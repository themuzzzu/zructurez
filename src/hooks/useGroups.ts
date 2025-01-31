import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { Chat } from "@/types/chat";

export const useGroups = (enabled: boolean) => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      // First fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Then fetch members for each group
      const groupsWithMembers = await Promise.all(
        groupsData.map(async (group) => {
          const { data: membersData } = await supabase
            .rpc('get_group_members', { group_id: group.id });

          const memberInfo = membersData?.[0] || { count: 0, members: [] };

          return {
            ...group,
            userId: group.user_id,
            type: 'group' as const,
            avatar: group.image_url || '/placeholder.svg',
            time: group.created_at,
            lastMessage: null,
            unread: 0,
            participants: [],
            messages: [],
            unreadCount: 0,
            isGroup: true,
            group_members: {
              count: Number(memberInfo.count),
              members: memberInfo.members || []
            }
          } as Group;
        })
      );

      return groupsWithMembers;
    },
    enabled,
    meta: {
      errorMessage: "Failed to load groups"
    }
  });
};