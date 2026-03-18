
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const BookingChecklistPage = () => {
  const { tripId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ item: '', due_date: '' });

  useEffect(() => {
    fetchItems();
  }, [tripId]);

  const fetchItems = async () => {
    try {
      const records = await pb.collection('booking_checklist').getList(1, 100, {
        filter: `trip_id = "${tripId}"`,
        sort: 'created',
        $autoCancel: false,
      });
      setItems(records.items);
    } catch (error) {
      toast.error('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.item.trim()) return;
    try {
      const record = await pb.collection('booking_checklist').create({
        ...newItem,
        trip_id: tripId,
        status: 'pending'
      }, { $autoCancel: false });
      setItems([...items, record]);
      setNewItem({ item: '', due_date: '' });
      toast.success('Item added');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const record = await pb.collection('booking_checklist').update(id, { status: newStatus }, { $autoCancel: false });
      setItems(items.map(i => i.id === id ? record : i));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('booking_checklist').delete(id, { $autoCancel: false });
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <>
      <Helmet><title>Checklist - VaykAIo</title></Helmet>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><CheckSquare className="w-8 h-8 text-primary"/> Booking Checklist</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedCount} of {items.length} completed</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="flex gap-3">
              <Input className="flex-1" placeholder="What needs to be booked?" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
              <Input type="date" className="w-40" value={newItem.due_date} onChange={e => setNewItem({...newItem, due_date: e.target.value})} />
              <Button type="submit"><Plus className="w-4 h-4"/></Button>
            </form>
          </CardContent>
        </Card>

        {loading ? <Skeleton className="h-64 w-full" /> : (
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No items in checklist.</div>
            ) : items.map(item => (
              <Card key={item.id} className={`transition-colors ${item.status === 'completed' ? 'bg-muted/50' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Checkbox 
                    checked={item.status === 'completed'} 
                    onCheckedChange={() => toggleStatus(item.id, item.status)} 
                    className="w-5 h-5"
                  />
                  <div className={`flex-1 ${item.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    <p className="font-medium">{item.item}</p>
                    {item.due_date && <p className="text-xs text-muted-foreground">Due: {item.due_date}</p>}
                  </div>
                  <Badge variant={item.status === 'completed' ? 'secondary' : 'default'}>
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingChecklistPage;
