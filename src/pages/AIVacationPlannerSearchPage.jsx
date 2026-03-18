
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plane, Hotel, Map, Coffee, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { usePlanner } from '@/contexts/AIVacationPlannerContext.jsx';

const SEARCH_STEPS = [
  { id: 'flights', label: 'Searching optimal flights...', icon: Plane },
  { id: 'hotels', label: 'Finding perfect accommodations...', icon: Hotel },
  { id: 'activities', label: 'Curating local experiences...', icon: Map },
  { id: 'dining', label: 'Selecting top-rated restaurants...', icon: Coffee }
];

// Mock data generator for demonstration
const generateMockResults = (planData) => {
  return {
    flights: [
      { id: 'f1', name: 'Direct Flight - Delta', price: 450, rating: 4.5, duration: '4h 20m', time: '08:00 AM - 12:20 PM' },
      { id: 'f2', name: '1 Stop - United', price: 320, rating: 4.0, duration: '6h 45m', time: '10:30 AM - 05:15 PM' }
    ],
    accommodations: [
      { id: 'h1', name: 'Grand Plaza Resort', price: 250, rating: 4.8, type: 'Resort', amenities: ['Pool', 'Spa', 'Breakfast'] },
      { id: 'h2', name: 'City Center Boutique', price: 180, rating: 4.6, type: 'Boutique', amenities: ['WiFi', 'Gym', 'Bar'] }
    ],
    activities: [
      { id: 'a1', name: 'Guided City Tour', price: 45, rating: 4.7, duration: '3 hours', type: 'Culture' },
      { id: 'a2', name: 'Sunset Boat Cruise', price: 85, rating: 4.9, duration: '2 hours', type: 'Relaxation' }
    ],
    restaurants: [
      { id: 'r1', name: 'The Rustic Spoon', price: '$$', rating: 4.8, cuisine: 'Local Authentic' },
      { id: 'r2', name: 'Ocean View Dining', price: '$$$', rating: 4.5, cuisine: 'Seafood' }
    ]
  };
};

const AIVacationPlannerSearchPage = () => {
  const navigate = useNavigate();
  const { state, setSearchResults } = usePlanner();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate search process
    const totalDuration = 4000; // 4 seconds total
    const stepDuration = totalDuration / SEARCH_STEPS.length;
    
    let startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      setProgress(newProgress);
      
      const stepIndex = Math.min(Math.floor((elapsed / totalDuration) * SEARCH_STEPS.length), SEARCH_STEPS.length - 1);
      setCurrentStep(stepIndex);

      if (newProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        setSearchResults(generateMockResults(state.planData));
        
        // Auto navigate after a brief pause
        setTimeout(() => {
          navigate('/ai-planner/review');
        }, 1000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [navigate, setSearchResults, state.planData]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 p-4">
      <Helmet><title>Searching... | TravelMatrix</title></Helmet>

      <Card className="w-full max-w-md shadow-lg border-none">
        <CardContent className="p-8 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {isComplete ? "Plan Generated!" : "Crafting Your Itinerary"}
            </h2>
            <p className="text-muted-foreground">
              {isComplete 
                ? "We've found the best options for your trip." 
                : "Our AI is analyzing thousands of options based on your preferences."}
            </p>
          </div>

          <div className="relative pt-4">
            <Progress value={progress} className="h-2 w-full" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-background px-2 text-sm font-medium text-primary">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="space-y-4 text-left mt-8">
            {SEARCH_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep && !isComplete;
              const isDone = idx < currentStep || isComplete;
              
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isDone || isActive ? 1 : 0.4, x: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone ? 'bg-green-100 text-green-600' : 
                    isActive ? 'bg-primary/10 text-primary' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : 
                     isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
              <Button className="w-full" onClick={() => navigate('/ai-planner/review')}>
                Review Options <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVacationPlannerSearchPage;
