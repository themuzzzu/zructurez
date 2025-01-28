import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, UserMinus, Trash2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GroupManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner (
            user_id
          )
        `);

      if (error) throw error;
      return data || [];
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Successfully joined the group!');
    },
    onError: () => {
      toast.error('Failed to join group');
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Successfully left the group');
    },
    onError: () => {
      toast.error('Failed to leave group');
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete group');
    },
  });

  const handleJoinGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await joinGroupMutation.mutateAsync(groupId);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await leaveGroupMutation.mutateAsync(groupId);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await deleteGroupMutation.mutateAsync(groupId);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (groupId: string) => {
    navigate(`/messages?group=${groupId}`);
  };

  if (isLoading) {
    return <div>Loading groups...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups?.map((group: any) => (
        <Card key={group.id} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{group.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenChat(group.id)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {group.description || 'No description available'}
            </p>
            <div className="flex justify-end gap-2">
              {group.user_id === (supabase.auth.user()?.id || '') ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteGroup(group.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              ) : group.group_members.some((member: any) => 
                  member.user_id === (supabase.auth.user()?.id || '')
                ) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLeaveGroup(group.id)}
                  disabled={loading}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};