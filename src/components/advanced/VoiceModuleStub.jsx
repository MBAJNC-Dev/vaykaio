
import React from 'react';
import { Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Voice & Audio integration.
// Add dependencies: Web Speech API, ElevenLabs API, or OpenAI Whisper.
// Features to build: Voice-activated itinerary planning, real-time audio translation, generated audio guides.

const VoiceModuleStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Mic className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>Voice Co-Pilot</CardTitle>
        <CardDescription>Hands-free planning and translation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          In Development
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          "Hey VaykAIo, find me a highly-rated sushi restaurant nearby." Voice commands and real-time translation are on the roadmap.
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceModuleStub;
