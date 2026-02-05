import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-secondary text-foreground rounded-bl-md'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  );
}
