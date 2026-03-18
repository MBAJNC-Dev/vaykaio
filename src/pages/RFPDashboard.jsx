
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Send, CheckCircle, TrendingDown, Plus, ArrowRight, Building2, Clock } from 'lucide-react';
import { RFPService } from '@/services/RFPService.js';
import pb from '@/lib/pocketbaseClient';

const RFPDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRFPs, setRecentRFPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!pb.authStore.isValid) return;
      try {
        const userId = pb.authStore.model.id;
        const [statsData, recentData] = await Promise.all([
          RFPService.getDashboardStats(userId),
          RFPService.getRecentRFPs(userId)
        ]);
        setStats(statsData);
        setRecentRFPs(recentData.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>RFP Dashboard | TravelMatrix</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFP Management</h1>
          <p className="text-muted-foreground mt-1">Manage group bookings, track proposals, and compare quotes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/rfp/tracking')}>View All</Button>
          <Button onClick={() => navigate('/rfp/create')}><Plus className="w-4 h-4 mr-2" /> New RFP</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active RFPs</p>
                {loading ? <Skeleton className="h-8 w-16 mt-2" /> : <h3 className="text-3xl font-bold mt-2">{stats?.activeRFPs || 0}</h3>}
              </div>
              <div className="p-3 bg-blue-50 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Responses</p>
                {loading ? <Skeleton className="h-8 w-16 mt-2" /> : <h3 className="text-3xl font-bold mt-2">{stats?.pendingResponses || 0}</h3>}
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl"><Clock className="w-5 h-5 text-yellow-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted Quotes</p>
                {loading ? <Skeleton className="h-8 w-16 mt-2" /> : <h3 className="text-3xl font-bold mt-2">{stats?.acceptedQuotes || 0}</h3>}
              </div>
              <div className="p-3 bg-green-50 rounded-xl"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potential Savings</p>
                {loading ? <Skeleton className="h-8 w-24 mt-2" /> : <h3 className="text-3xl font-bold mt-2 text-green-600">${stats?.totalSavings?.toLocaleString() || 0}</h3>}
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl"><TrendingDown className="w-5 h-5 text-emerald-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent RFPs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent RFPs</CardTitle>
              <CardDescription>Your latest requests for proposal</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/rfp/tracking">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : recentRFPs.length > 0 ? (
              <div className="space-y-4">
                {recentRFPs.map((rfp) => (
                  <div key={rfp.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{rfp.property_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rfp.group_size} guests • {new Date(rfp.check_in_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className={getStatusColor(rfp.status)}>
                        {rfp.status.charAt(0).toUpperCase() + rfp.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/rfp/tracking/${rfp.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No RFPs yet</h3>
                <p className="text-muted-foreground mb-4">Create your first Request for Proposal to get started.</p>
                <Button onClick={() => navigate('/rfp/create')}>Create RFP</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/rfp/responses"><Send className="w-4 h-4 mr-3 text-blue-500" /> View Responses</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/rfp/comparison"><FileText className="w-4 h-4 mr-3 text-purple-500" /> Compare Quotes</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/rfp/groups"><Building2 className="w-4 h-4 mr-3 text-green-500" /> Manage Groups</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Pro Tip</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Properties respond 40% faster when you provide flexible dates. Consider adding alternate dates to your next RFP.
              </p>
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                Update Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RFPDashboard;
