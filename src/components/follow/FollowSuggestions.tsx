import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  const handleFollow = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to follow users");
        return;
      }

      // Here you would implement the follow logic with your backend
      toast.success("Successfully followed user!");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user");
    }
  };

  const handleMessage = (userId: string) => {
    navigate(`/messages?userId=${userId}`);
  };

  return (
    <Card className="bg-card border-none shadow-none mb-6">
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => handleFollow(suggestion.id)}
              >
                Follow
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => handleMessage(suggestion.id)}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="link" className="text-sm text-blue-500 hover:text-blue-600 p-0">
          Show more
        </Button>
      </CardContent>
    </Card>
  );
};