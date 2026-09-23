import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { onusApi } from '@/api/onus.api';
import { ONU } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';

const mockOnus: ONU[] = [
  { id: '1', oltId: '1', ponPortId: '1', onuId: 1, serialNumber: 'ZTEGC3201111', status: 'ONLINE', rxPower: -22.5, txPower: 2.1, distance: 1200 },
  { id: '2', oltId: '1', ponPortId: '1', onuId: 2, serialNumber: 'ZTEGC3202222', status: 'OFFLINE', rxPower: -30.5, txPower: 0, distance: 0 },
  { id: '3', oltId: '1', ponPortId: '2', onuId: 1, serialNumber: 'HWTC3203333', status: 'LOS', rxPower: -40.0, txPower: 0, distance: 0 },
];

export default function OnusPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['onus', { search }],
    queryFn: async () => {
      try {
        const res = await onusApi.getAll({ search });
        return res.data;
      } catch {
        const filtered = mockOnus.filter(o => o.serialNumber?.toLowerCase().includes(search.toLowerCase()));
        return { data: filtered, meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 } };
      }
    }
  });

  const columns = [
    { accessorKey: 'serialNumber', header: 'Serial Number' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }: any) => <StatusBadge status={row.original.status} /> },
    { 
      accessorKey: 'rxPower', 
      header: 'RX Power', 
      cell: ({ row }: any) => {
        const power = row.original.rxPower;
        let color = 'text-green-500';
        if (power < -27) color = 'text-red-500';
        else if (power < -25) color = 'text-yellow-500';
        return <span className={`font-medium ${color}`}>{power ? `${power} dBm` : 'N/A'}</span>;
      }
    },
    { accessorKey: 'txPower', header: 'TX Power', cell: ({ row }: any) => <span>{row.original.txPower ? `${row.original.txPower} dBm` : 'N/A'}</span> },
    { accessorKey: 'distance', header: 'Distance (m)' }
  ];

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="ONT Management" description="Manage and monitor Optical Network Terminals." />
      <div className="flex items-center mb-6">
        <Input placeholder="Search by Serial Number..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>
      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      </div>
    </div>
  );
}