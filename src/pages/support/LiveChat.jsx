
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Headphones as HeadphonesIcon } from 'lucide-react';

const LiveChat = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-4rem)] flex flex-col">
      <Helmet><title>Live Support | Vacation Planner</title></Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <HeadphonesIcon className="w-8 h-8 text-primary" /> Live Support
        </h1>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground py-4">
          <CardTitle className="text-lg">Chat with an Agent</CardTitle>
          <p className="text-sm opacity-80">Usually replies in under 5 minutes</p>
        </CardHeader>
        <CardContent className="flex-1 p-6 bg-muted/10">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <HeadphonesIcon className="w-4 h-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 bg-muted/50">
              <p className="text-sm">Hello! How can I help you with your travel plans today?</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t bg-background">
          <div className="flex w-full gap-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button><Send className="w-4 h-4" /></Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LiveChat;
