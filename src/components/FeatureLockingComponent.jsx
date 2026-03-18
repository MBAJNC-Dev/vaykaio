
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

const FeatureLockingComponent = ({ featureName, requiredPlan, benefits = [] }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full overflow-hidden border-0 shadow-2xl ring-1 ring-primary/10">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
          
          <div className="w-16 h-16 bg-background rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 relative z-10 ring-1 ring-border">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2 relative z-10">
            {featureName} is locked
          </h2>
          <p className="text-muted-foreground mb-6 relative z-10">
            Upgrade to the <span className="font-semibold text-foreground capitalize">{requiredPlan}</span> plan to unlock this feature and take your travel planning to the next level.
          </p>

          {benefits.length > 0 && (
            <div className="text-left bg-background/50 backdrop-blur-sm rounded-xl p-4 mb-8 relative z-10 ring-1 ring-border/50">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> What you get:
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 relative z-10">
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
              <Link to="/pricing">Upgrade Now</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeatureLockingComponent;
