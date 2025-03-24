
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/SearchInput";
import { Loader2, Users2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JoinGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  user_id: string;
  memberCount: number;
  isJoined: boolean;
}

export const JoinGroupDialog = ({ open, onClose }: JoinGroupDialogProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchGroups();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredGroups(
        groups.filter(group => 
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredGroups(groups);
    }
  }, [searchQuery, groups]);

  const fetchGroups = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get all groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('name');

      if (groupsError) throw groupsError;

      // Get user's joined groups
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (userGroupsError) throw userGroupsError;

      const userGroupIds = userGroups.map(ug => ug.group_id);

      // Get member counts for all groups
      const { data: memberCounts, error: memberCountsError } = await supabase
        .rpc('get_group_members', { group_id: null });
      
      if (memberCountsError) throw memberCountsError;

      // Map the data together
      const mappedGroups = groupsData.map((group) => {
        const memberCount = memberCounts?.find((mc: any) => mc.group_id === group.id)?.count || 0;
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          image_url: group.image_url,
          user_id: group.user_id,
          memberCount: memberCount,
          isJoined: userGroupIds.includes(group.id)
        };
      });

      setGroups(mappedGroups);
      setFilteredGroups(mappedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error("Failed to load communities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleJoin = async (group: Group) => {
    if (!user) {
      toast.error("Please sign in to join communities");
      return;
    }

    setJoiningGroupId(group.id);
    
    try {
      if (group.isJoined) {
        // Leave the group
        const { error } = await supabase
          .from('group_members')
          .delete()
          .eq('group_id', group.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast.success(`Left ${group.name}`);
        
        // Update local state
        setGroups(prevGroups => 
          prevGroups.map(g => 
            g.id === group.id 
              ? { ...g, isJoined: false, memberCount: g.memberCount - 1 } 
              : g
          )
        );
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
        
        // Update local state
        setGroups(prevGroups => 
          prevGroups.map(g => 
            g.id === group.id 
              ? { ...g, isJoined: true, memberCount: g.memberCount + 1 } 
              : g
          )
        );
      }
    } catch (error) {
      console.error('Error toggling group membership:', error);
      toast.error(group.isJoined ? "Failed to leave community" : "Failed to join community");
    } finally {
      setJoiningGroupId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Join Communities</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search communities..."
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <div 
                  key={group.id} 
                  className="p-4 border rounded-lg flex items-start justify-between hover:bg-accent/20 transition-colors"
                >
                  <div className="flex gap-3">
                    {group.image_url ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={group.image_url} alt={group.name} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        <Users2 className="h-3 w-3 inline mr-1" />
                        {group.memberCount} members
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant={group.isJoined ? "destructive" : "default"}
                    size="sm"
                    disabled={joiningGroupId === group.id}
                    onClick={() => handleToggleJoin(group)}
                  >
                    {joiningGroupId === group.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : group.isJoined ? (
                      "Leave"
                    ) : (
                      "Join"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No communities found matching your search.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
