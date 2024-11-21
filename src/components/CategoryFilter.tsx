import { Button } from "./ui/button";

const categories = [
  "All",
  "General",
  "For Sale",
  "Safety",
  "Lost & Found",
  "Events",
  "Recommendations",
];

export const CategoryFilter = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All" ? "default" : "outline"}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};