
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

const InvoicesReceipts = () => {
  const invoices = [
    { id: 'INV-2023-001', date: 'Oct 12, 2023', amount: '$1,249.00', status: 'Paid', trip: 'Tokyo Adventure' },
    { id: 'INV-2023-002', date: 'Jul 05, 2023', amount: '$850.00', status: 'Paid', trip: 'Iceland Roadtrip' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Invoices | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing History</h1>
        <p className="text-muted-foreground mt-2">Download receipts and invoices for your trips.</p>
      </div>

      <div className="space-y-4">
        {invoices.map(inv => (
          <Card key={inv.id} className="shadow-sm border-0">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg"><FileText className="w-6 h-6 text-muted-foreground" /></div>
                <div>
                  <p className="font-semibold">{inv.trip}</p>
                  <p className="text-sm text-muted-foreground">{inv.id} • {inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="font-bold">{inv.amount}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider">{inv.status}</p>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> PDF</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvoicesReceipts;
