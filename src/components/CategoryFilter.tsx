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
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide animate-fade-up [animation-delay:100ms]">
      {categories.map((category, index) => (
        <Button
          key={category}
          variant={category === "All" ? "default" : "outline"}
          className="whitespace-nowrap bg-card transition-all duration-300 hover:scale-105 hover:shadow-md"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};