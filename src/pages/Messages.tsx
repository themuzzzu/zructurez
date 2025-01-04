import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
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
    // Clear unread count when selecting a chat
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
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block" />
          <main className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Messages</h1>
            </div>
            <Card className="h-[calc(100vh-140px)]">
              <div className="flex h-full">
                <ChatList
                  chats={filteredChats}
                  selectedChat={selectedChat}
                  onSelectChat={handleSelectChat}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                <ChatWindow
                  selectedChat={selectedChat}
                  message={message}
                  onMessageChange={setMessage}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;