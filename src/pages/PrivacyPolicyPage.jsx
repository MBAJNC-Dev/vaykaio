
import React from 'react';
import { Helmet } from 'react-helmet';

// TODO PHASE 2: Draft actual legal privacy policy text.
// TODO PHASE 2: Ensure compliance with GDPR/CCPA.

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Privacy Policy | VaykAIo</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: [Date]</p>
          <div className="h-96 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground mt-8">
            [TODO PHASE 2: Insert Legal Text Here]
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
