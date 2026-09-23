import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { genieAcsApi, GenieDevice } from '../../api/genieacs.api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Power, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function GenieDevicesPage() {
  const { data: devices, isLoading, refetch } = useQuery({
    queryKey: ['genieacs-devices'],
    queryFn: genieAcsApi.getDevices,
  });

  const refreshMutation = useMutation({
    mutationFn: (id: string) => genieAcsApi.refresh(id),
    onSuccess: () => {
      toast.success('Device refresh triggered');
      refetch();
    },
    onError: () => toast.error('Failed to refresh device'),
  });

  const rebootMutation = useMutation({
    mutationFn: (id: string) => genieAcsApi.reboot(id),
    onSuccess: () => toast.success('Device reboot triggered'),
    onError: () => toast.error('Failed to reboot device'),
  });

  const factoryResetMutation = useMutation({
    mutationFn: (id: string) => genieAcsApi.factoryReset(id),
    onSuccess: () => toast.success('Factory reset triggered'),
    onError: () => toast.error('Failed to factory reset device'),
  });

  const handleReboot = (id: string) => {
    if (window.confirm('Are you sure you want to reboot this device?')) {
      rebootMutation.mutate(id);
    }
  };

  const handleFactoryReset = (id: string) => {
    if (window.confirm('Are you sure you want to factory reset this device? This will erase all configuration!')) {
      factoryResetMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GenieACS Devices (TR-069)</h1>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh List
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Product Class</TableHead>
              <TableHead>Software Version</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Last Inform</TableHead>
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
                <TableCell colSpan={7} className="text-center py-8">No devices found</TableCell>
              </TableRow>
            ) : (
              devices?.map((device) => (
                <TableRow key={device._id}>
                  <TableCell className="font-mono text-xs">{device._id}</TableCell>
                  <TableCell>{device.manufacturer}</TableCell>
                  <TableCell>{device.productClass}</TableCell>
                  <TableCell>{device.softwareVersion}</TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell>{new Date(device.lastInform).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => refreshMutation.mutate(device._id)} title="Refresh Device">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleReboot(device._id)} title="Reboot">
                        <Power className="w-4 h-4 text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleFactoryReset(device._id)} title="Factory Reset">
                        <RotateCcw className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
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