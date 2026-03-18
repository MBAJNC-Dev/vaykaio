
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Book, MessageCircle, HelpCircle, FileText, Users } from 'lucide-react';

const KnowledgeBasePage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Support & Knowledge Base | VaykAIo</title>
      </Helmet>

      <section className="bg-muted/30 border-b py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="mb-6">How can we help?</h1>
          <div className="relative shadow-sm rounded-xl overflow-hidden mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for articles, guides, or FAQs..." 
              className="pl-12 h-14 text-base bg-background border-0 focus-visible:ring-1"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            <a href="#" className="text-primary hover:underline">Billing</a>
            <a href="#" className="text-primary hover:underline">AI Itinerary</a>
            <a href="#" className="text-primary hover:underline">Group Invites</a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="card-hover text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Guides & Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Step-by-step instructions for using every feature.</p>
              <Link to="/docs" className="text-primary font-medium text-sm hover:underline">Browse Guides &rarr;</Link>
            </CardContent>
          </Card>

          <Card className="card-hover text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <HelpCircle className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Answers to the most common questions.</p>
              <Link to="/faq" className="text-accent font-medium text-sm hover:underline">View FAQ &rarr;</Link>
            </CardContent>
          </Card>

          <Card className="card-hover text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Community Forum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Connect with other travelers and share tips.</p>
              <Link to="/forum" className="text-green-500 font-medium text-sm hover:underline">Join Discussion &rarr;</Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Recent Articles</h3>
            <ul className="space-y-4">
              <li><a href="#" className="block p-4 rounded-lg border hover:border-primary transition-colors font-medium">How to split expenses with a group</a></li>
              <li><a href="#" className="block p-4 rounded-lg border hover:border-primary transition-colors font-medium">Configuring custom domains for Enterprise</a></li>
              <li><a href="#" className="block p-4 rounded-lg border hover:border-primary transition-colors font-medium">Troubleshooting calendar sync issues</a></li>
            </ul>
          </div>
          
          <div className="bg-muted/30 rounded-2xl p-8 border text-center flex flex-col justify-center">
            <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you.</p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
