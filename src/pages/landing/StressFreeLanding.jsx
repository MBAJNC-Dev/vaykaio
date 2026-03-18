
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Map, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, TestimonialCard, MiniCTA, TrustBadge } from '@/components/landing/SharedUI';
import { AnimatedStepFlow, PersonaFAQAccordion } from '@/components/landing/FeatureSections';

const StressFreeLanding = () => {
  const { trackConversion } = useAnalytics();

  const steps = [
    { title: "Tell us your dream", description: "Just type where you want to go and what you like doing. No forms, just natural language." },
    { title: "AI builds the perfect plan", description: "Within seconds, get a fully optimized day-by-day itinerary that accounts for travel times and opening hours." },
    { title: "Book with one click", description: "We find the best flights and hotels that match your itinerary. Book everything securely in one place." }
  ];

  const faqs = [
    { q: "How much time does this actually save?", a: "On average, our users save 15+ hours of research and planning per trip. The AI handles the logistics so you don't have to." },
    { q: "What if I want to change the AI's plan?", a: "You have full control. Drag and drop activities, swap restaurants, or ask the AI to regenerate a specific day." },
    { q: "Is my booking data secure?", a: "Yes. We use bank-level encryption and partner with trusted providers like Stripe and Amadeus for all transactions." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Stress-Free AI Vacation Planner | VaykAIo</title>
        <meta name="description" content="Stop stressing over travel logistics. Let our AI build your perfect itinerary in seconds." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1697224118237-76d2cfdb6d34?auto=format&fit=crop&w=2400&q=80" alt="Relaxing vacation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <TrustBadge text="Voted #1 AI Travel Tool 2026" icon={<Sparkles className="w-4 h-4 text-accent" />} />
            <h1 className="text-white mt-6 mb-6 font-display">
              Stop stressing over travel logistics. <br/>
              <span className="text-accent">Start relaxing.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Planning a trip shouldn't feel like a full-time job. Let our AI instantly generate a perfect, bookable itinerary tailored to your exact preferences.
            </p>
            <div className="flex flex-wrap gap-4">
              <MiniCTA text="Plan My Trip in Seconds" onClick={() => trackConversion('hero_cta_click')} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2>Travel planning, completely automated</h2>
            <p className="text-muted-foreground mt-4 text-lg">We handle the 50 open browser tabs so you don't have to.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Clock />} title="Save 15+ Hours" description="Skip the endless research. Get a complete, optimized itinerary in under 60 seconds." delay={0.1} />
            <KeyBenefitCard icon={<Map />} title="Flawless Logistics" description="Our AI calculates travel times between spots so you're never rushing or double-booking." delay={0.2} />
            <KeyBenefitCard icon={<Calendar />} title="Everything in One Place" description="Flights, hotels, reservations, and tickets—all organized in a single, beautiful timeline." delay={0.3} />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-8">From idea to booked in 3 simple steps</h2>
              <AnimatedStepFlow steps={steps} />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border">
              <img src="https://images.unsplash.com/photo-1639060015191-9d83063eab2a?auto=format&fit=crop&w=1000&q=80" alt="Dashboard UI" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-16 text-white">Loved by busy professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="I used to dread planning our annual Europe trip. VaykAIo did in 2 minutes what usually takes me 3 weekends. It's actual magic."
              author="Sarah Jenkins" role="Marketing Director" image="https://i.pravatar.cc/150?img=44"
            />
            <TestimonialCard 
              quote="The way it automatically figures out the transit times between museums and restaurants saved us from so many arguments."
              author="Michael Chen" role="Software Engineer" image="https://i.pravatar.cc/150?img=11" delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12">Common Questions</h2>
          <PersonaFAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-muted/50 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="mb-6">Ready to take your weekends back?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join 50,000+ travelers who plan smarter, not harder.</p>
          <MiniCTA text="Start Your Free Trial" variant="default" onClick={() => trackConversion('bottom_cta_click')} />
        </div>
      </section>
    </div>
  );
};

export default StressFreeLanding;
