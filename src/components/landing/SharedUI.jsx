
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const KeyBenefitCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ delay, duration: 0.5 }}
    className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

export const TestimonialCard = ({ quote, author, role, image, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    whileInView={{ opacity: 1, scale: 1 }} 
    viewport={{ once: true }} 
    transition={{ delay, duration: 0.5 }}
  >
    <Card className="h-full border-0 shadow-lg bg-background">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
        </div>
        <blockquote className="text-lg font-medium leading-relaxed mb-8 flex-1">
          "{quote}"
        </blockquote>
        <div className="flex items-center gap-4 mt-auto">
          <img src={image} alt={author} className="w-12 h-12 rounded-full object-cover border-2 border-muted" />
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const MiniCTA = ({ text = "Start Planning Free", to = "/signup", variant = "default", onClick }) => (
  <Button variant={variant} className="rounded-full font-medium" asChild onClick={onClick}>
    <Link to={to}>{text} <ArrowRight className="ml-2 w-4 h-4" /></Link>
  </Button>
);

export const TrustBadge = ({ text = "Bank-level Security", icon = <ShieldCheck className="w-4 h-4" /> }) => (
  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 w-fit">
    {icon}
    <span>{text}</span>
  </div>
);

export const CategoryCard = ({ image, title, count, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ delay }}
    className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
  >
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h4 className="text-xl font-bold mb-1">{title}</h4>
      {count && <p className="text-white/80 text-sm">{count}</p>}
    </div>
  </motion.div>
);
