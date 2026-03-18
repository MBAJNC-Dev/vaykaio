
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Sparkles } from 'lucide-react';

const AIConversationalPlanning = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your AI Travel Assistant. Where would you like to go, or what kind of trip are you dreaming of?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'ai', 
        content: "That sounds amazing! I can help you plan a 5-day itinerary. Do you prefer a fast-paced adventure or a relaxing getaway?" 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-4rem)] flex flex-col">
      <Helmet><title>AI Chat Planner | Vacation Planner</title></Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" /> Conversational Planner
        </h1>
        <p className="text-muted-foreground">Plan your entire trip just by chatting.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg border-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'ai' ? 'bg-muted/50' : 'bg-primary text-primary-foreground'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <CardFooter className="p-4 border-t bg-background">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
            <Input 
              placeholder="Type your travel dreams here..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIConversationalPlanning;
