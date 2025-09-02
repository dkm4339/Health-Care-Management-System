import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import ChatMessageBubble from '@/components/ChatMessageBubble';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Paperclip, Video } from 'lucide-react';
import { useLocation } from 'wouter';
import { socketService } from '@/services/socket';
import { apiRequest } from '@/services/api';
import { Message } from '@shared/schema';

export default function Chat() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/chat/conversations'],
  });

  const { data: chatMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/chat/messages', selectedUserId],
    enabled: !!selectedUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; content: string }) => {
      return apiRequest('POST', '/api/chat/messages', messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
    },
  });

  // Initialize WebSocket connection
  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);

      socketService.onMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
        queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
        
        // If the message is from the currently selected user, update the chat
        if (message.senderId === selectedUserId) {
          queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', selectedUserId] });
        }
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [user?.id, selectedUserId, queryClient]);

  // Update local messages when chat messages change
  useEffect(() => {
    if (Array.isArray(chatMessages)) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUserId) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Send via WebSocket for real-time delivery
    socketService.sendMessage(user!.id, selectedUserId, content);

    // Also send via API for persistence
    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartVideoCall = () => {
    setLocation('/video-call');
  };

  const selectedConversation = Array.isArray(conversations) ? conversations.find((conv: any) => conv.userId === selectedUserId) : undefined;
  const filteredConversations = Array.isArray(conversations) ? conversations.filter((conv: any) => 
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getSidebarType = () => {
    if (user?.role === 'patient') return 'patient';
    if (user?.role === 'doctor') return 'doctor';
    return 'admin';
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={getSidebarType()} />
      
      <div className="flex-1 flex">
        {/* Chat List */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3" data-testid="text-messages-title">Messages</h2>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
                data-testid="input-search-conversations"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-3">
                    <div className="rounded-full bg-muted h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm" data-testid="text-no-conversations">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation: any) => (
                <div
                  key={conversation.userId}
                  className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedUserId === conversation.userId ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => setSelectedUserId(conversation.userId)}
                  data-testid={`conversation-${conversation.userId}`}
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" alt={conversation.userName} />
                        <AvatarFallback>
                          {conversation.userName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground truncate" data-testid={`text-conversation-name-${conversation.userId}`}>
                            {conversation.userName}
                          </h4>
                          <span className="text-xs text-muted-foreground" data-testid={`text-conversation-time-${conversation.userId}`}>
                            {new Date(conversation.lastMessageTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate" data-testid={`text-conversation-preview-${conversation.userId}`}>
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-0.5" data-testid={`badge-unread-${conversation.userId}`}>
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" alt={selectedConversation?.userName} />
                      <AvatarFallback>
                        {selectedConversation?.userName.split(' ').map((n: string) => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground" data-testid="text-active-chat-name">
                        {selectedConversation?.userName}
                      </h3>
                      <div className="flex items-center">
                        <span className="status-dot status-online mr-2"></span>
                        <span className="text-sm text-secondary" data-testid="text-online-status">Online</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartVideoCall}
                    className="bg-secondary hover:bg-secondary/90"
                    data-testid="button-start-video-call"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex space-x-3">
                            <div className="rounded-full bg-muted h-8 w-8"></div>
                            <div className="bg-muted rounded-lg p-3 w-64 h-12"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-no-messages">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <ChatMessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === user?.id}
                        senderName={message.senderId === user?.id ? 'You' : selectedConversation?.userName || 'Unknown'}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-12"
                      data-testid="input-message"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-testid="button-attach-file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-select-conversation">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
