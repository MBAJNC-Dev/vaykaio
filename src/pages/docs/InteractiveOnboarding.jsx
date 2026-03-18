
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, Circle, PlayCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import DocLayout from '@/components/docs/DocLayout.jsx';

const InteractiveOnboarding = () => {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Complete your profile', description: 'Add your photo and travel preferences.', completed: true },
    { id: 2, title: 'Create your first trip', description: 'Set up a destination and dates.', completed: false },
    { id: 3, title: 'Invite a friend', description: 'Add a collaborator to your trip.', completed: false },
    { id: 4, title: 'Generate AI Itinerary', description: 'Let our AI build a draft schedule.', completed: false },
  ]);

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleStep = (id) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  return (
    <DocLayout title="Interactive Onboarding">
      <Helmet><title>Interactive Onboarding | VaykAIo Docs</title></Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to VaykAIo!</h1>
        <p className="text-muted-foreground text-lg">
          Follow this interactive checklist to master the core features of the platform. Your progress is saved automatically.
        </p>
      </div>

      <div className="bg-muted/30 border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-semibold text-lg">Your Progress</h3>
            <p className="text-sm text-muted-foreground">{completedCount} of {steps.length} tasks completed</p>
          </div>
          <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="space-y-4 mb-10">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              step.completed ? 'bg-primary/5 border-primary/20' : 'bg-card hover:border-primary/50'
            }`}
            onClick={() => toggleStep(step.id)}
          >
            <button className="mt-0.5 shrink-0 focus:outline-none">
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1">
              <h4 className={`font-medium text-base ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
            {!step.completed && (
              <Button variant="ghost" size="sm" className="shrink-0 hidden sm:flex">
                Do this now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-accent" /> Video Walkthrough
        </h2>
        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop" 
            alt="Video thumbnail" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
          />
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
            <PlayCircle className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>
    </DocLayout>
  );
};

export default InteractiveOnboarding;
