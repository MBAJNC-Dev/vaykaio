
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Wand2, RotateCcw, Undo } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const PhotoEditorPage = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const record = await pb.collection('photos').getOne(photoId, { $autoCancel: false });
        setPhoto(record);
      } catch (error) {
        toast.error('Photo not found');
        navigate('/gallery');
      } finally {
        setLoading(false);
      }
    };
    if (photoId) fetchPhoto();
  }, [photoId, navigate]);

  const handleSave = async () => {
    toast.success('Edits saved successfully');
    // In production: save parameters to photo_edits collection
  };

  const handleAutoEnhance = () => {
    setBrightness([110]);
    setContrast([115]);
    setSaturation([120]);
    toast.info('AI Auto-enhance applied');
  };

  const handleReset = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!photo) return null;

  const imageUrl = pb.files.getUrl(photo, photo.file);
  const filterStyle = {
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Photo Editor | VaykAIo</title></Helmet>

      {/* Topbar */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}><Undo className="w-4 h-4 mr-2" /> Reset</Button>
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Copy</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-black/5 p-8 flex items-center justify-center overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Editing" 
            className="max-w-full max-h-full object-contain shadow-lg transition-all duration-200"
            style={filterStyle}
          />
        </div>

        {/* Tools Panel */}
        <div className="w-full md:w-80 bg-card border-l p-6 overflow-y-auto">
          <Button className="w-full mb-8 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAutoEnhance}>
            <Wand2 className="w-4 h-4 mr-2" /> AI Auto-Enhance
          </Button>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Brightness</Label>
                <span className="text-xs text-muted-foreground">{brightness[0]}%</span>
              </div>
              <Slider value={brightness} onValueChange={setBrightness} min={0} max={200} step={1} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Contrast</Label>
                <span className="text-xs text-muted-foreground">{contrast[0]}%</span>
              </div>
              <Slider value={contrast} onValueChange={setContrast} min={0} max={200} step={1} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Saturation</Label>
                <span className="text-xs text-muted-foreground">{saturation[0]}%</span>
              </div>
              <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} step={1} />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h4 className="font-medium mb-4">AI Metadata</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Tags: {photo.ai_tags?.join(', ') || 'None'}</p>
              <p>Location: {photo.location?.city || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditorPage;
