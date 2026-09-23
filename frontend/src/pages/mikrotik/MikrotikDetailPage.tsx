import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mikrotikApi } from '../../api/mikrotik.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cpu, MemoryStick, Activity, Users, Globe, Router } from 'lucide-react';

export default function MikrotikDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: device, isLoading: loadingDevice } = useQuery({
    queryKey: ['mikrotik-device', id],
    queryFn: () => mikrotikApi.getById(id!),
    enabled: !!id,
  });

  const { data: interfaces } = useQuery({
    queryKey: ['mikrotik-interfaces', id],
    queryFn: () => mikrotikApi.getInterfaces(id!),
    enabled: !!id,
  });

  const { data: pppoe } = useQuery({
    queryKey: ['mikrotik-pppoe', id],
    queryFn: () => mikrotikApi.getPppoe(id!),
    enabled: !!id,
  });

  const { data: dhcp } = useQuery({
    queryKey: ['mikrotik-dhcp', id],
    queryFn: () => mikrotikApi.getDhcp(id!),
    enabled: !!id,
  });

  const { data: bgp } = useQuery({
    queryKey: ['mikrotik-bgp', id],
    queryFn: () => mikrotikApi.getBgp(id!),
    enabled: !!id,
  });

  if (loadingDevice) return <div className="p-6">Loading router data...</div>;
  if (!device) return <div className="p-6">Router not found</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mikrotik')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {device.name}
            <Badge variant={device.status === 'online' ? 'default' : 'destructive'} className={device.status === 'online' ? 'bg-green-500' : ''}>
              {device.status.toUpperCase()}
            </Badge>
          </h1>
          <p className="text-gray-500 text-sm">IP: {device.ipAddress} • Uptime: {device.uptime}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> CPU Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.cpuLoad}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MemoryStick className="w-4 h-4" /> Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.memoryUsage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" /> Active PPPoE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.activePppoe}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Activity className="w-4 h-4" /> System Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-semibold">{device.model}</span><br/>
              ROS v{device.version} ({device.architecture})
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interfaces">
        <TabsList className="mb-4">
          <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
          <TabsTrigger value="pppoe">PPPoE Sessions</TabsTrigger>
          <TabsTrigger value="dhcp">DHCP Leases</TabsTrigger>
          <TabsTrigger value="bgp">Routing / BGP</TabsTrigger>
        </TabsList>

        <TabsContent value="interfaces" className="border rounded-md bg-white p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>MTU</TableHead>
                <TableHead>TX / RX (Bytes)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interfaces?.map(iface => (
                <TableRow key={iface.id}>
                  <TableCell className="font-medium">{iface.name}</TableCell>
                  <TableCell>{iface.type}</TableCell>
                  <TableCell>{iface.mtu}</TableCell>
                  <TableCell>{(iface.txByte / 1024 / 1024).toFixed(2)} MB / {(iface.rxByte / 1024 / 1024).toFixed(2)} MB</TableCell>
                  <TableCell>
                    {iface.running ? <Badge className="bg-green-500">Running</Badge> : <Badge variant="secondary">Down</Badge>}
                  </TableCell>
                </TableRow>
              ))}
              {!interfaces?.length && <TableRow><TableCell colSpan={5} className="text-center py-4">No interfaces data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="pppoe" className="border rounded-md bg-white p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Caller ID (MAC)</TableHead>
                <TableHead>Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pppoe?.map(session => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.user}</TableCell>
                  <TableCell>{session.address}</TableCell>
                  <TableCell>{session.callerId}</TableCell>
                  <TableCell>{session.uptime}</TableCell>
                </TableRow>
              ))}
              {!pppoe?.length && <TableRow><TableCell colSpan={4} className="text-center py-4">No active PPPoE sessions</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="dhcp" className="border rounded-md bg-white p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dhcp?.map(lease => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium">{lease.address}</TableCell>
                  <TableCell>{lease.macAddress}</TableCell>
                  <TableCell>{lease.hostname}</TableCell>
                  <TableCell><Badge variant="outline">{lease.status}</Badge></TableCell>
                </TableRow>
              ))}
              {!dhcp?.length && <TableRow><TableCell colSpan={4} className="text-center py-4">No DHCP leases</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="bgp" className="border rounded-md bg-white p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Peer Name</TableHead>
                <TableHead>Remote Address</TableHead>
                <TableHead>Remote AS</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bgp?.map(peer => (
                <TableRow key={peer.id}>
                  <TableCell className="font-medium">{peer.name}</TableCell>
                  <TableCell>{peer.remoteAddress}</TableCell>
                  <TableCell>{peer.remoteAs}</TableCell>
                  <TableCell>
                    <Badge variant={peer.state === 'established' ? 'default' : 'secondary'} className={peer.state === 'established' ? 'bg-green-500' : ''}>
                      {peer.state}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!bgp?.length && <TableRow><TableCell colSpan={4} className="text-center py-4">No BGP peers</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}