
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Server, Cpu, HardDrive, Network } from 'lucide-react';

const AdminPerformanceMonitoring = () => {
  return (
    <div className="space-y-6">
      <Helmet><title>Performance Monitoring | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Monitoring</h1>
        <p className="text-muted-foreground">Real-time system metrics and resource utilization.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5 text-primary"/> CPU Usage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm"><span className="font-medium">Core 1</span><span className="text-muted-foreground">45%</span></div>
            <Progress value={45} className="h-2" />
            <div className="flex justify-between text-sm"><span className="font-medium">Core 2</span><span className="text-muted-foreground">62%</span></div>
            <Progress value={62} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="w-5 h-5 text-accent"/> Memory & Storage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm"><span className="font-medium">RAM (16GB)</span><span className="text-muted-foreground">12.4GB Used</span></div>
            <Progress value={78} className="h-2 bg-muted [&>div]:bg-accent" />
            <div className="flex justify-between text-sm"><span className="font-medium">Disk (500GB)</span><span className="text-muted-foreground">210GB Used</span></div>
            <Progress value={42} className="h-2 bg-muted [&>div]:bg-accent" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Network className="w-5 h-5 text-green-500"/> API Latency</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2 pt-4">
              {[45, 52, 38, 95, 41, 39, 44, 48, 55, 42, 38, 40].map((val, i) => (
                <div key={i} className="w-full bg-green-500/20 rounded-t-sm relative group hover:bg-green-500/40 transition-colors" style={{ height: `${val}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm border">
                    {val}ms
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>60s ago</span>
              <span>Now</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPerformanceMonitoring;
