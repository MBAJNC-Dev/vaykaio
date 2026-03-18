import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-06-17' });

  // User Metrics Data
  const userMetricsData = [
    { month: 'Jan', dau: 240, mau: 800, retention: 65 },
    { month: 'Feb', dau: 320, mau: 920, retention: 68 },
    { month: 'Mar', dau: 410, mau: 1100, retention: 71 },
    { month: 'Apr', dau: 520, mau: 1350, retention: 74 },
    { month: 'May', dau: 680, mau: 1620, retention: 76 },
    { month: 'Jun', dau: 850, mau: 1850, retention: 78 }
  ];

  // Trip Metrics Data
  const tripMetricsData = [
    { month: 'Jan', created: 320, avgLength: 4.2, avgMembers: 2.1 },
    { month: 'Feb', created: 420, avgLength: 4.5, avgMembers: 2.3 },
    { month: 'Mar', created: 580, avgLength: 4.8, avgMembers: 2.5 },
    { month: 'Apr', created: 750, avgLength: 5.1, avgMembers: 2.7 },
    { month: 'May', created: 920, avgLength: 5.3, avgMembers: 2.9 },
    { month: 'Jun', created: 1150, avgLength: 5.5, avgMembers: 3.1 }
  ];

  // AI Metrics Data
  const aiMetricsData = [
    { day: 'Mon', activations: 340, acceptance: 78, avgTime: 2.1 },
    { day: 'Tue', activations: 380, acceptance: 81, avgTime: 2.0 },
    { day: 'Wed', activations: 420, acceptance: 83, avgTime: 1.9 },
    { day: 'Thu', activations: 390, acceptance: 80, avgTime: 2.1 },
    { day: 'Fri', activations: 450, acceptance: 85, avgTime: 1.8 },
    { day: 'Sat', activations: 380, acceptance: 82, avgTime: 2.0 },
    { day: 'Sun', activations: 350, acceptance: 79, avgTime: 2.2 }
  ];

  // Revenue Metrics Data
  const revenueMetricsData = [
    { month: 'Jan', mrr: 1200, arpu: 12.5, conversion: 8.2 },
    { month: 'Feb', mrr: 1890, arpu: 13.2, conversion: 9.1 },
    { month: 'Mar', mrr: 2340, arpu: 14.8, conversion: 10.2 },
    { month: 'Apr', mrr: 2900, arpu: 15.6, conversion: 11.5 },
    { month: 'May', mrr: 3400, arpu: 16.2, conversion: 12.8 },
    { month: 'Jun', mrr: 4200, arpu: 17.5, conversion: 14.2 }
  ];

  // Popular Destinations
  const destinationsData = [
    { name: 'Paris', value: 320, percentage: 15 },
    { name: 'Tokyo', value: 280, percentage: 13 },
    { name: 'NYC', value: 250, percentage: 12 },
    { name: 'London', value: 210, percentage: 10 },
    { name: 'Bali', value: 190, percentage: 9 },
    { name: 'Others', value: 740, percentage: 41 }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  // Churn Metrics
  const churnData = [
    { month: 'Jan', churn: 2.1, monthlyRetention: 97.9 },
    { month: 'Feb', churn: 1.8, monthlyRetention: 98.2 },
    { month: 'Mar', churn: 1.5, monthlyRetention: 98.5 },
    { month: 'Apr', churn: 1.2, monthlyRetention: 98.8 },
    { month: 'May', churn: 0.9, monthlyRetention: 99.1 },
    { month: 'Jun', churn: 0.8, monthlyRetention: 99.2 }
  ];

  const stats = [
    { label: 'Daily Active Users', value: '850', change: '+18%' },
    { label: 'Monthly Active Users', value: '1,850', change: '+12%' },
    { label: 'User Retention Rate', value: '78%', change: '+3%' },
    { label: 'Monthly Churn Rate', value: '0.8%', change: '-0.4%' },
    { label: 'Trips Created', value: '1,150', change: '+25%' },
    { label: 'Avg Trip Length', value: '5.5 days', change: '+2%' },
    { label: 'AI Acceptance Rate', value: '82%', change: '+4%' },
    { label: 'Avg Response Time', value: '2.0s', change: '-0.3s' },
    { label: 'Monthly Revenue', value: '$4,200', change: '+24%' },
    { label: 'ARPU', value: '$17.50', change: '+8%' },
    { label: 'Conversion Rate', value: '14.2%', change: '+2.2%' },
    { label: 'Customer Lifetime Value', value: '$420', change: '+15%' }
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - VaykAIo Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive metrics and insights for VaykAIo</p>
        </div>

        {/* Date Range Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div>
                <Label className="text-sm">From</Label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">To</Label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button>
                <Calendar className="h-4 w-4 mr-2" /> Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different metric categories */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Metrics</TabsTrigger>
            <TabsTrigger value="trips">Trip Metrics</TabsTrigger>
            <TabsTrigger value="ai">AI Metrics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Metrics</TabsTrigger>
          </TabsList>

          {/* User Metrics Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>DAU vs MAU vs Retention</CardTitle>
                  <CardDescription>User growth and retention trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="dau" stroke="#3b82f6" name="DAU" />
                      <Line yAxisId="left" type="monotone" dataKey="mau" stroke="#10b981" name="MAU" />
                      <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#f59e0b" name="Retention %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Churn Rate & Retention</CardTitle>
                  <CardDescription>Monthly churn trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={churnData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="churn" fill="#ef4444" stroke="#ef4444" name="Churn %" />
                      <Area yAxisId="right" type="monotone" dataKey="monthlyRetention" fill="#10b981" stroke="#10b981" name="Retention %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trip Metrics Tab */}
          <TabsContent value="trips" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trips Created</CardTitle>
                  <CardDescription>Monthly trip creation trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tripMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="created" fill="#3b82f6" name="Trips Created" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                  <CardDescription>Most visited destinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={destinationsData} cx="50%" cy="50%" labelLine={false} label={({ name, percentage }) => `${name} ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {destinationsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Trip Analytics</CardTitle>
                  <CardDescription>Average trip length and group size</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tripMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="avgLength" stroke="#10b981" name="Avg Length (days)" />
                      <Line yAxisId="right" type="monotone" dataKey="avgMembers" stroke="#f59e0b" name="Avg Members" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Metrics Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Agent Activations</CardTitle>
                  <CardDescription>Weekly activation trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={aiMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="activations" fill="#8b5cf6" name="Activations" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations Acceptance</CardTitle>
                  <CardDescription>Weekly acceptance rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={aiMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="acceptance" stroke="#10b981" name="Acceptance %" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>AI Performance</CardTitle>
                  <CardDescription>Response time trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={aiMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgTime" stroke="#ef4444" name="Avg Response Time (s)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Metrics Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Recurring Revenue</CardTitle>
                  <CardDescription>MRR growth trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="mrr" fill="#3b82f6" stroke="#3b82f6" name="MRR ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ARPU Trends</CardTitle>
                  <CardDescription>Average Revenue Per User</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="arpu" stroke="#10b981" name="ARPU ($)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Conversion Rate</CardTitle>
                  <CardDescription>Free to paid conversion trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversion" stroke="#f59e0b" name="Conversion Rate (%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;
