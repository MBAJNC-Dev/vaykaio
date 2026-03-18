
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Plus, MoreHorizontal, Users, DollarSign, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const DepartmentManagementPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments = [
    { id: 1, name: 'Engineering', members: 45, budget: 150000, spending: 124000, manager: 'Sarah Jenkins' },
    { id: 2, name: 'Sales', members: 32, budget: 200000, spending: 185000, manager: 'Mike Ross' },
    { id: 3, name: 'Marketing', members: 18, budget: 80000, spending: 65000, manager: 'Rachel Zane' },
    { id: 4, name: 'Executive', members: 8, budget: 100000, spending: 45000, manager: 'Harvey Specter' },
  ];

  const chartData = departments.map(d => ({
    name: d.name,
    Budget: d.budget,
    Spending: d.spending
  }));

  const handleCreate = (e) => {
    e.preventDefault();
    toast.success('Department created successfully');
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Helmet><title>Departments - VaykAIo Enterprise</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground mt-1">Organize teams and track departmental budgets.</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2"/> Create Department</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input placeholder="e.g., Customer Success" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Input placeholder="Search users..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Budget ($)</Label>
                    <Input type="number" placeholder="50000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Optional description..." className="resize-none" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Department</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-center">Members</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Spending</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="pl-6 font-medium flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" /> {dept.name}
                      </TableCell>
                      <TableCell className="text-sm">{dept.manager}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Users className="w-3 h-3 text-muted-foreground"/> {dept.members}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">${dept.budget.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-medium text-primary">${dept.spending.toLocaleString()}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Budget vs Spending</CardTitle>
              <CardDescription>Current fiscal year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" fontSize={12} stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} formatter={(val) => `$${val.toLocaleString()}`} />
                  <Bar dataKey="Budget" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="Spending" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
};

export default DepartmentManagementPage;
