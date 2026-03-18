
import React from 'react';
import { Helmet } from 'react-helmet';

// TODO PHASE 2: Add detailed enterprise and agency case studies.
// TODO PHASE 2: Include metrics and ROI statistics.

const CaseStudiesPage = () => {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Case Studies | VaykAIo</title>
        <meta name="description" content="See how agencies and families use VaykAIo to transform their travel." />
      </Helmet>
      
      <div className="container mx-auto px-4 text-center max-w-3xl mb-16">
        <h1 className="mb-6">Customer Success Stories</h1>
        <p className="text-xl text-muted-foreground">Discover how our platform saves time and money for travelers worldwide.</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="h-96 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground max-w-5xl mx-auto">
          [TODO PHASE 2: Insert Case Study Grid Here]
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesPage;
