import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  AlertTriangle,
  Users,
  Clock,
  Eye,
  Compass,
  Home,
  MessageSquare,
  Zap,
  Shield,
  Camera,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import * as SiteContentService from '@/services/SiteContentService.js';

const AI_AGENTS = [
  {
    title: 'Planner Agent',
    desc: 'Builds your perfect itinerary',
    icon: Calendar,
    color: 'sky',
  },
  {
    title: 'Monitor Agent',
    desc: 'Watches weather, traffic & timing',
    icon: Eye,
    color: 'amber',
  },
  {
    title: 'Experience Agent',
    desc: 'Finds restaurants & hidden gems',
    icon: Compass,
    color: 'emerald',
  },
  {
    title: 'Stay Agent',
    desc: 'Manages your accommodations',
    icon: Home,
    color: 'purple',
  },
  {
    title: 'Communication Agent',
    desc: 'Keeps your group in sync',
    icon: MessageSquare,
    color: 'pink',
  },
  {
    title: 'Optimization Agent',
    desc: 'Optimizes schedule & budget',
    icon: Zap,
    color: 'orange',
  },
  {
    title: 'Recovery Agent',
    desc: 'Handles disruptions & rebooking',
    icon: Shield,
    color: 'red',
  },
  {
    title: 'Memory Agent',
    desc: 'Captures & organizes memories',
    icon: Camera,
    color: 'teal',
  },
];

// Default pain points fallback
const DEFAULT_PAIN_POINTS = [
  {
    title: 'Hours of Research',
    desc: 'Endless tabs, conflicting reviews, decision paralysis',
    icon: Clock,
  },
  {
    title: 'Timing Chaos',
    desc: 'Missed reservations, late arrivals, wasted vacation time',
    icon: AlertTriangle,
  },
  {
    title: 'Group Coordination',
    desc: 'Everyone wants something different, nobody\'s on the same page',
    icon: Users,
  },
];

// Default features fallback
const DEFAULT_FEATURES = [
  {
    title: 'Smart Itinerary',
    desc: 'AI-built schedules that adapt in real-time',
    icon: Calendar,
  },
  {
    title: 'Proactive Alerts',
    desc: 'Leave-now reminders, weather alerts, timing adjustments',
    icon: AlertTriangle,
  },
  {
    title: 'Group Sync',
    desc: 'Shared calendars, voting, everyone stays coordinated',
    icon: Users,
  },
  {
    title: 'Discovery Engine',
    desc: 'Context-aware restaurant and activity recommendations',
    icon: Compass,
  },
  {
    title: 'Photo & Memories',
    desc: 'Auto-tagged, organized, ready to relive',
    icon: Camera,
  },
  {
    title: 'Budget Tracking',
    desc: 'Real-time spending, split expenses, smart suggestions',
    icon: Zap,
  },
];

// Default testimonials fallback
const DEFAULT_TESTIMONIALS = [
  {
    name: 'Sarah M.',
    trip_context: 'Family Trip to Hawaii',
    quote:
      'VaykAIo handled everything for 6 people. We spent more time enjoying and less time stressing. Absolutely life-changing.',
    rating: 5,
  },
  {
    name: 'James & Priya K.',
    trip_context: 'Honeymoon in Italy',
    quote:
      'The restaurant recommendations were perfect. Every meal was memorable. This made our honeymoon stress-free and romantic.',
    rating: 5,
  },
  {
    name: 'Alex T.',
    trip_context: 'Solo Adventure in Japan',
    quote:
      'Real-time rescheduling saved my trip when my flight was delayed. The AI had a perfect backup plan ready instantly.',
    rating: 5,
  },
];

