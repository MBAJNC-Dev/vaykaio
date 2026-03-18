
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowRight, Sparkles, MapPin, Calendar, Wallet, Camera,
  Users, Clock, ShieldCheck, Heart, Star, CheckCircle2,
  Globe, Plane, Search, PlayCircle, Monitor, AlertCircle,
  Compass, Zap, DollarSign
} from 'lucide-react';

// --- Data Arrays ---

const PAIN_POINTS = [
  {
    title: "Planning Stress",
    desc: "Hours of research, endless tabs, conflicting reviews",
    icon: <AlertCircle className="w-6 h-6" />
  },
  {
    title: "Timing Chaos",
    desc: "Missed reservations, late arrivals, wasted time",
    icon: <Clock className="w-6 h-6" />
  },
  {
    title: "Group Coordination",
    desc: "Everyone wants something different, no one's on the same page",
    icon: <Users className="w-6 h-6" />
  }
];

const AI_AGENTS = [
  {
    title: "Planner Agent",
    desc: "Plans and builds your perfect itinerary",
    icon: <Calendar className="w-8 h-8 text-sky-500" />
  },
  {
    title: "Monitor Agent",
    desc: "Watches weather, traffic, and timing",
    icon: <Monitor className="w-8 h-8 text-orange-500" />
  },
  {
    title: "Experience Agent",
    desc: "Finds the best restaurants, activities, hidden gems",
    icon: <Compass className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Stay Agent",
    desc: "Manages accommodations and check-ins",
    icon: <MapPin className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Memory Agent",
    desc: "Captures and organizes your trip memories",
    icon: <Camera className="w-8 h-8 text-pink-500" />
  }
];

const FEATURES = [
  {
    title: "Smart Itinerary",
    desc: "AI-built schedules that adapt in real-time",
    icon: <Calendar className="w-6 h-6" />
  },
  {
    title: "Proactive Alerts",
    desc: "Leave-now reminders, weather alerts, timing adjustments",
    icon: <AlertCircle className="w-6 h-6" />
  },
  {
    title: "Group Sync",
    desc: "Shared calendars, voting, everyone stays in the loop",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Discovery Engine",
    desc: "Context-aware restaurant and activity recommendations",
    icon: <Compass className="w-6 h-6" />
  },
  {
    title: "Memories & Photos",
    desc: "Auto-tagged, organized, ready for your scrapbook",
    icon: <Camera className="w-6 h-6" />
  },
  {
    title: "Budget Tracking",
    desc: "Real-time spending, smart suggestions, split expenses",
    icon: <DollarSign className="w-6 h-6" />
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah & Mark",
    type: "Europe Trip",
    quote: "VaykAIo saved us 20+ hours of planning. The AI suggestions were spot-on and the group coordination was seamless.",
    rating: 5
  },
  {
    name: "David L.",
    type: "Honeymoon",
    quote: "The romantic recommendation engine found hidden gems we never would have discovered. Absolutely perfect.",
    rating: 5
  },
  {
    name: "The Martinez Family",
    type: "Family Vacation",
    quote: "Getting the whole family to agree on activities used to be nightmare. Now everyone votes and we're all happy.",
    rating: 5
  }
];

