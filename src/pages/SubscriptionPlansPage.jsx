
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle2, Sparkles, Zap, Building2 } from 'lucide-react';
import PaymentFormComponent from '@/components/PaymentFormComponent.jsx';

const SubscriptionPlansPage = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for occasional travelers planning simple trips.',
      price: 0,
      icon: <CheckCircle2 className="w-6 h-6 text-slate-500" />,
      features: ['Up to 2 active trips', 'Basic itinerary builder', 'Standard expense tracking', 'Community support'],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For frequent travelers who want more organization.',
      price: annual ? 7.99 : 9.99,
      icon: <Zap className="w-6 h-6 text-primary" />,
      features: ['Unlimited trips', 'AI Itinerary Builder (50/mo)', 'Advanced budget analytics', 'Offline mode', 'Priority support'],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'The ultimate toolkit with unlimited AI and smart features.',
      price: annual ? 15.99 : 19.99,
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      features: ['Everything in Pro', 'Unlimited AI generations', 'Smart Photo Albums', 'Journal Insights', 'Export to PDF/Video'],
      buttonText: 'Get Premium',
      buttonVariant: 'default',
      popular: false,
      premium: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For travel agencies and large organizations.',
      price: 'Custom',
      icon: <Building2 className="w-6 h-6 text-slate-700" />,
      features: ['Custom branding', 'Team collaboration', 'API access', 'Dedicated account manager', 'SLA guarantee'],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false
    }
  ];

  const handleSubscribeClick = (plan) => {
    if (plan.price === 0 || plan.price === 'Custom') {
      navigate('/dashboard');
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    navigate('/settings/subscription');
  };

  return (
    <>
      <Helmet><title>Pricing & Plans - VaykAIo</title></Helmet>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
            Simple, transparent pricing for every traveler
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your travel style. Upgrade, downgrade, or cancel anytime.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <Label htmlFor="billing-toggle" className={`text-base ${!annual ? 'font-bold' : 'text-muted-foreground'}`}>Monthly</Label>
            <Switch 
              id="billing-toggle" 
              checked={annual} 
              onCheckedChange={setAnnual} 
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="billing-toggle" className={`text-base flex items-center gap-2 ${annual ? 'font-bold' : 'text-muted-foreground'}`}>
              Annually
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-0">Save 20%</Badge>
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col h-full transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary shadow-xl scale-105 z-10' : 
                plan.premium ? 'ring-1 ring-amber-500/50 shadow-lg bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20' : 
                'border-border shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-bold border-0">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-8">
                <div className="mb-4">{plan.icon}</div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="h-10">{plan.description}</CardDescription>
                <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-3xl font-medium text-muted-foreground mr-1">$</span>
                      {plan.price}
                      <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                    </>
                  ) : (
                    <span className="text-4xl">{plan.price}</span>
                  )}
                </div>
                {typeof plan.price === 'number' && plan.price > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {annual ? `Billed $${(plan.price * 12).toFixed(2)} yearly` : 'Billed monthly'}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.premium ? 'text-amber-500' : 'text-primary'}`} />
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-8 mt-auto">
                <Button 
                  onClick={() => handleSubscribeClick(plan)}
                  variant={plan.buttonVariant} 
                  className={`w-full h-12 text-base ${plan.premium ? 'premium-gradient text-primary-foreground border-0 hover:opacity-90' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>Subscribe to {selectedPlan?.name}</DialogTitle>
              <DialogDescription>
                You will be charged ${selectedPlan?.price} {annual ? 'annually' : 'monthly'}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <PaymentFormComponent 
                amount={selectedPlan?.price} 
                isSubscription={true}
                planId={selectedPlan?.id}
                frequency={annual ? 'yearly' : 'monthly'}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default SubscriptionPlansPage;
