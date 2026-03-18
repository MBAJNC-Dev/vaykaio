
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, GripHorizontal } from 'lucide-react';

const AdminDashboardEnhancements = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Dashboard Layout | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Customization</h1>
        <p className="text-muted-foreground">Configure the layout and widgets for the main admin dashboard.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary" /> Widget Layout</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl border-2 border-dashed">
            {[
              'Key Metrics (Top Row)', 'Revenue Chart (Main)', 'Recent Activity (Sidebar)',
              'System Health (Bottom)', 'Active Users Map', 'Error Logs'
            ].map((widget, i) => (
              <div key={i} className={`bg-card border rounded-lg p-4 flex items-center gap-3 shadow-sm cursor-move ${i === 1 ? 'col-span-2' : ''}`}>
                <GripHorizontal className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">{widget}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardEnhancements;
