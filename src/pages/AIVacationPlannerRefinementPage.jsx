
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, TrendingDown, Info, RefreshCw, MessageSquare, DollarSign, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const REFINE_OPTIONS = [
  { id: 'cheaper', title: 'Find Cheaper Alternatives', icon: TrendingDown, desc: 'Lower the cost of selected items' },
  { id: 'details', title: 'Request More Details', icon: Info, desc: 'Get reviews, photos, or specific info' },
  { id: 'swap', title: 'Swap Items', icon: RefreshCw, desc: 'Replace an item with something different' },
  { id: 'budget', title: 'Adjust Total Budget', icon: DollarSign, desc: 'Recalculate plan based on new budget' },
  { id: 'add', title: 'Add More Activities', icon: PlusCircle, desc: 'Find more things to do' },
  { id: 'custom', title: 'Custom Request', icon: MessageSquare, desc: 'Tell AI exactly what you want to change' }
];

const AIVacationPlannerRefinementPage = () => {
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState(null);
  const [customRequest, setCustomRequest] = useState('');

  const handleRefine = () => {
    toast.success('AI is updating your plan based on your request...');
    setTimeout(() => {
      navigate('/ai-planner/review');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Refine Plan | TravelMatrix</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refine Your Plan</h1>
          <p className="text-muted-foreground mt-1">Tell the AI how you'd like to adjust the current suggestions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REFINE_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isActive = activeOption === opt.id;
          return (
            <Card 
              key={opt.id} 
              className={`cursor-pointer transition-all hover:border-primary/50 ${isActive ? 'border-primary ring-1 ring-primary shadow-md' : ''}`}
              onClick={() => setActiveOption(opt.id)}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{opt.title}</h3>
                  <p className="text-sm text-muted-foreground">{opt.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeOption && (
        <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="text-lg">
              {REFINE_OPTIONS.find(o => o.id === activeOption)?.title}
            </CardTitle>
            <CardDescription>Provide details for your refinement request.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeOption === 'custom' ? (
              <Input 
                placeholder="e.g., 'Make the hotel closer to the beach' or 'Find vegetarian restaurants'" 
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
              />
            ) : (
              <div className="p-4 bg-background rounded-md border text-sm text-muted-foreground">
                Select items from your plan to apply this refinement to, or apply globally.
                {/* Placeholder for actual selection UI */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">Apply to Flights</Button>
                  <Button variant="outline" size="sm">Apply to Hotels</Button>
                  <Button variant="outline" size="sm">Apply Globally</Button>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button onClick={handleRefine}>Update Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIVacationPlannerRefinementPage;
