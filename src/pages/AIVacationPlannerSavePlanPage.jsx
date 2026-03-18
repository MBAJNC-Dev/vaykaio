
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, MoreVertical, Trash2, Share, ExternalLink, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AIVacationPlannerService } from '@/services/AIVacationPlannerService.js';
import { usePlanner } from '@/contexts/AIVacationPlannerContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AIVacationPlannerSavePlanPage = () => {
  const navigate = useNavigate();
  const { state } = usePlanner();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    if (!pb.authStore.isValid) {
      setLoading(false);
      return;
    }
    try {
      const data = await AIVacationPlannerService.listPlans(pb.authStore.model.id);
      setPlans(data);
    } catch (error) {
      toast.error('Failed to load saved plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrentPlan = async (e) => {
    e.preventDefault();
    if (!planName.trim()) return;
    
    setIsSaving(true);
    try {
      const newPlan = await AIVacationPlannerService.createPlan({
        plan_name: planName,
        destination: state.planData.destination || 'Unknown Destination',
        start_date: new Date().toISOString(), // Mock dates for demo
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        travelers_count: 2,
        budget: 2000
      });
      
      toast.success('Plan saved successfully!');
      setPlanName('');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to save plan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await AIVacationPlannerService.deletePlan(id);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Saved Plans | TravelMatrix</title></Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Vacation Plans</h1>
        <p className="text-muted-foreground mt-1">Manage your AI-generated itineraries and saved trips.</p>
      </div>

      {/* Save Current Plan Section (Only show if there's active context data) */}
      {state.planData.destination && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Save Current Draft</CardTitle>
            <CardDescription>You have an unsaved plan for {state.planData.destination}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveCurrentPlan} className="flex gap-4 max-w-md">
              <div className="flex-1 space-y-2">
                <Label htmlFor="planName" className="sr-only">Plan Name</Label>
                <Input 
                  id="planName" 
                  placeholder="e.g., Summer in Tokyo 2026" 
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Saved Plans Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Saved Itineraries</h2>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : plans.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved plans yet</h3>
              <p className="text-muted-foreground mb-6">Start chatting with our AI to build your first dream vacation.</p>
              <Button onClick={() => navigate('/ai-planner/chat')}>Create New Plan</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card key={plan.id} className="group hover:shadow-md transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1" title={plan.plan_name}>{plan.plan_name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/ai-planner/final-plan?id=${plan.id}`)}>
                          <ExternalLink className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(plan.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {plan.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">{plan.status}</Badge>
                    <Badge variant="outline">{plan.travelers_count} Travelers</Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="secondary" className="w-full" onClick={() => navigate(`/ai-planner/final-plan?id=${plan.id}`)}>
                    Open Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVacationPlannerSavePlanPage;
