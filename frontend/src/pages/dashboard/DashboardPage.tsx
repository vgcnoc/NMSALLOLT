import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, Users, AlertTriangle } from 'lucide-react';

const generateTimeData = () => {
  const data = [];
  let now = new Date();
  for (let i = 0; i < 7; i++) {
    data.push(now.toLocaleDateString([], { weekday: 'short' }));
    now.setDate(now.getDate() - 1);
  }
  return data.reverse();
};

export default function DashboardPage() {
  const timeData = generateTimeData();

  const overviewOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Total Traffic (Gbps)'], textStyle: { color: '#888' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: timeData, axisLabel: { color: '#888' } },
    yAxis: { type: 'value', axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#333', type: 'dashed' } } },
    series: [
      {
        name: 'Total Traffic (Gbps)', type: 'line', smooth: true,
        itemStyle: { color: '#8b5cf6' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(139,92,246,0.5)' }, { offset: 1, color: 'rgba(139,92,246,0.05)' }]
          }
        },
        data: [12, 14, 11, 16, 18, 15, 20]
      }
    ]
  };

  const alarmOption = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center', textStyle: { color: '#888' } },
    series: [
      {
        name: 'Alarms',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#111827',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' }
        },
        labelLine: { show: false },
        data: [
          { value: 5, name: 'Critical', itemStyle: { color: '#ef4444' } },
          { value: 12, name: 'Warning', itemStyle: { color: '#f59e0b' } },
          { value: 24, name: 'Info', itemStyle: { color: '#3b82f6' } }
        ]
      }
    ]
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OLTs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">3 offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ONUs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+180 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5 Gbps</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41</div>
            <p className="text-xs text-muted-foreground">5 Critical, 12 Warning</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Network Overview</CardTitle>
            <CardDescription>Aggregate traffic across all managed devices for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ReactECharts option={overviewOption} style={{ height: '350px', width: '100%' }} theme="dark" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alarms by Severity</CardTitle>
            <CardDescription>Current active alarms distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={alarmOption} style={{ height: '350px', width: '100%' }} theme="dark" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
