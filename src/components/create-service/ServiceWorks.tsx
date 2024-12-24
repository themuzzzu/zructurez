import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ServiceWorkItem } from "./ServiceWorkItem";

interface WorkItem {
  id: string;
  description: string;
  media: string | null;
}

interface ServiceWorksProps {
  works: WorkItem[];
  onChange: (works: WorkItem[]) => void;
}

export const ServiceWorks = ({ works, onChange }: ServiceWorksProps) => {
  const addWork = () => {
    onChange([...works, { id: crypto.randomUUID(), description: "", media: null }]);
  };

  const removeWork = (id: string) => {
    onChange(works.filter(work => work.id !== id));
  };

  const updateWork = (id: string, data: { description: string; media: string | null }) => {
    onChange(works.map(work => 
      work.id === id ? { ...work, ...data } : work
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Portfolio Works</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addWork}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Work
        </Button>
      </div>

      <div className="space-y-4">
        {works.map((work) => (
          <ServiceWorkItem
            key={work.id}
            onRemove={() => removeWork(work.id)}
            onChange={(data) => updateWork(work.id, data)}
          />
        ))}
      </div>
    </div>
  );
};