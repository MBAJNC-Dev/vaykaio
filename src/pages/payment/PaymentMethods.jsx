
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

const PaymentMethods = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Payment Methods | Vacation Planner</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">Manage your saved cards and billing options.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Card</Button>
      </div>

      <div className="grid gap-4">
        <Card className="border-primary shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-semibold flex items-center gap-2">Visa ending in 4242 <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">Default</span></p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethods;
