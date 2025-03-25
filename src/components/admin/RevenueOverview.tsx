
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Advertisement } from "@/services/adService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";

interface RevenueOverviewProps {
  ads: Advertisement[];
}

export const RevenueOverview = ({ ads }: RevenueOverviewProps) => {
  const [timeRange, setTimeRange] = useState("30");
  const [view, setView] = useState("overview");
  
  // Calculate total revenue based on ad budgets
  const totalRevenue = ads.reduce((sum, ad) => sum + ad.budget, 0);
  
  // Payment status mock data
  const paymentStatusData = [
    { name: "Paid", value: Math.floor(totalRevenue * 0.65) },
    { name: "Pending", value: Math.floor(totalRevenue * 0.2) },
    { name: "Failed", value: Math.floor(totalRevenue * 0.15) },
  ];
  
  // Revenue by ad type
  const revenueByTypeData = [
    { name: "Business", value: 0 },
    { name: "Service", value: 0 },
    { name: "Product", value: 0 },
    { name: "Sponsored", value: 0 },
  ];
  
  // Calculate revenue by ad type
  ads.forEach(ad => {
    const typeIndex = revenueByTypeData.findIndex(item => 
      item.name.toLowerCase() === ad.type.toLowerCase()
    );
    
    if (typeIndex >= 0) {
      revenueByTypeData[typeIndex].value += ad.budget;
    }
  });
  
  // Sort by value for better visualization
  revenueByTypeData.sort((a, b) => b.value - a.value);
  
  // Generate monthly revenue data (mock data based on ads)
  const monthlyRevenueData = [
    { name: "Jan", revenue: 5200 },
    { name: "Feb", revenue: 4800 },
    { name: "Mar", revenue: 6100 },
    { name: "Apr", revenue: 5400 },
    { name: "May", revenue: 7200 },
    { name: "Jun", revenue: 6800 },
    { name: "Jul", revenue: 7800 },
    { name: "Aug", revenue: 8400 },
    { name: "Sep", revenue: 10200 },
    { name: "Oct", revenue: 9800 },
    { name: "Nov", revenue: 11200 },
    { name: "Dec", revenue: 12400 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#00C49F'];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Recent transactions mock data
  const recentTransactions = ads.slice(0, 10).map(ad => ({
    id: ad.id.slice(0, 8),
    advertiser: ad.user_id.slice(0, 8),
    title: ad.title,
    amount: ad.budget,
    date: new Date(ad.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    status: Math.random() > 0.3 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'failed'
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="30">Month</TabsTrigger>
              <TabsTrigger value="90">Quarter</TabsTrigger>
              <TabsTrigger value="365">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" className="ml-2">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {view === "overview" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {ads.length} advertisements
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue / (ads.length || 1))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per advertisement
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue * 0.2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {Math.ceil(ads.length * 0.2)} advertisements
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-[350px]">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-rows-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Ad Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueByTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {revenueByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#FFC107" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Advertiser</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${transaction.advertiser}`} />
                          <AvatarFallback>{transaction.advertiser[0]}</AvatarFallback>
                        </Avatar>
                        <span>{transaction.advertiser}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{transaction.title}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'paid' ? 'default' : 
                          transaction.status === 'pending' ? 'outline' : 'destructive'
                        }
                        className={
                          transaction.status === 'paid' ? 'bg-green-500' : undefined
                        }
                      >
                        {transaction.status === 'paid' ? 'Paid' : 
                         transaction.status === 'pending' ? 'Pending' : 'Failed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
