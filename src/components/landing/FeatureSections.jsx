
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export const FeatureHighlightGrid = ({ features }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {features.map((feature, idx) => (
      <Card key={idx} className={`bg-card border-border/50 overflow-hidden ${feature.large ? 'md:col-span-2' : ''}`}>
        <CardContent className="p-8 h-full flex flex-col justify-between">
          <div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.colorClass || 'bg-primary/10 text-primary'}`}>
              {feature.icon}
            </div>
            <h3 className="text-2xl mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {feature.description}
            </p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const AnimatedStepFlow = ({ steps }) => (
  <div className="space-y-12">
    {steps.map((step, index) => (
      <motion.div 
        key={index}
        initial={{ opacity: 0, x: -20 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        viewport={{ once: true }} 
        transition={{ delay: index * 0.1 }}
        className="flex gap-6 group"
      >
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
            {index + 1}
          </div>
          {index !== steps.length - 1 && <div className="w-0.5 h-full bg-border mt-4"></div>}
        </div>
        <div className="pb-8 pt-2">
          <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
          <p className="text-muted-foreground leading-relaxed max-w-lg">{step.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export const SavingsBreakdownChart = ({ data }) => (
  <div className="h-[300px] w-full mt-8">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `$${val}`} />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="traditional" name="Traditional Booking" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ai" name="AI Optimized" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PersonaFAQAccordion = ({ faqs }) => (
  <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
    {faqs.map((faq, i) => (
      <AccordionItem key={i} value={`item-${i}`}>
        <AccordionTrigger className="text-left font-semibold text-lg">{faq.q}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground leading-relaxed text-base">
          {faq.a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export const PricingTable = ({ plans }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {plans.map((plan, idx) => (
      <Card key={idx} className={`flex flex-col ${plan.popular ? 'border-primary shadow-xl scale-105 relative z-10' : 'bg-background border-border/50 shadow-sm'}`}>
        {plan.popular && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent border-0 px-3 py-1">Most Popular</Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3 text-sm">
            {plan.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${plan.popular ? 'text-accent' : 'text-primary'}`} /> 
                {feat}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`} variant={plan.popular ? 'default' : 'outline'} asChild>
            <Link to="/signup">{plan.cta}</Link>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

export const CommunityShowcase = ({ stats }) => (
  <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8 border-y border-border/50 bg-muted/30">
    {stats.map((stat, idx) => (
      <div key={idx} className="text-center">
        <p className="text-3xl md:text-4xl font-bold text-primary mb-1 font-display">{stat.value}</p>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
      </div>
    ))}
  </div>
);
