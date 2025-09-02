import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@shared/schema';

interface ChatMessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
}

export default function ChatMessageBubble({ message, isOwn, senderName }: ChatMessageBubbleProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isOwn) {
    return (
      <div className="flex items-start space-x-3 justify-end" data-testid={`message-${message.id}`}>
        <div className="flex-1 flex justify-end">
          <div className="bg-primary rounded-lg p-3 shadow-sm max-w-xs">
            <p className="text-sm text-primary-foreground" data-testid={`text-content-${message.id}`}>
              {message.content}
            </p>
          </div>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarImage src="" alt="You" />
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3" data-testid={`message-${message.id}`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src="" alt={senderName} />
        <AvatarFallback className="text-xs">
          {senderName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-card rounded-lg p-3 shadow-sm">
          <p className="text-sm text-foreground" data-testid={`text-content-${message.id}`}>
            {message.content}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-1" data-testid={`text-timestamp-${message.id}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
