
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { AdminDataService } from '@/services/AdminDataService.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminGroupTravelsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await AdminDataService.fetchAllGroupPlans();
      setGroups(data.items);
    } catch (error) {
      toast.error("Failed to load group plans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Group Travels | Admin Portal</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Group Travels</h1>
        <p className="text-muted-foreground">Manage large group and corporate trips.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Group Plans</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : groups.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No group plans found.</TableCell></TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.group_name}</TableCell>
                    <TableCell>{group.trip_destination}</TableCell>
                    <TableCell>{group.group_size} people</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{group.group_type}</Badge></TableCell>
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

export default AdminGroupTravelsManagement;
