
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdFormData } from "../types";
import { format } from "date-fns";

interface ReviewProps {
  data: AdFormData;
}

export const Review = ({ data }: ReviewProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Review Your Advertisement</h3>
        <p className="text-sm text-muted-foreground">
          Double-check all your information before submitting
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative w-full h-48 bg-muted">
          {data.mediaUrl ? (
            <img
              src={data.mediaUrl}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No media uploaded
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {data.section && (
              <Badge variant="outline">{data.section}</Badge>
            )}
            {data.type && (
              <Badge variant="secondary">{data.type.replace(/_/g, " ")}</Badge>
            )}
            <Badge variant={data.isActive ? "default" : "outline"}>
              {data.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold">{data.title || "No title"}</h3>
          <p className="text-muted-foreground">
            {data.description || "No description provided"}
          </p>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Call to Action: </span>
              <span>{data.ctaText || "None"}</span>
            </div>

            <div>
              <span className="text-sm font-medium">Target Type: </span>
              <span>{data.targetType}</span>
            </div>

            <div>
              <span className="text-sm font-medium">Target ID: </span>
              <span className="font-mono text-xs">{data.targetId || "None"}</span>
            </div>

            <div>
              <span className="text-sm font-medium">Timeframe: </span>
              <span>
                {format(data.startDate, "PPP")}
                {data.endDate ? ` to ${format(data.endDate, "PPP")}` : " (no end date)"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Ready to submit</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Once submitted, your advertisement will be processed and go live according to your selected schedule.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
