
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DataDeletionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Account deletion requested. You will be logged out.');
      navigate('/');
    }, 2000);
  };

  return (
    <>
      <Helmet><title>Delete Account - VaykAIo</title></Helmet>
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Delete Account & Data</h1>
          <p className="text-muted-foreground">This action is permanent and cannot be undone.</p>
        </div>

        <Card className="border-destructive shadow-sm">
          <CardHeader className="bg-destructive/5 border-b border-destructive/20">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="font-medium">If you delete your account, the following will happen immediately:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>All your trips, itineraries, and expenses will be permanently deleted.</li>
              <li>All uploaded photos and journal entries will be erased.</li>
              <li>Your active subscription will be cancelled immediately without refund.</li>
              <li>Any shared trips will no longer be accessible to your collaborators.</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-lg mt-6">
              <p className="text-sm font-medium mb-2">Want to keep your data but stop paying?</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings/subscription/cancel')}>
                Cancel Subscription Instead
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>To confirm deletion, type "DELETE" below:</Label>
              <Input 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)} 
                placeholder="DELETE" 
                className="font-mono"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-6 flex justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading || confirmText !== 'DELETE'}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Permanently Delete Account
            </Button>
          </CardFooter>
        </Card>

      </div>
    </>
  );
};

export default DataDeletionPage;
