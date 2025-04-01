
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryWithSubcategories } from "./CategoryWithSubcategories";

interface CategorySubcategoryGridProps {
  onCategorySelect?: (category: string, subcategory?: string) => void;
}

interface CategoryItem {
  name: string;
  slug: string;
  description?: string;
  price?: string;
  image?: string;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  subcategories: CategoryItem[];
}

export const CategorySubcategoryGrid = ({ onCategorySelect }: CategorySubcategoryGridProps) => {
  // Use mock data since the database tables don't seem to exist yet
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-with-subcategories'],
    queryFn: async () => {
      // This would normally fetch from the database but we'll use the fallback data
      return [] as CategoryData[];
    },
    // Fallback demo data
    initialData: [
      {
        id: "electronics",
        name: "Electronics",
        slug: "electronics",
        subcategories: [
          { name: "Deals on Projectors", slug: "projectors", price: "From ₹5,579*" },
          { name: "Mobile Storage Pendrives", slug: "pendrives", price: "From ₹289" },
          { name: "Gaming Accessories", slug: "gaming-accessories", price: "From ₹299" },
          { name: "Mouse,Keyboards & more", slug: "keyboards", price: "From ₹149" },
          { name: "Premium Monitors", slug: "monitors", price: "From ₹1,717/M*" },
          { name: "Printer Inks and Toners", slug: "printer-supplies", price: "From ₹299" },
          { name: "Ink Tank Printers", slug: "printers", price: "From ₹7,739*" }
        ]
      },
      {
        id: "fashion",
        name: "Fashion",
        slug: "fashion",
        subcategories: [
          { name: "Mens Clothing", slug: "mens-clothing", price: "Up to 60% off" },
          { name: "Womens Clothing", slug: "womens-clothing", price: "Up to 70% off" },
          { name: "Footwear", slug: "footwear", price: "Min 40% off" },
          { name: "Watches", slug: "watches", price: "From ₹999" },
          { name: "Bags & Wallets", slug: "bags", price: "From ₹499" }
        ]
      },
      {
        id: "home",
        name: "Home & Kitchen",
        slug: "home-kitchen",
        subcategories: [
          { name: "Kitchen Appliances", slug: "kitchen-appliances", price: "Up to 50% off" },
          { name: "Cookware", slug: "cookware", price: "From ₹699" },
          { name: "Home Decor", slug: "home-decor", price: "Min 40% off" },
          { name: "Furniture", slug: "furniture", price: "Up to 60% off" },
          { name: "Storage Solutions", slug: "storage", price: "From ₹299" }
        ]
      },
      {
        id: "beauty",
        name: "Beauty & Personal Care",
        slug: "beauty",
        subcategories: [
          { name: "Skin Care", slug: "skin-care", price: "Up to 40% off" },
          { name: "Makeup", slug: "makeup", price: "Min 30% off" },
          { name: "Hair Care", slug: "hair-care", price: "From ₹199" },
          { name: "Perfumes", slug: "perfumes", price: "From ₹499" },
          { name: "Men's Grooming", slug: "mens-grooming", price: "Up to 50% off" }
        ]
      },
      {
        id: "toys",
        name: "Toys & Games",
        slug: "toys-games",
        subcategories: [
          { name: "Action Figures", slug: "action-figures", price: "From ₹399" },
          { name: "Board Games", slug: "board-games", price: "Min 30% off" },
          { name: "Educational Toys", slug: "educational-toys", price: "Up to 45% off" },
          { name: "Outdoor Play", slug: "outdoor-play", price: "From ₹599" }
        ]
      },
      {
        id: "books",
        name: "Books & Media",
        slug: "books-media",
        subcategories: [
          { name: "Fiction Books", slug: "fiction", price: "From ₹199" },
          { name: "Academic", slug: "academic", price: "Up to 30% off" },
          { name: "E-Books", slug: "ebooks", price: "From ₹99" },
          { name: "Movies & TV Shows", slug: "movies", price: "Min 40% off" }
        ]
      }
    ]
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
          </Card>
        ))}
      </div>
    );
  }
  
  if (!categories || categories.length === 0) {
    return <div className="text-center text-muted-foreground">No categories found</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {categories.map((category) => (
        <CategoryWithSubcategories
          key={category.id}
          title={category.name}
          slug={category.slug}
          subcategories={category.subcategories}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </div>
  );
};
