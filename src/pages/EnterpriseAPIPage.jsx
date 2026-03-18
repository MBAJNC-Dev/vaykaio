
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Terminal, Key, Webhook, Copy, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const EnterpriseAPIPage = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      <Helmet><title>API & Webhooks - VaykAIo Enterprise</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
            <p className="text-muted-foreground mt-1">Manage API keys, webhooks, and integrations.</p>
          </div>
          <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2"/> View API Docs</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* API Keys */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary"/> API Keys</CardTitle>
                  <CardDescription>Keys used to authenticate API requests.</CardDescription>
                </div>
                <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Generate Key</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key Prefix</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Production App</TableCell>
                      <TableCell className="font-mono text-xs">tm_live_8f92...</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Oct 1, 2025</TableCell>
                      <TableCell className="text-sm text-muted-foreground">2 mins ago</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Staging Environment</TableCell>
                      <TableCell className="font-mono text-xs">tm_test_4a1b...</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Sep 15, 2025</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Yesterday</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Webhooks */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2"><Webhook className="w-5 h-5 text-primary"/> Webhooks</CardTitle>
                  <CardDescription>Receive real-time HTTP notifications for events.</CardDescription>
                </div>
                <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Add Endpoint</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">https://api.acme.com/webhooks/vaykaio</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">trip.created, trip.updated</Badge></TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="shadow-sm bg-slate-950 text-slate-50 border-0">
              <CardHeader>
                <CardTitle className="text-slate-50 flex items-center gap-2"><Terminal className="w-5 h-5"/> Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">Authenticate requests by including your API key in the Authorization header.</p>
                <div className="bg-slate-900 p-3 rounded-lg relative group">
                  <code className="text-xs text-green-400 font-mono break-all">
                    curl -X GET https://api.vaykaio.com/v1/trips \<br/>
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </code>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard('curl -X GET https://api.vaykaio.com/v1/trips -H "Authorization: Bearer YOUR_API_KEY"')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Rate Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Requests</span>
                    <span className="font-medium">12,450 / 100,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '12.45%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">Resets in 15 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </>
  );
};

export default EnterpriseAPIPage;
