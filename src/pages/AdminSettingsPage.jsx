
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, MapPin, Utensils, Map } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [prompts, setPrompts] = useState({
    itinerary_generator_prompt: '',
    ai_assistant_prompt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('admin_settings').getList(1, 50, { $autoCancel: false });
      setSettings(records.items);
      
      const newPrompts = { ...prompts };
      records.items.forEach(setting => {
        if (setting.setting_key === 'itinerary_generator_prompt') newPrompts.itinerary_generator_prompt = setting.setting_value;
        if (setting.setting_key === 'ai_assistant_prompt') newPrompts.ai_assistant_prompt = setting.setting_value;
      });
      setPrompts(newPrompts);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const key of Object.keys(prompts)) {
        const existing = settings.find(s => s.setting_key === key);
        if (existing) {
          await pb.collection('admin_settings').update(existing.id, { setting_value: prompts[key] }, { $autoCancel: false });
        } else {
          await pb.collection('admin_settings').create({ setting_key: key, setting_value: prompts[key] }, { $autoCancel: false });
        }
      }
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>System Settings - Admin - VaykAIo</title></Helmet>
      <div className="space-y-8 max-w-5xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button onClick={handleSave} disabled={saving || loading}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>AI Prompt Configuration</CardTitle>
              <CardDescription>Configure the system prompts used by the AI models.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? <Skeleton className="h-32 w-full" /> : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Itinerary Generator Prompt</label>
                  <Textarea 
                    className="min-h-[150px] font-mono text-sm" 
                    value={prompts.itinerary_generator_prompt}
                    onChange={e => setPrompts({...prompts, itinerary_generator_prompt: e.target.value})}
                    placeholder="You are an expert travel planner..."
                  />
                  <p className="text-xs text-muted-foreground">Used when generating day-by-day itineraries.</p>
                </div>
              )}
              
              {loading ? <Skeleton className="h-32 w-full" /> : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Assistant Prompt</label>
                  <Textarea 
                    className="min-h-[150px] font-mono text-sm" 
                    value={prompts.ai_assistant_prompt}
                    onChange={e => setPrompts({...prompts, ai_assistant_prompt: e.target.value})}
                    placeholder="You are a helpful travel assistant..."
                  />
                  <p className="text-xs text-muted-foreground">Used for the interactive chat assistant.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Manage content libraries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/destination-library"><Map className="w-4 h-4 mr-2" /> Destination Library</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/activity-library"><MapPin className="w-4 h-4 mr-2" /> Activity Library</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/restaurant-library"><Utensils className="w-4 h-4 mr-2" /> Restaurant Library</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
