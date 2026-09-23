import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mikrotikApi } from '../../api/mikrotik.api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Server, Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function MikrotikPage() {
  const navigate = useNavigate();
  const { data: devices, isLoading, refetch } = useQuery({
    queryKey: ['mikrotik-devices'],
    queryFn: mikrotikApi.getAll,
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" />
            MikroTik Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor MikroTik routers</p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Model / OS</TableHead>
              <TableHead>Resources (CPU/Mem)</TableHead>
              <TableHead>Active PPPoE</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading devices...</TableCell>
              </TableRow>
            ) : devices?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">No MikroTik devices found</TableCell>
              </TableRow>
            ) : (
              devices?.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{device.model}</span>
                      <span className="text-xs text-gray-500">v{device.version} ({device.architecture})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{device.cpuLoad}% / {device.memoryUsage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{device.activePppoe}</TableCell>
                  <TableCell>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'} className={device.status === 'online' ? 'bg-green-500' : ''}>
                      {device.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/mikrotik/${device.id}`)}>
                      Manage
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}