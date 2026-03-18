
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Paintbrush, Upload, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';

const EnterpriseCustomBrandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState({
    companyName: 'Acme Corp',
    primaryColor: '#0ea5e9',
    portalName: 'Acme Travel Portal'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Branding settings saved successfully');
    }, 1000);
  };

  return (
    <>
      <Helmet><title>Custom Branding - VaykAIo Enterprise</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Branding</h1>
            <p className="text-muted-foreground mt-1">Personalize the platform to match your corporate identity.</p>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Paintbrush className="w-5 h-5 text-primary"/> Visual Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input 
                      value={branding.companyName} 
                      onChange={e => setBranding({...branding, companyName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Portal Name</Label>
                    <Input 
                      value={branding.portalName} 
                      onChange={e => setBranding({...branding, portalName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label>Brand Colors</Label>
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={branding.primaryColor} 
                          onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                          className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-sm font-mono">{branding.primaryColor}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Primary Accent</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label>Logos & Assets</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload Main Logo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG or SVG, max 2MB</p>
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload Favicon</p>
                      <p className="text-xs text-muted-foreground mt-1">ICO or PNG, 32x32px</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Customize automated emails sent to your team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sender Name</Label>
                  <Input defaultValue="Acme Travel Team" />
                </div>
                <div className="space-y-2">
                  <Label>Custom Footer Text</Label>
                  <Textarea defaultValue="© 2025 Acme Corp. Internal use only." className="resize-none" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Eye className="w-4 h-4"/> Live Preview</h3>
              
              {/* Mock App Preview */}
              <div className="border rounded-2xl overflow-hidden shadow-xl bg-background">
                {/* Mock Header */}
                <div className="h-14 border-b flex items-center px-4 justify-between" style={{ borderBottomColor: `${branding.primaryColor}20` }}>
                  <div className="font-bold text-lg" style={{ color: branding.primaryColor }}>{branding.companyName}</div>
                  <div className="w-8 h-8 rounded-full bg-muted"></div>
                </div>
                {/* Mock Sidebar & Content */}
                <div className="flex h-64">
                  <div className="w-1/3 border-r p-4 space-y-3 bg-muted/10">
                    <div className="h-2 w-3/4 rounded bg-muted"></div>
                    <div className="h-2 w-1/2 rounded bg-muted"></div>
                    <div className="h-2 w-2/3 rounded bg-muted"></div>
                  </div>
                  <div className="w-2/3 p-4 space-y-4">
                    <div className="h-4 w-1/2 rounded font-bold" style={{ color: branding.primaryColor }}>{branding.portalName}</div>
                    <div className="h-20 rounded-xl opacity-20" style={{ backgroundColor: branding.primaryColor }}></div>
                    <div className="h-8 rounded-lg w-1/2 text-white flex items-center justify-center text-xs font-medium" style={{ backgroundColor: branding.primaryColor }}>
                      Primary Button
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Changes will apply to all users in your enterprise tenant.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default EnterpriseCustomBrandingPage;
