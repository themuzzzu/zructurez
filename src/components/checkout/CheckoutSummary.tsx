
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Tag, Loader2 } from "lucide-react";

interface CartItem {
  quantity: number;
  products: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
  };
}

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  appliedCoupon: any;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  formatPrice: (price: number) => string;
  isCouponLoading: boolean;
  isCheckoutDisabled: boolean;
}

export const CheckoutSummary = ({
  cartItems,
  subtotal,
  discount,
  shippingFee,
  total,
  couponCode,
  appliedCoupon,
  onCouponChange,
  onApplyCoupon,
  formatPrice,
  isCouponLoading,
  isCheckoutDisabled,
}: CheckoutSummaryProps) => {
  return (
    <Card className="p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      <div className="mb-4 max-h-60 overflow-auto">
        {cartItems.map((item) => (
          <div key={item.products.id} className="flex py-2 border-b">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-slate-50">
              {item.products.image_url && (
                <img
                  src={item.products.image_url}
                  alt={item.products.title}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium">
                <h3 className="text-sm line-clamp-2">{item.products.title}</h3>
              </div>
              <div className="flex flex-1 items-end justify-between">
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">
                  {formatPrice(item.products.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="mt-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-medium">Apply Coupon</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
            disabled={!!appliedCoupon || isCouponLoading || isCheckoutDisabled}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onApplyCoupon}
            disabled={!couponCode || !!appliedCoupon || isCouponLoading || isCheckoutDisabled}
          >
            {isCouponLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : appliedCoupon ? (
              "Applied"
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        {appliedCoupon && (
          <div className="mt-2 p-2 bg-green-50 text-green-700 text-xs rounded">
            <span className="font-medium">{appliedCoupon.code}</span> applied: {appliedCoupon.description}
          </div>
        )}
      </div>

      {/* Price Details */}
      <div className="space-y-2 py-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Discount</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          {shippingFee === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>{formatPrice(shippingFee)}</span>
          )}
        </div>
        <div className="pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {shippingFee === 0 && (
        <div className="mt-4 p-2 bg-green-50 text-green-700 text-xs rounded">
          You've qualified for free shipping!
        </div>
      )}
    </Card>
  );
};
