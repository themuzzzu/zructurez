
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  tax,
  shipping,
  total,
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Items summary */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Additional information */}
          <div className="text-xs text-muted-foreground mt-4">
            <p>
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="mt-1">
              All payments are securely processed and encrypted.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
