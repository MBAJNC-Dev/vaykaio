
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, PlayCircle, PauseCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminScheduledTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const records = await pb.collection('ScheduledTasks').getFullList({ sort: '-created', $autoCancel: false });
        setTasks(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Scheduled Tasks | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheduled Tasks</h1>
        <p className="text-muted-foreground">Manage cron jobs and automated background processes.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Background Jobs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Schedule (Cron)</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : tasks.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No scheduled tasks found.</TableCell></TableRow>
              ) : (
                tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.task_name}</TableCell>
                    <TableCell className="font-mono text-sm">{task.schedule}</TableCell>
                    <TableCell>{task.last_run ? new Date(task.last_run).toLocaleString() : 'Never'}</TableCell>
                    <TableCell>
                      <Badge variant={task.status === 'running' ? 'default' : 'secondary'} className="capitalize">
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><PlayCircle className="w-4 h-4 text-green-500" /></Button>
                      <Button variant="ghost" size="icon"><PauseCircle className="w-4 h-4 text-amber-500" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminScheduledTasks;
