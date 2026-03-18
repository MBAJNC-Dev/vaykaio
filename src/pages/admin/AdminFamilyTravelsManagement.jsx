
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { AdminDataService } from '@/services/AdminDataService.js';
import { toast } from 'sonner';

const AdminFamilyTravelsManagement = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const data = await AdminDataService.fetchAllFamilyPlans();
        setFamilies(data.items);
      } catch (error) {
        toast.error("Failed to load family plans");
      } finally {
        setLoading(false);
      }
    };
    fetchFamilies();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Family Travels | Admin Portal</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Family Travels</h1>
        <p className="text-muted-foreground">Manage family vacation plans.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Family Plans</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : families.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No family plans found.</TableCell></TableRow>
              ) : (
                families.map((fam) => (
                  <TableRow key={fam.id}>
                    <TableCell className="font-medium">{fam.family_name}</TableCell>
                    <TableCell>{fam.trip_destination}</TableCell>
                    <TableCell>{fam.family_size} members</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{fam.status}</Badge></TableCell>
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

export default AdminFamilyTravelsManagement;
