import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const AdminFeatureFlags = () => {
  const [flags, setFlags] = useState([
    {
      id: 'ai_agents',
      name: 'AI Agents',
      description: 'Enable AI-powered itinerary suggestions and recommendations',
      status: true,
      rollout: 100,
      affectedUsers: 1248,
      createdAt: '2024-01-15'
    },
    {
      id: 'group_voting',
      name: 'Group Voting',
      description: 'Allow group members to vote on activities and destinations',
      status: true,
      rollout: 85,
      affectedUsers: 1060,
      createdAt: '2024-02-01'
    },
    {
      id: 'photo_ai_tagging',
      name: 'Photo AI Tagging',
      description: 'Automatic location and object tagging for trip photos',
      status: true,
      rollout: 60,
      affectedUsers: 748,
      createdAt: '2024-02-15'
    },
    {
      id: 'memory_timeline',
      name: 'Memory Timeline',
      description: 'View trip memories organized in an interactive timeline',
      status: true,
      rollout: 40,
      affectedUsers: 499,
      createdAt: '2024-03-01'
    },
    {
      id: 'budget_optimization',
      name: 'Budget Optimization',
      description: 'AI-powered budget planning and cost optimization',
      status: false,
      rollout: 20,
      affectedUsers: 249,
      createdAt: '2024-03-10'
    },
    {
      id: 'offline_mode',
      name: 'Offline Mode',
      description: 'Access trip information without internet connection',
      status: false,
      rollout: 10,
      affectedUsers: 124,
      createdAt: '2024-03-15'
    },
    {
      id: 'voice_input',
      name: 'Voice Input',
      description: 'Add activities and notes using voice commands',
      status: false,
      rollout: 5,
      affectedUsers: 62,
      createdAt: '2024-04-01'
    },
    {
      id: 'calendar_sync',
      name: 'Calendar Sync',
      description: 'Sync trip itinerary with Google Calendar and Outlook',
      status: true,
      rollout: 75,
      affectedUsers: 936,
      createdAt: '2024-04-05'
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rollout: 0
  });

  const handleToggleFlag = (flagId) => {
    setFlags(flags.map(f => 
      f.id === flagId ? { ...f, status: !f.status } : f
    ));
    toast.success('Flag status updated');
  };

  const handleUpdateRollout = (flagId, rollout) => {
    setFlags(flags.map(f => {
      if (f.id === flagId) {
        const affectedUsers = Math.round(1248 * (rollout / 100));
        return { ...f, rollout, affectedUsers };
      }
      return f;
    }));
    toast.success('Rollout percentage updated');
  };

  const handleCreateFlag = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const newFlag = {
      id: formData.name.toLowerCase().replace(/\s+/g, '_'),
      name: formData.name,
      description: formData.description,
      status: true,
      rollout: formData.rollout || 50,
      affectedUsers: Math.round(1248 * ((formData.rollout || 50) / 100)),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFlags([...flags, newFlag]);
    setShowCreateDialog(false);
    setFormData({ name: '', description: '', rollout: 0 });
    toast.success('Feature flag created');
  };

  const handleEditFlag = (flag) => {
    setSelectedFlag(flag);
    setFormData({
      name: flag.name,
      description: flag.description,
      rollout: flag.rollout
    });
    setShowEditDialog(true);
  };

  const handleUpdateFlag = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    setFlags(flags.map(f =>
      f.id === selectedFlag.id
        ? {
            ...f,
            name: formData.name,
            description: formData.description,
            rollout: formData.rollout,
            affectedUsers: Math.round(1248 * (formData.rollout / 100))
          }
        : f
    ));
    setShowEditDialog(false);
    setSelectedFlag(null);
    setFormData({ name: '', description: '', rollout: 0 });
    toast.success('Feature flag updated');
  };

  const handleDeleteFlag = (flagId) => {
    if (!window.confirm('Are you sure you want to delete this flag?')) return;
    setFlags(flags.filter(f => f.id !== flagId));
    toast.success('Feature flag deleted');
  };

  return (
    <>
      <Helmet>
        <title>Feature Flags - VaykAIo Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Feature Flags</h1>
            <p className="text-muted-foreground">Control feature rollout and A/B testing</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Flag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Feature Flag</DialogTitle>
                <DialogDescription>Create a new feature flag to control feature rollout</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Flag Name</Label>
                  <Input
                    placeholder="e.g., AI Recommendations"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe what this flag controls..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 min-h-20"
                  />
                </div>
                <div>
                  <Label>Initial Rollout %</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[formData.rollout]}
                      onValueChange={(value) => setFormData({ ...formData, rollout: value[0] })}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{formData.rollout}%</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleCreateFlag}>Create Flag</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feature Flags Grid */}
        <div className="grid grid-cols-1 gap-4">
          {flags.map((flag) => (
            <Card key={flag.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{flag.name}</h3>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={flag.status}
                          onCheckedChange={() => handleToggleFlag(flag.id)}
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                          {flag.status ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{flag.description}</p>

                    {/* Rollout Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Rollout Percentage</Label>
                        <span className="text-sm font-medium">{flag.rollout}%</span>
                      </div>
                      <Slider
                        value={[flag.rollout]}
                        onValueChange={(value) => handleUpdateRollout(flag.id, value[0])}
                        max={100}
                        step={5}
                        disabled={!flag.status}
                      />
                    </div>

                    {/* Affected Users */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {flag.affectedUsers.toLocaleString()} users affected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Created: {flag.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Dialog open={showEditDialog && selectedFlag?.id === flag.id} onOpenChange={setShowEditDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFlag(flag)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Feature Flag</DialogTitle>
                          <DialogDescription>Update flag details and settings</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Flag Name</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="mt-1 min-h-20"
                            />
                          </div>
                          <div>
                            <Label>Rollout %</Label>
                            <div className="flex items-center gap-4 mt-2">
                              <Slider
                                value={[formData.rollout]}
                                onValueChange={(value) => setFormData({ ...formData, rollout: value[0] })}
                                max={100}
                                step={5}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium w-12">{formData.rollout}%</span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                          <Button onClick={handleUpdateFlag}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteFlag(flag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Flags Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Flags</p>
                <p className="text-2xl font-bold">{flags.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enabled</p>
                <p className="text-2xl font-bold">{flags.filter(f => f.status).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rollout</p>
                <p className="text-2xl font-bold">
                  {Math.round(flags.reduce((sum, f) => sum + f.rollout, 0) / flags.length)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {flags.reduce((sum, f) => sum + f.affectedUsers, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminFeatureFlags;
