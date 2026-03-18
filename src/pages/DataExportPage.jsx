
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const DataExportPage = () => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('json');
  const [selections, setSelections] = useState({
    trips: true,
    activities: true,
    expenses: true,
    photos: false,
    journals: true
  });

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Data export started. You will receive an email when it is ready.');
    }, 1500);
  };

  return (
    <>
      <Helmet><title>Export Data - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Your Data</h1>
          <p className="text-muted-foreground mt-1">Download a copy of your travel data for your records.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>New Export Request</CardTitle>
              <CardDescription>Select the data you want to include in your export archive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Data Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selections).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id={key} 
                        checked={value} 
                        onCheckedChange={(c) => setSelections({...selections, [key]: c})} 
                      />
                      <Label htmlFor={key} className="flex-1 cursor-pointer capitalize">{key}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label>Export Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json"><div className="flex items-center"><FileJson className="w-4 h-4 mr-2"/> JSON (Machine readable)</div></SelectItem>
                    <SelectItem value="csv"><div className="flex items-center"><FileText className="w-4 h-4 mr-2"/> CSV (Spreadsheet)</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t p-6 flex justify-between">
              <p className="text-sm text-muted-foreground">Estimated size: ~2.4 MB</p>
              <Button onClick={handleExport} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Request Export
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/> Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Exports containing photos may take up to 24 hours to process. Text-only exports usually complete within minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Export History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Requested</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Oct 10, 2025</TableCell>
                  <TableCell><Badge variant="outline">JSON</Badge></TableCell>
                  <TableCell>1.8 MB</TableCell>
                  <TableCell><span className="text-green-600 text-sm font-medium">Ready</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default DataExportPage;
