import { useState } from 'react';
import { Alarm, AlarmSeverity } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockAlarms: Alarm[] = [
  { id: '1', deviceId: '1', severity: 'CRITICAL', alarmType: 'LOS', message: 'ONU Loss of Signal', status: 'NEW', createdAt: new Date().toISOString() },
  { id: '2', deviceId: '2', severity: 'MAJOR', alarmType: 'HIGH_CPU', message: 'CPU utilization > 90%', status: 'NEW', createdAt: new Date().toISOString() },
  { id: '3', deviceId: '1', severity: 'WARNING', alarmType: 'RX_POWER_LOW', message: 'ONU RX Power -28dBm', status: 'ACKNOWLEDGED', createdAt: new Date().toISOString() },
];

export default function AlarmsPage() {
  const [filter, setFilter] = useState('ALL');

  const getSeverityBadge = (severity: AlarmSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <Badge variant="destructive">CRITICAL</Badge>;
      case 'MAJOR': return <Badge className="bg-orange-500 hover:bg-orange-600">MAJOR</Badge>;
      case 'WARNING': return <Badge className="bg-yellow-500 hover:bg-yellow-600">WARNING</Badge>;
      case 'INFO': return <Badge className="bg-blue-500 hover:bg-blue-600">INFO</Badge>;
      default: return <Badge>{severity}</Badge>;
    }
  };

  const columns = [
    { accessorKey: 'severity', header: 'Severity', cell: ({ row }: any) => getSeverityBadge(row.original.severity) },
    { accessorKey: 'alarmType', header: 'Type' },
    { accessorKey: 'message', header: 'Message' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'createdAt', header: 'Time', cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleString() }
  ];

  const filteredAlarms = filter === 'ALL' ? mockAlarms : mockAlarms.filter(a => a.severity === filter);

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Alarms" description="System and network alarms" />
      <Tabs defaultValue="ALL" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="CRITICAL">Critical</TabsTrigger>
          <TabsTrigger value="MAJOR">Major</TabsTrigger>
          <TabsTrigger value="WARNING">Warning</TabsTrigger>
          <TabsTrigger value="INFO">Info</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={filteredAlarms} isLoading={false} />
      </div>
    </div>
  );
}