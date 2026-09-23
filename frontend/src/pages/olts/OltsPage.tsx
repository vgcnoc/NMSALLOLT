import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { oltsApi } from '@/api/olts.api';
import { OLT } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { AddDeviceDialog } from '@/components/devices/AddDeviceDialog';

const mockOlts: OLT[] = [
  {
    id: '1',
    deviceId: 'dev1',
    oltType: 'C320',
    totalPonPorts: 16,
    totalBoards: 2,
    device: { id: 'dev1', name: 'ZTE-C320-Main', type: 'OLT', vendor: 'ZTE', model: 'C320', ipAddress: '10.0.0.1', status: 'ONLINE', createdAt: '', updatedAt: '' }
  },
  {
    id: '2',
    deviceId: 'dev2',
    oltType: 'MA5608T',
    totalPonPorts: 32,
    totalBoards: 4,
    device: { id: 'dev2', name: 'Huawei-East', type: 'OLT', vendor: 'HUAWEI', model: 'MA5608T', ipAddress: '10.0.0.3', status: 'WARNING', createdAt: '', updatedAt: '' }
  }
];

export default function OltsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['olts', { search }],
    queryFn: async () => {
      try {
        const res = await oltsApi.getAll({ search });
        return res.data;
      } catch (err) {
        let filtered = [...mockOlts];
        if (search) filtered = filtered.filter(o => o.device.name.toLowerCase().includes(search.toLowerCase()) || o.device.ipAddress.includes(search));
        return { data: filtered, meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 } };
      }
    }
  });

  const columns = [
    {
      accessorKey: 'device.name',
      header: 'Name',
      cell: ({ row }: any) => (
        <Link to={`/olts/${row.original.id}`} className="font-medium text-primary hover:underline">
          {row.original.device.name}
        </Link>
      ),
    },
    { accessorKey: 'device.ipAddress', header: 'IP Address' },
    { accessorKey: 'device.vendor', header: 'Vendor' },
    { accessorKey: 'device.model', header: 'Model' },
    { accessorKey: 'totalPonPorts', header: 'PON Ports' },
    {
      accessorKey: 'device.status',
      header: 'Status',
      cell: ({ row }: any) => <StatusBadge status={row.original.device.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const handleSync = async () => {
          try {
            await oltsApi.poll(row.original.id);
            alert('OLT data synced successfully!');
            // Ideally trigger a re-fetch, but for now just alert
          } catch (e) {
            alert('Failed to sync OLT data.');
          }
        };
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/olts/${row.original.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSync} title="Sync Live Data from OLT">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <PageHeader 
        title="OLT Management" 
        description="Manage your Optical Line Terminals (OLTs) and ONUs."
      >
        <Button onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add OLT</Button>
      </PageHeader>

      <div className="flex items-center mb-6">
        <Input 
          placeholder="Search OLTs..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      </div>

      <AddDeviceDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}