const FAQS = [
  { q: "How does the multi-agent system create my itinerary?", a: "Our AI agents work together: the Planner builds your schedule, the Monitor ensures timing works, the Experience agent finds the best activities, and others handle stays and memories. It's like having a travel concierge team." },
  { q: "Can I edit the AI-generated plan?", a: "Absolutely! VaykAIo gives you a powerful starting point, but you control everything. Drag, drop, add, or remove any activity. The agents learn from your changes." },
  { q: "Is my family's data and photos secure?", a: "Yes. Enterprise-grade encryption protects everything. Your private family groups and photo albums are only visible to people you explicitly invite. We never sell your data." },
  { q: "What if things change during the trip?", a: "The Monitor Agent constantly watches for changes—flight delays, weather, traffic. It automatically alerts you and the Experience Agent suggests alternatives. Your itinerary adapts in real-time." },
  { q: "Does it work for groups?", a: "Perfect for groups! Everyone sees the shared itinerary, can vote on options, and expenses are automatically tracked and split. No more awkward math at the end." }
];

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const HomePage = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Check your email to get started!');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>VaykAIo | Your AI Vacation Operating System</title>
        <meta name="description" content="VaykAIo: Your AI Vacation Command Center. Travel smarter, relax harder. Let AI handle the logistics while you enjoy every moment." />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#1a1f36] via-[#0f4c75] to-[#1a1f36]" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Animated floating dots */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sky-400/20"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <Badge className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-100 border-sky-400/50 backdrop-blur-md px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-sky-300 mr-2" />
                Your AI Vacation Operating System
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Your AI Vacation<br className="hidden md:block" />
              <span className="bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">Command Center</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-sky-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Travel Smarter. Relax Harder. Let AI handle the logistics while you enjoy every moment.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/30" asChild>
                <Link to="/signup">Start Planning <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto bg-sky-500/10 backdrop-blur-sm text-sky-100 border-sky-400/50 hover:bg-sky-500/20" asChild>
                <a href="#solution"><PlayCircle className="mr-2 w-5 h-5" /> See How It Works</a>
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sky-200 text-sm font-medium">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-sky-500 bg-sky-400/20 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span>Join thousands of travelers</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-sky-400/50"></div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                <span className="ml-2">4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Vacation Planning Shouldn't Be<br className="hidden md:block" /> a Full-Time Job</h2>
            <p className="text-lg text-muted-foreground">Yet most travelers spend weeks coordinating, researching, and stressing. We're here to change that.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-muted/50 border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      {pain.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{pain.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI SOLUTION SECTION */}
      <section id="solution" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Your AI Travel Entourage</h2>
            <p className="text-lg text-muted-foreground">Five specialized agents working together to handle every aspect of your vacation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {AI_AGENTS.map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-background border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4">
                      {agent.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{agent.title}</h3>
                    <p className="text-sm text-muted-foreground">{agent.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Packed with Intelligent Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to plan, coordinate, and remember your best trips.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-muted/50 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Families, Adventurers, and Honeymooners</h2>
            <p className="text-lg text-muted-foreground">See what real travelers are saying about VaykAIo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-background border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                    <p className="text-base mb-6 flex-grow leading-relaxed text-muted-foreground">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.type}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-background rounded-2xl border border-border/50 p-12 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by travel partners worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60">
              <span className="text-lg font-bold">Airbnb</span>
              <span className="text-lg font-bold">Booking.com</span>
              <span className="text-lg font-bold">Skyscanner</span>
              <span className="text-lg font-bold">TripAdvisor</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Start free, upgrade when you're ready. No credit card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="bg-background border-border/50 shadow-sm flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>Perfect for solo travelers</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-2">/forever</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>1 trip</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Basic itinerary</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Up to 2 members</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Pro Plan - Popular */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-0 px-4 py-1.5">Most Popular</Badge>
              </div>
              <Card className="bg-gradient-to-br from-sky-500/10 to-orange-500/10 border-primary/50 shadow-xl flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For frequent travelers</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">$9.99</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Unlimited trips</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>AI itinerary builder</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Group sync & voting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Up to 10 members</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                    <Link to="/signup">Start Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Card className="bg-background border-border/50 shadow-sm flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription>For power users</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">$19.99</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>All 5 AI agents</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Unlimited members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>Memory timeline</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/signup">Upgrade Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about VaykAIo.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f36] via-sky-900/50 to-[#1a1f36]" />
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-sky-400"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Your Trip, Handled.</h2>
          <p className="text-xl text-sky-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who let AI run their vacations. Start planning free today.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-sky-400/50 text-white placeholder:text-sky-300 h-12"
              required
            />
            <Button size="lg" className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-lg w-full sm:w-auto">
              Get Started Free
            </Button>
          </form>

          <p className="text-sky-200 text-sm">No credit card required. Start planning immediately.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
