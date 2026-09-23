import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MoreHorizontal, Eye, Edit, Trash, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { devicesApi } from '@/api/devices.api';
import { Device, DeviceType, DeviceStatus, DeviceVendor } from '@/types';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { AddDeviceDialog } from '@/components/devices/AddDeviceDialog';
import { EditDeviceDialog } from '@/components/devices/EditDeviceDialog';

// Mock fallback data
const mockDevices: Device[] = [
  { id: '1', name: 'OLT-ZTE-C320-Main', type: 'OLT', vendor: 'ZTE', model: 'C320', ipAddress: '10.0.0.1', status: 'ONLINE', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'MikroTik-CCR1036', type: 'MIKROTIK', vendor: 'MIKROTIK', model: 'CCR1036', ipAddress: '10.0.0.2', status: 'ONLINE', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'OLT-Huawei-MA5608T', type: 'OLT', vendor: 'HUAWEI', model: 'MA5608T', ipAddress: '10.0.0.3', status: 'WARNING', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'Switch-Core', type: 'SWITCH', vendor: 'OTHER', model: 'CISCO', ipAddress: '10.0.0.4', status: 'OFFLINE', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function DevicesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['devices', { search, typeFilter, vendorFilter, statusFilter }],
    queryFn: async () => {
      try {
        const res = await devicesApi.getAll({ search, type: typeFilter !== 'all' ? typeFilter : undefined, vendor: vendorFilter !== 'all' ? vendorFilter : undefined, status: statusFilter !== 'all' ? statusFilter : undefined });
        return res.data;
      } catch (err) {
        // Fallback to mock data for demo
        let filtered = [...mockDevices];
        if (search) filtered = filtered.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.ipAddress.includes(search));
        if (typeFilter !== 'all') filtered = filtered.filter(d => d.type === typeFilter);
        if (vendorFilter !== 'all') filtered = filtered.filter(d => d.vendor === vendorFilter);
        if (statusFilter !== 'all') filtered = filtered.filter(d => d.status === statusFilter);
        
        return { data: filtered, meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 } };
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => devicesApi.delete(id),
    onSuccess: () => {
      toast.success('Device deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: () => {
      toast.error('Failed to delete device (Mock mode usually fails)');
    }
  });

  const pollMutation = useMutation({
    mutationFn: (id: string) => devicesApi.poll(id),
    onSuccess: () => toast.success('Device poll initiated'),
    onError: () => toast.error('Failed to poll device')
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <Link to={`/devices/${row.original.id}`} className="font-medium text-primary hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    { 
      accessorKey: 'ipAddress', 
      header: 'IP / Web Access',
      cell: ({ row }: any) => {
        const ip = row.original.ipAddress;
        if (!ip) return '-';
        const url = ip.startsWith('http') ? ip : `http://${ip}`;
        return (
          <a href={url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
            {ip}
            <Eye className="h-3 w-3 opacity-50" />
          </a>
        );
      }
    },
    { accessorKey: 'vendor', header: 'Vendor' },
    { accessorKey: 'model', header: 'Model' },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: any) => <Badge variant="outline">{row.original.type}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/devices/${row.original.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDevice(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => pollMutation.mutate(row.original.id)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Poll Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <PageHeader 
        title="Device Management" 
        description="Manage your network devices including OLTs, Routers, and Switches."
      >
        <Button onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Device</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search devices..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="OLT">OLT</SelectItem>
            <SelectItem value="MIKROTIK">MikroTik</SelectItem>
            <SelectItem value="SWITCH">Switch</SelectItem>
            <SelectItem value="ROUTER">Router</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="WARNING">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        <DataTable 
          columns={columns} 
          data={data?.data || []} 
          isLoading={isLoading} 
        />
      </div>

      <AddDeviceDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      {editDevice && (
        <EditDeviceDialog 
          open={!!editDevice} 
          onOpenChange={(open) => !open && setEditDevice(null)} 
          device={editDevice} 
        />
      )}
    </div>
  );
}
