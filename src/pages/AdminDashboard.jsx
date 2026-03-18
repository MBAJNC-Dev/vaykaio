
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, MapPin, DollarSign, Zap, TrendingUp, AlertCircle, CheckCircle2, Zap as ZapIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 1248,
    trips: 3890,
    subscriptions: 287,
    revenue: 4892.43,
    activeTrips: 156,
    monthlyRecurringRevenue: 2445.68
  });
  const [loading, setLoading] = useState(false);

  const [userGrowthData] = useState([
    { month: 'Jan', users: 400, active: 240 },
    { month: 'Feb', users: 520, active: 310 },
    { month: 'Mar', users: 680, active: 420 },
    { month: 'Apr', users: 890, active: 580 },
    { month: 'May', users: 1050, active: 720 },
    { month: 'Jun', users: 1248, active: 850 }
  ]);

  const [revenueData] = useState([
    { month: 'Jan', revenue: 1200, subscriptions: 45 },
    { month: 'Feb', revenue: 1890, subscriptions: 62 },
    { month: 'Mar', revenue: 2340, subscriptions: 85 },
    { month: 'Apr', revenue: 2900, subscriptions: 120 },
    { month: 'May', revenue: 3400, subscriptions: 165 },
    { month: 'Jun', revenue: 4892.43, subscriptions: 287 }
  ]);

  const [recentSignups] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Pro', joinedDate: '2 hours ago' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', plan: 'Premium', joinedDate: '5 hours ago' },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', plan: 'Free', joinedDate: '1 day ago' },
    { id: 4, name: 'Alex Rodriguez', email: 'alex@example.com', plan: 'Pro', joinedDate: '2 days ago' },
    { id: 5, name: 'Lisa Wong', email: 'lisa@example.com', plan: 'Premium', joinedDate: '3 days ago' }
  ]);

  const [aiAgentStatus] = useState([
    { name: 'Itinerary Builder', status: 'active', requests: 892, avgTime: '2.3s' },
    { name: 'Recommendation Engine', status: 'active', requests: 1245, avgTime: '1.8s' },
    { name: 'Budget Optimizer', status: 'active', requests: 456, avgTime: '3.1s' },
    { name: 'Photo AI Tagger', status: 'active', requests: 234, avgTime: '4.2s' },
    { name: 'Memory Timeline', status: 'degraded', requests: 123, avgTime: '6.8s' }
  ]);

  const systemHealth = {
    database: 'healthy',
    cache: 'healthy',
    api: 'healthy',
    email: 'healthy',
    storage: 'degraded'
  };

  return (
    <>
      <Helmet><title>Admin Dashboard - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">VaykAIo platform overview and key metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trips</CardTitle>
              <MapPin className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrips}</div>
              <p className="text-xs text-muted-foreground">{stats.trips.toLocaleString()} total created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRecurringRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Subscriptions</CardTitle>
              <Zap className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subscriptions}</div>
              <p className="text-xs text-muted-foreground">+24 this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Total and active users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Subscriptions</CardTitle>
              <CardDescription>Monthly revenue and subscription count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#f59e0b" />
                  <Bar yAxisId="right" dataKey="subscriptions" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium">{signup.name}</p>
                    <p className="text-sm text-muted-foreground">{signup.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{signup.plan}</Badge>
                    <p className="text-sm text-muted-foreground">{signup.joinedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Agents & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Agent Status */}
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Status</CardTitle>
              <CardDescription>Active AI agent overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiAgentStatus.map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.requests} requests • {agent.avgTime} avg</p>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Core service status indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(systemHealth).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {status === 'healthy' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <p className="font-medium text-sm capitalize">{service}</p>
                  </div>
                  <Badge variant={status === 'healthy' ? 'outline' : 'secondary'}>
                    {status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="w-full">Manage Users</Button>
              <Button variant="outline" className="w-full">View Logs</Button>
              <Button variant="outline" className="w-full">Feature Flags</Button>
              <Button variant="outline" className="w-full">Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
