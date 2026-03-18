
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserFollowingSystem = () => {
  const users = [
    { id: 1, name: 'Lucia Torres', handle: '@luciatravels', isFollowing: true },
    { id: 2, name: 'Raj Patel', handle: '@rajexplores', isFollowing: false },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Network | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Network</h1>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="following">Following (142)</TabsTrigger>
          <TabsTrigger value="followers">Followers (89)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="following" className="pt-6 space-y-4">
          {users.map(user => (
            <Card key={user.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar><AvatarFallback>{user.name.substring(0,2)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.handle}</p>
                  </div>
                </div>
                <Button variant={user.isFollowing ? "secondary" : "default"}>
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserFollowingSystem;
