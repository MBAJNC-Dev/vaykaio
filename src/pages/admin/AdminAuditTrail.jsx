
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminDataService } from '@/services/AdminDataService.js';

const AdminAuditTrail = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await AdminDataService.fetchAuditTrails();
        setTrails(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrails();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Audit Trail | Admin Portal</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Audit Trail</h1>
        <p className="text-muted-foreground">Comprehensive log of system data changes.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Data Changes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : trails.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No audit records found.</TableCell></TableRow>
              ) : (
                trails.map((trail) => (
                  <TableRow key={trail.id}>
                    <TableCell className="font-medium">{trail.expand?.user_id?.email || 'Unknown'}</TableCell>
                    <TableCell>{trail.module}</TableCell>
                    <TableCell>{trail.action}</TableCell>
                    <TableCell>{new Date(trail.timestamp || trail.created).toLocaleString()}</TableCell>
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

export default AdminAuditTrail;
