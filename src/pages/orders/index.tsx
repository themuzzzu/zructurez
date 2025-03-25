
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, ArrowLeft, ChevronRight, Clock, CheckCircle, Truck, ShoppingBag, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { measureApiCall } from "@/utils/performanceTracking";

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  products: {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
  };
}

interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  total: number;
  payment_method: string;
  address_id?: string;
  discount: number;
  shipping_fee: number;
  coupon_code: string | null;
  order_items: OrderItem[];
  user_addresses?: UserAddress;
}

interface OrderData {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  total_price: number;
  product_id: string;
  quantity: number;
  business_id: string | null;
  payment_method?: string;
  address_id?: string;
  discount?: number;
  shipping_fee?: number;
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: ordersData = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to view orders');
      }

      return await measureApiCall('fetch-user-orders', async () => {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        
        const ordersWithItems = await Promise.all(
          (ordersData || []).map(async (order: OrderData) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select(`
                *,
                products:product_id (
                  id,
                  title,
                  price,
                  image_url
                )
              `)
              .eq('order_id', order.id);
            
            if (itemsError) {
              console.error('Error fetching order items:', itemsError);
              return { 
                ...order, 
                order_items: [],
                total: order.total_price,
                payment_method: order.payment_method || 'cod',
                discount: order.discount || 0,
                shipping_fee: order.shipping_fee || 0,
                coupon_code: null
              } as Order;
            }
            
            let addressData = null;
            if (order.address_id) {
              const { data: address, error: addressError } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('id', order.address_id)
                .single();
                
              if (addressError && addressError.code !== 'PGRST116') {
                console.error('Error fetching address:', addressError);
              } else {
                addressData = address;
              }
            }
            
            return { 
              ...order, 
              order_items: itemsData || [],
              user_addresses: addressData || null,
              total: order.total_price,
              payment_method: order.payment_method || 'cod',
              discount: order.discount || 0,
              shipping_fee: order.shipping_fee || 0,
              coupon_code: null
            } as Order;
          })
        );
        
        return ordersWithItems as Order[];
      });
    },
  });

  const filteredOrders = (ordersData || []).filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderIdMatch = order.id.toLowerCase().includes(query);
      
      const productMatch = order.order_items.some(item => 
        (item.products?.title || '').toLowerCase().includes(query)
      );
      
      return orderIdMatch || productMatch;
    }

    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="border-indigo-500 text-indigo-700">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="border-green-500 text-green-700">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6 gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => setOrderFilter(value as any)}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
            <TabsContent value="all" />
            <TabsContent value="pending" />
            <TabsContent value="processing" />
            <TabsContent value="shipped" />
            <TabsContent value="delivered" />
          </Tabs>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">Order #{order.id.slice(0, 8)}</h2>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="md:text-right mt-2 md:mt-0">
                    <p className="font-medium">{formatPrice(order.total || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {order.order_items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-slate-50">
                        {item.products?.image_url && (
                          <img
                            src={item.products.image_url}
                            alt={item.products.title}
                            className="h-full w-full object-cover object-center"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-sm font-medium line-clamp-1">{item.products?.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {order.order_items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.order_items.length - 2} more items
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {getOrderStatusIcon(order.status)}
                    <span className="ml-2">
                      {order.status === 'pending' && 'Order confirmation pending'}
                      {order.status === 'processing' && 'Order is being processed'}
                      {order.status === 'shipped' && 'Order has been shipped'}
                      {order.status === 'delivered' && 'Order delivered successfully'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'No orders match your search criteria' : 'You haven\'t placed any orders yet'}
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
