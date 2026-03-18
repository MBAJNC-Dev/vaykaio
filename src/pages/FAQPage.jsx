import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');

  const faqs = {
    general: [
      {
        id: 'g1',
        question: 'What is VaykAIo?',
        answer: 'VaykAIo is an AI vacation operating system that automates vacation planning. It coordinates itinerary building, group decisions, expense tracking, and travel logistics—so you can focus on enjoying your trip.',
      },
      {
        id: 'g2',
        question: 'How does VaykAIo differ from other travel planning apps?',
        answer: 'VaykAIo uses a multi-agent AI system that understands your preferences, automates coordination, and continuously learns. Unlike traditional apps, VaykAIo handles the entire vacation management process, not just bookings.',
      },
      {
        id: 'g3',
        question: 'Is VaykAIo free?',
        answer: 'VaykAIo offers a free plan for basic trip planning. Our Pro plans unlock advanced features like unlimited AI recommendations, group coordination tools, and expense splitting for $12.99/month.',
      },
      {
        id: 'g4',
        question: 'How do I get started?',
        answer: 'Sign up for free at VaykAIo.com, create your first trip, and answer a few questions about your preferences. Our AI will handle the rest!',
      },
      {
        id: 'g5',
        question: 'Can I use VaykAIo offline?',
        answer: 'Yes! VaykAIo has offline mode for viewing itineraries, maps, and documents. Changes sync automatically when you reconnect to the internet.',
      },
    ],
    ai: [
      {
        id: 'a1',
        question: 'How does the AI understand my preferences?',
        answer: 'You answer questions about your travel style, interests, and constraints. Our AI agents analyze this along with your trip history to make personalized recommendations. You can always provide feedback to improve suggestions.',
      },
      {
        id: 'a2',
        question: 'Can I override AI recommendations?',
        answer: 'Absolutely! VaykAIo is designed for you to stay in control. You can edit every aspect of your itinerary, swap activities, change timings, and add your own ideas.',
      },
      {
        id: 'a3',
        question: 'What data does the AI use?',
        answer: 'The AI uses your stated preferences, travel history with VaykAIo, and real-time information (availability, weather, events). We never use personal data beyond what you explicitly share.',
      },
      {
        id: 'a4',
        question: 'How accurate are the recommendations?',
        answer: 'Accuracy improves over time as the AI learns your preferences. Early recommendations are based on your profile and community data. After a few trips, the AI becomes highly personalized.',
      },
      {
        id: 'a5',
        question: 'Can I use VaykAIo for different types of trips?',
        answer: 'Yes! VaykAIo handles solo travel, family vacations, adventure trips, cultural exploration, and more. You can save templates for different trip types.',
      },
    ],
    features: [
      {
        id: 'f1',
        question: 'How does group coordination work?',
        answer: 'Invite group members to your trip. Everyone sees the itinerary in real-time, can suggest activities, and vote on options. VaykAIo tallies votes and handles logistics for everyone.',
      },
      {
        id: 'f2',
        question: 'How are expenses split?',
        answer: 'Log expenses as you travel. VaykAIo categorizes spending and automatically calculates who owes whom. Settle up in the app or export for venmo/paypal.',
      },
      {
        id: 'f3',
        question: 'Can I share my photos?',
        answer: 'Yes! Create shared albums for group trips. VaykAIo organizes photos by location and date. You control privacy settings for each album.',
      },
      {
        id: 'f4',
        question: 'How do notifications work?',
        answer: 'VaykAIo sends notifications for flight reminders (24h before), restaurant reservations, group updates, and weather alerts. You control frequency and quiet hours.',
      },
      {
        id: 'f5',
        question: 'What integrations does VaykAIo support?',
        answer: 'We integrate with Google Calendar, Apple Calendar, Stripe, and major hotel/flight APIs. More integrations coming soon.',
      },
    ],
    privacy: [
      {
        id: 'p1',
        question: 'Is my data private?',
        answer: 'Privacy is our highest priority. Your data is encrypted in transit and at rest. We never sell or share your information. You own all your trip data.',
      },
      {
        id: 'p2',
        question: 'Can I export my data?',
        answer: 'Yes! You can export all your trip data, photos, and documents in standard formats at any time. No lock-in.',
      },
      {
        id: 'p3',
        question: 'How is my payment information handled?',
        answer: 'We use Stripe for payments. We never store full credit card numbers. All transactions are PCI-compliant.',
      },
      {
        id: 'p4',
        question: 'What happens to my data if I delete my account?',
        answer: 'You can request permanent deletion anytime. We delete all personal data within 30 days, except what we\'re legally required to retain.',
      },
      {
        id: 'p5',
        question: 'Do you use my data for advertising?',
        answer: 'No. We never use your data for advertising or sell it to third parties. We make money through subscriptions, not data.',
      },
    ],
    technical: [
      {
        id: 't1',
        question: 'What devices does VaykAIo support?',
        answer: 'VaykAIo works on iOS, Android, web browser, and desktop apps. Your data syncs across all devices.',
      },
      {
        id: 't2',
        question: 'Is there a mobile app?',
        answer: 'Yes! Download VaykAIo from the App Store or Google Play for free. The app includes offline mode and native features.',
      },
      {
        id: 't3',
        question: 'What\'s the best way to contact support?',
        answer: 'Email support@vaykaio.com or use our live chat (10am-6pm ET). Response time is typically under 2 hours.',
      },
      {
        id: 't4',
        question: 'How often does VaykAIo update?',
        answer: 'We deploy updates weekly. Major features roll out monthly. You\'ll always have the latest version on mobile and web.',
      },
      {
        id: 't5',
        question: 'What\'s your uptime guarantee?',
        answer: 'VaykAIo guarantees 99.9% uptime. We use redundant servers and automatic failover to ensure reliability.',
      },
    ],
  };

  const categories = [
    { id: 'general', label: 'General', icon: '?' },
    { id: 'ai', label: 'AI Features', icon: '🤖' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'technical', label: 'Technical', icon: '⚙️' },
  ];

  const currentFAQs = faqs[activeCategory];
  const filteredFAQs = currentFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - VaykAIo</title>
        <meta name="description" content="Frequently asked questions about VaykAIo vacation planning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Hero */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">Everything you need to know about VaykAIo</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-lg border-border/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <Card className="border-border/50 shadow-sm">
                <CardContent className="pt-12 text-center pb-12">
                  <p className="text-muted-foreground">No questions found matching your search.</p>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map(faq => (
                <Card
                  key={faq.id}
                  className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 pb-6 border-t text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Still have questions?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-lg">Email Support</Button>
              <Button size="lg" variant="outline" className="rounded-lg">
                Live Chat (10am-6pm ET)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
