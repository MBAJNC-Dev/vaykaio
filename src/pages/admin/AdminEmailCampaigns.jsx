
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, BarChart2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminEmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const records = await pb.collection('EmailCampaigns').getFullList({ sort: '-created', $autoCancel: false });
        setCampaigns(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Email Campaigns | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">Manage newsletters and automated emails.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Campaign</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Recent Campaigns</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No campaigns found.</TableCell></TableRow>
              ) : (
                campaigns.map(camp => (
                  <TableRow key={camp.id}>
                    <TableCell className="font-medium">{camp.campaign_name}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{camp.type}</Badge></TableCell>
                    <TableCell>{camp.sent_count?.toLocaleString() || 0}</TableCell>
                    <TableCell>{camp.sent_count ? Math.round((camp.open_count / camp.sent_count) * 100) : 0}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><BarChart2 className="w-4 h-4" /></Button>
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

export default AdminEmailCampaigns;
