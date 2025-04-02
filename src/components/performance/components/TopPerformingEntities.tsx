
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ShoppingCart, Newspaper } from "lucide-react";

interface EntityItem {
  id: string;
  title?: string;
  content?: string;
  views: number;
}

interface TopPerformingEntitiesProps {
  products: EntityItem[];
  services: EntityItem[];
  posts: EntityItem[];
}

export const TopPerformingEntities = ({
  products,
  services,
  posts,
}: TopPerformingEntitiesProps) => {
  return (
    <Tabs defaultValue="products" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Top Performing
        </h3>
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-1">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3.5v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
              <path d="M20 10.5v2a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
              <path d="M14 17.5v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
            </svg>
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <Newspaper className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="products">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right" style={{ width: '100px' }}>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                    No product data available
                  </TableCell>
                </TableRow>
              ) : (
                products.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {product.views.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="services">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right" style={{ width: '100px' }}>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                    No service data available
                  </TableCell>
                </TableRow>
              ) : (
                services.slice(0, 5).map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {service.views.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="posts">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead className="text-right" style={{ width: '100px' }}>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                    No post data available
                  </TableCell>
                </TableRow>
              ) : (
                posts.slice(0, 5).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {post.content?.substring(0, 40)}
                      {post.content && post.content.length > 40 ? '...' : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
};
