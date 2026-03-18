
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AdminDatabaseManagement = () => {
  const handleOptimize = () => {
    toast.success("Database optimization started in background.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Database Management | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground">Monitor storage and optimize database performance.</p>
        </div>
        <Button onClick={handleOptimize}><Zap className="w-4 h-4 mr-2" /> Optimize DB</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Storage Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Total Size</span><span className="font-medium font-mono">1.24 GB</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Record Count</span><span className="font-medium font-mono">142,850</span></div>
            <div className="flex justify-between py-2"><span className="text-muted-foreground">Index Size</span><span className="font-medium font-mono">340 MB</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-accent" /> Maintenance</CardTitle>
            <CardDescription>Run manual maintenance tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">Rebuild Indexes</Button>
            <Button variant="outline" className="w-full justify-start">Clear Orphaned Files</Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">Vacuum Database</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDatabaseManagement;
