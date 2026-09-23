import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, HardDrive, Network } from 'lucide-react';
import { useParams } from 'react-router-dom';

const generateTimeData = () => {
  const data = [];
  let now = new Date();
  for (let i = 0; i < 24; i++) {
    data.push(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    now.setHours(now.getHours() - 1);
  }
  return data.reverse();
};

const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export default function DeviceDetailPage() {
  const { id } = useParams();
  const timeData = generateTimeData();

  const trafficOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Inbound', 'Outbound'], textStyle: { color: '#888' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: timeData, axisLabel: { color: '#888' } },
    yAxis: { type: 'value', axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#333', type: 'dashed' } } },
    series: [
      {
        name: 'Inbound', type: 'line', smooth: true,
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.5)' }, { offset: 1, color: 'rgba(59,130,246,0.05)' }]
          }
        },
        data: generateRandomData(24, 200, 800)
      },
      {
        name: 'Outbound', type: 'line', smooth: true,
        itemStyle: { color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(16,185,129,0.5)' }, { offset: 1, color: 'rgba(16,185,129,0.05)' }]
          }
        },
        data: generateRandomData(24, 150, 600)
      }
    ]
  };

  const cpuOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: timeData, axisLabel: { color: '#888' } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#333', type: 'dashed' } } },
    series: [{
      name: 'CPU Usage', type: 'line', smooth: true,
      itemStyle: { color: '#ef4444' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(239,68,68,0.5)' }, { offset: 1, color: 'rgba(239,68,68,0.05)' }]
        }
      },
      data: generateRandomData(24, 20, 85)
    }]
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Device Details: OLT-{id || '123'}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-600">Online</Badge>
            <span className="text-sm text-muted-foreground">Uptime: 45d 12h 30m</span>
            <span className="text-sm text-muted-foreground">IP: 10.0.1.5</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Normal load</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">2.4GB / 4.0GB</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PON Ports</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 / 16</div>
            <p className="text-xs text-muted-foreground">2 ports offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ONUs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic (Mbps)</CardTitle>
            <CardDescription>24-hour traffic profile for this OLT.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ReactECharts option={trafficOption} style={{ height: '350px', width: '100%' }} theme="dark" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>CPU Utilization</CardTitle>
            <CardDescription>24-hour CPU load history.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ReactECharts option={cpuOption} style={{ height: '350px', width: '100%' }} theme="dark" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}