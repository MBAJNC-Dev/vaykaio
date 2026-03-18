import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Bell, CheckCircle2, Trash2, Search, Clock, AlertTriangle, MapPin,
  Sparkles, Zap, AlertCircle
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const records = await pb.collection('notifications').getList(1, 50, {
        filter: `user_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setNotifications(records.items);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { read: true }, { $autoCancel: false });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await pb.collection('notifications').delete(id, { $autoCancel: false });
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          pb.collection('notifications').update(n.id, { read: true }, { $autoCancel: false })
        )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const getUrgency = (notification) => {
    return notification.urgency || 'fyi';
  };

  const getIcon = (type) => {
    switch(type) {
      case 'activity_reminder': return <Clock className="w-5 h-5" />;
      case 'weather_alert': return <AlertTriangle className="w-5 h-5" />;
      case 'travel_alert': return <MapPin className="w-5 h-5" />;
      case 'ai_recommendation': return <Sparkles className="w-5 h-5" />;
      case 'booking_reminder': return <Zap className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
      case 'urgent_now':
        return <Badge className="bg-red-500/20 text-red-700 hover:bg-red-500/30 border-red-500/50">Urgent</Badge>;
      case 'action_soon':
        return <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 border-amber-500/50">Action Needed</Badge>;
      case 'fyi':
        return <Badge className="bg-sky-500/20 text-sky-700 hover:bg-sky-500/30 border-sky-500/50">FYI</Badge>;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'urgent_now': return 'border-red-500/20 bg-red-500/5';
      case 'action_soon': return 'border-amber-500/20 bg-amber-500/5';
      case 'fyi': return 'border-sky-500/20 bg-sky-500/5';
      default: return 'border-border/50';
    }
  };

  const filterByUrgency = (urgency) => {
    return notifications.filter(n => getUrgency(n) === urgency);
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeTab === 'urgent') {
      filtered = filterByUrgency('urgent_now');
    } else if (activeTab === 'action') {
      filtered = filterByUrgency('action_soon');
    } else if (activeTab === 'fyi') {
      filtered = filterByUrgency('fyi');
    }

    return filtered.filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      <Helmet><title>Notifications - VaykAIo</title></Helmet>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm py-1 px-3 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-2">Stay on top of your trips with real-time alerts from VaykAIo.</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="touch-target">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-12 h-12 bg-card border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger value="all" className="relative">
              All
              {notifications.length > 0 && (
                <span className="ml-2 text-xs font-semibold text-muted-foreground">
                  {notifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="urgent" className="relative">
              Urgent
              {filterByUrgency('urgent_now').length > 0 && (
                <span className="ml-2 text-xs font-semibold bg-red-500/20 text-red-700 px-2 py-0.5 rounded-full">
                  {filterByUrgency('urgent_now').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="action" className="relative">
              Action
              {filterByUrgency('action_soon').length > 0 && (
                <span className="ml-2 text-xs font-semibold bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full">
                  {filterByUrgency('action_soon').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="fyi" className="relative">
              FYI
              {filterByUrgency('fyi').length > 0 && (
                <span className="ml-2 text-xs font-semibold bg-sky-500/20 text-sky-700 px-2 py-0.5 rounded-full">
                  {filterByUrgency('fyi').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="h-24 animate-pulse bg-muted/50 border-0" />
              ))
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => {
                const urgency = getUrgency(notification);
                return (
                  <Card
                    key={notification.id}
                    className={`transition-all duration-200 border ${getUrgencyColor(urgency)} ${
                      !notification.read ? 'ring-1 ring-primary/20' : ''
                    }`}
                  >
                    <CardContent className="p-4 sm:p-6 flex gap-4 items-start">
                      <div className={`p-3 rounded-2xl shrink-0 flex items-center justify-center ${
                        urgency === 'urgent_now' ? 'bg-red-500/10 text-red-600' :
                        urgency === 'action_soon' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-sky-500/10 text-sky-600'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold text-base ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            {getUrgencyBadge(urgency)}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.created), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          !notification.read ? 'text-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {notification.message}
                        </p>
                        {notification.action_url && (
                          <Button variant="link" className="p-0 h-auto mt-2 text-primary hover:underline">
                            View Details
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                            className="h-9 w-9"
                          >
                            <CheckCircle2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                          className="h-9 w-9"
                        >
                          <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No notifications match your search.' : 'VaykAIo is watching your trip.'}
                </p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default NotificationsPage;
