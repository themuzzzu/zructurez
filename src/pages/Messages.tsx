import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chat, Message } from "@/types/chat";

// Using proper UUIDs for the sample data
const SAMPLE_CHATS: Chat[] = [
  {
    id: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thanks for the help with the garden!",
    time: "2m ago",
    unread: 2,
    userId: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d1",
    messages: [
      {
        id: "1",
        content: "Hi there! Could you help me with my garden?",
        timestamp: "Yesterday 2:30 PM",
        senderId: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d1"
      },
      {
        id: "2",
        content: "Of course! What do you need help with?",
        timestamp: "Yesterday 2:35 PM",
        senderId: "me"
      },
      {
        id: "3",
        content: "Thanks for the help with the garden!",
        timestamp: "2m ago",
        senderId: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d1"
      }
    ]
  },
  {
    id: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d2",
    name: "Mike Peterson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    lastMessage: "When is the next community meeting?",
    time: "1h ago",
    unread: 0,
    userId: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d2",
    messages: []
  },
  {
    id: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d3",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "I found your lost cat!",
    time: "3h ago",
    unread: 1,
    userId: "feb4a063-6dfc-4b6f-a1d9-0fc2c57c04d3",
    messages: []
  }
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChat = (chat: Chat) => {
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setChats(updatedChats);
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      senderId: "me"
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: message,
          time: "Just now"
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id) || null);
    setMessage("");
    toast.success("Message sent!");
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-[400px] border-r bg-background">
            <ChatList
              chats={filteredChats}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <div className="flex-1 bg-background">
            <ChatWindow
              selectedChat={selectedChat}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
