
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

const FeaturePlaceholder = ({ title, description, icon: Icon = Sparkles }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <Helmet><title>{title} | VaykAIo</title></Helmet>
      
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        {description || "This advanced feature module is currently being provisioned. Check back soon for updates."}
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
        <Button asChild>
          <Link to="/docs">Read Documentation</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturePlaceholder;
