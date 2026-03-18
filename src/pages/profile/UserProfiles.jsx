
import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Award, Users, MessageSquare } from 'lucide-react';
import ResponsiveContainer from '@/components/ResponsiveContainer.jsx';
import ResponsiveGrid from '@/components/ResponsiveGrid.jsx';

const UserProfiles = () => {
  const { userId } = useParams();
  
  // Mock user data
  const user = {
    name: 'Maya Chen',
    handle: '@mayatravels',
    bio: 'Digital nomad & food enthusiast. Exploring the world one cafe at a time.',
    location: 'San Francisco, CA',
    joined: 'March 2023',
    stats: { trips: 14, countries: 8, followers: 1240, following: 342 },
    badges: ['Top Reviewer', 'Early Adopter', 'Globe Trotter']
  };

  return (
    <ResponsiveContainer className="py-6 md:py-12 space-y-6 md:space-y-8">
      <Helmet><title>{user.name} | Profile</title></Helmet>
      
      {/* Profile Header */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-accent/20 premium-gradient opacity-80" />
        <CardContent className="relative pt-0 px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-end -mt-16 sm:-mt-20 mb-4 md:mb-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl rounded-2xl shrink-0">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 text-center sm:text-left">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <p className="text-sm md:text-base text-muted-foreground font-medium">{user.handle}</p>
              </div>
              <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none touch-target">Follow</Button>
                <Button variant="outline" size="icon" className="touch-target shrink-0"><MessageSquare className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
          
          <p className="text-sm md:text-lg max-w-2xl mb-4 md:mb-6 text-center sm:text-left">{user.bio}</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-6 md:mb-8">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> {user.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" /> Joined {user.joined}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-8 border-y py-4">
            <div className="text-center"><span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.trips}</span><span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Trips</span></div>
            <div className="text-center"><span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.countries}</span><span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Countries</span></div>
            <div className="text-center"><span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.followers}</span><span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Followers</span></div>
            <div className="text-center"><span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.following}</span><span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Following</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="trips" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap hide-scrollbar">
          <TabsTrigger value="trips" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap touch-target">Travel History</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap touch-target">Reviews</TabsTrigger>
          <TabsTrigger value="badges" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap touch-target">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trips" className="pt-4 md:pt-6">
          <ResponsiveGrid columns={2}>
            <Card className="card-hover cursor-pointer"><CardHeader><CardTitle className="text-lg md:text-xl">Tokyo Adventure</CardTitle><CardDescription>Oct 2023 • 14 Days</CardDescription></CardHeader></Card>
            <Card className="card-hover cursor-pointer"><CardHeader><CardTitle className="text-lg md:text-xl">Iceland Roadtrip</CardTitle><CardDescription>Jul 2023 • 10 Days</CardDescription></CardHeader></Card>
          </ResponsiveGrid>
        </TabsContent>
        
        <TabsContent value="badges" className="pt-4 md:pt-6">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {user.badges.map(badge => (
              <Badge key={badge} variant="secondary" className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-1.5 md:gap-2">
                <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" /> {badge}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
};

export default UserProfiles;
