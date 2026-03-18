
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const SocialSharing = () => {
  const shareUrl = "https://vacationplanner.com/trip/shared/xyz123";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Share Trip | Vacation Planner</title></Helmet>
      
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Share Your Itinerary</h1>
        <p className="text-muted-foreground mt-2">Let friends and family view or collaborate on your trip.</p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Share Link</CardTitle>
          <CardDescription>Anyone with this link can view your itinerary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} className="bg-muted font-mono text-sm" />
            <Button onClick={copyLink} variant="secondary"><Copy className="w-4 h-4 mr-2" /> Copy</Button>
          </div>
          
          <div className="pt-6 border-t">
            <p className="text-sm font-medium mb-4">Share via Social Media</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1"><Twitter className="w-4 h-4 mr-2 text-blue-400" /> Twitter</Button>
              <Button variant="outline" className="flex-1"><Facebook className="w-4 h-4 mr-2 text-blue-600" /> Facebook</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialSharing;
