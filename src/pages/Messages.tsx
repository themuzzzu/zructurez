import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { MessageBubble } from "@/components/MessageBubble";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const SAMPLE_CHATS: Chat[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thanks for the help with the garden!",
    time: "2m ago",
    unread: 2,
    messages: [
      {
        id: "1",
        content: "Hi there! Could you help me with my garden?",
        timestamp: "Yesterday 2:30 PM",
        senderId: "sarah"
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
        senderId: "sarah"
      }
    ]
  },
  {
    id: 2,
    name: "Mike Peterson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    lastMessage: "When is the next community meeting?",
    time: "1h ago",
    unread: 0
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessage: "I found your lost cat!",
    time: "3h ago",
    unread: 1
  }
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS);
  const [searchQuery, setSearchQuery] = useState("");

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
          messages: [...chat.messages, newMessage],
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
                <div className="w-80 border-r">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b ${
                          selectedChat?.id === chat.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold">{chat.name}</span>
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {selectedChat ? (
                    <>
                      <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedChat.avatar}
                            alt="Chat avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="font-semibold">
                            {selectedChat.name}
                          </span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {selectedChat.messages.map((msg) => (
                            <MessageBubble
                              key={msg.id}
                              content={msg.content}
                              timestamp={msg.timestamp}
                              isOwn={msg.senderId === "me"}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      Select a chat to start messaging
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;
