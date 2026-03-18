import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Settings,
  ArrowLeft,
  UserPlus,
  MessageCircle,
  BarChart3,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import GroupService from '@/services/GroupService';
import GroupMemberManagement from '@/components/GroupMemberManagement.jsx';
import GroupBudgetTracking from '@/components/GroupBudgetTracking.jsx';
import GroupVoting from '@/components/GroupVoting.jsx';
import GroupMessaging from '@/components/GroupMessaging.jsx';

const GroupTravelDashboard = () => {
  const navigate = useNavigate();
  const [groupPlan, setGroupPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [calendar, setCalendar] = useState({});
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchGroupPlan();
  }, []);

  const fetchGroupPlan = async () => {
    try {
      const records = await pb.collection('GroupTravelPlans').getList(1, 1, {
        filter: `user_id = "${pb.authStore.model?.id}"`,
        sort: '-created',
        $autoCancel: false
      });

      if (records.items.length > 0) {
        const plan = records.items[0];
        setGroupPlan(plan);
        await fetchGroupData(plan.id);
      } else {
        // Mock data for demo
        const mockPlan = {
          id: 'mock-group-1',
          group_name: 'Summer Reunion 2026',
          trip_destination: 'Tuscany, Italy',
          check_in_date: '2026-07-10',
          check_out_date: '2026-07-20',
          group_size: 12,
          total_budget: 15000,
          status: 'planning'
        };
        setGroupPlan(mockPlan);
        await fetchGroupData(mockPlan.id);
      }
    } catch (error) {
      console.error("Error fetching group plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupData = async (tripId) => {
    try {
      // Fetch members
      const membersData = await GroupService.getGroupMembers(tripId);
      setMembers(membersData.length > 0 ? membersData : getMockMembers());

      // Fetch conflicts
      const conflictsData = await GroupService.detectConflicts(tripId);
      setConflicts(conflictsData);

      // Fetch calendar
      const calendarData = await GroupService.getGroupCalendar(tripId);
      setCalendar(calendarData);
    } catch (error) {
      console.error("Error fetching group data:", error);
      // Load mock data on error
      setMembers(getMockMembers());
      setConflicts([]);
    }
  };

  const getMockMembers = () => [
    { id: '1', name: 'You', email: 'you@example.com', role: 'planner', status: 'active', avatar: 'Y' },
    { id: '2', name: 'Sarah', email: 'sarah@example.com', role: 'editor', status: 'active', avatar: 'S' },
    { id: '3', name: 'Mike', email: 'mike@example.com', role: 'editor', status: 'online', avatar: 'M' },
    { id: '4', name: 'Emma', email: 'emma@example.com', role: 'viewer', status: 'offline', avatar: 'E' }
  ];

  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      await GroupService.addMember(groupPlan.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('editor');
      setShowInviteDialog(false);
      await fetchGroupData(groupPlan.id);
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/trip/${groupPlan.id}/invite`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleColor = (role) => {
    const colors = {
      planner: 'bg-purple-100 text-purple-800',
      editor: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
      companion: 'bg-green-100 text-green-800'
    };
    return colors[role] || colors.viewer;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      online: 'bg-green-500',
      active: 'bg-blue-500',
      offline: 'bg-gray-400',
      invited: 'bg-yellow-500'
    };
    return statuses[status] || statuses.offline;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!groupPlan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No group plan found</h2>
        <Button onClick={() => navigate('/ai-planner/search')}>Create a Group Trip</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-24">
      <Helmet><title>{groupPlan.group_name} | VaykAIo Group Dashboard</title></Helmet>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 mb-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">{groupPlan.group_name}</h1>
              <Badge variant="secondary" className="capitalize text-lg px-3 py-1">
                {groupPlan.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex flex-col md:flex-row md:items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {groupPlan.trip_destination}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(groupPlan.check_in_date).toLocaleDateString()} - {new Date(groupPlan.check_out_date).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Button onClick={() => navigate('/ai-planner/chat')}>
              Ask AI Assistant
            </Button>
          </div>
        </div>

        {/* Alerts Section */}
        {conflicts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Schedule Conflicts Detected</h3>
                <p className="text-sm text-yellow-800">
                  {conflicts.length} scheduling conflict{conflicts.length > 1 ? 's' : ''} found between members.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 mb-8 h-auto p-1 bg-muted">
            <TabsTrigger value="overview" className="py-2.5">Overview</TabsTrigger>
            <TabsTrigger value="members" className="py-2.5">Members</TabsTrigger>
            <TabsTrigger value="calendar" className="py-2.5">Calendar</TabsTrigger>
            <TabsTrigger value="voting" className="py-2.5">Votes</TabsTrigger>
            <TabsTrigger value="chat" className="py-2.5">Chat</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trip Summary Card */}
              <Card className="md:col-span-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle>Trip Summary</CardTitle>
                  <CardDescription>Overview of your group trip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Your group trip is currently in the {groupPlan.status} phase. Use the tabs to manage members, coordinate activities, and track expenses.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Members</div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        {members.length}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Total Budget</div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        {groupPlan.total_budget?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Trip Days</div>
                      <div className="text-2xl font-bold">
                        {Math.ceil((new Date(groupPlan.check_out_date) - new Date(groupPlan.check_in_date)) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Per Person</div>
                      <div className="text-2xl font-bold">
                        ${Math.round(groupPlan.total_budget / members.length)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite a Member</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleInviteMember} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Email Address</label>
                          <Input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="friend@example.com"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                          >
                            <option value="planner">Planner (Full Access)</option>
                            <option value="editor">Editor (Can edit activities)</option>
                            <option value="viewer">Viewer (Read-only)</option>
                            <option value="companion">Companion (Limited)</option>
                          </select>
                        </div>
                        <Button type="submit" className="w-full">Send Invite</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCopyInviteLink}
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 mr-2" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Share Link</>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[value="voting"]')?.click()}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" /> Create a Vote
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/ai-planner/final-plan')}
                  >
                    <Calendar className="w-4 h-4 mr-2" /> View Itinerary
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Budget Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-2xl font-bold">${groupPlan.total_budget?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Per Person</p>
                    <p className="text-2xl font-bold">${Math.round(groupPlan.total_budget / members.length)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <p className="text-2xl font-bold">$0</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">${groupPlan.total_budget?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <GroupMemberManagement groupId={groupPlan.id} />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Group Calendar</CardTitle>
                <CardDescription>View what everyone is doing each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(calendar).length > 0 ? (
                    Object.entries(calendar).map(([day, items]) => (
                      <div key={day} className="border-l-4 border-primary pl-4">
                        <h3 className="font-semibold text-lg mb-3">Day {day}</h3>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{item.title || item.activity_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.start_time && new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                {item.location_id && (
                                  <Badge variant="secondary" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" /> Location
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto opacity-20 mb-3" />
                      <p>No activities scheduled yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voting Tab */}
          <TabsContent value="voting" className="mt-6">
            <GroupVoting groupId={groupPlan.id} />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <GroupMessaging groupId={groupPlan.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupTravelDashboard;
