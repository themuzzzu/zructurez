
import { Shield, Truck, Clock, CreditCard, Award, RotateCcw } from "lucide-react";

export const MarketplaceFeatures = () => {
  const features = [
    {
      icon: <Truck size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Free Delivery",
      description: "On orders above ₹499"
    },
    {
      icon: <Shield size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Secure Payments",
      description: "100% protected transactions"
    },
    {
      icon: <Clock size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Express Delivery",
      description: "Delivered in 24-48 hours"
    },
    {
      icon: <CreditCard size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Easy Returns",
      description: "15 days hassle-free returns"
    },
    {
      icon: <Award size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Quality Guarantee",
      description: "Genuine products assured"
    },
    {
      icon: <RotateCcw size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Quick Refunds",
      description: "Processed within 24 hours"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-zinc-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
        >
          <div className="mb-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
