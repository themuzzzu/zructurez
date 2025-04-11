
import { useNavigate } from "react-router-dom";
import { 
  AirVent, 
  Wrench, 
  Car, 
  Truck, 
  Hammer, 
  Home, 
  ShieldCheck,
  Smartphone,
  ArrowRight
} from "lucide-react";

export const QuickAccessServices = () => {
  const navigate = useNavigate();
  
  const services = [
    { id: "ac-repair", name: "AC Repair", icon: <AirVent className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-blue-100 text-blue-700" },
    { id: "plumbing", name: "Plumbing", icon: <Wrench className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-green-100 text-green-700" },
    { id: "car-service", name: "Car Service", icon: <Car className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-red-100 text-red-700" },
    { id: "packers-movers", name: "Packers & Movers", icon: <Truck className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-yellow-100 text-yellow-700" },
    { id: "renovation", name: "Home Renovation", icon: <Hammer className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-purple-100 text-purple-700" },
    { id: "real-estate", name: "Real Estate", icon: <Home className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-pink-100 text-pink-700" },
    { id: "pest-control", name: "Pest Control", icon: <ShieldCheck className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-teal-100 text-teal-700" },
    { id: "electronics-repair", name: "Electronics Repair", icon: <Smartphone className="h-4 w-4 fill-primary stroke-black dark:stroke-white" />, color: "bg-indigo-100 text-indigo-700" }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/search?q=${serviceId}`);
  };

  return (
    <section className="services-top-gap px-2 my-3 pt-4">
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-lg font-bold">Services</h2>
        <button 
          onClick={() => navigate('/services')}
          className="text-primary text-xs font-medium flex items-center"
        >
          View All <ArrowRight className="h-3 w-3 ml-0.5" />
        </button>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide pb-1">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 min-w-[560px]">
          {services.map((service) => (
            <div 
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-2 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className={`${service.color} p-1.5 rounded-full mb-1.5`}>
                {service.icon}
              </div>
              <span className="text-[10px] sm:text-xs text-center">{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessServices;
