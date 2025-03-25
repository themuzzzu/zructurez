
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface RealtimeOrdersTableProps {
  salesData: any[];
  isLoading: boolean;
}

export const RealtimeOrdersTable = ({ 
  salesData, 
  isLoading 
}: RealtimeOrdersTableProps) => {
  if (isLoading) {
    return <p>Loading orders...</p>;
  }
  
  if (salesData.length === 0) {
    return <p className="text-center py-4">No orders found</p>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesData.map(order => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
            <TableCell>{format(parseISO(order.created_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell>{order.products?.title || "Product"}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>₹{order.total_price.toLocaleString()}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  order.status === "completed" ? "default" :
                  order.status === "pending" ? "outline" :
                  order.status === "cancelled" ? "destructive" :
                  "secondary"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
