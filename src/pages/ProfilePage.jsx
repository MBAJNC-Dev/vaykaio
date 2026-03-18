import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Award, Users, MessageSquare, Edit2, Globe, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams();

  // Mock user data
  const user = {
    id: userId || 'maya-chen',
    name: 'Maya Chen',
    handle: '@mayatravels',
    bio: 'Digital nomad & food enthusiast. Exploring the world one cafe at a time.',
    location: 'San Francisco, CA',
    joined: 'March 2023',
    memberSince: '3 years',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya-chen',
    stats: {
      trips: 14,
      countries: 8,
      photos: 2340,
      interests: ['culture', 'food', 'nature', 'hiking']
    },
    travelPreferences: {
      pace: 'Moderate',
      dietary: 'Vegetarian',
      interests: 'Culture, Food, Nature, Adventure',
    },
    recentTrips: [
      { id: 1, name: 'Tokyo Adventure', date: 'Oct 2024', days: 14 },
      { id: 2, name: 'Iceland Roadtrip', date: 'Jul 2024', days: 10 },
      { id: 3, name: 'Thailand Exploration', date: 'Mar 2024', days: 21 },
    ],
    achievements: [
      { name: 'Globe Trotter', description: 'Visited 8 countries', icon: '🌍' },
      { name: 'Photo Master', description: 'Took 2000+ photos', icon: '📸' },
      { name: 'Early Adopter', description: 'Joined VaykAIo in the first year', icon: '⭐' },
      { name: 'Group Explorer', description: 'Completed 5 group trips', icon: '👥' },
    ],
    badges: ['Top Explorer', 'Early Adopter', 'Travel Enthusiast', 'Community Helper']
  };

  const isOwnProfile = true; // In real app, check if current user matches userId

  return (
    <>
      <Helmet><title>{user.name} - VaykAIo Profile</title></Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Profile Header Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-32 md:h-40 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-10 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
              </div>
            </div>
            <CardContent className="relative pt-0 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-10">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
                <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">{user.handle}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Member since {user.memberSince}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <Button className="w-full sm:w-auto rounded-lg" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-sm md:text-base max-w-2xl mb-6 text-muted-foreground">{user.bio}</p>

              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-muted-foreground mb-6 border-b pb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" /> {user.stats.countries} Countries
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 md:gap-8">
                <div className="text-center">
                  <span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.trips}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Trips</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.countries}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Countries</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg md:text-2xl font-bold text-foreground">{user.stats.photos}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Photos</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg md:text-2xl font-bold text-foreground">{user.achievements.length}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">Badges</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Preferences */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Travel Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Pace</p>
                  <p className="font-semibold">{user.travelPreferences.pace}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Dietary</p>
                  <p className="font-semibold">{user.travelPreferences.dietary}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Interests</p>
                  <p className="font-semibold text-sm">{user.travelPreferences.interests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap mb-6">
              <TabsTrigger value="trips" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap">
                <Calendar className="w-4 h-4 mr-2" /> Recent Trips
              </TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap">
                <Award className="w-4 h-4 mr-2" /> Achievements
              </TabsTrigger>
              <TabsTrigger value="photos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 whitespace-nowrap">
                <Camera className="w-4 h-4 mr-2" /> Gallery
              </TabsTrigger>
            </TabsList>

            {/* Recent Trips */}
            <TabsContent value="trips" className="space-y-4">
              {user.recentTrips.map(trip => (
                <Card key={trip.id} className="card-hover cursor-pointer border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg md:text-xl">{trip.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> {trip.date} • {trip.days} days
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="rounded-lg">{trip.days} days</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.achievements.map((achievement, idx) => (
                  <Card key={idx} className="border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-2 mt-6">
                <h3 className="font-semibold">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map(badge => (
                    <Badge key={badge} variant="outline" className="rounded-full px-3 py-1">
                      <Award className="w-3 h-3 mr-1" /> {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Gallery Placeholder */}
            <TabsContent value="photos" className="space-y-4">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="pt-12 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Photo gallery coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
