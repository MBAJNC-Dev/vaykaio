
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check, X, Zap, Star, ChevronDown
} from 'lucide-react';
import * as SiteContentService from '@/services/SiteContentService.js';

// Default plans fallback
const DEFAULT_PLANS = [
  {
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    display_name: 'Free',
    is_popular: false,
    features: ['1 active trip', 'Basic itinerary builder', 'Up to 2 trip members', 'Packing checklist', 'Basic notifications'],
  },
  {
    name: 'Pro',
    price_monthly: 9.99,
    price_annual: 95.90,
    display_name: 'Pro',
    is_popular: true,
    features: ['Unlimited trips', 'AI itinerary builder', 'Up to 10 trip members', 'Group sync & voting', 'Smart notifications', 'Discovery engine', 'Budget tracking & splitting'],
  },
  {
    name: 'Premium',
    price_monthly: 19.99,
    price_annual: 191.90,
    display_name: 'Premium',
    is_popular: false,
    features: ['Everything in Pro', 'All 8 AI agents', 'Unlimited trip members', 'Memory timeline & recaps', 'AI photo tagging', 'Smart budget optimization', 'Priority support'],
  },
];

// Default FAQs fallback
const DEFAULT_FAQS = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When you upgrade, the change takes effect immediately and you are prorated for the difference. When you downgrade, the change takes effect at the end of your current billing cycle.',
    category: 'pricing',
  },
  {
    question: 'What are AI agents?',
    answer: 'AI agents are specialized assistants that work behind the scenes to manage different aspects of your trip. The Planner Agent builds itineraries, the Monitor Agent watches weather and timing, and more. Together they create the feeling that a full travel team is handling your vacation.',
    category: 'pricing',
  },
  {
    question: 'Is there a free trial for Pro or Premium?',
    answer: 'Yes, both Pro and Premium come with a 14-day free trial. No credit card required to start. You can explore all the features and decide which plan works best for you.',
    category: 'pricing',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay. All payments are processed securely.',
    category: 'pricing',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Absolutely. You can cancel anytime from your account settings. Your plan will remain active until the end of your current billing period, so you never lose access mid-trip.',
    category: 'pricing',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Annual plans save you 20% compared to monthly billing. Pro is $95.90/year and Premium is $191.90/year.',
    category: 'pricing',
  },
];

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // Load subscription plans
        const planData = await SiteContentService.getSubscriptionPlans();
        if (planData && planData.length > 0) {
          setPlans(planData);
        }

        // Load FAQs for pricing category
        const faqData = await SiteContentService.getFaqs('pricing');
        if (faqData && faqData.length > 0) {
          setFaqs(faqData);
        }
      } catch (error) {
        console.error('Error loading pricing content:', error);
        // Content remains at defaults
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const getPrice = (plan) => {
    if (plan.name === 'Free') return '$0';
    if (annual) {
      const monthlyPrice = plan.price_monthly || 0;
      const annualPrice = monthlyPrice * 12 * 0.8;
      return `$${(annualPrice / 12).toFixed(2)}`;
    }
    return `$${plan.price_monthly || 0}`;
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse mb-2" />
        <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-12 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
        </div>
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50/50">
      <Helmet>
        <title>Pricing | VaykAIo</title>
        <meta name="description" content="Simple, transparent pricing for every traveler. Start free, upgrade when ready." />
      </Helmet>

      {/* Hero */}
      <section className="pt-20 pb-12 text-center px-4">
        <Badge className="mb-4 bg-sky-100 text-sky-700 border-0">
          <Zap className="w-3 h-3 mr-1" /> Simple Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-sky-600 bg-clip-text text-transparent">
          Plans for Every Traveler
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Start free. Upgrade when you need more power. No hidden fees, no surprises.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-muted/50 rounded-full p-1 mb-12">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !annual ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              annual ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
            }`}
          >
            Annual
            <Badge className="ml-2 bg-green-100 text-green-700 border-0 text-xs">Save 20%</Badge>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-2 transition-all hover:shadow-lg ${
                  plan.is_popular
                    ? 'border-sky-500 shadow-lg scale-[1.02]'
                    : 'border-border hover:border-sky-200'
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-sky-500 to-sky-600 text-white border-0 px-4">
                      <Star className="w-3 h-3 mr-1" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4 pt-8">
                  <CardTitle className="text-xl">{plan.display_name || plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{getPrice(plan)}</span>
                    <span className="text-muted-foreground">
                      {plan.name === 'Free' ? '' : annual ? '/mo (billed yearly)' : '/month'}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.name === 'Free'
                      ? 'Perfect for trying out VaykAIo on your next trip.'
                      : plan.name === 'Pro'
                      ? 'For frequent travelers who want AI-powered planning.'
                      : 'The complete AI vacation operating system.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/signup">
                    <Button
                      className={`w-full mb-6 ${
                        plan.is_popular
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white'
                          : plan.name === 'Premium'
                          ? 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white'
                          : ''
                      }`}
                      variant={plan.is_popular || plan.name === 'Premium' ? 'default' : 'outline'}
                    >
                      {plan.name === 'Free'
                        ? 'Get Started Free'
                        : 'Start Free Trial'}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {(plan.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Feature</th>
                <th className="text-center py-3 px-4 font-medium">Free</th>
                <th className="text-center py-3 px-4 font-medium text-sky-600">Pro</th>
                <th className="text-center py-3 px-4 font-medium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Active trips', '1', 'Unlimited', 'Unlimited'],
                ['Trip members', '2', '10', 'Unlimited'],
                ['AI itinerary generation', false, true, true],
                ['Group sync & voting', false, true, true],
                ['Discovery engine', false, true, true],
                ['Budget tracking', 'Basic', 'Full', 'Full + AI'],
                ['Smart notifications', 'Basic', 'Smart', 'Proactive'],
                ['AI agents', false, 'Basic', 'All 8 agents'],
                ['Memory timeline', false, false, true],
                ['Priority support', false, false, true],
              ].map(([feature, free, pro, premium], i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 px-4">{feature}</td>
                  {[free, pro, premium].map((val, j) => (
                    <td key={j} className="text-center py-3 px-4">
                      {val === true ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : val === false ? (
                        <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden">
                  <div className="w-full flex items-center justify-between p-4">
                    <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-muted-foreground text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-sky-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Let AI Handle Your Vacation?</h2>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
          Join thousands of travelers who plan less and enjoy more.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              Start Free Today
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
