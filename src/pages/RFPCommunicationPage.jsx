
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Paperclip, Clock, User } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RFPCommunicationPage = () => {
  const { rfpId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!pb.authStore.isValid || !rfpId) return;
      try {
        const records = await pb.collection('rfp_communications').getFullList({
          filter: `rfp_id = "${rfpId}"`,
          sort: 'created',
          $autoCancel: false
        });
        setMessages(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [rfpId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const msg = await pb.collection('rfp_communications').create({
        rfp_id: rfpId,
        message_type: 'follow_up',
        sender: pb.authStore.model.email,
        message: newMessage
      }, { $autoCancel: false });
      
      setMessages([...messages, msg]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>RFP Communications | TravelMatrix</title></Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
        <p className="text-muted-foreground mt-1">Manage all correspondence with the property.</p>
      </div>

      <Card className="flex flex-col h-[600px]">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Message History</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === pb.authStore.model.email ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" /> {msg.sender} • <Clock className="w-3 h-3 ml-1" /> {new Date(msg.created).toLocaleString()}
                </div>
                <div className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === pb.authStore.model.email ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <div className="p-4 border-t bg-muted/10">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Button type="button" variant="outline" size="icon" className="shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1"
            />
            <Button type="submit" className="shrink-0">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default RFPCommunicationPage;
