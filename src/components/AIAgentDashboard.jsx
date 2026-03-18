import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Zap,
  Eye,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AGENTS = [
  {
    id: 'planner',
    name: 'Planner',
    icon: Calendar,
    description: 'Manages itinerary and activity scheduling',
  },
  {
    id: 'monitor',
    name: 'Monitor',
    icon: Eye,
    description: 'Watches for issues and opportunities',
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: Zap,
    description: 'Curates personalized recommendations',
  },
  {
    id: 'stay',
    name: 'Stay',
    icon: MessageSquare,
    description: 'Handles accommodation assistance',
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: MessageSquare,
    description: 'Group coordination and messaging',
  },
  {
    id: 'optimization',
    name: 'Optimization',
    icon: TrendingUp,
    description: 'Improves efficiency and costs',
  },
  {
    id: 'recovery',
    name: 'Recovery',
    icon: RefreshCw,
    description: 'Handles emergencies and changes',
  },
  {
    id: 'memory',
    name: 'Memory',
    icon: AlertTriangle,
    description: 'Tracks preferences and patterns',
  },
];

// Mock activity timeline
const mockActivityTimeline = [
  {
    id: 1,
    agent: 'Planner',
    action: 'Optimized daily schedule',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    agent: 'Experience',
    action: 'Found 3 new restaurant recommendations',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    agent: 'Monitor',
    action: 'Weather alert: Rain expected tomorrow',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    agent: 'Optimization',
    action: 'Savings opportunity: Alternative route found',
    timestamp: '3 hours ago',
  },
  {
    id: 5,
    agent: 'Stay',
    action: 'Checked accommodation availability',
    timestamp: '5 hours ago',
  },
  {
    id: 6,
    agent: 'Planner',
    action: 'Created backup itinerary',
    timestamp: '1 day ago',
  },
  {
    id: 7,
    agent: 'Memory',
    action: 'Learned: Preference for vegetarian food',
    timestamp: '2 days ago',
  },
  {
    id: 8,
    agent: 'Communication',
    action: 'Synced with group members',
    timestamp: '3 days ago',
  },
  {
    id: 9,
    agent: 'Recovery',
    action: 'Assisted with flight rescheduling',
    timestamp: '1 week ago',
  },
  {
    id: 10,
    agent: 'Experience',
    action: 'Learned local cultural tips',
    timestamp: '1 week ago',
  },
];

const AIAgentDashboard = ({
  agentStatuses = {},
  alertCount = 0,
  onAgentClick,
}) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState(false);

  // Merge agent data with statuses
  const agentsWithStatus = AGENTS.map((agent) => ({
    ...agent,
    status: agentStatuses[agent.id] || 'idle',
    actionCount: Math.floor(Math.random() * 15) + 1,
    lastAction: mockActivityTimeline.find((a) => a.agent === agent.name)
      ?.action,
  }));

  const handleAgentClick = (agent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent);
    onAgentClick?.(agent);
  };

  const overallStatus =
    alertCount > 0
      ? `${alertCount} Alert${alertCount !== 1 ? 's' : ''} Active`
      : 'All Systems Operational';

  const statusColor =
    alertCount > 0 ? 'text-amber-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-l-4"
          style={{
            borderLeftColor:
              alertCount > 0
                ? 'hsl(var(--warning))'
                : 'hsl(var(--success))',
          }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {alertCount > 0 ? (
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h2 className={cn('text-xl font-bold', statusColor)}>
                  {overallStatus}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {agentsWithStatus.length} AI agents managing your trip
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Agent Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {agentsWithStatus.map((agent, idx) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent?.id === agent.id;
          const statusColor = {
            active: 'bg-green-50 border-green-200',
            alert: 'bg-amber-50 border-amber-200',
            idle: 'bg-muted border-border',
          }[agent.status] || 'bg-muted border-border';

          const statusIconColor = {
            active: 'text-green-600',
            alert: 'text-amber-600',
            idle: 'text-muted-foreground',
          }[agent.status] || 'text-muted-foreground';

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              onClick={() => handleAgentClick(agent)}
              className="cursor-pointer"
            >
              <Card
                className={cn(
                  'border transition-all duration-300 hover:shadow-md',
                  isSelected &&
                    'ring-2 ring-primary shadow-lg border-primary'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <div
                        className={cn(
                          'p-2 rounded-lg',
                          statusColor
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold">
                          {agent.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {agent.status === 'active' && (
                            <>
                              <CheckCircle className={cn('w-3 h-3', statusIconColor)} />
                              <span className="text-xs font-medium text-green-600">
                                Active
                              </span>
                            </>
                          )}
                          {agent.status === 'alert' && (
                            <>
                              <AlertCircle className={cn('w-3 h-3', statusIconColor)} />
                              <span className="text-xs font-medium text-amber-600">
                                Alert
                              </span>
                            </>
                          )}
                          {agent.status === 'idle' && (
                            <>
                              <Clock className={cn('w-3 h-3', statusIconColor)} />
                              <span className="text-xs font-medium text-muted-foreground">
                                Idle
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-lg font-bold text-primary">
                        {agent.actionCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Actions
                      </p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-lg font-bold text-accent">
                        {agent.status === 'active' ? '✓' : '○'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status
                      </p>
                    </div>
                  </div>

                  {agent.lastAction && (
                    <div className="p-2 bg-primary/5 rounded border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-1">
                        Last Action
                      </p>
                      <p className="text-xs text-foreground line-clamp-2">
                        {agent.lastAction}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedLogs(!expandedLogs)}
              >
                {expandedLogs ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {mockActivityTimeline
                .slice(0, expandedLogs ? undefined : 5)
                .map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="flex gap-3 pb-3 border-b border-border last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {item.agent}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>

            {mockActivityTimeline.length > 5 && !expandedLogs && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setExpandedLogs(true)}
              >
                View all {mockActivityTimeline.length} activities
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Agent Details */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-l-4"
              style={{ borderLeftColor: 'hsl(var(--primary))' }}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedAgent.name} - Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockActivityTimeline
                    .filter((a) => a.agent === selectedAgent.name)
                    .slice(0, 5)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-muted/50 rounded-lg text-sm"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-foreground">{log.action}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {log.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentDashboard;
