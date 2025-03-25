
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, X, Minimize2, Maximize2, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { measureApiCall } from "@/utils/performanceTracking";
import { toast } from "sonner";

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-message',
      role: 'assistant',
      content: 'Hello! I\'m your personal shopping assistant. I can help with order questions, product recommendations, or finding businesses that match your needs. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Process message with AI
      const response = await measureApiCall('ai-assistant-message', () => 
        processAIResponse(userMessage.content)
      );
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation history if user is logged in
      if (currentUser) {
        try {
          // Store conversation in the new ai_conversations table
          const { error } = await supabase
            .from('ai_conversations')
            .insert({
              user_id: currentUser.id,
              query: userMessage.content,
              response: response,
              query_type: detectQueryType(userMessage.content)
            });
            
          if (error) {
            console.error('Failed to save conversation:', error);
          }
        } catch (error) {
          console.error('Exception saving conversation:', error);
          // Silently handle this error to not interrupt the UX
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      }]);
      
      toast.error('Failed to process message');
    } finally {
      setIsLoading(false);
    }
  };

  const processAIResponse = async (query: string): Promise<string> => {
    // In a real application, this would call an AI service endpoint
    // For demonstration, we'll simulate different responses based on the query
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Simple rule-based responses
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('order') && (lowerQuery.includes('track') || lowerQuery.includes('status'))) {
      return "You can track your order status in the 'Orders' tab of your account settings. If you've just placed an order, please allow up to 15 minutes for it to appear in your order history.";
    }
    
    if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
      return "Our return policy allows returns within 30 days of purchase. To initiate a return, go to your Orders tab, select the order, and click 'Request Return'. Once approved, you'll receive a refund within 5-7 business days.";
    }
    
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggestion')) {
      return "Based on your browsing history, you might enjoy our trending products in electronics and home goods. Would you like me to show you specific recommendations? I can filter by category, price range, or popularity.";
    }
    
    if (lowerQuery.includes('discount') || lowerQuery.includes('coupon') || lowerQuery.includes('promo')) {
      return "We currently have several active promotions! Use code WELCOME15 for 15% off your first purchase, or SUMMER2023 for free shipping on orders over $50. You can also check the Promotions section for category-specific deals.";
    }
    
    if (lowerQuery.includes('business') && (lowerQuery.includes('find') || lowerQuery.includes('nearby'))) {
      return "I can help you find businesses based on your location and preferences. What type of business are you looking for, and in which area? You can also browse the Services page to explore local businesses by category.";
    }
    
    // Default response for other queries
    return "Thank you for your question. I'd be happy to help with that. Could you provide a bit more information so I can better assist you? You can ask about orders, products, businesses, or general shopping assistance.";
  };

  const detectQueryType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('order') || lowerQuery.includes('track') || lowerQuery.includes('shipping')) {
      return 'order_support';
    }
    
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest') || lowerQuery.includes('find products')) {
      return 'product_recommendation';
    }
    
    if (lowerQuery.includes('business') || lowerQuery.includes('service provider')) {
      return 'business_inquiry';
    }
    
    return 'general';
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4 h-14 w-14 shadow-lg z-50"
        onClick={handleToggleOpen}
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-80 sm:w-96'}`}>
      <Card className="border shadow-xl">
        <CardHeader className="p-3 flex flex-row justify-between items-center space-y-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 bg-primary">
              <Bot className="h-4 w-4 text-white" />
            </Avatar>
            <CardTitle className="text-sm font-semibold">AI Shopping Assistant</CardTitle>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleToggleMinimize}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleToggleOpen}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            <CardContent className="p-3 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === 'assistant' ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="text-xs font-semibold">
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 text-right mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0">
              <form 
                className="flex w-full items-center space-x-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input 
                  placeholder="Type your message..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || input.trim() === ''}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};
