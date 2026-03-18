
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, Train, Bus, Car, Ship, Plus, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TransportationPage = () => {
  const { tripId } = useParams();
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLeg, setNewLeg] = useState({ from_location: '', to_location: '', method: 'flight', date: '', cost: '' });

  useEffect(() => {
    fetchTransport();
  }, [tripId]);

  const fetchTransport = async () => {
    try {
      const records = await pb.collection('transportation').getList(1, 50, {
        filter: `trip_id = "${tripId}"`,
        sort: 'date',
        $autoCancel: false,
      });
      setTransport(records.items);
    } catch (error) {
      toast.error('Failed to load transportation');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('transportation').create({
        ...newLeg,
        trip_id: tripId,
        cost: Number(newLeg.cost) || 0
      }, { $autoCancel: false });
      setTransport([...transport, record].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setNewLeg({ from_location: '', to_location: '', method: 'flight', date: '', cost: '' });
      toast.success('Transport added');
    } catch (error) {
      toast.error('Failed to add transport');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transport leg?')) return;
    try {
      await pb.collection('transportation').delete(id, { $autoCancel: false });
      setTransport(transport.filter(t => t.id !== id));
      toast.success('Transport deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (method) => {
    switch(method) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'ferry': return <Ship className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const totalCost = transport.reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
    <>
      <Helmet><title>Transportation - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><Plane className="w-8 h-8 text-primary"/> Transportation</h1>
          <div className="text-xl font-semibold">Total: ${totalCost.toLocaleString()}</div>
        </div>

        <Card>
          <CardHeader><CardTitle>Add Transport Leg</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-sm font-medium">From</label>
                <Input required value={newLeg.from_location} onChange={e => setNewLeg({...newLeg, from_location: e.target.value})} placeholder="City/Airport" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">To</label>
                <Input required value={newLeg.to_location} onChange={e => setNewLeg({...newLeg, to_location: e.target.value})} placeholder="City/Airport" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Method</label>
                <Select value={newLeg.method} onValueChange={v => setNewLeg({...newLeg, method: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="ferry">Ferry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={newLeg.date} onChange={e => setNewLeg({...newLeg, date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cost ($)</label>
                <Input type="number" value={newLeg.cost} onChange={e => setNewLeg({...newLeg, cost: e.target.value})} placeholder="0" />
              </div>
              <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? <Skeleton className="h-64 w-full m-6" /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transport.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No transportation added.</TableCell></TableRow>
                  ) : transport.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date ? format(new Date(t.date), 'MMM d, yyyy') : '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 capitalize">
                          {getIcon(t.method)} {t.method}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{t.from_location} → {t.to_location}</TableCell>
                      <TableCell className="text-right">${t.cost || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransportationPage;
