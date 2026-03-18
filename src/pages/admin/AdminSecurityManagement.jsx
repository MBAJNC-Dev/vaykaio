
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Key, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminSecurityManagement = () => {
  const handleSave = () => toast.success("Security settings updated");

  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Security Management | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Management</h1>
        <p className="text-muted-foreground">Configure authentication, access controls, and policies.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Authentication Policies</CardTitle>
            <CardDescription>Global settings for user login and sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Enforce Two-Factor Authentication (2FA)</Label>
                <p className="text-sm text-muted-foreground">Require all admin users to use 2FA.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Automatically log out inactive users.</p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue={30} className="w-20" />
                <span className="text-sm text-muted-foreground">mins</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> IP Whitelisting</CardTitle>
            <CardDescription>Restrict admin access to specific IP addresses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Allowed IP Addresses (Comma separated)</Label>
              <Input placeholder="e.g., 192.168.1.1, 10.0.0.0/24" />
            </div>
            <Button onClick={handleSave}>Save IP Rules</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurityManagement;
