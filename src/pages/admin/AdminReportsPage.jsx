
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', users: 400, plans: 240 },
  { name: 'Feb', users: 300, plans: 139 },
  { name: 'Mar', users: 200, plans: 980 },
  { name: 'Apr', users: 278, plans: 390 },
  { name: 'May', users: 189, plans: 480 },
  { name: 'Jun', users: 239, plans: 380 },
];

const AdminReportsPage = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Reports | Admin Portal</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Generate and export system insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Mail className="w-4 h-4 mr-2" /> Email Report</Button>
          <Button><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
        </div>
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <label className="text-xs font-medium">Report Type</label>
            <Select defaultValue="growth">
              <SelectTrigger className="w-[200px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="growth">User Growth</SelectItem>
                <SelectItem value="revenue">Revenue Analysis</SelectItem>
                <SelectItem value="plans">Plan Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Date Range</label>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal bg-background">
              <CalendarIcon className="mr-2 h-4 w-4" /> Last 6 Months
            </Button>
          </div>
          <Button className="mt-5">Generate</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User & Plan Growth</CardTitle>
          <CardDescription>Monthly comparison of new users vs created plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="plans" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
