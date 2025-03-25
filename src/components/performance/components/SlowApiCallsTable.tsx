
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSlowApiCalls } from '../utils/metricCalculations';
import { formatDistanceToNow } from 'date-fns';

interface SlowApiCallsTableProps {
  data: any[];
  threshold?: number;
}

export const SlowApiCallsTable = ({ data, threshold = 500 }: SlowApiCallsTableProps) => {
  const slowCalls = getSlowApiCalls(data, threshold);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Slow API Calls</CardTitle>
        <CardDescription>API calls taking longer than {threshold}ms to complete</CardDescription>
      </CardHeader>
      <CardContent>
        {slowCalls.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slowCalls.map((call, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{call.endpoint}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono ${
                      call.response_time > 1000 ? 'text-red-500 font-bold' : 
                      call.response_time > 750 ? 'text-amber-500' : 
                      'text-amber-400'
                    }`}>
                      {call.response_time.toFixed(0)}ms
                    </span>
                  </TableCell>
                  <TableCell>
                    {call.success ? (
                      <span className="text-green-600">Success</span>
                    ) : (
                      <span className="text-red-600">Failed</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No slow API calls detected.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
