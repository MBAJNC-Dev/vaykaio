
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, FileText, Printer, Mail } from 'lucide-react';
import { format } from 'date-fns';

const InvoiceManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const invoices = [
    { id: 'INV-2025-001', date: '2025-10-15', amount: 19.99, status: 'paid', plan: 'Premium Plan - Monthly' },
    { id: 'INV-2025-002', date: '2025-09-15', amount: 19.99, status: 'paid', plan: 'Premium Plan - Monthly' },
    { id: 'INV-2025-003', date: '2025-08-15', amount: 9.99, status: 'paid', plan: 'Pro Plan - Monthly' },
    { id: 'INV-2025-004', date: '2025-07-15', amount: 9.99, status: 'failed', plan: 'Pro Plan - Monthly' },
  ];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet><title>Invoices - VaykAIo</title></Helmet>
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-1">View and download your billing history.</p>
          </div>
          <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export All</Button>
        </div>

        <Card className="shadow-sm border-0 ring-1 ring-border">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search invoice number..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="pl-6">Invoice Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="pl-6 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {invoice.id}
                    </TableCell>
                    <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`
                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        ${invoice.status === 'failed' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                        ${invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                        border-0 capitalize
                      `}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">View</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex justify-between items-center">
                              <span>Invoice {invoice.id}</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase">Paid</Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-6 space-y-8">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-bold text-lg">VaykAIo Inc.</h4>
                                <p className="text-sm text-muted-foreground">123 Tech Blvd<br/>San Francisco, CA 94105</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">Billed To:</p>
                                <p className="text-sm">John Doe<br/>123 Travel Way<br/>San Francisco, CA 94105</p>
                              </div>
                            </div>
                            
                            <div className="border rounded-xl overflow-hidden">
                              <Table>
                                <TableHeader className="bg-muted/50">
                                  <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>{invoice.plan} (Oct 15 - Nov 15)</TableCell>
                                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <div className="bg-muted/10 p-4 border-t flex justify-between items-center">
                                <span className="font-bold">Total Paid</span>
                                <span className="font-bold text-lg">${invoice.amount.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              <p>Paid via Visa ending in 4242 on {format(new Date(invoice.date), 'MMM d, yyyy')}.</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 border-t pt-4">
                            <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2"/> Print</Button>
                            <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2"/> Email</Button>
                            <Button size="sm"><Download className="w-4 h-4 mr-2"/> Download PDF</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" title="Download PDF">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No invoices found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default InvoiceManagementPage;
