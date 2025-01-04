import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { GroupChat } from "@/components/groups/GroupChat";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGroups } from "@/hooks/useGroups";
import { GroupList } from "@/components/groups/GroupList";

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

  const { data: currentUser } = useCurrentUser();
  const { data: groups, isLoading } = useGroups(!!currentUser);

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
    onError: () => {
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
            <GroupList 
              groups={groups || []}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
            />
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