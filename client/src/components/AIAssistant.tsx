import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, X, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  selectedItem?: any;
  currentValuation?: any;
}

export function AIAssistant({ selectedItem, currentValuation }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI valuation assistant. I can help you understand market trends, pricing factors, and answer questions about item valuations. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on context
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on selected item and valuation
    if (selectedItem && currentValuation) {
      if (lowerMessage.includes("price") || lowerMessage.includes("value")) {
        return `Based on the current market analysis for the ${selectedItem.name}, the estimated market value is ${currentValuation.marketValue}. This pricing considers the item's condition (${selectedItem.condition}), brand reputation, and recent sales data. The recommended offer of ${currentValuation.recommendedOffer} provides a healthy profit margin of ${currentValuation.marginPercentage}%.`;
      }
      
      if (lowerMessage.includes("condition") || lowerMessage.includes("factor")) {
        return `For the ${selectedItem.name}, several factors affect its value: 1) Condition (${selectedItem.condition}) - impacts 20-30% of value, 2) Brand reputation (${selectedItem.brand}) - premium brands hold value better, 3) Age (${selectedItem.age}) - newer items typically worth more, 4) Market demand - current trends and seasonality. The item's current condition suggests it's in ${selectedItem.condition} shape, which is reflected in our valuation.`;
      }
      
      if (lowerMessage.includes("trend") || lowerMessage.includes("market")) {
        return `Market trends for ${selectedItem.categoryId} items show steady demand. ${selectedItem.brand} products typically maintain strong resale values. Consider seasonal factors - electronics tend to peak before holidays, while luxury items like watches and jewelry have consistent demand year-round.`;
      }
    }
    
    // General pawn shop advice
    if (lowerMessage.includes("tips") || lowerMessage.includes("advice")) {
      return "Here are key valuation tips: 1) Always verify authenticity first, 2) Check multiple data sources for accurate pricing, 3) Consider local market demand, 4) Factor in refurbishment costs, 5) Be aware of seasonal trends, 6) Maintain competitive but profitable margins. Would you like specific advice for any category?";
    }
    
    if (lowerMessage.includes("category") || lowerMessage.includes("type")) {
      return "Different categories have unique considerations: Electronics depreciate quickly but have high turnover. Jewelry requires authentication and metal testing. Vehicles need title verification and mechanical inspection. Musical instruments hold value well if maintained. Tools have steady demand. What category interests you most?";
    }
    
    if (lowerMessage.includes("authentication") || lowerMessage.includes("fake")) {
      return "Authentication is crucial for valuable items. For electronics, check serial numbers and original packaging. For jewelry, test metals and verify hallmarks. For designer items, examine stitching, materials, and serial numbers. When in doubt, consult specialists or use authentication services.";
    }
    
    if (lowerMessage.includes("profit") || lowerMessage.includes("margin")) {
      return "Healthy profit margins vary by category: Electronics 15-25%, Jewelry 40-60%, Tools 25-35%, Vehicles 10-20%. Consider holding costs, refurbishment needs, and market velocity. Higher-risk items should have higher margins to compensate for potential losses.";
    }
    
    // Default helpful response
    return "I can help you with pricing analysis, market trends, authentication tips, and valuation strategies. Feel free to ask about specific items, categories, or general pawn shop best practices. What would you like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gold hover:bg-gold/90 text-dark-primary rounded-full w-14 h-14 shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 bg-dark-secondary border-accent-gray/30 shadow-xl z-50 transition-all ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-accent-gray/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-white">AI Assistant</h3>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white w-8 h-8 p-0"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4 h-[360px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-dark-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-gold text-dark-primary"
                        : "bg-dark-primary text-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-accent-gray rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-dark-primary" />
                  </div>
                  <div className="bg-dark-primary text-white p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-accent-gray/30">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask about pricing, trends, or valuation tips..."
                className="bg-dark-primary border-accent-gray/50 text-white flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gold hover:bg-gold/90 text-dark-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}