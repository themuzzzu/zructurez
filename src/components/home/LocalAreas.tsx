
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export const LocalAreas = () => {
  const navigate = useNavigate();
  
  const localAreas = [
    { id: "bangalore", name: "Bangalore", count: 3250 },
    { id: "hyderabad", name: "Hyderabad", count: 2840 },
    { id: "chennai", name: "Chennai", count: 2320 },
    { id: "mumbai", name: "Mumbai", count: 4150 },
    { id: "delhi", name: "Delhi", count: 3980 }
  ];

  const popularLocalities = [
    { id: "koramangala", name: "Koramangala", city: "Bangalore" },
    { id: "indiranagar", name: "Indiranagar", city: "Bangalore" },
    { id: "whitefield", name: "Whitefield", city: "Bangalore" },
    { id: "hsr-layout", name: "HSR Layout", city: "Bangalore" },
    { id: "jp-nagar", name: "JP Nagar", city: "Bangalore" }
  ];

  const handleAreaClick = (areaId: string) => {
    navigate(`/businesses?location=${areaId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-red-500" />
          Top Cities
        </h3>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {localAreas.map((area) => (
            <li 
              key={area.id}
              onClick={() => handleAreaClick(area.id)}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md"
            >
              <span>{area.name}</span>
              <span className="text-xs text-muted-foreground">{area.count}+</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t pt-4">
        <h4 className="font-medium text-sm mb-2">Popular Areas in Bangalore</h4>
        <ul className="space-y-1">
          {popularLocalities.map((locality) => (
            <li 
              key={locality.id}
              onClick={() => handleAreaClick(locality.id)}
              className="text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              {locality.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
