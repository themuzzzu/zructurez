
import { useNavigate } from "react-router-dom";
import { 
  AirVent, 
  Wrench, 
  Car, 
  Truck, 
  Hammer, 
  Home, 
  ShieldCheck,
  Smartphone 
} from "lucide-react";

export const QuickAccessServices = () => {
  const navigate = useNavigate();
  
  const services = [
    { id: "ac-repair", name: "AC Repair", icon: <AirVent className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
    { id: "plumbing", name: "Plumbing", icon: <Wrench className="h-5 w-5" />, color: "bg-green-100 text-green-700" },
    { id: "car-service", name: "Car Service", icon: <Car className="h-5 w-5" />, color: "bg-red-100 text-red-700" },
    { id: "packers-movers", name: "Packers & Movers", icon: <Truck className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-700" },
    { id: "renovation", name: "Home Renovation", icon: <Hammer className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
    { id: "real-estate", name: "Real Estate", icon: <Home className="h-5 w-5" />, color: "bg-pink-100 text-pink-700" },
    { id: "pest-control", name: "Pest Control", icon: <ShieldCheck className="h-5 w-5" />, color: "bg-teal-100 text-teal-700" },
    { id: "electronics-repair", name: "Electronics Repair", icon: <Smartphone className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-700" }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/search?q=${serviceId}`);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quick Access Services</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {services.map((service) => (
          <div 
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`${service.color} p-2 rounded-full mb-2`}>
              {service.icon}
            </div>
            <span className="text-sm text-center">{service.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
