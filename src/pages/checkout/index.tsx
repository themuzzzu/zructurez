
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutAddress from '@/components/checkout/CheckoutAddress';
import CheckoutPaymentMethod from '@/components/checkout/CheckoutPaymentMethod';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import StepIndicator from '@/components/checkout/StepIndicator';
import { Address } from '@/types/address';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Sample data for payment methods
const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    icon: '💳',
    lastFour: '4242',
    isDefault: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    email: 'user@example.com',
    isDefault: false,
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: '🍎',
    isDefault: false,
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  // Fetch cart items
  useEffect(() => {
    const getCartItems = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            quantity,
            products(id, name, price, image_url, description)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        // Transform data to include product details
        const items = data.map(item => ({
          id: item.id,
          quantity: item.quantity,
          product: item.products,
        }));

        setCartItems(items);

        // Calculate totals
        const itemSubtotal = items.reduce(
          (sum, item) => sum + (item.product?.price || 0) * item.quantity,
          0
        );
        const calculatedTax = itemSubtotal * 0.07; // 7% tax
        const calculatedShipping = items.length > 0 ? 5.99 : 0;
        const calculatedTotal = itemSubtotal + calculatedTax + calculatedShipping;

        setSubtotal(itemSubtotal);
        setTax(calculatedTax);
        setShipping(calculatedShipping);
        setOrderTotal(calculatedTotal);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Could not fetch your cart. Please try again.');
      }
    };

    getCartItems();
  }, [user]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleStepComplete = () => {
    if (step === 1 && !selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }

    if (step === 2 && !selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handlePlaceOrder();
    }
  };

  const handleStepBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress || !selectedPayment || cartItems.length === 0) {
      toast.error('Missing required information for checkout');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: orderTotal,
          shipping_address_id: selectedAddress.id,
          payment_method: selectedPayment.id,
          shipping_method: 'standard',
          tax_amount: tax,
          shipping_amount: shipping,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <Card className="text-center py-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
            <p className="mb-6">You need to be logged in to complete your purchase.</p>
            <Button onClick={() => navigate('/auth', { state: { returnTo: '/checkout' } })}>
              Log In or Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <CheckoutAddress 
              selectedAddress={selectedAddress as Address} 
              onSelectAddress={handleAddressSelect}
            />
          )}

          {step === 2 && (
            <CheckoutPaymentMethod
              paymentMethods={PAYMENT_METHODS}
              selectedPayment={selectedPayment}
              onSelectPayment={handlePaymentSelect}
            />
          )}

          {step === 3 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Address Review */}
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-1">Shipping Address</h3>
                        {selectedAddress && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium">{selectedAddress.name}</p>
                            <p>{selectedAddress.address_line1}</p>
                            {selectedAddress.address_line2 && <p>{selectedAddress.address_line2}</p>}
                            <p>
                              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                            </p>
                            <p>Phone: {selectedAddress.phone}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(1)}
                        className="text-primary"
                      >
                        Change
                      </Button>
                    </div>
                  </div>

                  {/* Payment Review */}
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-1">Payment Method</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <span className="mr-2">{selectedPayment.icon}</span>
                          <span>
                            {selectedPayment.name}
                            {selectedPayment.lastFour && ` (•••• ${selectedPayment.lastFour})`}
                            {selectedPayment.email && ` (${selectedPayment.email})`}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(2)}
                        className="text-primary"
                      >
                        Change
                      </Button>
                    </div>
                  </div>

                  {/* Items Review */}
                  <div>
                    <h3 className="font-medium text-lg mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 mr-3"
                              style={{
                                backgroundImage: `url(${item.product?.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                            <div>
                              <p className="font-medium">{item.product?.name}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-muted-foreground">
                                  ${item.product?.price.toFixed(2)} × {item.quantity}
                                </span>
                                {item.quantity > 1 && (
                                  <Badge variant="outline" className="ml-2">
                                    ${(item.product?.price * item.quantity).toFixed(2)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={handleStepBack} disabled={loading}>
                Back
              </Button>
            ) : (
              <div /> // Empty div for spacing
            )}

            <Button 
              onClick={handleStepComplete} 
              disabled={loading || cartItems.length === 0}
              className="min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : step === 3 ? (
                'Place Order'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CheckoutSummary
            items={cartItems}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={orderTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
