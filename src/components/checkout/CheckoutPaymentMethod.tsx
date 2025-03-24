
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Wallet, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CheckoutPaymentMethodProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export const CheckoutPaymentMethod = ({
  selectedMethod,
  onSelectMethod,
  onPlaceOrder,
  isProcessing,
}: CheckoutPaymentMethodProps) => {
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay securely with Visa, Mastercard, Rupay or other cards",
      icon: <CreditCard className="h-5 w-5 text-slate-500" />,
      disabled: false,
    },
    {
      id: "upi",
      name: "UPI",
      description: "Pay via GPay, PhonePe, Paytm or any UPI app",
      icon: <Landmark className="h-5 w-5 text-slate-500" />,
      disabled: false,
    },
    {
      id: "wallet",
      name: "Wallet",
      description: "Pay using Amazon Pay, Paytm, PhonePe or other wallets",
      icon: <Wallet className="h-5 w-5 text-slate-500" />,
      disabled: false,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order is delivered",
      icon: <Truck className="h-5 w-5 text-slate-500" />,
      disabled: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onSelectMethod}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={method.id}
                id={`payment-${method.id}`}
                disabled={method.disabled}
              />
              <Label
                htmlFor={`payment-${method.id}`}
                className="flex-grow cursor-pointer"
              >
                <Card 
                  className={`p-4 hover:border-primary transition-colors ${
                    selectedMethod === method.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-4">{method.icon}</div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-slate-500">{method.description}</p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Payment Form based on selected method */}
      {selectedMethod === "card" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card-number"
                  className="w-full p-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="expiry"
                    className="w-full p-2 border rounded"
                    placeholder="MM/YY"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="cvv"
                    className="w-full p-2 border rounded"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="name-on-card">Name on Card</Label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name-on-card"
                  className="w-full p-2 border rounded"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedMethod === "upi" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">UPI Payment</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upi-id">UPI ID</Label>
              <div className="mt-1">
                <input
                  type="text"
                  id="upi-id"
                  className="w-full p-2 border rounded"
                  placeholder="username@upi"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedMethod === "wallet" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Select Wallet</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge", "JioMoney"].map(
              (wallet) => (
                <div
                  key={wallet}
                  className="border rounded p-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5"
                >
                  <div className="h-10 flex items-center justify-center mb-2">
                    <Wallet className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium">{wallet}</p>
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {/* Place Order Button */}
      <Button 
        onClick={onPlaceOrder} 
        className="w-full mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
        This is a demo checkout page. No actual payment will be processed.
        {selectedMethod !== "cod" && " For testing, you can enter any data in the payment forms."}
      </div>
    </div>
  );
};
