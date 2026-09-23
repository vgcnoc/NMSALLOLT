import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { popsApi } from '@/api/pops.api';
import { Pop } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AddPopDialog } from '@/components/pops/AddPopDialog';

const mockPops: Pop[] = [
  { id: '1', name: 'Main Data Center', code: 'MDC-01', region: 'North', address: '123 Main St', isActive: true, _count: { devices: 15 } },
  { id: '2', name: 'East Region POP', code: 'ERP-02', region: 'East', address: '456 East Ave', isActive: true, _count: { devices: 8 } },
  { id: '3', name: 'West Remote Site', code: 'WRS-03', region: 'West', address: '789 West Blvd', isActive: false, _count: { devices: 2 } },
];

export default function PopsPage() {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['pops', { search }],
    queryFn: async () => {
      try {
        const res = await popsApi.getAll({ search });
        return res.data;
      } catch (err) {
        let filtered = [...mockPops];
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()));
        return { data: filtered, meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 } };
      }
    }
  });

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code', cell: ({ row }: any) => <Badge variant="secondary">{row.original.code}</Badge> },
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'address', header: 'Address' },
    { accessorKey: '_count.devices', header: 'Devices Count' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <PageHeader 
        title="Points of Presence" 
        description="Manage your network POPs and locations."
        action={<Button onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add POP</Button>}
      />

      <div className="flex items-center mb-6">
        <Input 
          placeholder="Search POPs..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      </div>

      <AddPopDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}