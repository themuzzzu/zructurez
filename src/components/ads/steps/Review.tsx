
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AdFormData } from "../types";

interface ReviewProps {
  data: AdFormData;
}

export const Review = ({ data }: ReviewProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Review Your Advertisement</h3>
        <p className="text-sm text-muted-foreground">
          Please review all details before submitting
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
            {data.mediaUrl && (
              <img
                src={data.mediaUrl}
                alt="Ad preview"
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p className="mt-1">
                <Badge variant="secondary" className="mr-2">
                  {data.section}
                </Badge>
                <Badge>{data.type}</Badge>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
              <div className="mt-1 space-y-1">
                <p className="font-medium">{data.title}</p>
                {data.description && (
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                )}
                <p className="text-sm">
                  CTA: <span className="font-medium">{data.ctaText}</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Target</h4>
              <p className="mt-1">
                {data.targetType === "url" ? (
                  <a 
                    href={data.targetId} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {data.targetId}
                  </a>
                ) : (
                  <span>
                    {data.targetType}: {data.targetId}
                  </span>
                )}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
              <div className="mt-1 space-y-1">
                <p>Start: {format(data.startDate, "PPP")}</p>
                {data.endDate && <p>End: {format(data.endDate, "PPP")}</p>}
                <p>Status: {data.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
