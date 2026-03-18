
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';

const KnowledgeBase = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Helmet><title>Help Center | Vacation Planner</title></Helmet>
      
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">How can we help?</h1>
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search for articles, guides, and FAQs..." className="pl-12 h-14 text-lg rounded-full shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover cursor-pointer border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5 text-primary"/> Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Learn how to create your first AI-powered itinerary.</CardContent>
        </Card>
        <Card className="card-hover cursor-pointer border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5 text-primary"/> Billing & Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Manage subscriptions, invoices, and payment methods.</CardContent>
        </Card>
        <Card className="card-hover cursor-pointer border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5 text-primary"/> Group Travel</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">How to invite friends and split expenses.</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeBase;
