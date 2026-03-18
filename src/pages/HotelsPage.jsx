
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Hotel, Plus, Trash2, MapPin, Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const HotelsPage = () => {
  const { tripId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHotel, setNewHotel] = useState({ name: '', check_in: '', check_out: '', cost: '', rating: '' });

  useEffect(() => {
    fetchHotels();
  }, [tripId]);

  const fetchHotels = async () => {
    try {
      const records = await pb.collection('hotels').getList(1, 50, {
        filter: `trip_id = "${tripId}"`,
        $autoCancel: false,
      });
      setHotels(records.items);
    } catch (error) {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('hotels').create({
        ...newHotel,
        trip_id: tripId,
        cost: Number(newHotel.cost) || 0,
        rating: Number(newHotel.rating) || 0
      }, { $autoCancel: false });
      setHotels([...hotels, record]);
      setNewHotel({ name: '', check_in: '', check_out: '', cost: '', rating: '' });
      toast.success('Hotel added');
    } catch (error) {
      toast.error('Failed to add hotel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await pb.collection('hotels').delete(id, { $autoCancel: false });
      setHotels(hotels.filter(h => h.id !== id));
      toast.success('Hotel deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const totalCost = hotels.reduce((sum, h) => sum + (h.cost || 0), 0);

  return (
    <>
      <Helmet><title>Hotels - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Hotel className="w-8 h-8 text-primary"/> Hotels</h1>
          <div className="text-xl font-semibold">Total: ${totalCost.toLocaleString()}</div>
        </div>

        <Card>
          <CardHeader><CardTitle>Add Hotel</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newHotel.name} onChange={e => setNewHotel({...newHotel, name: e.target.value})} placeholder="Hotel name" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Check In</label>
                <Input type="date" value={newHotel.check_in} onChange={e => setNewHotel({...newHotel, check_in: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Check Out</label>
                <Input type="date" value={newHotel.check_out} onChange={e => setNewHotel({...newHotel, check_out: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Total Cost ($)</label>
                <Input type="number" value={newHotel.cost} onChange={e => setNewHotel({...newHotel, cost: e.target.value})} placeholder="0" />
              </div>
              <Button type="submit" className="md:col-span-5"><Plus className="w-4 h-4 mr-2"/> Add Hotel</Button>
            </form>
          </CardContent>
        </Card>

        {loading ? <Skeleton className="h-64 w-full" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border">No hotels booked yet.</div>
            ) : hotels.map(hotel => (
              <Card key={hotel.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{hotel.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2" onClick={() => handleDelete(hotel.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check In:</span>
                    <span className="font-medium">{hotel.check_in ? format(new Date(hotel.check_in), 'MMM d, yyyy') : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check Out:</span>
                    <span className="font-medium">{hotel.check_out ? format(new Date(hotel.check_out), 'MMM d, yyyy') : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium text-primary">${hotel.cost || 0}</span>
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

export default HotelsPage;
