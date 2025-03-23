
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupsSidebarProps {
  selectedGroup: string | null;
  setSelectedGroup: (groupId: string | null) => void;
}

export const GroupsSidebar = ({ selectedGroup, setSelectedGroup }: GroupsSidebarProps) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

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

  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold mb-4">Communities</h1>
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setSelectedGroup(null)}
        >
          All Communities
        </Button>
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-2 pr-4">
            {groups.map((group) => (
              <Button
                key={group.id}
                variant={selectedGroup === group.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedGroup(group.id)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{group.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {group.group_members.count}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
