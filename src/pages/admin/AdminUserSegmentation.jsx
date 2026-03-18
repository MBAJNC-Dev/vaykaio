
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Filter } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminUserSegmentation = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const records = await pb.collection('UserSegments').getFullList({ sort: '-created', $autoCancel: false });
        setSegments(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>User Segmentation | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Segmentation</h1>
          <p className="text-muted-foreground">Create dynamic user groups based on behavior and attributes.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Create Segment</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Active Segments</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Criteria Summary</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : segments.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No segments defined.</TableCell></TableRow>
              ) : (
                segments.map(seg => (
                  <TableRow key={seg.id}>
                    <TableCell className="font-medium">{seg.segment_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {seg.criteria ? JSON.stringify(seg.criteria).substring(0, 50) + '...' : 'Custom rules'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex w-fit items-center gap-1">
                        <Users className="w-3 h-3" /> {seg.member_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View Users</Button>
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

export default AdminUserSegmentation;
