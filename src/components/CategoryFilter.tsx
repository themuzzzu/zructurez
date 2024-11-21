import { Button } from "./ui/button";

const categories = [
  "All",
  "General",
  "Events",
  "For Sale",
  "Safety",
  "Lost & Found",
  "Recommendations",
  "Crime & Safety",
  "Local News",
  "Free Items",
  "Pets",
];

export const CategoryFilter = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All" ? "default" : "outline"}
          className="whitespace-nowrap bg-card"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};