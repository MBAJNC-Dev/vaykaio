
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Shield, Zap, Cpu, Leaf } from 'lucide-react';

const features = [
  {
    title: "AI-Powered Itineraries",
    description: "Instantly generate personalized travel plans based on your unique preferences and real-time data.",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "AR/VR Previews",
    description: "Explore destinations in immersive 3D before you book, ensuring the perfect fit for your trip.",
    icon: Globe,
    color: "text-[hsl(var(--vr-purple))]",
    bg: "bg-[hsl(var(--vr-purple))]/10"
  },
  {
    title: "Web3 Security",
    description: "Your bookings and identity are secured on the blockchain, providing tamper-proof travel records.",
    icon: Shield,
    color: "text-[hsl(var(--blockchain-gold))]",
    bg: "bg-[hsl(var(--blockchain-gold))]/10"
  },
  {
    title: "Real-Time IoT Sync",
    description: "Connect with smart luggage and local transit systems for seamless, delay-free journeys.",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: "Predictive Analytics",
    description: "Anticipate weather changes, crowd levels, and price fluctuations weeks in advance.",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Eco-Friendly Routing",
    description: "Optimize your travel footprint with carbon-neutral suggestions and sustainable lodging.",
    icon: Leaf,
    color: "text-[hsl(var(--eco-green))]",
    bg: "bg-[hsl(var(--eco-green))]/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesGrid = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      {features.map((feature, idx) => (
        <motion.div 
          key={idx} 
          variants={itemVariants}
          className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className={`w-7 h-7 ${feature.color}`} />
          </div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturesGrid;
