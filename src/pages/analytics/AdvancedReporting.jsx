
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';

const AdvancedReporting = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Advanced Reporting | Admin</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Advanced Reporting</h1>
          <p className="text-muted-foreground mt-2">Generate and export custom data reports.</p>
        </div>
        <Button><Download className="w-4 h-4 mr-2" /> Export All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover cursor-pointer border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-green-600"/> Financial Summary</CardTitle>
            <CardDescription>Q3 2023 Revenue & Expenses</CardDescription>
          </CardHeader>
        </Card>
        <Card className="card-hover cursor-pointer border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-blue-600"/> User Growth</CardTitle>
            <CardDescription>Monthly Active Users (YTD)</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedReporting;
