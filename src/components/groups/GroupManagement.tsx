import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export const GroupManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Query to fetch groups
  const { data: groups, isError: isGroupsError } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Group[];
    },
  });

  // Query to fetch user's group memberships
  const { data: memberships } = useQuery({
    queryKey: ['group_memberships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(m => m.group_id);
    },
    enabled: !!user,
  });

  // Mutation to join a group
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) {
        toast.error("Please sign in to join groups");
        navigate("/auth");
        return;
      }

      try {
        const { error } = await supabase
          .from('group_members')
          .insert([
            { group_id: groupId, user_id: user.id }
          ]);

        if (error) {
          if (error.code === '23505') {
            toast.error("You're already a member of this group");
            return;
          }
          throw error;
        }

        toast.success("Successfully joined the group!");
      } catch (error) {
        console.error('Error joining group:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_memberships'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Mutation to leave a group
  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_memberships'] });
      toast.success("Successfully left the group");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleJoinGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      await joinGroupMutation.mutateAsync(groupId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      await leaveGroupMutation.mutateAsync(groupId);
    } finally {
      setIsLoading(false);
    }
  };

  if (isGroupsError) {
    return <div className="p-4 text-red-500">Error loading groups</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {groups?.map((group) => (
        <div
          key={group.id}
          className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
        >
          <div>
            <h3 className="font-semibold">{group.name}</h3>
            {group.description && (
              <p className="text-sm text-muted-foreground">{group.description}</p>
            )}
          </div>
          <Button
            onClick={() => 
              memberships?.includes(group.id)
                ? handleLeaveGroup(group.id)
                : handleJoinGroup(group.id)
            }
            disabled={isLoading}
            variant={memberships?.includes(group.id) ? "destructive" : "default"}
          >
            {memberships?.includes(group.id) ? "Leave" : "Join"}
          </Button>
        </div>
      ))}
    </div>
  );
};