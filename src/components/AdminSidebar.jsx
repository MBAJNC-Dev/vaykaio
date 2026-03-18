
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, BarChart3, Flag,
  Settings, Activity, Zap, Compass,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = ({ className }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups = [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
      ]
    },
    {
      title: "SaaS & Growth",
      items: [
        { title: "Users", icon: Users, href: "/admin/users" },
        { title: "Subscriptions", icon: Zap, href: "/admin/subscriptions" },
        { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
        { title: "Feature Flags", icon: Flag, href: "/admin/feature-flags" },
      ]
    },
    {
      title: "System",
      items: [
        { title: "Settings", icon: Settings, href: "/admin/settings" },
        { title: "Activity Log", icon: Activity, href: "/admin/activity-log" },
      ]
    }
  ];

  return (
    <div className={cn(
      "pb-12 border-r bg-slate-50/50 dark:bg-slate-950/50 h-screen overflow-y-auto flex-shrink-0 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-2 flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1.5 rounded-lg flex-shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <h2 className="text-lg font-bold tracking-tight">VaykAIo Admin</h2>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-muted rounded-lg"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {navGroups.map((group, i) => (
          <div key={i} className="px-3 py-2">
            {!isCollapsed && (
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {group.title}
              </h2>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  title={isCollapsed ? item.title : ""}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
