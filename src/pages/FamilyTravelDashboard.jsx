
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, DollarSign, Settings, ArrowLeft, Baby, Heart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import FamilyMemberProfiles from '@/components/FamilyMemberProfiles.jsx';

const FamilyTravelDashboard = () => {
  const navigate = useNavigate();
  const [familyPlan, setFamilyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyPlan();
  }, []);

  const fetchFamilyPlan = async () => {
    try {
      const records = await pb.collection('FamilyTravelPlans').getList(1, 1, {
        filter: `user_id = "${pb.authStore.model?.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      
      if (records.items.length > 0) {
        setFamilyPlan(records.items[0]);
      } else {
        // Mock data if none exists
        setFamilyPlan({
          id: 'mock-family-1',
          family_name: 'The Smiths',
          trip_destination: 'Orlando, Florida',
          check_in_date: '2026-12-20',
          check_out_date: '2026-12-27',
          family_size: 4,
          budget: 5000,
          status: 'planning'
        });
      }
    } catch (error) {
      console.error("Error fetching family plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  if (!familyPlan) {
    return <div className="p-8 text-center">No family plan found. Please create one first.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>{familyPlan.family_name} Vacation | Dashboard</title></Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" className="-ml-3 mb-2 text-muted-foreground" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{familyPlan.family_name} Vacation</h1>
            <Badge variant="secondary" className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">{familyPlan.status}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {familyPlan.trip_destination}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(familyPlan.check_in_date).toLocaleDateString()} - {new Date(familyPlan.check_out_date).toLocaleDateString()}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
          <Button onClick={() => navigate('/ai-planner/chat')}>Ask AI Assistant</Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1">
          <TabsTrigger value="overview" className="py-2.5">Overview</TabsTrigger>
          <TabsTrigger value="profiles" className="py-2.5">Family Profiles</TabsTrigger>
          <TabsTrigger value="itinerary" className="py-2.5">Kid-Friendly Itinerary</TabsTrigger>
          <TabsTrigger value="packing" className="py-2.5">Packing Lists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
                <p className="text-muted-foreground mb-6">Manage your family's needs, track budgets, and ensure everyone has a great time with AI-curated activities.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="text-sm text-blue-800 dark:text-blue-400 mb-1">Family Size</div>
                    <div className="text-xl font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-300"><Users className="w-5 h-5" /> {familyPlan.family_size} Members</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/30">
                    <div className="text-sm text-green-800 dark:text-green-400 mb-1">Total Budget</div>
                    <div className="text-xl font-semibold flex items-center gap-2 text-green-900 dark:text-green-300"><DollarSign className="w-5 h-5" /> ${familyPlan.budget?.toLocaleString() || '0'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                    <Baby className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium block">Childcare Options</span>
                      <span className="text-muted-foreground">Found 3 highly-rated babysitting services near your hotel.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                    <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium block">Allergy-Friendly Dining</span>
                      <span className="text-muted-foreground">Added 5 peanut-free restaurants to your map.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profiles">
          <FamilyMemberProfiles familyPlanId={familyPlan.id} />
        </TabsContent>

        <TabsContent value="itinerary">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p>Your family itinerary will appear here. The AI will automatically schedule downtime and nap times based on your family profiles.</p>
              <Button className="mt-4" onClick={() => navigate('/ai-planner/chat')}>Generate Itinerary</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packing">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p>Smart packing lists generated based on destination weather and family member ages.</p>
              <Button className="mt-4" variant="outline">Create Packing List</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyTravelDashboard;
