
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const PhotoUploadPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return toast.error('Please select files to upload');
    
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('trip_id', tripId);
        formData.append('user_id', pb.authStore.model.id);
        await pb.collection('photos').create(formData, { $autoCancel: false });
      }
      toast.success('Photos uploaded successfully!');
      navigate(`/trip/${tripId}/photos`);
    } catch (error) {
      toast.error('Failed to upload some photos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Helmet><title>Upload Photos - VaykAIo</title></Helmet>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Photos</h1>
          <p className="text-muted-foreground mt-1">Add memories to your gallery.</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/30 transition-colors relative">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <UploadCloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-1">Click or drag photos here</h3>
              <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP</p>
            </div>

            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Selected Files ({files.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {files.map((file, i) => (
                    <div key={i} className="bg-muted rounded-lg p-2 flex items-center gap-2 overflow-hidden">
                      <ImageIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      <span className="text-xs truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setFiles([])} disabled={uploading}>Clear</Button>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload All'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PhotoUploadPage;
