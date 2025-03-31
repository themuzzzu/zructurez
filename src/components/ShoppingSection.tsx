import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { type Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/shopping/FilterPanel";
import { ShoppingHeader } from "@/components/shopping/ShoppingHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const ShoppingSection = ({
  searchQuery = "",
  selectedCategory = "all",
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest",
  priceRange = "all",
  gridLayout = "grid4x4"
}: ShoppingSectionProps) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    stock: 1,
    business_id: '',
    category: '',
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: businessList, isLoading: isBusinessListLoading } = useQuery({
    queryKey: ['businessList'],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', profile.id);

      if (error) {
        console.error('Error fetching business list:', error);
        return [];
      }

      return data;
    },
    enabled: !!profile?.id,
  });

  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (showDiscounted) {
        // Assuming you have a 'discounted' column in your products table
        // This is just a placeholder, adjust the query as needed
        query = query.gt('discount', 0);
      }

      if (showUsed) {
        // Assuming you have a 'condition' column in your products table
        // This is just a placeholder, adjust the query as needed
        query = query.eq('condition', 'used');
      }

      if (showBranded) {
        // Assuming you have a 'brand' column in your products table
        // This is just a placeholder, adjust the query as needed
        query = query.not('brand', 'is', null);
      }

      // Sorting options
      if (sortOption === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortOption === 'price-high') {
        query = query.order('price', { ascending: false });
      } else if (sortOption === 'most-viewed') {
        query = query.order('views', { ascending: false });
      } else if (sortOption === 'best-selling') {
        query = query.order('sold', { ascending: false });
      } else if (sortOption === 'trending') {
        query = query.order('trending', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Price range filtering
      if (priceRange === '0-50') {
        query = query.gte('price', 0).lte('price', 50);
      } else if (priceRange === '50-100') {
        query = query.gte('price', 50).lte('price', 100);
      } else if (priceRange === '100-200') {
        query = query.gte('price', 100).lte('price', 200);
      } else if (priceRange === '200+') {
        query = query.gte('price', 200);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }

      return data as Product[];
    },
  });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
    }
  }, [productsData]);

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleOpenAddProductDialog = () => {
    setIsAddProductDialogOpen(true);
  };

  const handleCloseAddProductDialog = () => {
    setIsAddProductDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewProduct(prev => ({ ...prev, price: parseFloat(value) }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewProduct(prev => ({ ...prev, category: value }));
  };

  const handleBusinessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewProduct(prev => ({ ...prev, business_id: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    try {
      setUploading(true);
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to upload the image.",
          variant: "destructive",
        });
        return;
      }

      const imagePath = data.path;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(imagePath);

      setNewProduct(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to upload the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image_url || !newProduct.business_id || !newProduct.category) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to add the product.",
          variant: "destructive",
        });
        return;
      }

      refetch();
      handleCloseAddProductDialog();
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        stock: 1,
        business_id: '',
        category: '',
      });

      toast({
        title: "Success!",
        description: "Product added successfully.",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleToggleMobileFilters = () => {
    setIsFilterMobileOpen(!isFilterMobileOpen);
  };

  const handleCloseMobileFilter = () => {
    setIsFilterMobileOpen(false);
  };

  const hasActiveFilters = showDiscounted || showUsed || showBranded || sortOption !== 'newest' || priceRange !== 'all';

  return (
    <div>
      <ShoppingHeader
        selectedCategory={selectedCategory}
        onOpenAddProductDialog={handleOpenAddProductDialog}
        onToggleMobileFilters={handleToggleMobileFilters}
        sortOption={sortOption}
        onSortChange={(value) => {
          // Here you would typically call a function to update the sorting option
          // For example: onSortChange(value);
          console.log("Sort option changed to:", value);
        }}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {/* Filter Panel (Hidden on small screens) */}
        <aside className="hidden sm:block col-span-1">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
            <h3 className="font-medium">Filters</h3>
            <div className="space-y-3 mt-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Sort by</label>
                <Select value={sortOption} onValueChange={(value) => {
                  // Here you would typically call a function to update the sorting option
                  // For example: onSortChange(value);
                  console.log("Sort option changed to:", value);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Product Types</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="discounted" />
                    <Label htmlFor="discounted">Discounted</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="used" />
                    <Label htmlFor="used">Used</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="branded" />
                    <Label htmlFor="branded">Branded</Label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Price Range</label>
                <Select value={priceRange} onValueChange={(value) => {
                  // Here you would typically call a function to update the price range
                  // For example: onPriceRangeChange(value);
                  console.log("Price range changed to:", value);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="0-50">₹0 - ₹50</SelectItem>
                    <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                    <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                    <SelectItem value="200+">₹200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Panel */}
        <FilterPanel
          selectedCategory={selectedCategory}
          showDiscounted={showDiscounted}
          showUsed={showUsed}
          showBranded={showBranded}
          sortOption={sortOption}
          priceRange={priceRange}
          onDiscountedChange={(checked) => {
            // Here you would typically call a function to update the discounted filter
            // For example: onDiscountedChange(checked);
            console.log("Discounted filter changed to:", checked);
          }}
          onUsedChange={(checked) => {
            // Here you would typically call a function to update the used filter
            // For example: onUsedChange(checked);
            console.log("Used filter changed to:", checked);
          }}
          onBrandedChange={(checked) => {
            // Here you would typically call a function to update the branded filter
            // For example: onBrandedChange(checked);
            console.log("Branded filter changed to:", checked);
          }}
          onSortChange={(value) => {
            // Here you would typically call a function to update the sorting option
            // For example: onSortChange(value);
            console.log("Sort option changed to:", value);
          }}
          onPriceRangeChange={(value) => {
            // Here you would typically call a function to update the price range
            // For example: onPriceRangeChange(value);
            console.log("Price range changed to:", value);
          }}
          onCloseMobileFilter={handleCloseMobileFilter}
          isFilterMobileOpen={isFilterMobileOpen}
        />

        {/* Product Grid */}
        <div className="col-span-4 sm:col-span-3">
          {isLoading ? (
            <ProductGrid gridLayout={gridLayout}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full">
                  <Skeleton className="w-full aspect-square rounded-md" />
                  <div className="mt-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </ProductGrid>
          ) : products.length > 0 ? (
            <ProductGrid gridLayout={gridLayout}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Create a new product to sell.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handlePriceChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                type="file"
                id="image"
                className="col-span-3"
                onChange={handleImageChange}
              />
              {uploading && <Badge variant="secondary">Uploading...</Badge>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="business" className="text-right">
                Business
              </Label>
              <Select onValueChange={(value) => setNewProduct(prev => ({ ...prev, business_id: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businessList?.map((business) => (
                    <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
