
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ActivityLibraryPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [newActivity, setNewActivity] = useState({ name: '', destination: '', category: 'adventure', cost: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const records = await pb.collection('activity_library').getList(1, 100, {
        sort: '-created',
        $autoCancel: false,
      });
      setActivities(records.items);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newActivity.name);
      formData.append('destination', newActivity.destination);
      formData.append('category', newActivity.category);
      formData.append('cost', Number(newActivity.cost) || 0);
      formData.append('description', newActivity.description);
      if (imageFile) formData.append('image', imageFile);

      const record = await pb.collection('activity_library').create(formData, { $autoCancel: false });
      setActivities([record, ...activities]);
      setNewActivity({ name: '', destination: '', category: 'adventure', cost: '', description: '' });
      setImageFile(null);
      toast.success('Activity added to library');
    } catch (error) {
      toast.error('Failed to add activity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity from the library?')) return;
    try {
      await pb.collection('activity_library').delete(id, { $autoCancel: false });
      setActivities(activities.filter(a => a.id !== id));
      toast.success('Activity deleted');
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const filtered = activities.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Activity Library - Admin - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Activity Library</h1>
          <Badge variant="secondary" className="text-sm">Total: {activities.length}</Badge>
        </div>

        <Card>
          <CardHeader><CardTitle>Add New Activity</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              <div className="space-y-1 lg:col-span-2">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} placeholder="Activity name" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Destination</label>
                <Input required value={newActivity.destination} onChange={e => setNewActivity({...newActivity, destination: e.target.value})} placeholder="City/Country" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Select value={newActivity.category} onValueChange={v => setNewActivity({...newActivity, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cost ($)</label>
                <Input type="number" value={newActivity.cost} onChange={e => setNewActivity({...newActivity, cost: e.target.value})} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Image</label>
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="space-y-1 lg:col-span-5">
                <label className="text-sm font-medium">Description</label>
                <Input value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} placeholder="Short description" />
              </div>
              <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Library</CardTitle>
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-96 w-full" /> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No activities found.</TableCell></TableRow>
                    ) : filtered.map(activity => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          {activity.image ? (
                            <img src={pb.files.getUrl(activity, activity.image)} alt={activity.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>{activity.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{activity.description}</div>
                        </TableCell>
                        <TableCell>{activity.destination}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{activity.category}</Badge></TableCell>
                        <TableCell>${activity.cost || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ActivityLibraryPage;
