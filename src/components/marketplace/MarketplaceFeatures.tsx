
import { Shield, Truck, Clock, CreditCard } from "lucide-react";

export const MarketplaceFeatures = () => {
  const features = [
    {
      icon: <Truck size={24} className="text-blue-600" />,
      title: "Free Delivery",
      description: "On orders above ₹499"
    },
    {
      icon: <Shield size={24} className="text-blue-600" />,
      title: "Secure Payments",
      description: "100% protected transactions"
    },
    {
      icon: <Clock size={24} className="text-blue-600" />,
      title: "Fast Shipping",
      description: "Delivered in 24-48 hours"
    },
    {
      icon: <CreditCard size={24} className="text-blue-600" />,
      title: "Easy Returns",
      description: "15 days return policy"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center transition-transform hover:scale-105">
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
