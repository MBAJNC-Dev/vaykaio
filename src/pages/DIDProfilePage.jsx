
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fingerprint, Shield, CheckCircle2, Award } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const DIDProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('did_profiles').getFirstListItem(`user_id="${pb.authStore.model.id}"`, {
        $autoCancel: false
      }).then(setProfile).catch(() => {
        setProfile({
          did_identifier: 'did:ethr:0x71C...976F',
          reputation_score: 98,
          trust_score: 100
        });
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Decentralized Identity</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decentralized Identity (DID)</h1>
        <p className="text-muted-foreground mt-1">Manage your verifiable credentials and on-chain reputation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Fingerprint className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h2 className="text-2xl font-bold">Web3 Traveler</h2>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p className="font-mono text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md inline-block">
                {profile?.did_identifier || 'did:ethr:pending...'}
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <p className="text-sm text-muted-foreground font-medium">Trust Score</p>
              <p className="text-3xl font-bold text-green-600">{profile?.trust_score || 0}/100</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reputation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Traveler Score</span>
                <span className="font-medium">{profile?.reputation_score || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[98%]" />
              </div>
            </div>
            <Button variant="outline" className="w-full">View On-Chain History</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Verifiable Credentials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-start gap-4">
            <Shield className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <h3 className="font-semibold">KYC Verified</h3>
              <p className="text-sm text-muted-foreground mt-1">Identity verified by Synaps.</p>
              <Badge variant="secondary" className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-start gap-4">
            <Award className="w-8 h-8 text-yellow-500 shrink-0" />
            <div>
              <h3 className="font-semibold">Frequent Flyer</h3>
              <p className="text-sm text-muted-foreground mt-1">Completed 10+ verified trips.</p>
              <Badge variant="secondary" className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DIDProfilePage;
