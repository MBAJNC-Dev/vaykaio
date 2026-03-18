
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, UserX } from 'lucide-react';

const AdminComplianceManagement = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Compliance | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance & Privacy</h1>
        <p className="text-muted-foreground">Manage GDPR/CCPA requests and data retention policies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserX className="w-5 h-5 text-destructive" /> Data Subject Requests</CardTitle>
            <CardDescription>Pending user requests for data deletion or export.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No pending requests.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Legal Documents</CardTitle>
            <CardDescription>Manage Terms of Service and Privacy Policy versions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Privacy Policy</p>
                <p className="text-xs text-muted-foreground">v2.1 • Updated Oct 2023</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Terms of Service</p>
                <p className="text-xs text-muted-foreground">v1.4 • Updated Jan 2023</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminComplianceManagement;
