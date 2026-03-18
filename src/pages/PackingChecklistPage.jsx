
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Plus, Trash2, Briefcase } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const PackingChecklistPage = () => {
  const { tripId } = useParams();
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('clothing');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const categories = ['clothing', 'toiletries', 'documents', 'electronics', 'other'];

  useEffect(() => {
    fetchItems();
  }, [tripId]);

  const fetchItems = async () => {
    try {
      const records = await pb.collection('packing_checklist').getFullList({
        filter: `trip_id = "${tripId}"`,
        sort: 'created',
        $autoCancel: false
      });
      setItems(records);
    } catch (error) {
      toast.error('Failed to load packing list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setAdding(true);
    try {
      const record = await pb.collection('packing_checklist').create({
        trip_id: tripId,
        item: newItemName,
        category: newItemCategory,
        checked: false
      }, { $autoCancel: false });
      
      setItems(prev => [...prev, record]);
      setNewItemName('');
      toast.success('Item added');
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleCheck = async (id, currentStatus) => {
    // Optimistic update
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !currentStatus } : item));
    
    try {
      await pb.collection('packing_checklist').update(id, {
        checked: !currentStatus
      }, { $autoCancel: false });
    } catch (error) {
      // Revert on failure
      setItems(prev => prev.map(item => item.id === id ? { ...item, checked: currentStatus } : item));
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('packing_checklist').delete(id, { $autoCancel: false });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(item => item.category === cat);
    return acc;
  }, {});

  const completedCount = items.filter(i => i.checked).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Packing Checklist - VaykAIo</title></Helmet>
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/trip/${tripId}`}><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Packing Checklist</h1>
            <p className="text-muted-foreground mt-1">Keep track of everything you need to bring.</p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-end mb-2">
              <div className="text-sm font-medium">Packing Progress</div>
              <div className="text-2xl font-bold text-primary">{progress}%</div>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-sm text-muted-foreground mt-2">
              {completedCount} of {items.length} items packed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Add a new item..." 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1"
              />
              <select 
                className="flex h-10 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <Button type="submit" disabled={adding || !newItemName.trim()}>
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-dashed">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">Your checklist is empty</h3>
            <p className="text-muted-foreground">Add items above to start packing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(category => {
              const categoryItems = groupedItems[category];
              if (categoryItems.length === 0) return null;
              
              return (
                <Card key={category} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize flex items-center justify-between">
                      {category}
                      <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {categoryItems.filter(i => i.checked).length}/{categoryItems.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id={`item-${item.id}`} 
                              checked={item.checked}
                              onCheckedChange={() => handleToggleCheck(item.id, item.checked)}
                            />
                            <label 
                              htmlFor={`item-${item.id}`}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer transition-all ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {item.item}
                            </label>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PackingChecklistPage;
