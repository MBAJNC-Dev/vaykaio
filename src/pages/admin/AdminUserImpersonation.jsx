
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserSquare2, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminUserImpersonation = () => {
  const [email, setEmail] = useState('');

  const handleImpersonate = () => {
    if (!email) return;
    toast.success(`Impersonation session started for ${email}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Helmet><title>User Impersonation | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Impersonation</h1>
        <p className="text-muted-foreground">Log in as a specific user for troubleshooting and support.</p>
      </div>

      <Card className="border-amber-500/50 shadow-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <UserSquare2 className="w-5 h-5" /> Start Impersonation Session
          </CardTitle>
          <CardDescription>
            Warning: All actions taken during this session will be logged and attributed to your admin account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter user email or ID..." 
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleImpersonate} variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
              Impersonate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserImpersonation;
