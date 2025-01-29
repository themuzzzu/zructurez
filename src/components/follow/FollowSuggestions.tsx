import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface FollowSuggestion {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  isVerified?: boolean;
}

const suggestions: FollowSuggestion[] = [
  {
    id: "1",
    name: "Manobala Vijayabalan",
    username: "@ManobalaV",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manobala",
    isVerified: true
  },
  {
    id: "2",
    name: "Tadas Viskanta",
    username: "@abnormalreturns",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tadas",
    isVerified: true
  },
  {
    id: "3",
    name: "Harry Stebbings",
    username: "@HarryStebbings",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harry",
    isVerified: true
  }
];

export const FollowSuggestions = () => {
  return (
    <Card className="bg-card border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={suggestion.avatar_url} alt={suggestion.name} />
                <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm">{suggestion.name}</span>
                  {suggestion.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500 fill-current" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{suggestion.username}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Follow
            </Button>
          </div>
        ))}
        <Button variant="link" className="text-sm text-blue-500 hover:text-blue-600 p-0">
          Show more
        </Button>
      </CardContent>
    </Card>
  );
};