import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/components/groups/types";
import { GroupChat } from "@/components/groups/GroupChat";
import { useNavigate } from "react-router-dom";

const Communities = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast.error("Please sign in to access communities");
        navigate('/auth');
      }
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      // Get the profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }
      
      return profile;
    },
    retry: 1,
    onError: (error) => {
      console.error('Error fetching user:', error);
      toast.error("Error loading user data");
    }
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      try {
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select(`
            *,
            group_members!inner (
              user_id
            )
          `);

        if (groupsError) throw groupsError;

        const processedGroups = groupsData.map(group => ({
          ...group,
          group_members: {
            count: group.group_members.length,
            members: group.group_members.map((member: any) => member.user_id)
          }
        }));

        return processedGroups;
      } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }
    },
    enabled: !!currentUser, // Only fetch groups if we have a user
    onError: (error) => {
      console.error('Error fetching groups:', error);
      toast.error("Failed to load groups");
    }
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('group_members')
        .insert({ 
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success("Successfully joined the group!");
    },
    onError: (error) => {
      console.error('Error joining group:', error);
      toast.error("Failed to join group");
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-[400px] border-r bg-background">
            <div className="p-4 border-b flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Groups</h1>
              <Button onClick={() => setIsCreateGroupOpen(true)} size="sm" className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              {groups?.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedGroup?.id === group.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center gap-3">
                    {group.image_url ? (
                      <img
                        src={group.image_url}
                        alt={group.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users2 className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {group.description || 'No description'}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Users2 className="h-3 w-3 mr-1" />
                        {group.group_members.count} members
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-background">
            {selectedGroup ? (
              <GroupChat groupId={selectedGroup.id} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a group to view the chat
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupForm
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['groups'] })}
      />
    </div>
  );
};

export default Communities;