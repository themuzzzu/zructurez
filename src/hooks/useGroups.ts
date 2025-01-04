import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";

export const useGroups = (enabled: boolean) => {
  return useQuery({
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

      return groupsData.map(group => ({
        ...group,
        group_members: {
          count: group.group_members.length,
          members: group.group_members.map((member: any) => member.user_id)
        }
      })) as Group[];
    },
    enabled,
    meta: {
      errorMessage: "Failed to load groups"
    }
  });
};