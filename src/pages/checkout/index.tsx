import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { CheckoutAddress } from "@/components/checkout/CheckoutAddress";
import { CheckoutPaymentMethod } from "@/components/checkout/CheckoutPaymentMethod";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  address_type: 'home' | 'work' | 'other';
  user_id: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to checkout');
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(addr => ({
        ...addr,
        address_type: addr.address_type as 'home' | 'work' | 'other'
      })) as Address[];
    },
  });

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to view cart');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            title,
            price,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (code.toUpperCase() === 'WELCOME10') {
        return {
          valid: true,
          code: 'WELCOME10',
          discount_percentage: 10,
          description: '10% off your entire order'
        };
      } else if (code.toUpperCase() === 'NEWUSER20') {
        return {
          valid: true,
          code: 'NEWUSER20',
          discount_percentage: 20,
          description: '20% off your entire order'
        };
      }
      throw new Error('Invalid coupon code');
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      toast.success(`Coupon applied: ${data.description}`);
    },
    onError: () => {
      toast.error('Invalid coupon code');
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to place an order');
      }

      if (!selectedAddress) {
        throw new Error('Please select a shipping address');
      }

      for (const item of cartItems) {
        const { error } = await supabase
          .from('orders')
          .insert({
            user_id: session.session.user.id,
            product_id: item.products.id,
            total_price: item.products.price * item.quantity,
            quantity: item.quantity,
            status: 'pending',
            address_id: selectedAddress,
            payment_method: selectedPaymentMethod,
            coupon_code: appliedCoupon?.code,
            discount: appliedCoupon ? (item.products.price * item.quantity * appliedCoupon.discount_percentage / 100) : 0,
            shipping_fee: subtotal > 1000 ? 0 : 40
          });

        if (error) throw error;
      }

      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.session.user.id);

      if (clearCartError) throw clearCartError;
      
      return { success: true };
    },
    onSuccess: () => {
      setOrderSuccess(true);
      
      toast.success('Order placed successfully!');
      
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: Math.random().toString(36).substring(2, 10).toUpperCase(),
            orderDate: new Date().toISOString(),
            deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: selectedPaymentMethod
          } 
        });
      }, 2000);
    },
    onError: (error) => {
      setIsProcessing(false);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    },
  });

  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0) || 0;

  const discount = appliedCoupon 
    ? (subtotal * appliedCoupon.discount_percentage / 100) 
    : 0;

  const shippingFee = subtotal > 1000 ? 0 : 40;

  const total = subtotal - discount + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    applyCouponMutation.mutate(couponCode);
  };

  const handleContinueFromAddress = () => {
    if (!selectedAddress) {
      toast.error('Please select or add an address');
      return;
    }
    setCurrentStep(2);
  };

  const handleBackToAddress = () => {
    setCurrentStep(1);
  };

  const handleContinueFromPayment = () => {
    setCurrentStep(3);
  };

  const handleBackToPayment = () => {
    setCurrentStep(2);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    placeOrderMutation.mutate();
  };

  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0 && !orderSuccess) {
      toast.error('Your cart is empty');
      navigate('/marketplace');
    }
  }, [cartItems, isLoadingCart, navigate, orderSuccess]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CheckoutAddress
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onContinue={handleContinueFromAddress}
          />
        );
      case 2:
        return (
          <CheckoutPaymentMethod
            selectedMethod={selectedPaymentMethod}
            onSelectMethod={setSelectedPaymentMethod}
            onPlaceOrder={handleContinueFromPayment}
            isProcessing={isProcessing}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-medium text-green-700">Delivery Information</h3>
                  <p className="text-sm text-green-600">Your order will be delivered by Thu, April 10</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handlePlaceOrder} 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order & Pay"}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (orderSuccess) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-muted-foreground">Redirecting to order details...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
        </div>

        <div className="mb-8">
          <StepIndicator 
            steps={['Shipping', 'Payment', 'Review']} 
            currentStep={currentStep - 1} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 2 && (
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={handleBackToAddress}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shipping
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={handleBackToPayment}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payment
              </Button>
            )}
            
            {renderStepContent()}
          </div>
          
          <div className="lg:col-span-1">
            <CheckoutSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shippingFee={shippingFee}
              total={total}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              formatPrice={formatPrice}
              isCouponLoading={applyCouponMutation.isPending}
              isCheckoutDisabled={isProcessing || orderSuccess}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
