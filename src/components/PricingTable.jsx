
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for solo travelers planning their next weekend getaway.",
    features: [
      "Basic AI Itinerary Generation",
      "Up to 2 trips per month",
      "Standard Email Support",
      "Community Access"
    ],
    missing: [
      "AR/VR Destination Previews",
      "Web3 Identity & Booking",
      "Predictive Price Analytics"
    ],
    cta: "Get Started",
    link: "/signup",
    popular: false
  },
  {
    name: "Voyager Pro",
    price: "$19",
    period: "/month",
    description: "Advanced tools for frequent flyers and family coordinators.",
    features: [
      "Unlimited AI Itineraries",
      "AR/VR Destination Previews",
      "Predictive Price Analytics",
      "Priority 24/7 Support",
      "Group Collaboration Tools"
    ],
    missing: [
      "Web3 Identity & Booking"
    ],
    cta: "Start Free Trial",
    link: "/signup?plan=pro",
    popular: true
  },
  {
    name: "Nomad Enterprise",
    price: "$49",
    period: "/month",
    description: "The ultimate suite with blockchain security and IoT integrations.",
    features: [
      "Everything in Voyager Pro",
      "Web3 Identity & Booking",
      "Real-Time IoT Sync",
      "Dedicated Travel Concierge",
      "Custom API Access"
    ],
    missing: [],
    cta: "Contact Sales",
    link: "/contact",
    popular: false
  }
];

const PricingTable = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className={`relative flex flex-col bg-card rounded-3xl border p-8 ${
            plan.popular ? 'shadow-2xl ring-2 ring-primary scale-105 z-10' : 'shadow-sm'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
              Most Popular
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-muted-foreground min-h-[48px]">{plan.description}</p>
          </div>
          
          <div className="mb-8 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
            {plan.missing.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            asChild 
            size="lg" 
            variant={plan.popular ? "default" : "outline"}
            className="w-full h-14 text-lg rounded-xl"
          >
            <Link to={plan.link}>{plan.cta}</Link>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingTable;
