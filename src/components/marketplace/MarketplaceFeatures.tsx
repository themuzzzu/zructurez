
import { Shield, Truck, Clock, CreditCard, Award, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const MarketplaceFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  // Simulate real-time feature availability
  useEffect(() => {
    // Initially set a random feature as active
    setActiveFeature(Math.floor(Math.random() * 6));
    
    // Periodically change the active feature
    const interval = setInterval(() => {
      setActiveFeature(Math.floor(Math.random() * 6));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const features = [
    {
      icon: <Truck size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Free Delivery",
      description: "On orders above ₹499",
      status: "active"
    },
    {
      icon: <Shield size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Secure Payments",
      description: "100% protected transactions",
      status: "active"
    },
    {
      icon: <Clock size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Express Delivery",
      description: "Delivered in 24-48 hours",
      status: "active"
    },
    {
      icon: <CreditCard size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Easy Returns",
      description: "15 days hassle-free returns",
      status: "active"
    },
    {
      icon: <Award size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Quality Guarantee",
      description: "Genuine products assured",
      status: "active"
    },
    {
      icon: <RotateCcw size={22} className="text-blue-600 dark:text-blue-400" />,
      title: "Quick Refunds",
      description: "Processed within 24 hours",
      status: "active"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className={cn(
            "bg-white dark:bg-zinc-800/80 rounded-xl p-4 shadow-sm border transition-all hover:shadow-md relative",
            activeFeature === index 
              ? "border-blue-400 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900/40" 
              : "border-gray-100 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-800"
          )}
        >
          {activeFeature === index && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
          )}
          <div className={cn(
            "flex flex-col items-center text-center",
            activeFeature === index && "scale-[1.02] transition-transform duration-300"
          )}>
            <div className={cn(
              "mb-2 p-2.5 rounded-full",
              activeFeature === index 
                ? "bg-blue-100 dark:bg-blue-900/40" 
                : "bg-blue-50 dark:bg-blue-900/20"
            )}>
              {feature.icon}
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
