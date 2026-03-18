
import React from 'react';
import { Helmet } from 'react-helmet';

// TODO PHASE 2: Implement masonry layout for user reviews.
// TODO PHASE 2: Add video testimonial support.

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Testimonials | VaykAIo</title>
        <meta name="description" content="Read what our users have to say about VaykAIo." />
      </Helmet>
      
      <div className="container mx-auto px-4 text-center max-w-3xl mb-16">
        <h1 className="mb-6">Wall of Love</h1>
        <p className="text-xl text-muted-foreground">Don't just take our word for it.</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="h-96 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground max-w-5xl mx-auto">
          [TODO PHASE 2: Insert Masonry Testimonial Grid Here]
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
