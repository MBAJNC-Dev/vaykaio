
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Globe, History, HardDrive, AlertTriangle } from 'lucide-react';

const EnterpriseSecurityPage = () => {
  return (
    <>
      <Helmet><title>Security Settings - VaykAIo Enterprise</title></Helmet>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Compliance</h1>
          <p className="text-muted-foreground mt-1">Manage authentication, access controls, and audit logs.</p>
        </div>

        <Tabs defaultValue="sso" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8 h-auto p-1">
            <TabsTrigger value="sso" className="py-2.5"><Key className="w-4 h-4 mr-2"/> SSO & Auth</TabsTrigger>
            <TabsTrigger value="network" className="py-2.5"><Globe className="w-4 h-4 mr-2"/> Network</TabsTrigger>
            <TabsTrigger value="audit" className="py-2.5"><History className="w-4 h-4 mr-2"/> Audit Logs</TabsTrigger>
            <TabsTrigger value="access" className="py-2.5"><Shield className="w-4 h-4 mr-2"/> Access Logs</TabsTrigger>
            <TabsTrigger value="backup" className="py-2.5 hidden lg:flex"><HardDrive className="w-4 h-4 mr-2"/> Backups</TabsTrigger>
          </TabsList>

          <TabsContent value="sso" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Single Sign-On (SSO)</CardTitle>
                <CardDescription>Configure SAML or OAuth2 for your organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable SSO</Label>
                    <p className="text-sm text-muted-foreground">Require users to log in via your identity provider.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Identity Provider URL</Label>
                    <Input placeholder="https://login.microsoftonline.com/..." defaultValue="https://login.microsoftonline.com/e1234567-89ab-cdef-0123-456789abcdef/saml2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Client ID / Entity ID</Label>
                    <Input placeholder="Enter Client ID" defaultValue="vaykaio-enterprise-app" />
                  </div>
                  <div className="space-y-2">
                    <Label>X.509 Certificate</Label>
                    <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs" defaultValue="-----BEGIN CERTIFICATE-----\nMIIDdTCCAl2gAwIBAgILBAAAAAABRE7wQzANBgkqhkiG9w0BAQsFADBxMQswCQYD\nVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5j\n...\n-----END CERTIFICATE-----" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/10 p-6 flex justify-between">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enforce 2FA globally</Label>
                    <p className="text-sm text-muted-foreground">Require all enterprise users to set up two-factor authentication.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>Immutable record of administrative actions.</CardDescription>
                </div>
                <Button variant="outline" size="sm">Export CSV</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6">Timestamp</TableHead>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { time: '2025-10-15 14:32:01', user: 'admin@company.com', action: 'UPDATE_SSO_CONFIG', resource: 'Security Settings', ip: '192.168.1.105' },
                      { time: '2025-10-14 09:15:22', user: 'admin@company.com', action: 'DELETE_USER', resource: 'User: john.doe@company.com', ip: '192.168.1.105' },
                      { time: '2025-10-12 16:45:10', user: 'manager@company.com', action: 'CREATE_DEPARTMENT', resource: 'Dept: Customer Success', ip: '10.0.0.42' },
                    ].map((log, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6 text-sm text-muted-foreground font-mono">{log.time}</TableCell>
                        <TableCell className="text-sm font-medium">{log.user}</TableCell>
                        <TableCell className="text-sm"><Badge variant="outline" className="font-mono text-[10px]">{log.action}</Badge></TableCell>
                        <TableCell className="text-sm">{log.resource}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network">
            <Card className="shadow-sm p-12 text-center text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">IP Whitelisting</h3>
              <p>Restrict access to your enterprise portal to specific IP ranges.</p>
              <Button className="mt-6" variant="outline">Configure IP Rules</Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="access">
            <Card className="shadow-sm p-12 text-center text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Access Logs</h3>
              <p>View detailed login history for all team members.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup">
            <Card className="shadow-sm p-12 text-center text-muted-foreground">
              <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Data Backups</h3>
              <p>Configure automated daily backups to your own AWS S3 bucket.</p>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </>
  );
};

export default EnterpriseSecurityPage;
