
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

const AdminDataExport = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast.success("Data export completed successfully. Download starting...");
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Helmet><title>Data Export | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
        <p className="text-muted-foreground">Export system data for external analysis or backup.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Select the data source and format for your export.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select defaultValue="users">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users Collection</SelectItem>
                <SelectItem value="plans">Travel Plans</SelectItem>
                <SelectItem value="bookings">Bookings & Transactions</SelectItem>
                <SelectItem value="audit">Audit Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary bg-primary/5 border-primary">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-sm">CSV</p>
                  <p className="text-xs text-muted-foreground">For Excel/Sheets</p>
                </div>
              </div>
              <div className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary">
                <FileJson className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="font-medium text-sm">JSON</p>
                  <p className="text-xs text-muted-foreground">For APIs/Developers</p>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleExport} disabled={exporting} className="w-full">
            {exporting ? 'Processing Export...' : <><Download className="w-4 h-4 mr-2" /> Generate Export</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataExport;
