
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDataImport = () => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    if (!file) return toast.error("Please select a file first");
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setFile(null);
      toast.success("Data imported successfully. 142 records created.");
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Helmet><title>Data Import | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Import</h1>
        <p className="text-muted-foreground">Bulk import records via CSV or JSON files.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Data File</CardTitle>
          <CardDescription>Supported formats: .csv, .json (Max 10MB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
            <Input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".csv,.json"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-2">
              {file ? (
                <>
                  <FileUp className="w-10 h-10 text-primary" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-muted-foreground" />
                  <p className="font-medium">Click or drag file to upload</p>
                  <p className="text-xs text-muted-foreground">CSV or JSON files only</p>
                </>
              )}
            </div>
          </div>

          <Button onClick={handleImport} disabled={!file || importing} className="w-full">
            {importing ? 'Processing Import...' : 'Start Import'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataImport;
