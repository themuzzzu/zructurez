import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/chat";

const Communities = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members (
            count,
            members:user_id
          )
        `);

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
        },
        type: "group",
        avatar: group.image_url || '/placeholder.svg',
        time: group.created_at,
        lastMessage: null,
        unread: 0,
        participants: [],
        messages: [],
        unreadCount: 0,
        isGroup: true,
        userId: group.user_id
      }));

      setGroups(mappedGroups);
    };

    fetchGroups();
  }, []);

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
      <h1 className="text-2xl font-bold">Communities</h1>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {groups.map((group) => (
          <div key={group.id} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p>{group.description || 'No description'}</p>
            <p>{group.group_members.count} members</p>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No groups yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;