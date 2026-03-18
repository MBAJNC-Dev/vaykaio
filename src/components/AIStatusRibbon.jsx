import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AIStatusRibbon = ({
  isMonitoring = true,
  alerts = [],
  agents = [],
  onDismissAlert,
  compact = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent">
        <CardHeader className="py-3 pb-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Pulsing indicator */}
              <motion.div
                className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Bot className="w-2.5 h-2.5 text-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  VaykAIo is monitoring your trip
                </p>
                {activeAlerts.length > 0 && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    {activeAlerts.length} suggestion
                    {activeAlerts.length !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
            </div>

            <motion.button
              className="p-1 hover:bg-muted rounded transition-colors"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-3 pt-0">
                {/* Agent Status Grid */}
                {agents.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Agent Status
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {agents.map((agent) => (
                        <motion.div
                          key={agent.id}
                          className={cn(
                            'p-2 rounded-lg border text-center transition-colors',
                            agent.status === 'active'
                              ? 'bg-green-50/50 border-green-200 text-green-700'
                              : agent.status === 'alert'
                                ? 'bg-amber-50/50 border-amber-200 text-amber-700'
                                : 'bg-muted border-border text-muted-foreground'
                          )}
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-xs font-medium truncate">
                            {agent.name}
                          </p>
                          <p className="text-xs text-opacity-70 mt-0.5">
                            {agent.status === 'active' && (
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Active
                              </span>
                            )}
                            {agent.status === 'alert' && (
                              <span className="inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Alert
                              </span>
                            )}
                            {agent.status === 'idle' && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Idle
                              </span>
                            )}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {activeAlerts.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Alerts
                    </p>
                    <div className="space-y-2">
                      {activeAlerts.map((alert, idx) => (
                        <motion.div
                          key={alert.id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-start gap-3 p-2 bg-amber-50/50 border border-amber-200 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-amber-900">
                              {alert.title}
                            </p>
                            {alert.description && (
                              <p className="text-xs text-amber-700 mt-0.5 line-clamp-2">
                                {alert.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onDismissAlert?.(alert.id || idx)}
                            className="p-1 hover:bg-amber-100 rounded transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-amber-600" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {agents.length === 0 && activeAlerts.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">
                    All systems operational. No alerts at this time.
                  </p>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AIStatusRibbon;
