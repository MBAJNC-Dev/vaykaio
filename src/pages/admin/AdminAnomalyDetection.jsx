
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminAnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const records = await pb.collection('AnomalyDetections').getFullList({ sort: '-created', $autoCancel: false });
        setAnomalies(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Anomaly Detection | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection</h1>
        <p className="text-muted-foreground">AI-powered detection of unusual system behavior or potential fraud.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Detected Anomalies</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : anomalies.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center"><ShieldAlert className="w-8 h-8 mb-2 opacity-20"/> No anomalies detected recently.</TableCell></TableRow>
              ) : (
                anomalies.map(anomaly => (
                  <TableRow key={anomaly.id}>
                    <TableCell className="whitespace-nowrap">{new Date(anomaly.created).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{anomaly.anomaly_type}</TableCell>
                    <TableCell>
                      <Badge variant={anomaly.severity === 'critical' ? 'destructive' : anomaly.severity === 'warning' ? 'secondary' : 'outline'}>
                        {anomaly.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{anomaly.description}</TableCell>
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

export default AdminAnomalyDetection;
