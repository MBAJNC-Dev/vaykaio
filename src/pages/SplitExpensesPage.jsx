
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SplitExpensesPage = () => {
  const { tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    const calculateSplits = async () => {
      try {
        setLoading(true);
        // Mocking split calculation logic
        setTimeout(() => {
          setSettlements([
            { from: 'Sarah', to: 'John', amount: 125.50, settled: false },
            { from: 'Emma', to: 'John', amount: 45.00, settled: true },
            { from: 'Sarah', to: 'Emma', amount: 30.00, settled: false },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to calculate splits');
        setLoading(false);
      }
    };
    calculateSplits();
  }, [tripId]);

  return (
    <>
      <Helmet><title>Split Expenses - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" /> Split Expenses
          </h1>
          <p className="text-muted-foreground mt-1">Who owes whom for the trip.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Settlement Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settlements.map((s, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${s.settled ? 'bg-muted/30 opacity-70' : 'bg-card'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-medium">
                      <span>{s.from}</span>
                      <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      <span>{s.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">${s.amount.toFixed(2)}</span>
                    {s.settled ? (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Settled</span>
                    ) : (
                      <Button size="sm" variant="outline">Mark Settled</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SplitExpensesPage;
