
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, FileText, TrendingUp, Users, AlertCircle } from 'lucide-react';

const EnterpriseBillingPage = () => {
  return (
    <>
      <Helmet><title>Enterprise Billing - VaykAIo</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
          <p className="text-muted-foreground mt-1">Manage your enterprise subscription, invoices, and cost allocation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">Current Plan</p>
                  <p className="text-2xl font-bold">Enterprise</p>
                </div>
                <Badge className="bg-primary text-primary-foreground border-0">Active</Badge>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Billing Cycle</span> <span className="font-medium">Annual</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Next Invoice</span> <span className="font-medium">Oct 15, 2026</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount Due</span> <span className="font-medium">$12,500.00</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Licenses</p>
                  <p className="text-2xl font-bold">145 <span className="text-sm font-normal text-muted-foreground">/ 200</span></p>
                </div>
                <div className="p-2 bg-muted rounded-lg"><Users className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <div className="mt-6 w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '72.5%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">55 licenses available</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="text-lg font-bold flex items-center gap-2"><CreditCard className="w-5 h-5"/> •••• 4242</p>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <p className="text-muted-foreground">Expires 12/2028</p>
                <Button variant="outline" size="sm" className="w-full">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Cost Allocation by Department</CardTitle>
              <CardDescription>Current billing cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Engineering', amount: 4500, pct: 36 },
                  { name: 'Sales', amount: 3200, pct: 25 },
                  { name: 'Marketing', amount: 1800, pct: 14 },
                  { name: 'Executive', amount: 3000, pct: 24 }
                ].map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-muted-foreground">${dept.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${dept.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Download past billing statements</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {[
                    { id: 'INV-2025-10', date: 'Oct 15, 2025', amount: 12500, status: 'Paid' },
                    { id: 'INV-2024-10', date: 'Oct 15, 2024', amount: 10000, status: 'Paid' },
                    { id: 'INV-2023-10', date: 'Oct 15, 2023', amount: 8500, status: 'Paid' }
                  ].map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground"/> {inv.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                      <TableCell>${inv.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Download className="w-4 h-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
};

export default EnterpriseBillingPage;
