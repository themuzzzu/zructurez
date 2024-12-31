import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/components/groups/types";
import { GroupChat } from "@/components/groups/GroupChat";

const Groups = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data: groups, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            count
          )
        `);

      if (error) throw error;
      return groups as Group[];
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
      toast.success("Successfully joined the community!");
    },
    onError: () => {
      toast.error("Failed to join community");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block" />
          <main className="flex-1">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Link to="/">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold">Groups</h1>
                </div>
                <Button onClick={() => setIsCreateGroupOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Community
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups?.map((group) => (
                      <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up">
                        {group.image_url && (
                          <img
                            src={group.image_url}
                            alt={group.name}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <Users2 className="h-4 w-4 mr-2" />
                            {group.group_members?.[0]?.count || 0} members
                          </div>
                          {group.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {group.description}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              variant="default"
                              onClick={() => joinGroupMutation.mutate(group.id)}
                              disabled={joinGroupMutation.isPending}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Join Community
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedGroup(group)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    {selectedGroup ? (
                      <div className="h-full">
                        <div className="p-4 border-b">
                          <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                        </div>
                        <GroupChat groupId={selectedGroup.id} />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
                        Select a community to view the chat
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </main>
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

export default Groups;