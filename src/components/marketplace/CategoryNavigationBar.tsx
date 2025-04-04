
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CategoryNavigationBar = () => {
  const navigate = useNavigate();
  
  const mainCategories = [
    { name: "All", path: "/marketplace" },
    { name: "Electronics", path: "/marketplace?category=electronics" },
    { name: "Fashion", path: "/marketplace?category=fashion" },
    { name: "Home", path: "/marketplace?category=home" },
    { name: "Beauty", path: "/marketplace?category=beauty" },
    { name: "Books", path: "/marketplace?category=books" },
  ];
  
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
      {mainCategories.map((category) => (
        <Button
          key={category.name}
          variant="outline"
          size="sm"
          onClick={() => navigate(category.path)}
          className="whitespace-nowrap"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
