
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plus, Loader2, Navigation } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const PlaceCaptureFeature = () => {
  const { tripId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    notes: '',
    latitude: '',
    longitude: ''
  });

  // Only show if we are in a trip context
  if (!tripId) return null;

  const handleCaptureLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLocating(false);
          toast.success('Location captured!');
        },
        (error) => {
          setLocating(false);
          toast.error('Failed to get location. Please enter manually.');
        }
      );
    } else {
      setLocating(false);
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');

    setLoading(true);
    try {
      await pb.collection('places').create({
        trip_id: tripId,
        user_id: pb.authStore.model.id,
        name: formData.name,
        category: formData.category,
        notes: formData.notes,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        date_captured: new Date().toISOString()
      }, { $autoCancel: false });

      toast.success('Place captured successfully!');
      setOpen(false);
      setFormData({ name: '', category: 'other', notes: '', latitude: '', longitude: '' });
    } catch (error) {
      toast.error('Failed to capture place');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/25 hover:-translate-y-1 transition-all z-50"
        >
          <MapPin className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Capture Place
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Place Name</Label>
            <Input 
              placeholder="e.g., Hidden Gelato Shop" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant / Food</SelectItem>
                <SelectItem value="cafe">Cafe / Bakery</SelectItem>
                <SelectItem value="attraction">Attraction / Sight</SelectItem>
                <SelectItem value="shop">Shop / Store</SelectItem>
                <SelectItem value="hotel">Accommodation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Location (Coordinates)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={handleCaptureLocation} disabled={locating} className="h-8 text-xs">
                {locating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Navigation className="w-3 h-3 mr-1" />}
                Current Location
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Lat" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
              <Input placeholder="Lng" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              placeholder="What makes this place special?" 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="resize-none h-20"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Save Place
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceCaptureFeature;
