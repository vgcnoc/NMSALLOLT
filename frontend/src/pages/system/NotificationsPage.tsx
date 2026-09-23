import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Send } from 'lucide-react';

const mockNotifications = [
  { id: 1, timestamp: '2026-09-23 18:45:12', channel: 'Telegram', target: '@noc_alerts', message: 'CRITICAL: OLT-Central-1 CPU usage at 92%', status: 'Sent' },
  { id: 2, timestamp: '2026-09-23 17:30:00', channel: 'Email', target: 'admin@isp.local', message: 'WARNING: Memory usage on OLT-North-2 is high (85%)', status: 'Sent' },
  { id: 3, timestamp: '2026-09-23 16:15:22', channel: 'Telegram', target: '@noc_alerts', message: 'INFO: Scheduled maintenance started for Zone B', status: 'Sent' },
  { id: 4, timestamp: '2026-09-23 15:00:05', channel: 'SMS', target: '+1234567890', message: 'CRITICAL: Power failure reported at POP-West', status: 'Failed' },
  { id: 5, timestamp: '2026-09-23 14:20:10', channel: 'Telegram', target: '@noc_alerts', message: 'RESOLVED: OLT-South-1 CPU usage normalized', status: 'Sent' },
];

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notification History</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Notifications</CardTitle>
          <CardDescription>Log of all alerts and messages dispatched by the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="whitespace-nowrap">{note.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Send className="w-3 h-3 text-muted-foreground"/> {note.channel}
                      </div>
                    </TableCell>
                    <TableCell>{note.target}</TableCell>
                    <TableCell className="max-w-md truncate" title={note.message}>{note.message}</TableCell>
                    <TableCell>
                      <Badge variant={note.status === 'Sent' ? 'default' : 'destructive'} className={note.status === 'Sent' ? 'bg-green-600 hover:bg-green-700' : ''}>
                        {note.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}