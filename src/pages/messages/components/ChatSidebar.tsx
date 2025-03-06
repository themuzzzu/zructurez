
import { FoldersSection } from "@/components/chat/FoldersSection";
import { ChatList } from "@/components/chat/ChatList";
import { GroupList } from "@/components/groups/GroupList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chat } from "@/types/chat";
import type { Group } from "@/types/group";

interface ChatSidebarProps {
  chats: Chat[];
  groups: Group[];
  selectedChat: Chat | null;
  selectedGroup: Group | null;
  activeTab: string;
  selectedFolder: string;
  searchQuery: string;
  isPremiumUser: boolean;
  onSelectChat: (chat: Chat) => void;
  onSelectGroup: (group: Group) => void;
  onTabChange: (tab: string) => void;
  onFolderSelect: (folder: string) => void;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({
  chats,
  groups,
  selectedChat,
  selectedGroup,
  activeTab,
  isPremiumUser,
  searchQuery,
  onSelectChat,
  onSelectGroup,
  onTabChange,
  onFolderSelect,
  onSearchChange,
  onNewChat,
}: ChatSidebarProps) => {
  return (
    <div className="col-span-12 md:col-span-4 border rounded-lg overflow-hidden bg-background shadow-sm">
      <FoldersSection
        onSelectFolder={onFolderSelect}
        isPremiumUser={isPremiumUser}
      />

      <Tabs 
        defaultValue={activeTab} 
        className="w-full" 
        onValueChange={onTabChange}
      >
        <TabsList className="w-full px-4 py-2">
          <TabsTrigger value="chats" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        <div className="p-4 flex justify-end border-b">
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={activeTab === "chats" ? onNewChat : () => {}}
          >
            <Plus className="h-4 w-4" />
            {activeTab === "chats" ? "New Chat" : "New Group"}
          </Button>
        </div>

        <TabsContent value="chats" className="m-0">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={onSelectChat}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onNewChat={onNewChat}
          />
        </TabsContent>

        <TabsContent value="groups" className="m-0">
          <GroupList
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={onSelectGroup}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onAddMembers={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
