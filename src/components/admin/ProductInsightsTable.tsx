import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUpDown, ShoppingBag, Eye, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  views: number;
  reach: number;
  is_discounted: boolean;
  discount_percentage: number | null;
  created_at: string;
  stock: number;
}

interface ProductWithPurchases extends Product {
  product_purchases: Array<{ id: string }>;
  purchases: number;
}

export const ProductInsightsTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['product-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_purchases(id)')
        .order('views', { ascending: false });
        
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data.map(product => ({
        ...product,
        purchases: product.product_purchases ? product.product_purchases.length : 0
      })) as ProductWithPurchases[];
    }
  });
  
  // Get all categories
  const categories = products 
    ? ['all', ...new Set(products.map(product => product.category))]
    : ['all'];
  
  // Filter products
  const filteredProducts = products
    ? products.filter(product => {
        const matchesSearch = searchQuery 
          ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
          
        const matchesCategory = categoryFilter === 'all' 
          ? true 
          : product.category === categoryFilter;
          
        return matchesSearch && matchesCategory;
      })
    : [];
    
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'purchases':
        return b.purchases - a.purchases;
      case 'price':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return (b.views || 0) - (a.views || 0);
    }
  });
  
  // Top categories data for chart
  const categoryData = products 
    ? Object.entries(
        products.reduce((acc, product) => {
          const category = product.category;
          if (!acc[category]) {
            acc[category] = {
              views: 0,
              purchases: 0,
              count: 0
            };
          }
          acc[category].views += product.views || 0;
          acc[category].purchases += product.purchases || 0;
          acc[category].count += 1;
          return acc;
        }, {} as Record<string, { views: number; purchases: number; count: number }>)
      )
        .map(([name, data]) => ({
          name,
          views: data.views,
          purchases: data.purchases,
          count: data.count
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
    : [];
    
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Product Categories</CardTitle>
            <CardDescription>By views and purchases</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="views" name="Views" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="purchases" name="Purchases" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-rows-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                  <Eye className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Product Views</div>
                  <div className="text-2xl font-bold">
                    {products.reduce((sum, product) => sum + (product.views || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                  <ShoppingBag className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Purchases</div>
                  <div className="text-2xl font-bold">
                    {products.reduce((sum, product) => sum + product.purchases, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-900">
                  <Heart className="h-6 w-6 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  <div className="text-2xl font-bold">
                    {products.reduce((sum, product) => sum + (product.views || 0), 0) > 0
                      ? ((products.reduce((sum, product) => sum + product.purchases, 0) / 
                          products.reduce((sum, product) => sum + (product.views || 0), 0)) * 100).toFixed(2) + '%'
                      : '0%'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Track views, purchases, and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="purchases">Most Purchases</SelectItem>
                  <SelectItem value="price">Highest Price</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Views <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Purchases <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Conv. Rate</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Listed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length > 0 ? (
                  sortedProducts.slice(0, 10).map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.title} 
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="max-w-[200px] truncate font-medium">
                            {product.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="capitalize">{product.category}</span>
                          {product.subcategory && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {product.subcategory}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.views?.toLocaleString() || 0}</TableCell>
                      <TableCell>{product.purchases.toLocaleString()}</TableCell>
                      <TableCell>
                        {product.views > 0
                          ? ((product.purchases / product.views) * 100).toFixed(2) + '%'
                          : '0%'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {product.is_discounted && product.discount_percentage ? (
                            <>
                              <span className="font-medium">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-xs line-through text-muted-foreground">
                                {formatCurrency(product.price + (product.price * product.discount_percentage / 100))}
                              </span>
                            </>
                          ) : (
                            <span>{formatCurrency(product.price)}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.stock > 10 ? "outline" : "destructive"}
                          className={product.stock > 10 ? "border-green-500 text-green-700" : undefined}
                        >
                          {product.stock > 0 ? product.stock : "Out of stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(product.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No products found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
