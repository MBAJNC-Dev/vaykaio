
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Map, Calendar, Compass, ArrowRight, Plane, Hotel, Coffee } from 'lucide-react';

const AIVacationPlannerLandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Vacation Planner | TravelMatrix</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1698778574208-bcd9051b4d97?q=80&w=2070&auto=format&fit=crop" 
            alt="Beautiful coastal vacation destination" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium tracking-wide">Next-Generation Travel AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Plan Your Vacation <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">with AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Stop spending hours researching. Tell our AI what you love, and get a fully personalized, bookable itinerary in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl shadow-lg shadow-primary/25" asChild>
                <Link to="/ai-planner/chat">
                  Plan Your Vacation Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm" asChild>
                <Link to="/ai-planner/saved">
                  View My Trips
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smarter Planning, Better Travel</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Everything you need to craft the perfect getaway, powered by advanced artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2">
              <Card className="h-full bg-muted/50 border-none shadow-none overflow-hidden group">
                <CardContent className="p-8 md:p-12 flex flex-col h-full justify-between">
                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Conversational AI Planning</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                      Chat naturally with our AI. Tell it your budget, vibe, and dates, and watch it construct a detailed day-by-day itinerary tailored exactly to your preferences.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button variant="link" className="px-0 text-primary" asChild>
                      <Link to="/ai-planner/chat">Try the planner <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card className="h-full bg-card border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Map className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Real-Time Search</h3>
                  <p className="text-muted-foreground mb-6">
                    We scan thousands of flights, hotels, and activities instantly to find the best matches for your generated plan.
                  </p>
                  <div className="mt-auto grid grid-cols-2 gap-2 opacity-50">
                    <div className="flex items-center gap-2 text-sm"><Plane className="w-4 h-4"/> Flights</div>
                    <div className="flex items-center gap-2 text-sm"><Hotel className="w-4 h-4"/> Hotels</div>
                    <div className="flex items-center gap-2 text-sm"><Compass className="w-4 h-4"/> Tours</div>
                    <div className="flex items-center gap-2 text-sm"><Coffee className="w-4 h-4"/> Dining</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Card className="h-full bg-card border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Flexible Refinement</h3>
                  <p className="text-muted-foreground">
                    Don't like a suggestion? Ask the AI for cheaper alternatives, different times, or completely new ideas with one click.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2">
              <Card className="h-full bg-slate-950 text-white border-none overflow-hidden relative">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-50 pointer-events-none" />
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between h-full relative z-10">
                  <div className="max-w-md mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-3">Ready to explore?</h3>
                    <p className="text-slate-300">Browse popular AI-generated itineraries and get inspired for your next adventure.</p>
                  </div>
                  <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 w-full md:w-auto" asChild>
                    <Link to="/ai-planner/recommendations">Browse Destinations</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIVacationPlannerLandingPage;
