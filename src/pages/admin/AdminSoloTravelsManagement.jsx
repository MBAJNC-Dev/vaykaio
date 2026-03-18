
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { AdminDataService } from '@/services/AdminDataService.js';
import { toast } from 'sonner';

const AdminSoloTravelsManagement = () => {
  const [solos, setSolos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolos = async () => {
      try {
        const data = await AdminDataService.fetchAllSoloPlans();
        setSolos(data.items);
      } catch (error) {
        toast.error("Failed to load solo plans");
      } finally {
        setLoading(false);
      }
    };
    fetchSolos();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Solo Travels | Admin Portal</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Solo Travels</h1>
        <p className="text-muted-foreground">Manage individual adventure plans.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Solo Plans</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Style</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : solos.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No solo plans found.</TableCell></TableRow>
              ) : (
                solos.map((solo) => (
                  <TableRow key={solo.id}>
                    <TableCell className="font-medium">{solo.destination}</TableCell>
                    <TableCell className="capitalize">{solo.travel_style}</TableCell>
                    <TableCell>${solo.budget}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{solo.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
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

export default AdminSoloTravelsManagement;
