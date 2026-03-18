
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign, Download, Share2, Save, Edit3 } from 'lucide-react';
import { usePlanner } from '@/contexts/AIVacationPlannerContext.jsx';

const AIVacationPlannerFinalPlanPage = () => {
  const navigate = useNavigate();
  const { state } = usePlanner();

  // Mock data if context is empty for demo purposes
  const destination = state.planData.destination || "Tokyo, Japan";
  const dates = state.planData.dates_raw || "Oct 15 - Oct 22, 2026";
  const travelers = state.planData.travelers_raw || "2 Adults";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Your Final Plan | TravelMatrix</title></Helmet>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100 border-0">Ready to Book</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Your Trip to {destination}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>
          <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button size="sm" onClick={() => navigate('/ai-planner/saved')}><Save className="w-4 h-4 mr-2" /> Save Plan</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><MapPin className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="font-semibold text-sm truncate">{destination}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Dates</p>
              <p className="font-semibold text-sm truncate">{dates}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Travelers</p>
              <p className="font-semibold text-sm truncate">{travelers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Est. Total</p>
              <p className="font-semibold text-sm truncate">$2,450</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="info">Important Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="space-y-6">
          {[1, 2, 3].map(day => (
            <Card key={day}>
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline">Day {day}</Badge> 
                  <span className="text-muted-foreground font-normal text-sm ml-auto">Oct {14 + day}, 2026</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4 flex gap-4 hover:bg-muted/10 transition-colors">
                    <div className="w-16 text-sm font-medium text-muted-foreground shrink-0">09:00 AM</div>
                    <div>
                      <h4 className="font-medium">Breakfast at Local Cafe</h4>
                      <p className="text-sm text-muted-foreground mt-1">Recommended: Try the traditional pastries.</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 hover:bg-muted/10 transition-colors">
                    <div className="w-16 text-sm font-medium text-muted-foreground shrink-0">10:30 AM</div>
                    <div>
                      <h4 className="font-medium">City Center Walking Tour</h4>
                      <p className="text-sm text-muted-foreground mt-1">Guided tour covering main historical sites. Wear comfortable shoes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Booking summary will appear here once items are confirmed.</p>
              <Button className="mt-4">Proceed to Booking</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Detailed cost breakdown by category.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Visa requirements, weather forecasts, and packing tips.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIVacationPlannerFinalPlanPage;
