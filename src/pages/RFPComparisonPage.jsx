
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const RFPComparisonPage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!pb.authStore.isValid) return;
      try {
        // Fetch responses and expand the related RFP to get property names
        const records = await pb.collection('rfp_responses').getList(1, 5, {
          expand: 'rfp_id',
          $autoCancel: false
        });
        
        // If no real data, provide mock data for demonstration of the premium feature
        if (records.items.length === 0) {
          setResponses([
            { id: '1', property_name: 'Grand Hyatt Tokyo', quote_amount: 45000, validity_period: '30 days', inclusions: 'Breakfast, WiFi, Meeting Room', exclusions: 'AV Equipment' },
            { id: '2', property_name: 'Hilton Shinjuku', quote_amount: 42500, validity_period: '14 days', inclusions: 'Breakfast, WiFi', exclusions: 'Meeting Room, AV Equipment' },
            { id: '3', property_name: 'Mandarin Oriental', quote_amount: 52000, validity_period: '30 days', inclusions: 'All Meals, WiFi, Full AV Setup, Spa Access', exclusions: 'None' }
          ]);
        } else {
          setResponses(records.items.map(r => ({
            id: r.id,
            property_name: r.expand?.rfp_id?.property_name || 'Unknown Property',
            quote_amount: r.quote_amount,
            validity_period: r.validity_period,
            inclusions: r.inclusions,
            exclusions: r.exclusions
          })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Compare Quotes | TravelMatrix</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quote Comparison</h1>
          <p className="text-muted-foreground mt-1">Compare up to 5 property responses side-by-side.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px] font-semibold">Feature / Property</TableHead>
                {responses.map(res => (
                  <TableHead key={res.id} className="min-w-[250px]">
                    <div className="font-bold text-lg text-foreground">{res.property_name}</div>
                    {res.quote_amount === Math.min(...responses.map(r => r.quote_amount)) && (
                      <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100 border-0">Best Price</Badge>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium bg-muted/20">Total Quote</TableCell>
                {responses.map(res => (
                  <TableCell key={res.id} className="text-xl font-bold">
                    ${res.quote_amount?.toLocaleString() || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/20">Validity</TableCell>
                {responses.map(res => (
                  <TableCell key={res.id}>{res.validity_period || 'Not specified'}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/20">Inclusions</TableCell>
                {responses.map(res => (
                  <TableCell key={res.id}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{res.inclusions || 'Standard room only'}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/20">Exclusions</TableCell>
                {responses.map(res => (
                  <TableCell key={res.id}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{res.exclusions || 'None specified'}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium bg-muted/20">Action</TableCell>
                {responses.map(res => (
                  <TableCell key={res.id}>
                    <Button className="w-full" variant={res.quote_amount === Math.min(...responses.map(r => r.quote_amount)) ? 'default' : 'outline'}>
                      Accept Quote
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RFPComparisonPage;
