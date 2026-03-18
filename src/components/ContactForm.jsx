
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      e.target.reset();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-3xl border shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" required placeholder="Maya" className="input-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" required placeholder="Chen" className="input-base" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" required placeholder="maya@example.com" className="input-base" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" required placeholder="How can we help?" className="input-base" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          required 
          placeholder="Tell us more about your inquiry..." 
          className="min-h-[150px] rounded-xl border-input bg-background px-4 py-3 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      
      <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl" disabled={loading}>
        {loading ? "Sending..." : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
      </Button>
    </form>
  );
};

export default ContactForm;
