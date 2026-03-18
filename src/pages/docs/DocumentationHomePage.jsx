
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Book, Code, Shield, PlayCircle, Search, ArrowRight, FileText, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DocumentationHomePage = () => {
  const categories = [
    {
      title: 'User Guides',
      description: 'Learn how to plan trips, manage budgets, and collaborate with friends.',
      icon: Book,
      path: '/docs/getting-started',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Developer API',
      description: 'Integrate VaykAIo into your own applications with our REST API.',
      icon: Code,
      path: '/docs/developer',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Admin & Enterprise',
      description: 'Manage teams, configure security, and set up white-labeling.',
      icon: Shield,
      path: '/docs/admin',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Interactive Tutorials',
      description: 'Step-by-step interactive guides to master advanced features.',
      icon: PlayCircle,
      path: '/docs/onboarding',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  const popularArticles = [
    { title: 'How to split expenses with a group', path: '/docs/features/expenses' },
    { title: 'Using the AI Itinerary Builder', path: '/docs/features/ai-builder' },
    { title: 'Authenticating API Requests', path: '/docs/developer#auth' },
    { title: 'Setting up custom domains', path: '/docs/admin/domains' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet><title>Documentation Hub | VaykAIo</title></Helmet>

      {/* Hero Section */}
      <section className="bg-muted/30 border-b py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search our comprehensive documentation, API reference, and interactive guides to get the most out of VaykAIo.
          </p>
          
          <div className="relative max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for guides, API endpoints, or tutorials..." 
              className="pl-12 h-14 text-base bg-background border-0 focus-visible:ring-0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((category, idx) => (
            <Card key={idx} className="card-hover border-border/50">
              <Link to={category.path} className="block h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-4`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary font-medium flex items-center text-sm">
                    Explore {category.title} <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> Popular Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularArticles.map((article, idx) => (
                <Link key={idx} to={article.path} className="flex items-start gap-3 p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                  <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="font-medium text-sm">{article.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Need more help?</CardTitle>
                <CardDescription>Can't find what you're looking for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/help" className="flex items-center justify-between p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <span className="font-medium text-sm">Visit Help Center</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link to="/support/tickets" className="flex items-center justify-between p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <span className="font-medium text-sm">Submit a Ticket</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationHomePage;
