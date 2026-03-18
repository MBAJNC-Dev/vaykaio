
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Advanced Security features.
// Features to build: Biometric login (WebAuthn), end-to-end encryption for travel documents, advanced fraud detection for payments.

const SecurityModuleStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>Enterprise Security</CardTitle>
        <CardDescription>Military-grade protection for your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          In Development
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          End-to-end encryption for your passport copies and biometric login support to ensure your travel data remains strictly yours.
        </p>
      </CardContent>
    </Card>
  );
};

export default SecurityModuleStub;
