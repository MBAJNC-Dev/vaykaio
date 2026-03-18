
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, LayoutTemplate } from 'lucide-react';

const AdminCustomReports = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Custom Reports | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
          <p className="text-muted-foreground">Design and save custom analytics dashboards.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-dashed bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
          <Plus className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="font-medium text-muted-foreground">Create Blank Report</p>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Financial Summary</CardTitle>
            <CardDescription>Revenue, expenses, and profit margins by month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded-md flex items-center justify-center">
              <LayoutTemplate className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-accent" /> User Retention</CardTitle>
            <CardDescription>Cohort analysis and churn rates over 90 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded-md flex items-center justify-center">
              <LayoutTemplate className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomReports;
