
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorListProps {
  data: any[];
}

export const ErrorList = ({ data }: ErrorListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Errors</CardTitle>
        <CardDescription>Most recent error messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data
            .filter(m => !m.success && m.error_message)
            .slice(0, 5)
            .map((error, i) => (
              <div key={i} className="text-sm text-destructive">
                {error.error_message}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
