
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Webhook, Plus, Activity } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminWebhookManagement = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const records = await pb.collection('AdminWebhooks').getFullList({ sort: '-created', $autoCancel: false });
        setWebhooks(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebhooks();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Webhooks | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhook Management</h1>
          <p className="text-muted-foreground">Configure outbound event notifications.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Webhook</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Webhook className="w-5 h-5 text-primary" /> Configured Endpoints</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : webhooks.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No webhooks configured.</TableCell></TableRow>
              ) : (
                webhooks.map(hook => (
                  <TableRow key={hook.id}>
                    <TableCell className="font-medium font-mono text-sm">{hook.webhook_url}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {hook.events ? hook.events.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>) : 'All'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={hook.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                        {hook.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Activity className="w-4 h-4 mr-2" /> Test</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWebhookManagement;