// Default plans fallback
const DEFAULT_PLANS = [
  {
    name: 'Free',
    price_monthly: 0,
    price_annual: 0,
    display_name: 'Free',
    is_popular: false,
    features: {
      trips: '1',
      members: 'Up to 2',
      features: ['Basic itinerary builder', 'Basic features'],
    },
  },
  {
    name: 'Pro',
    price_monthly: 9.99,
    price_annual: 95.90,
    display_name: 'Pro',
    is_popular: true,
    features: {
      trips: 'Unlimited',
      members: 'Up to 10',
      features: ['AI itinerary builder', 'Group sync & voting'],
    },
  },
  {
    name: 'Premium',
    price_monthly: 19.99,
    price_annual: 191.90,
    display_name: 'Premium',
    is_popular: false,
    features: {
      trips: 'Unlimited',
      members: 'Unlimited',
      features: ['Everything in Pro', 'All 8 AI agents', 'Priority support'],
    },
  },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [visibleCards, setVisibleCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState({
    headline: 'Your AI Vacation Command Center',
    subheadline: 'Plan less. Experience more. VaykAIo\'s AI agents handle the logistics while you enjoy every moment of your trip.',
  });
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [faqs, setFaqs] = useState([]);
  const [painPoints, setPainPoints] = useState(DEFAULT_PAIN_POINTS);
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCards((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // Load hero content
        const hero = await SiteContentService.getSiteContent('hero');
        if (hero && Object.keys(hero).length > 0) {
          setHeroContent({
            headline: hero.headline || heroContent.headline,
            subheadline: hero.subheadline || heroContent.subheadline,
          });
        }

        // Load testimonials
        const testData = await SiteContentService.getTestimonials();
        if (testData && testData.length > 0) {
          setTestimonials(testData);
        }

        // Load subscription plans
        const planData = await SiteContentService.getSubscriptionPlans();
        if (planData && planData.length > 0) {
          setPlans(planData);
        }

        // Load FAQs
        const faqData = await SiteContentService.getFaqs();
        if (faqData && faqData.length > 0) {
          setFaqs(faqData);
        }

        // Load problem section content
        const problemData = await SiteContentService.getSiteContent('problem');
        if (problemData && Object.keys(problemData).length > 0) {
          // Map database content to pain points structure
          const points = [];
          Object.entries(problemData).forEach(([key, value]) => {
            if (key.includes('title')) {
              const index = key.match(/\d+/)?.[0] || 0;
              if (!points[index]) points[index] = { icon: DEFAULT_PAIN_POINTS[index]?.icon || Clock };
              points[index].title = value;
            } else if (key.includes('desc')) {
              const index = key.match(/\d+/)?.[0] || 0;
              if (!points[index]) points[index] = { icon: DEFAULT_PAIN_POINTS[index]?.icon || Clock };
              points[index].desc = value;
            }
          });
          if (points.length > 0) {
            setPainPoints(points.filter(Boolean));
          }
        }

        // Load solution section content
        const solutionData = await SiteContentService.getSiteContent('solution');
        if (solutionData && Object.keys(solutionData).length > 0) {
          // Map database content to features structure
          const feats = [];
          Object.entries(solutionData).forEach(([key, value]) => {
            if (key.includes('title')) {
              const index = key.match(/\d+/)?.[0] || 0;
              if (!feats[index]) feats[index] = { icon: DEFAULT_FEATURES[index]?.icon || Zap };
              feats[index].title = value;
            } else if (key.includes('desc')) {
              const index = key.match(/\d+/)?.[0] || 0;
              if (!feats[index]) feats[index] = { icon: DEFAULT_FEATURES[index]?.icon || Zap };
              feats[index].desc = value;
            }
          });
          if (feats.length > 0) {
            setFeatures(feats.filter(Boolean));
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        // Content remains at defaults
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    setEmail('');
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 mb-6 animate-pulse" />
        <div className="h-6 bg-slate-200 rounded mb-3 w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>VaykAIo - Your AI Vacation Operating System</title>
        <meta
          name="description"
          content="Plan less. Experience more. VaykAIo's AI agents handle the logistics while you enjoy every moment of your trip."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes floatOrb1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -30px);
          }
        }

        @keyframes floatOrb2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-40px, 40px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(14, 165, 233, 0.6);
          }
        }

        .hero-gradient {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }

        .fade-in-on-scroll {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          border-color: #0ea5e9;
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1);
        }

        .feature-card {
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: #0ea5e9;
        }

        .agent-card {
          transition: all 0.3s ease;
        }

        .agent-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2);
        }

        .gradient-text {
          background: linear-gradient(135deg, #0ea5e9 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-button {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          transition: all 0.3s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.4);
        }
      `}
      </style>

      {/* Hero Section */}
      <section className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div
            className="absolute top-20 right-20 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl"
            style={{
              animation: 'floatOrb1 6s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"
            style={{
              animation: 'floatOrb2 8s ease-in-out infinite',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2">
              <Badge className="bg-sky-500/20 text-sky-100 border-sky-400/50 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Your AI Vacation Operating System
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
              {heroContent.headline}
              <br className="hidden md:block" />
              <span className="gradient-text">Command Center</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-sky-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              {heroContent.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                className="hero-button rounded-full h-14 px-8 text-lg w-full sm:w-auto text-white border-0 shadow-lg"
                asChild
              >
                <Link to="/signup">
                  Start Planning Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-lg w-full sm:w-auto bg-sky-500/10 backdrop-blur-sm text-sky-100 border-sky-400/50 hover:bg-sky-500/20"
                asChild
              >
                <a href="#agents">See How It Works ↓</a>
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="text-sky-200 text-sm font-medium">
              <p>No credit card required • Free forever plan • 2,000+ trips planned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 bg-slate-900/50 border-b border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
            Trusted by travelers from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <span className="text-slate-300 font-semibold">Google</span>
            <span className="text-slate-300 font-semibold">Apple</span>
            <span className="text-slate-300 font-semibold">Meta</span>
            <span className="text-slate-300 font-semibold">Amazon</span>
            <span className="text-slate-300 font-semibold">Netflix</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Vacation Planning Shouldn\'t Feel Like a Second Job
            </h2>
            <p className="text-lg text-slate-600">
              Yet most travelers spend weeks researching, coordinating, and stressing. We\'re here to change that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              painPoints.map((pain, i) => {
                const Icon = pain.icon;
                return (
                  <div
                    key={i}
                    data-animate
                    id={`pain-${i}`}
                    className={`fade-in-on-scroll card-hover ${
                      visibleCards[`pain-${i}`] ? '' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <Card className="h-full bg-slate-50 border-slate-200 hover:border-sky-400">
                      <CardContent className="p-8">
                        <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-6">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{pain.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{pain.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="agents" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Meet Your AI Travel Team
            </h2>
            <p className="text-lg text-slate-600">
              8 specialized AI agents work behind the scenes so you don\'t have to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_AGENTS.map((agent, i) => {
              const Icon = agent.icon;
              const colorMap = {
                sky: 'bg-sky-100 text-sky-600',
                amber: 'bg-amber-100 text-amber-600',
                emerald: 'bg-emerald-100 text-emerald-600',
                purple: 'bg-purple-100 text-purple-600',
                pink: 'bg-pink-100 text-pink-600',
                orange: 'bg-orange-100 text-orange-600',
                red: 'bg-red-100 text-red-600',
                teal: 'bg-teal-100 text-teal-600',
              };

              return (
                <div
                  key={i}
                  data-animate
                  id={`agent-${i}`}
                  className={`fade-in-on-scroll agent-card ${
                    visibleCards[`agent-${i}`] ? '' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <Card className="h-full bg-white border-slate-200 hover:border-sky-400">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                          colorMap[agent.color]
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        {agent.title}
                      </h3>
                      <p className="text-sm text-slate-600">{agent.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Everything You Need, Nothing You Don\'t
            </h2>
            <p className="text-lg text-slate-600">
              Powerful features designed for modern travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    data-animate
                    id={`feature-${i}`}
                    className={`fade-in-on-scroll feature-card ${
                      visibleCards[`feature-${i}`] ? '' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <Card className="h-full bg-slate-50 border-slate-200 hover:border-sky-400">
                      <CardContent className="p-8">
                        <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-6">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600">{feature.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Loved by Travelers Everywhere
            </h2>
            <p className="text-lg text-slate-600">
              See what real travelers are saying about VaykAIo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  data-animate
                  id={`testimonial-${i}`}
                  className={`fade-in-on-scroll card-hover ${
                    visibleCards[`testimonial-${i}`] ? '' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <Card className="h-full bg-white border-slate-200 hover:border-sky-400">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, j) => (
                          <Star
                            key={j}
                            className="w-5 h-5 fill-orange-400 text-orange-400"
                          />
                        ))}
                      </div>
                      <p className="text-base mb-6 flex-grow leading-relaxed text-slate-600">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-bold text-slate-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500">{testimonial.trip_context}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Start free, upgrade when you\'re ready. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              plans.map((plan, idx) => (
                <div key={idx} className={plan.is_popular ? 'relative md:scale-105' : ''}>
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white border-0 px-4 py-1.5 font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={
                      plan.is_popular
                        ? 'bg-gradient-to-br from-sky-50 to-orange-50 border-sky-400 border-2 h-full'
                        : 'bg-slate-50 border-slate-200 h-full'
                    }
                  >
                    <CardHeader className="pb-4">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {plan.display_name || plan.name}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {plan.name === 'Free'
                          ? '1 trip included'
                          : plan.name === 'Pro'
                          ? 'For frequent travelers'
                          : 'For power users'}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <span className="text-5xl font-bold text-slate-900">
                          ${plan.price_monthly || plan.price_annual || 0}
                        </span>
                        <span className="text-slate-600 ml-2">
                          {plan.name === 'Free' ? '/forever' : '/month'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                          <span className="text-slate-700">
                            {plan.name === 'Free' ? '1 trip' : 'Unlimited trips'}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                          <span className="text-slate-700">
                            {plan.name === 'Free'
                              ? 'Basic features'
                              : 'Advanced features'}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                          <span className="text-slate-700">
                            {plan.name === 'Free'
                              ? 'Up to 2 members'
                              : plan.name === 'Pro'
                              ? 'Up to 10 members'
                              : 'Unlimited members'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={plan.is_popular ? 'default' : 'outline'}
                        className={
                          plan.is_popular
                            ? 'w-full bg-orange-500 hover:bg-orange-600 text-white'
                            : 'w-full'
                        }
                        asChild
                      >
                        <Link to="/signup">
                          {plan.name === 'Free'
                            ? 'Get Started'
                            : 'Start Free Trial'}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient relative py-24 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div
            className="absolute top-10 right-1/4 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl"
            style={{
              animation: 'floatOrb1 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-10 left-1/3 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl"
            style={{
              animation: 'floatOrb2 10s ease-in-out infinite',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Your Trip, Handled.
          </h2>
          <p className="text-xl text-sky-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who plan less and experience more. Start planning free today.
          </p>

          <form
            onSubmit={handleGetStarted}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-sky-400/50 text-white placeholder:text-sky-300 h-12"
              required
            />
            <Button
              size="lg"
              className="hero-button h-12 px-8 text-white border-0 rounded-lg w-full sm:w-auto"
            >
              Get Started Free
            </Button>
          </form>

          <p className="text-sky-200 text-sm">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </section>
    </>
  );
}
