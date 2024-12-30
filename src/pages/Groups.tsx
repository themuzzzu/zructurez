import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users2, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  _count?: {
    members: number;
  };
}

const Groups = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
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
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId });

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

  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success("Left the group");
    },
    onError: () => {
      toast.error("Failed to leave group");
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
                  Create Group
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <Button 
                        className="w-full"
                        variant="default"
                        onClick={() => joinGroupMutation.mutate(group.id)}
                        disabled={joinGroupMutation.isPending || leaveGroupMutation.isPending}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    </div>
                  </Card>
                ))}
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