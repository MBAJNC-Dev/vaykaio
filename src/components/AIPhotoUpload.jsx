
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { AIRecognitionService } from '@/services/AIRecognitionService';
import exifr from 'exifr';

const AIPhotoUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      status: 'pending', // pending, analyzing, uploading, success, error
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10485760 // 10MB
  });

  const removeFile = (name) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const processAndUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status === 'success') continue;

      try {
        // 1. Update status
        updateFileState(file.name, { status: 'analyzing', progress: 20 });

        // 2. Extract EXIF locally
        let exifData = null;
        try {
          exifData = await exifr.parse(file);
        } catch (e) {
          console.warn('No EXIF found', e);
        }
        updateFileState(file.name, { progress: 40 });

        // 3. AI Analysis via Backend
        const aiResult = await AIRecognitionService.analyzePhoto(file);
        updateFileState(file.name, { progress: 70 });

        // 4. Prepare PocketBase payload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', pb.authStore.model?.id);
        
        if (aiResult?.analyses?.labels?.labels) {
          const tags = aiResult.analyses.labels.labels.map(l => l.name);
          formData.append('ai_tags', JSON.stringify(tags));
        }
        
        if (aiResult?.analyses?.quality?.overallQuality) {
          formData.append('quality_score', aiResult.analyses.quality.overallQuality);
        }

        if (exifData) {
          formData.append('exif_metadata', JSON.stringify(exifData));
          if (exifData.latitude && exifData.longitude) {
            formData.append('location', JSON.stringify({
              lat: exifData.latitude,
              lng: exifData.longitude
            }));
          }
        }

        // 5. Upload to PocketBase
        updateFileState(file.name, { status: 'uploading', progress: 90 });
        await pb.collection('photos').create(formData, { $autoCancel: false });
        
        updateFileState(file.name, { status: 'success', progress: 100 });
        successCount++;

      } catch (error) {
        console.error('Upload error for', file.name, error);
        updateFileState(file.name, { status: 'error', progress: 0 });
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} photos`);
      if (onUploadComplete) onUploadComplete();
      // Clear successful files after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== 'success'));
      }, 2000);
    }
  };

  const updateFileState = (name, updates) => {
    setFiles(prev => prev.map(f => f.name === name ? { ...f, ...updates } : f));
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Drag & drop photos here</h3>
        <p className="text-muted-foreground text-sm">or click to select files (JPEG, PNG, WebP up to 10MB)</p>
      </div>

      {files.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Upload Queue ({files.length})</h4>
            <Button onClick={processAndUpload} disabled={uploading || files.every(f => f.status === 'success')}>
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Upload All'}
            </Button>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                <img src={file.preview} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={file.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {file.status === 'analyzing' ? 'AI...' : `${file.progress}%`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {file.status === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
                  {file.status === 'pending' && (
                    <button onClick={() => removeFile(file.name)} className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPhotoUpload;
