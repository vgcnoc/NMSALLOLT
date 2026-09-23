import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, ShieldAlert, Settings } from 'lucide-react';

const mockAlarmRules = [
  { id: 1, name: 'High CPU Usage', metric: 'CPU', condition: '>', threshold: '80%', severity: 'Critical', status: 'Active' },
  { id: 2, name: 'High Memory', metric: 'Memory', condition: '>', threshold: '90%', severity: 'Warning', status: 'Active' },
  { id: 3, name: 'PON Port Offline', metric: 'PON Status', condition: '==', threshold: 'Offline', severity: 'Critical', status: 'Active' },
];

const mockChannels = [
  { id: 1, name: 'NOC Telegram Group', type: 'Telegram', target: '@noc_alerts', status: 'Active' },
  { id: 2, name: 'Admin Email', type: 'Email', target: 'admin@isp.local', status: 'Active' },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2"><Settings className="w-4 h-4"/> General</TabsTrigger>
          <TabsTrigger value="alarms" className="flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Alarm Rules</TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2"><Bell className="w-4 h-4"/> Notification Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure global system parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input id="systemName" defaultValue="ISP NMS Master" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataRetention">Data Retention (Days)</Label>
                <Input id="dataRetention" type="number" defaultValue="90" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarms" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Alarm Rules</CardTitle>
                <CardDescription>Manage rules that trigger system alarms.</CardDescription>
              </div>
              <Button size="sm"><Plus className="mr-2 h-4 w-4"/> Add Rule</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlarmRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.metric}</TableCell>
                      <TableCell>{rule.condition} {rule.threshold}</TableCell>
                      <TableCell>
                        <Badge variant={rule.severity === 'Critical' ? 'destructive' : 'default'}>
                          {rule.severity}
                        </Badge>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-green-500 border-green-500">{rule.status}</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure where alarm notifications are sent.</CardDescription>
              </div>
              <Button size="sm"><Plus className="mr-2 h-4 w-4"/> Add Channel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChannels.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell className="font-medium">{channel.name}</TableCell>
                      <TableCell>{channel.type}</TableCell>
                      <TableCell>{channel.target}</TableCell>
                      <TableCell><Badge variant="outline" className="text-green-500 border-green-500">{channel.status}</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-blue-500">Test</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}