import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatMessage } from '@/components/forms/ChatMessage';
import { ChatInput } from '@/components/forms/ChatInput';
import { aiService } from '@/services/aiService';
import { ChatMessage as ChatMessageType } from '@/types';
import { generateId } from '@/utils/formatters';
import { Bot } from 'lucide-react';

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI financial assistant. Ask me anything about your spending habits, savings tips, or budget recommendations. I'll analyze your data and provide personalized insights.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await aiService.sendMessage(content);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground">Get personalized financial insights and recommendations</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 pr-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-border mt-4">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </AppLayout>
  );
}
