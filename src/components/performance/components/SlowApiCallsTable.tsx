
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
    <Card className="w-full">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-lg md:text-xl">Slow API Calls</CardTitle>
        <CardDescription className="text-sm">API calls taking longer than {threshold}ms to complete</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {slowCalls.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] md:w-[180px]">Endpoint</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Response Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slowCalls.map((call, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-xs md:text-sm truncate max-w-[100px] md:max-w-full">
                      {call.endpoint}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <span className={`font-mono text-xs md:text-sm ${
                        call.response_time > 1000 ? 'text-red-500 font-bold' : 
                        call.response_time > 750 ? 'text-amber-500' : 
                        'text-amber-400'
                      }`}>
                        {call.response_time.toFixed(0)}ms
                      </span>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {call.success ? (
                        <span className="text-green-600">Success</span>
                      ) : (
                        <span className="text-red-600">Failed</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell text-xs md:text-sm">
                      {formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No slow API calls detected.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
