import { Card } from "@/components/ui/card";

interface BusinessBioSectionProps {
  bio: string;
}

export const BusinessBioSection = ({ bio }: BusinessBioSectionProps) => {
  if (!bio) return null;
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Bio</h2>
      <p className="text-muted-foreground break-words">{bio}</p>
    </Card>
  );
};