
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Calendar, CreditCard, Home, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || {
    orderId: "ORDER" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    orderDate: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "card"
  };

  // Redirect if accessed directly without order data
  useEffect(() => {
    if (!location.state) {
      setTimeout(() => {
        navigate('/marketplace');
      }, 5000);
    }
  }, [location.state, navigate]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEE, MMM d, yyyy");
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "upi":
        return <span className="text-sm font-semibold">UPI</span>;
      case "wallet":
        return <span className="text-sm font-semibold">W</span>;
      case "cod":
        return <Package className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "upi":
        return "UPI Payment";
      case "wallet":
        return "Wallet";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Online Payment";
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-3xl mx-auto p-4 py-12"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div 
          className="flex flex-col items-center text-center mb-8"
          variants={item}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you for shopping with us. Your order has been confirmed.
          </p>
        </motion.div>

        <motion.div 
          className="bg-card rounded-lg border p-6 mb-6"
          variants={item}
        >
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{orderData.orderId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{formatDate(orderData.orderDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Delivery</p>
                <p className="font-medium">{formatDate(orderData.deliveryDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {getPaymentMethodIcon(orderData.paymentMethod)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{getPaymentMethodName(orderData.paymentMethod)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-8" variants={item}>
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium text-green-700">Delivery Update</h3>
              <p className="text-sm text-green-600">Your order will be delivered by {formatDate(orderData.deliveryDate)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={item}>
          <Button 
            onClick={() => navigate('/orders')}
            variant="outline"
          >
            View Order Details
          </Button>
          <Button 
            onClick={() => navigate('/marketplace')}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
