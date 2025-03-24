
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommunityHeaderProps {
  group: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    user_id: string;
    group_members: any[];
  };
  onRefresh: () => void;
}

export const CommunityHeader = ({ group, onRefresh }: CommunityHeaderProps) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // Check if user is a member
  useState(() => {
    const checkMembership = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();
      
      setIsJoined(!!data);
    };
    
    checkMembership();
  });

  const handleToggleJoin = async () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      return;
    }

    setIsJoining(true);
    
    try {
      if (isJoined) {
        // Leave the group
        const { error } = await supabase
          .from('group_members')
          .delete()
          .eq('group_id', group.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast.success(`Left ${group.name}`);
        setIsJoined(false);
      } else {
        // Join the group
        const { error } = await supabase
          .from('group_members')
          .insert({
            group_id: group.id,
            user_id: user.id
          });

        if (error) throw error;
        
        toast.success(`Joined ${group.name}`);
        setIsJoined(true);
      }
      
      onRefresh();
    } catch (error) {
      console.error('Error toggling group membership:', error);
      toast.error(isJoined ? "Failed to leave community" : "Failed to join community");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start gap-4">
        {group.image_url ? (
          <Avatar className="h-16 w-16">
            <AvatarImage src={group.image_url} alt={group.name} />
            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Users2 className="h-8 w-8 text-primary" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{group.name}</h2>
              {group.description && (
                <p className="text-muted-foreground mt-1">{group.description}</p>
              )}
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Users2 className="h-4 w-4 mr-1" />
                {group.group_members?.length || 0} members
              </div>
            </div>
            
            <Button
              variant={isJoined ? "outline" : "default"}
              onClick={handleToggleJoin}
              disabled={isJoining}
            >
              {isJoined ? "Leave" : "Join"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
