
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/SearchInput";
import { Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

interface GroupsSidebarProps {
  selectedGroup: string | null;
  setSelectedGroup: (groupId: string | null) => void;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  group_members: {
    count: number;
    members: string[];
  };
}

export const GroupsSidebar = ({ selectedGroup, setSelectedGroup }: GroupsSidebarProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  useEffect(() => {
    fetchGroups();
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            count,
            members:user_id
          )
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching groups:', error);
        return;
      }

      const mappedGroups: Group[] = data.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        image_url: group.image_url,
        created_at: group.created_at,
        user_id: group.user_id,
        group_members: {
          count: group.group_members?.length || 0,
          members: group.group_members?.map((m: any) => m.members) || []
        }
      }));

      setGroups(mappedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user!.id);

      if (error) throw error;
      setJoinedGroups(data.map(item => item.group_id));
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const isUserInGroup = (groupId: string) => {
    return joinedGroups.includes(groupId);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Communities</h2>
      <div className="space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search communities..."
        />
        
        <Button 
          variant={selectedGroup === null ? "default" : "outline"} 
          className="w-full mb-2"
          onClick={() => setSelectedGroup(null)}
        >
          All Communities
        </Button>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-1 pr-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedGroup === group.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center gap-3">
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{group.name}</h3>
                        {isUserInGroup(group.id) && (
                          <Badge variant="outline" className="ml-2">Joined</Badge>
                        )}
                      </div>
                      {group.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Users2 className="h-3 w-3 mr-1" />
                        {group.group_members?.count || 0} members
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredGroups.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No communities found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
