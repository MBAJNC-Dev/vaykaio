
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';

const UserCommunity = () => {
  const posts = [
    { id: 1, user: 'Alex Johnson', avatar: 'AJ', time: '2h ago', content: 'Just finished the hike up Mount Batur in Bali. The sunrise was absolutely unreal! Highly recommend adding this to your itinerary if you visit.', likes: 124, comments: 18 },
    { id: 2, user: 'Sarah Williams', avatar: 'SW', time: '5h ago', content: 'Does anyone have recommendations for hidden gem restaurants in Rome? Trying to avoid the tourist traps near the Colosseum.', likes: 45, comments: 32 }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Community | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Traveler Community</h1>
        <p className="text-muted-foreground mt-2">Share experiences, ask questions, and connect with fellow explorers.</p>
      </div>

      {/* Create Post */}
      <Card className="shadow-md border-0">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar><AvatarFallback>ME</AvatarFallback></Avatar>
            <div className="flex-1 space-y-4">
              <Input placeholder="Share your travel moments or ask a question..." className="border-0 bg-muted/50 focus-visible:ring-1" />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-muted-foreground"><ImageIcon className="w-4 h-4 mr-2" /> Add Photo</Button>
                <Button>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="shadow-sm border-0">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar><AvatarFallback>{post.avatar}</AvatarFallback></Avatar>
              <div>
                <CardTitle className="text-base">{post.user}</CardTitle>
                <p className="text-xs text-muted-foreground">{post.time}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{post.content}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex gap-6 text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium"><Heart className="w-4 h-4" /> {post.likes}</button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium"><MessageCircle className="w-4 h-4" /> {post.comments}</button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium ml-auto"><Share2 className="w-4 h-4" /> Share</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserCommunity;
