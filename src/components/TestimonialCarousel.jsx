
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Family Coordinator",
    content: "The AI itinerary builder saved me literally weeks of planning. It perfectly balanced activities for my toddlers and teenagers.",
    rating: 5,
    initials: "SJ",
    bg: "bg-blue-100 text-blue-700"
  },
  {
    name: "Marcus Chen",
    role: "Digital Nomad",
    content: "Using the AR preview feature let me check out co-working spaces in Bali before I even booked my flight. Absolute game-changer.",
    rating: 5,
    initials: "MC",
    bg: "bg-emerald-100 text-emerald-700"
  },
  {
    name: "Elena Rodriguez",
    role: "Adventure Traveler",
    content: "The predictive weather analytics warned us about a monsoon, allowing us to shift our itinerary seamlessly. Highly recommend!",
    rating: 5,
    initials: "ER",
    bg: "bg-purple-100 text-purple-700"
  }
];

const TestimonialCarousel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((t, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="bg-card rounded-3xl p-8 border shadow-sm relative"
        >
          <Quote className="absolute top-6 right-8 w-12 h-12 text-muted/50" />
          <div className="flex gap-1 mb-6">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-lg text-foreground leading-relaxed mb-8 relative z-10">
            "{t.content}"
          </p>
          <div className="flex items-center gap-4 mt-auto">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.bg}`}>
              {t.initials}
            </div>
            <div>
              <h4 className="font-bold text-foreground">{t.name}</h4>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialCarousel;
