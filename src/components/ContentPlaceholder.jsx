
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ContentPlaceholder = ({ title, description }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-background">
      <Helmet><title>{title} | VaykAIo</title></Helmet>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        {description || "This content section is currently being developed. Check back soon for updates."}
      </p>
      
      <div className="h-64 w-full max-w-4xl border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground mb-8 bg-muted/10">
        [ Dynamic Feed / Grid Placeholder ]
      </div>

      <Button variant="outline" asChild>
        <Link to="/marketing-hub"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub</Link>
      </Button>
    </div>
  );
};

export default ContentPlaceholder;
