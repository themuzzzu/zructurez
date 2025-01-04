import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chat, Message } from "@/types/chat";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SAMPLE_CHATS: Chat[] = [
  {
    id: "d7bed21c-5a38-402b-ac0a-4ee011247c77",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thanks for the help with the garden!",
    time: "2m ago",
    unread: 2,
    userId: "d7bed21c-5a38-402b-ac0a-4ee011247c77",
    messages: [
      {
        id: "1",
        content: "Hi there! Could you help me with my garden?",
        timestamp: "Yesterday 2:30 PM",
        senderId: "d7bed21c-5a38-402b-ac0a-4ee011247c77"
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
        senderId: "d7bed21c-5a38-402b-ac0a-4ee011247c77"
      }
    ]
  },
  {
    id: "e9e34f2c-9587-4bd7-9a58-d2c9db66a743",
    name: "Mike Peterson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    lastMessage: "When is the next community meeting?",
    time: "1h ago",
    unread: 0,
    userId: "e9e34f2c-9587-4bd7-9a58-d2c9db66a743",
    messages: []
  },
  {
    id: "f6b3d8a1-4e12-4c3a-9e2d-8c4f1c9b7b5a",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "I found your lost cat!",
    time: "3h ago",
    unread: 1,
    userId: "f6b3d8a1-4e12-4c3a-9e2d-8c4f1c9b7b5a",
    messages: []
  }
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
            <div className="p-4 border-b flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>
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
