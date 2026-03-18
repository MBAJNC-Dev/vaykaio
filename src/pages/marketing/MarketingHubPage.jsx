
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Video, Image as ImageIcon, Download, Mic, Share2, Megaphone, HeartHandshake as Handshake } from 'lucide-react';

const MarketingHubPage = () => {
  const categories = [
    { id: 'blog', label: 'Blog Library', icon: FileText, path: '/blog' },
    { id: 'videos', label: 'Video Gallery', icon: Video, path: '/videos' },
    { id: 'infographics', label: 'Infographics', icon: ImageIcon, path: '/infographics' },
    { id: 'downloads', label: 'Downloads', icon: Download, path: '/downloads' },
    { id: 'webinars', label: 'Webinars', icon: Video, path: '/webinars' },
    { id: 'podcasts', label: 'Podcasts', icon: Mic, path: '/podcasts' },
    { id: 'social', label: 'Social Campaigns', icon: Share2, path: '/social-campaigns' },
    { id: 'ads', label: 'Advertising', icon: Megaphone, path: '/advertising' },
    { id: 'partnerships', label: 'Partnerships', icon: Handshake, path: '/partnerships' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Marketing & Resources Hub | VaykAIo</title>
      </Helmet>

      {/* Header */}
      <section className="bg-muted/30 border-b py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="mb-6">Marketing & Resources Hub</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to succeed with VaykAIo. Explore our extensive library of guides, videos, templates, and insights.
          </p>
          
          <div className="relative max-w-2xl mx-auto shadow-sm rounded-xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search resources, blogs, or webinars..." 
              className="pl-12 h-14 text-base bg-background border-0 focus-visible:ring-1"
            />
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-center mb-12 overflow-x-auto pb-2 custom-scrollbar">
            <TabsList className="h-auto p-1 bg-muted/50">
              <TabsTrigger value="overview" className="px-6 py-3 rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="featured" className="px-6 py-3 rounded-lg">Featured</TabsTrigger>
              <TabsTrigger value="latest" className="px-6 py-3 rounded-lg">Latest Releases</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Card key={cat.id} className="card-hover border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <cat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{cat.label}</CardTitle>
                    <CardDescription>Explore our collection of {cat.label.toLowerCase()}.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={cat.path}>Browse {cat.label}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="h-64 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground">
              Featured Content Carousel Placeholder
            </div>
          </TabsContent>

          <TabsContent value="latest">
            <div className="h-64 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground">
              Latest Releases Feed Placeholder
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingHubPage;
