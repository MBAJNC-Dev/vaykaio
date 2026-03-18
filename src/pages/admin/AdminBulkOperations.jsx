
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Layers, Trash2, UserCheck, ShieldAlert } from 'lucide-react';

const AdminBulkOperations = () => {
  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState('');

  const mockUsers = [
    { id: '1', email: 'user1@example.com', status: 'active', role: 'user' },
    { id: '2', email: 'user2@example.com', status: 'inactive', role: 'user' },
    { id: '3', email: 'user3@example.com', status: 'active', role: 'admin' },
  ];

  const handleSelectAll = (checked) => {
    if (checked) setSelected(mockUsers.map(u => u.id));
    else setSelected([]);
  };

  const handleExecute = () => {
    if (!action || selected.length === 0) return;
    toast.success(`Successfully executed ${action} on ${selected.length} items.`);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Bulk Operations | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground">Perform actions on multiple records simultaneously.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Select users to apply bulk actions.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete"><span className="flex items-center"><Trash2 className="w-4 h-4 mr-2 text-destructive"/> Delete Users</span></SelectItem>
                <SelectItem value="suspend"><span className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-amber-500"/> Suspend Accounts</span></SelectItem>
                <SelectItem value="verify"><span className="flex items-center"><UserCheck className="w-4 h-4 mr-2 text-green-500"/> Mark as Verified</span></SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExecute} disabled={!action || selected.length === 0}>
              <Layers className="w-4 h-4 mr-2" /> Execute
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selected.length === mockUsers.length} 
                    onCheckedChange={handleSelectAll} 
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selected.includes(user.id)}
                      onCheckedChange={(c) => {
                        if (c) setSelected([...selected, user.id]);
                        else setSelected(selected.filter(id => id !== user.id));
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.status}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkOperations;
