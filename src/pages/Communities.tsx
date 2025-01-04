import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/components/groups/types";
import { GroupChat } from "@/components/groups/GroupChat";

const Communities = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner (
            user_id
          )
        `);

      if (groupsError) throw groupsError;

      // Process the data to get member counts
      const processedGroups = groupsData.map(group => ({
        ...group,
        group_members: {
          count: group.group_members.length,
          members: group.group_members.map((member: any) => member.user_id)
        }
      }));

      return processedGroups;
    },
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
    return <div>Loading...</div>;
  }

  const isGroupMember = (group: typeof groups[0]) => {
    if (!currentUser) return false;
    return group.group_members.members.includes(currentUser.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Groups List */}
          <div className="w-[400px] border-r bg-background">
            <div className="p-4 border-b flex justify-between items-center">
              <h1 className="text-2xl font-bold">Groups</h1>
              <Button onClick={() => setIsCreateGroupOpen(true)} size="sm">
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

          {/* Chat Area */}
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