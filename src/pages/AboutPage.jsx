import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Cpu, Plane, Users } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Privacy First',
      description: 'Your data is yours. We never sell, share, or use your information for advertising. Full transparency in all operations.',
    },
    {
      icon: Zap,
      title: 'Intelligence',
      description: 'Cutting-edge AI agents work together to understand your preferences and optimize every aspect of your trip.',
    },
    {
      icon: Cpu,
      title: 'Simplicity',
      description: 'Powerful features, intuitive interface. We remove complexity while preserving control and customization.',
    },
  ];

  const story = [
    {
      step: '1',
      title: 'The Problem',
      description: 'Planning a vacation used to mean hours of research across multiple websites, coordinating with group members, and still missing important details or opportunities.',
    },
    {
      step: '2',
      title: 'Our Solution',
      description: 'We built VaykAIo to automate the tedious parts of travel planning while empowering you to make the decisions that matter.',
    },
    {
      step: '3',
      title: 'The Vision',
      description: 'We believe vacations should be about enjoying, not managing. VaykAIo is your AI vacation command center.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About - VaykAIo</title>
        <meta name="description" content="Learn about VaykAIo and our mission to transform vacation planning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Mission Statement */}
          <div className="space-y-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              We believe vacations should be about enjoying, not managing.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              VaykAIo is your AI vacation command center. We handle the planning, coordination, and logistics so you can focus on creating memories.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">The VaykAIo Process</h2>
              <p className="text-muted-foreground mt-2">Three simple steps to your perfect vacation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {story.map((item) => (
                <Card key={item.step} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-muted-foreground mt-2">What guides everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, idx) => (
                <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8">
                    <div className="space-y-4">
                      <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary">
                        <value.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="space-y-6 border-t pt-12">
            <h2 className="text-3xl md:text-4xl font-bold">The VaykAIo Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                VaykAIo was born from a simple observation: travel planning is broken. Whether planning a solo adventure, family vacation, or group trip, the process involves juggling multiple websites, coordinating with others, managing budgets, and hoping you don't miss anything important.
              </p>
              <p>
                Our founding team experienced this firsthand. We're experienced travelers who became frustrated with the friction between wanting to plan the perfect trip and the actual mechanics of making it happen. We realized the solution wasn't incremental improvements to existing tools—it was a completely new approach powered by AI.
              </p>
              <p>
                In 2024, we started building VaykAIo with a clear vision: create an AI vacation operating system that handles the complexity while staying true to our core values of privacy, intelligence, and simplicity. Today, thousands of travelers use VaykAIo to plan better vacations.
              </p>
              <p>
                We're just getting started. Our roadmap includes advanced group features, deeper integrations with booking platforms, and AI capabilities we're still imagining. We invite you to be part of this journey.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-8 border-t pt-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Our Team</h2>
              <p className="text-muted-foreground mt-2">Passionate travelers building the future of vacation planning</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <Card key={idx} className="border-border/50 shadow-sm overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border-b">
                    <Plane className="w-12 h-12 text-primary/30" />
                  </div>
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-lg">Team Member</h3>
                    <p className="text-sm text-muted-foreground mt-1">Role Title</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Let's Talk</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interested in VaykAIo? Have questions about our mission? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-lg">Get in Touch</Button>
              <Button size="lg" variant="outline" className="rounded-lg">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
