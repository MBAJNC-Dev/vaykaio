import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Tag,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import PhotoService from '@/services/PhotoService';
import exifr from 'exifr';

const PhotoUploadComponent = ({ tripId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: Math.random(),
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ''),
        day: null,
        location: null,
        tags: []
      }
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10485760
  });

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const updateFileMetadata = (id, field, value) => {
    setFiles(files.map(f =>
      f.id === id
        ? { ...f, metadata: { ...f.metadata, [field]: value } }
        : f
    ));
  };

  const extractExifData = async (file) => {
    try {
      const exifData = await exifr.parse(file);
      return {
        date: exifData?.DateTimeOriginal || exifData?.DateTime,
        lat: exifData?.latitude,
        lng: exifData?.longitude,
        camera: exifData?.Make ? `${exifData.Make} ${exifData.Model}`.trim() : null
      };
    } catch (e) {
      console.warn('No EXIF data found', e);
      return null;
    }
  };

  const detectTripDay = (photoDate, tripStartDate) => {
    if (!photoDate || !tripStartDate) return null;
    const start = new Date(tripStartDate);
    const diff = Math.floor((photoDate - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1);
  };

  const processAndUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status === 'success') continue;

      try {
        updateFileMetadata(file.id, 'status', { ...file, status: 'analyzing', progress: 20 });

        // 1. Extract EXIF data
        const exifData = await extractExifData(file);
        if (exifData?.date && !file.metadata.day) {
          const trip = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
          const detectedDay = detectTripDay(exifData.date, trip.check_in_date);
          updateFileMetadata(file.id, 'day', detectedDay);
        }

        updateFile(file.id, { progress: 40 });

        // 2. Prepare upload data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('trip_id', tripId);
        formData.append('user_id', pb.authStore.model?.id);
        formData.append('title', file.metadata.title);
        formData.append('day', file.metadata.day || null);

        if (exifData?.lat && exifData?.lng) {
          formData.append('location', JSON.stringify({
            lat: exifData.lat,
            lng: exifData.lng
          }));
        }

        if (file.metadata.tags.length > 0) {
          formData.append('tags', JSON.stringify(file.metadata.tags));
        }

        if (exifData?.camera) {
          formData.append('camera_info', exifData.camera);
        }

        // 3. Upload to PocketBase
        updateFile(file.id, { status: 'uploading', progress: 90 });
        await pb.collection('photos').create(formData, { $autoCancel: false });

        updateFile(file.id, { status: 'success', progress: 100 });
        successCount++;
      } catch (error) {
        console.error('Upload error for', file.name, error);
        updateFile(file.id, { status: 'error', progress: 0 });
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}`);
      if (onUploadComplete) onUploadComplete();
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== 'success'));
      }, 2000);
    }
  };

  const updateFile = (id, updates) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload Your Photos</h3>
        <p className="text-muted-foreground text-sm mb-2">Drag & drop images here or click to select</p>
        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP • Up to 10MB each</p>
      </div>

      {files.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Upload Queue</CardTitle>
                <CardDescription>{files.length} file{files.length > 1 ? 's' : ''} selected</CardDescription>
              </div>
              <Button
                onClick={processAndUpload}
                disabled={uploading || files.every(f => f.status === 'success')}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Upload All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors space-y-3"
              >
                {/* File Preview and Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={file.preview}
                      alt="preview"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {file.status === 'success' && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-1">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {file.status === 'analyzing' && (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Analyzing...
                        </Badge>
                      )}
                      {file.status === 'uploading' && (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Uploading...
                        </Badge>
                      )}
                      {file.status === 'success' && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Uploaded
                        </Badge>
                      )}
                      {file.status === 'error' && (
                        <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {(file.status === 'analyzing' || file.status === 'uploading') && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{file.progress}%</p>
                  </div>
                )}

                {/* Metadata Inputs */}
                {file.status === 'pending' && (
                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <Label htmlFor={`title-${file.id}`} className="text-xs">
                        Photo Title
                      </Label>
                      <Input
                        id={`title-${file.id}`}
                        value={file.metadata.title}
                        onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                        placeholder="What is this photo?"
                        className="text-sm mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`day-${file.id}`} className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Trip Day
                        </Label>
                        <Input
                          id={`day-${file.id}`}
                          type="number"
                          min="1"
                          value={file.metadata.day || ''}
                          onChange={(e) => updateFileMetadata(file.id, 'day', parseInt(e.target.value) || null)}
                          placeholder="1"
                          className="text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`location-${file.id}`} className="text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Location
                        </Label>
                        <Input
                          id={`location-${file.id}`}
                          value={file.metadata.location || ''}
                          onChange={(e) => updateFileMetadata(file.id, 'location', e.target.value)}
                          placeholder="City, landmark"
                          className="text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`tags-${file.id}`} className="text-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Tags
                      </Label>
                      <Input
                        id={`tags-${file.id}`}
                        value={file.metadata.tags.join(', ')}
                        onChange={(e) =>
                          updateFileMetadata(
                            file.id,
                            'tags',
                            e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          )
                        }
                        placeholder="nature, sunset, group (comma-separated)"
                        className="text-sm mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Summary */}
      {files.filter(f => f.status === 'success').length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                {files.filter(f => f.status === 'success').length} of {files.length} photos uploaded successfully!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoUploadComponent;
