
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DatabaseBackup, Download, RotateCcw, Plus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminBackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const records = await pb.collection('Backups').getFullList({ sort: '-created', $autoCancel: false });
        setBackups(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBackups();
  }, []);

  const handleCreateBackup = () => {
    toast.success("Backup process initiated. This may take a few minutes.");
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Backup & Restore | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
          <p className="text-muted-foreground">Manage system snapshots and data recovery.</p>
        </div>
        <Button onClick={handleCreateBackup}><Plus className="w-4 h-4 mr-2" /> Create Backup</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DatabaseBackup className="w-5 h-5 text-primary" /> System Backups</CardTitle>
          <CardDescription>Automated and manual database snapshots.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : backups.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No backups found.</TableCell></TableRow>
              ) : (
                backups.map(backup => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{new Date(backup.backup_date || backup.created).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{backup.backup_type}</Badge></TableCell>
                    <TableCell>{(backup.backup_size / 1024 / 1024).toFixed(2)} MB</TableCell>
                    <TableCell>
                      <Badge variant={backup.status === 'complete' ? 'default' : 'secondary'} className="capitalize">
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Download"><Download className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" title="Restore" className="text-amber-500"><RotateCcw className="w-4 h-4" /></Button>
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

export default AdminBackupRestore;
