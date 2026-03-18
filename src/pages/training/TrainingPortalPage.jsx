
import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlayCircle, Award, BookOpen, CheckCircle2 } from 'lucide-react';

const TrainingPortalPage = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Training & Certification Portal | VaykAIo</title>
      </Helmet>

      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="mb-6 text-white">VaykAIo Academy</h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Master the platform, earn official certifications, and become a travel tech expert.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12 relative z-10">
        <Card className="mb-12 shadow-lg border-0">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Learning Progress</h3>
              <p className="text-muted-foreground">VaykAIo Fundamentals (Beginner)</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>40% Completed</span>
                <span>2/5 Modules</span>
              </div>
              <Progress value={40} className="h-3" />
            </div>
            <Button>Continue Course</Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="paths" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="videos">Video Library</TabsTrigger>
          </TabsList>

          <TabsContent value="paths">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Beginner', 'Intermediate', 'Advanced'].map((level, idx) => (
                <Card key={idx} className="card-hover">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{level} Path</CardTitle>
                    <CardDescription>Master the {level.toLowerCase()} features of VaykAIo.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary"/> Module 1: Setup</li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-primary"/> Module 2: Planning</li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground"><PlayCircle className="w-4 h-4"/> Module 3: Collaboration</li>
                    </ul>
                    <Button variant="outline" className="w-full">Start Path</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <Award className="w-8 h-8 text-accent mb-4" />
                  <CardTitle>Certified VaykAIo Admin</CardTitle>
                  <CardDescription>For enterprise managers and agency owners.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Validate your expertise in managing teams, configuring billing, and setting up white-label environments.</p>
                  <Button className="bg-accent hover:bg-accent/90 text-white">View Requirements</Button>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <Award className="w-8 h-8 text-primary mb-4" />
                  <CardTitle>Certified Developer</CardTitle>
                  <CardDescription>For engineers building custom integrations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Prove your knowledge of the VaykAIo REST API, Webhooks, and custom UI extensions.</p>
                  <Button>View Requirements</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="h-64 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground">
              Video Training Library Grid Placeholder
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingPortalPage;
