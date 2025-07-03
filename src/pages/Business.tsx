import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  List,
  Grip,
  GripHorizontal,
  Plus,
  MapPin,
  Check,
} from "lucide-react";
import { ErrorView } from "@/components/ErrorView";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { cn } from "@/lib/utils";
import { ProductsGrid } from "@/components/ProductsGrid";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  rating: number;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  location: string;
  verified: boolean;
  openNow: boolean;
  sortBy: string;
}

interface UseBusinessesProps {
  searchQuery: string;
  category: string;
  sortBy: string;
  page: number;
  limit: number;
}

const Business = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid3x3");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    category: "",
    priceRange: [0, 10000],
    rating: 0,
    location: "",
    verified: false,
    openNow: false,
    sortBy: "rating"
  });

  const { data: businesses, isLoading, error, refetch } = useBusinesses({
    searchQuery,
    category: selectedCategory,
    sortBy,
    page: currentPage,
    limit: 12
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setSelectedFilters(newFilters);
    setSelectedCategory(newFilters.category);
    setSortBy(newFilters.sortBy);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return <ErrorView onRetry={handleRetry} />;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Businesses</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setIsFilterOpen(true)}>
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Businesses</DialogTitle>
            <DialogDescription>
              Apply filters to refine the list of businesses.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <Select
                    onValueChange={(value) =>
                      handleFilterChange({
                        ...selectedFilters,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Price Range (₹)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={selectedFilters.priceRange[0].toString()}
                        onChange={(e) =>
                          handleFilterChange({
                            ...selectedFilters,
                            priceRange: [
                              parseInt(e.target.value),
                              selectedFilters.priceRange[1],
                            ],
                          })
                        }
                        className="w-24"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        value={selectedFilters.priceRange[1].toString()}
                        onChange={(e) =>
                          handleFilterChange({
                            ...selectedFilters,
                            priceRange: [
                              selectedFilters.priceRange[0],
                              parseInt(e.target.value),
                            ],
                          })
                        }
                        className="w-24"
                      />
                    </div>
                    <Slider
                      defaultValue={selectedFilters.priceRange}
                      max={10000}
                      step={100}
                      onValueChange={(value) =>
                        handleFilterChange({
                          ...selectedFilters,
                          priceRange: [value[0], value[1]],
                        })
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rating">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Minimum Rating</Label>
                    <Slider
                      defaultValue={[selectedFilters.rating]}
                      max={5}
                      step={0.5}
                      onValueChange={(value) =>
                        handleFilterChange({
                          ...selectedFilters,
                          rating: value[0],
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Selected Rating: {selectedFilters.rating} stars
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="location">
                <AccordionTrigger>Location</AccordionTrigger>
                <AccordionContent>
                  <Input
                    type="text"
                    placeholder="Enter location"
                    value={selectedFilters.location}
                    onChange={(e) =>
                      handleFilterChange({
                        ...selectedFilters,
                        location: e.target.value,
                      })
                    }
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="other">
                <AccordionTrigger>Other Filters</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={selectedFilters.verified}
                      onCheckedChange={(checked) =>
                        handleFilterChange({
                          ...selectedFilters,
                          verified: Boolean(checked),
                        })
                      }
                    />
                    <Label htmlFor="verified">Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="openNow"
                      checked={selectedFilters.openNow}
                      onCheckedChange={(checked) =>
                        handleFilterChange({
                          ...selectedFilters,
                          openNow: Boolean(checked),
                        })
                      }
                    />
                    <Label htmlFor="openNow">Open Now</Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p>Loading businesses...</p>
      ) : businesses && Array.isArray(businesses) && businesses.length > 0 ? (
        <ProductGrid gridLayout={gridLayout}>
          {businesses.map((business) => (
            <Card key={business.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{business.category}</Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{business.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {business.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {business.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-1">
                      Rating: {business.rating}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ProductGrid>
      ) : (
        <p>No businesses found.</p>
      )}

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        <span>Page {currentPage}</span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              businesses && Array.isArray(businesses) && businesses.length === 12 ? prev + 1 : prev
            )
          }
          disabled={!businesses || !Array.isArray(businesses) || businesses.length < 12}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default Business;

function useBusinesses({
  searchQuery,
  category,
  sortBy,
  page,
  limit,
}: UseBusinessesProps) {
  return useQuery({
    queryKey: ["businesses", searchQuery, category, sortBy, page, limit],
    queryFn: async () => {
      let query = supabase
        .from("businesses")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order(sortBy, { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
