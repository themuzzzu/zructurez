import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, CreditCard, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckoutAddress } from "@/components/checkout/CheckoutAddress";
import { CheckoutPaymentMethod } from "@/components/checkout/CheckoutPaymentMethod";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { measureApiCall } from "@/utils/performanceTracking";

interface CartItem {
  quantity: number;
  products: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
  };
}

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

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cod");
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to view cart');
      }

      return await measureApiCall('fetch-cart-items', async () => {
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
        return data as CartItem[];
      });
    },
  });

  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to view addresses');
      }

      return await measureApiCall('fetch-user-addresses', async () => {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', session.session.user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;
        return (data || []) as Address[];
      });
    },
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      return await measureApiCall('fetch-coupons', async () => {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('is_active', true)
          .lte('valid_from', new Date().toISOString())
          .gte('valid_until', new Date().toISOString());

        if (error) throw error;
        return (data || []) as Coupon[];
      });
    },
  });

  useEffect(() => {
    if (coupons.length > 0 && cartItems.length > 0) {
      const cartTotal = calculateSubtotal();
      
      const applicableCoupons = coupons.filter(coupon => 
        cartTotal >= (coupon.min_order_value || 0)
      );
      
      if (applicableCoupons.length > 0) {
        const bestCoupon = applicableCoupons.reduce((best, current) => {
          const bestDiscount = calculateCouponDiscount(best, cartTotal);
          const currentDiscount = calculateCouponDiscount(current, cartTotal);
          return currentDiscount > bestDiscount ? current : best;
        }, applicableCoupons[0]);
        
        setCouponCode(bestCoupon.code);
        setAppliedCoupon(bestCoupon);
        toast.success(`Coupon "${bestCoupon.code}" automatically applied!`);
      }
    }
  }, [coupons, cartItems]);

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      return await measureApiCall('apply-coupon', async () => {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', code)
          .eq('is_active', true)
          .lte('valid_from', new Date().toISOString())
          .gte('valid_until', new Date().toISOString())
          .single();

        if (error) throw new Error('Invalid or expired coupon code');
        return data as Coupon;
      });
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      toast.success(`Coupon "${data.code}" applied successfully!`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to apply coupon');
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to place order');
      }

      if (!selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      return await measureApiCall('place-order', async () => {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: session.session.user.id,
            address_id: selectedAddress,
            payment_method: selectedPaymentMethod,
            subtotal: calculateSubtotal(),
            discount: calculateDiscount(),
            shipping_fee: calculateShippingFee(),
            total: calculateTotal(),
            coupon_code: appliedCoupon?.code || null,
            status: selectedPaymentMethod === 'cod' ? 'pending' : 'payment_pending',
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = cartItems.map(item => ({
          order_id: order.id,
          product_id: item.products.id,
          quantity: item.quantity,
          price: item.products.price,
          total: item.products.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        const { error: cartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', session.session.user.id);

        if (cartError) throw cartError;

        await supabase
          .from('notifications')
          .insert({
            user_id: session.session.user.id,
            message: `Your order #${order.id.substr(0, 8)} has been placed successfully!`,
          });

        return order;
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCurrentStep('confirmation');
      toast.success('Order placed successfully!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    },
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.products?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateCouponDiscount = (coupon: Coupon | null, subtotal: number) => {
    if (!coupon) return 0;
    
    if (coupon.discount_type === 'percentage') {
      const discount = subtotal * (coupon.discount_value / 100);
      return Math.min(discount, coupon.max_discount || Infinity);
    } else {
      return Math.min(coupon.discount_value, subtotal);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return calculateCouponDiscount(appliedCoupon, calculateSubtotal());
  };

  const calculateShippingFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShippingFee();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    applyCouponMutation.mutate(couponCode);
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      if (selectedPaymentMethod === 'cod') {
        await placeOrderMutation.mutateAsync();
      } else {
        setTimeout(async () => {
          await placeOrderMutation.mutateAsync();
          setIsProcessing(false);
        }, 2000);
      }
    } catch (error) {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/marketplace');
    }
  }, [isLoadingCart, cartItems, navigate]);

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6 gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (currentStep === 'payment') {
                setCurrentStep('address');
              } else if (currentStep === 'address') {
                navigate('/marketplace');
              }
            }}
            disabled={currentStep === 'confirmation'}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {currentStep === 'address' && 'Delivery Address'}
            {currentStep === 'payment' && 'Payment Method'}
            {currentStep === 'confirmation' && 'Order Confirmation'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            {currentStep === 'address' && (
              <CheckoutAddress 
                addresses={addresses} 
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                onContinue={handleContinueToPayment}
              />
            )}

            {currentStep === 'payment' && (
              <CheckoutPaymentMethod
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 'confirmation' && (
              <Card className="bg-white shadow p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-2">Order Placed Successfully!</h2>
                <p className="text-center text-slate-600 mb-6">
                  Your order has been placed and will be processed soon.
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600">Order Number</span>
                    <span className="font-medium">ZR-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-medium">
                      {selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600">Estimated Delivery</span>
                    <span className="font-medium">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} 
                      - 
                      {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button onClick={() => navigate('/orders')} className="w-full">
                    Track Order
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/marketplace')} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="col-span-1">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={calculateSubtotal()}
              discount={calculateDiscount()}
              shippingFee={calculateShippingFee()}
              total={calculateTotal()}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              formatPrice={formatPrice}
              isCouponLoading={applyCouponMutation.isPending}
              isCheckoutDisabled={currentStep === 'confirmation'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
