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

const SAMPLE_CHATS = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thanks for the help with the garden!",
    time: "2m ago",
    unread: 2
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
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success("Message sent!");
      setMessage("");
    }
  };

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
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    {SAMPLE_CHATS.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b"
                        onClick={() => setSelectedChat(chat.id)}
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
                            src={SAMPLE_CHATS.find(c => c.id === selectedChat)?.avatar}
                            alt="Chat avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="font-semibold">
                            {SAMPLE_CHATS.find(c => c.id === selectedChat)?.name}
                          </span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          <p className="text-center text-sm text-muted-foreground">
                            This is the beginning of your conversation
                          </p>
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
