import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Server, Activity, Power } from 'lucide-react';

import { oltsApi } from '@/api/olts.api';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { OLT, OltBoard, PonPort, ONU } from '@/types';

const mockOlt: OLT = {
  id: '1', deviceId: 'dev1', oltType: 'C320', totalPonPorts: 16, totalBoards: 2,
  device: { id: 'dev1', name: 'ZTE-C320-Main', type: 'OLT', vendor: 'ZTE', model: 'C320', ipAddress: '10.0.0.1', status: 'ONLINE', createdAt: '', updatedAt: '' }
};

const mockBoards: OltBoard[] = [
  { id: 'b1', oltId: '1', slot: 1, boardType: 'GTGO', status: 'INSERVICE', serialNumber: 'ZTEG123456' }
];

const mockPonPorts: PonPort[] = [
  { id: 'p1', oltId: '1', slot: 1, port: 1, name: 'gpon-olt_1/1/1', status: 'ONLINE', totalOnus: 64, onlineOnus: 60, ponType: 'GPON' }
];

const mockOnus: ONU[] = [
  { id: 'o1', oltId: '1', ponPortId: 'p1', onuId: 1, serialNumber: 'ZTEG00A1B2C3', status: 'ONLINE', rxPower: -21.5, txPower: 2.1, distance: 1500 }
];

export default function OltDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: olt } = useQuery({ queryKey: ['olt', id], queryFn: () => oltsApi.getById(id!).then(res => res.data).catch(() => mockOlt) });
  const { data: boards = mockBoards } = useQuery({ queryKey: ['oltBoards', id], queryFn: () => oltsApi.getBoards(id!).then(res => res.data).catch(() => mockBoards) });
  const { data: ports = mockPonPorts } = useQuery({ queryKey: ['oltPorts', id], queryFn: () => oltsApi.getPonPorts(id!).then(res => res.data).catch(() => mockPonPorts) });
  const { data: onusData } = useQuery({ queryKey: ['oltOnus', id], queryFn: () => oltsApi.getOnus(id!).then(res => res.data).catch(() => ({ data: mockOnus, meta: { total: 1, page: 1, limit: 10, totalPages: 1 } })) });

  if (!olt) return null;

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/olts')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{olt.device.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <StatusBadge status={olt.device.status} />
            <span className="text-muted-foreground text-sm">{olt.device.ipAddress}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
          <TabsTrigger value="ports">PON Ports</TabsTrigger>
          <TabsTrigger value="onus">ONUs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader><CardContent>Total PON Ports: {olt.totalPonPorts}</CardContent></Card>
        </TabsContent>
        <TabsContent value="boards">
          <DataTable columns={[{ accessorKey: 'slot', header: 'Slot' }, { accessorKey: 'boardType', header: 'Type' }, { accessorKey: 'status', header: 'Status' }]} data={boards} />
        </TabsContent>
        <TabsContent value="ports">
          <DataTable columns={[{ accessorKey: 'name', header: 'Port Name' }, { accessorKey: 'status', header: 'Status' }, { accessorKey: 'onlineOnus', header: 'Online ONUs' }]} data={ports} />
        </TabsContent>
        <TabsContent value="onus">
          <DataTable columns={[
            { accessorKey: 'serialNumber', header: 'SN' },
            { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
            { accessorKey: 'rxPower', header: 'RX Power', cell: ({ row }: any) => <span className={row.original.rxPower < -27 ? 'text-red-500' : 'text-green-500'}>{row.original.rxPower} dBm</span> }
          ]} data={onusData?.data || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}