
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Upload, FileText, Trash2, Download, File } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TravelDocumentsPage = () => {
  const { tripId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('other');

  useEffect(() => {
    fetchDocuments();
  }, [tripId]);

  const fetchDocuments = async () => {
    try {
      const records = await pb.collection('travel_documents').getFullList({
        filter: `trip_id = "${tripId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setDocuments(records);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!docName) {
        // Auto-fill name from filename without extension
        setDocName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !docName) {
      toast.error('Please provide a file and a name');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('trip_id', tripId);
    formData.append('name', docName);
    formData.append('type', docType);
    formData.append('file', file);

    try {
      const record = await pb.collection('travel_documents').create(formData, { $autoCancel: false });
      setDocuments(prev => [record, ...prev]);
      setFile(null);
      setDocName('');
      setDocType('other');
      // Reset file input
      document.getElementById('file-upload').value = '';
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload document. Ensure it is under 20MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await pb.collection('travel_documents').delete(id, { $autoCancel: false });
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const getFileUrl = (record) => {
    return pb.files.getUrl(record, record.file);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Travel Documents - VaykAIo</title></Helmet>
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/trip/${tripId}`}><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Travel Documents</h1>
            <p className="text-muted-foreground mt-1">Securely store your tickets, visas, and reservations.</p>
          </div>
        </div>

        <Card className="bg-muted/30 border-dashed border-2">
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input id="file-upload" type="file" onChange={handleFileChange} className="cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Document Name</Label>
                  <Input id="doc-name" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g., Return Flight Tickets" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Type</Label>
                  <select 
                    id="doc-type"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="passport">Passport/ID</option>
                    <option value="visa">Visa</option>
                    <option value="booking">Booking/Ticket</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={uploading || !file || !docName}>
                  {uploading ? 'Uploading...' : <><Upload className="w-4 h-4 mr-2" /> Upload Document</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {documents.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No documents uploaded</h3>
            <p className="text-muted-foreground">Upload your first document to keep it safe and accessible.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base truncate" title={doc.name}>{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted capitalize">
                        {doc.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.created), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="secondary" className="w-full" asChild>
                        <a href={getFileUrl(doc)} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" /> View
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" className="px-2 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TravelDocumentsPage;
