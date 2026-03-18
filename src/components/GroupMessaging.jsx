import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  MapPin,
  Share2,
  MoreVertical,
  Smile
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import pb from '@/lib/pocketbaseClient';
import GroupService from '@/services/GroupService';
import { toast } from 'sonner';

const GroupMessaging = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock user data
  const currentUser = pb.authStore.model || {
    id: 'current-user',
    name: 'You',
    email: 'you@example.com'
  };

  const mockUsers = {
    'current-user': { id: 'current-user', name: 'You', avatar: 'Y', color: 'primary' },
    'user-1': { id: 'user-1', name: 'Sarah', avatar: 'S', color: 'slate' },
    'user-2': { id: 'user-2', name: 'Mike', avatar: 'M', color: 'blue' },
    'user-3': { id: 'user-3', name: 'Emma', avatar: 'E', color: 'green' }
  };

  useEffect(() => {
    if (groupId) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await GroupService.getGroupMessages(groupId, 50);
      setMessages(response.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback to mock data
      if (loading) {
        setMessages(getMockMessages());
        setLoading(false);
      }
    }
  };

  const getMockMessages = () => [
    {
      id: '1',
      user_id: 'user-1',
      content: 'Hey everyone! So excited for this trip.',
      message_type: 'text',
      created: new Date(Date.now() - 3600000).toISOString(),
      userName: 'Sarah'
    },
    {
      id: '2',
      user_id: 'user-2',
      content: 'Me too! Did we decide on the hotel yet?',
      message_type: 'text',
      created: new Date(Date.now() - 3000000).toISOString(),
      userName: 'Mike'
    },
    {
      id: '3',
      user_id: 'current-user',
      content: 'I just posted a vote in the Voting tab. Check it out!',
      message_type: 'text',
      created: new Date(Date.now() - 600000).toISOString(),
      userName: 'You'
    }
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      await GroupService.sendGroupMessage(
        groupId,
        currentUser.id,
        messageText,
        'text'
      );

      toast.success('Message sent');
      await fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const getMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getMessageIcon = (type) => {
    const icons = {
      text: null,
      activity_share: <Share2 className="w-4 h-4" />,
      location_share: <MapPin className="w-4 h-4" />,
      vote_share: <Share2 className="w-4 h-4" />
    };
    return icons[type];
  };

  return (
    <Card className="flex flex-col h-[700px] border shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Group Chat</CardTitle>
            <CardDescription>Discuss plans and share updates</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Clear History</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Export Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.user_id === currentUser.id;
              const user = mockUsers[msg.user_id] || { name: 'Unknown', avatar: 'U' };

              return (
                <div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className={`bg-${user.color}-200 text-${user.color}-800`}>
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getMessageTime(msg.created)}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getMessageIcon(msg.message_type)}
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="text-xs text-muted-foreground italic">Someone is typing...</div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4 space-y-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="Share photo"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="Share location"
          >
            <MapPin className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="Emoji"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default GroupMessaging;
