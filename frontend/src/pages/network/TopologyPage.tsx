import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent } from '@/components/ui/card';

export default function TopologyPage() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const myChart = echarts.init(chartRef.current);
    
    const mockData = {
      nodes: [
        { id: '0', name: 'MikroTik CCR', category: 0, symbolSize: 50 },
        { id: '1', name: 'ZTE C320 OLT', category: 1, symbolSize: 40 },
        { id: '2', name: 'PON 1/1/1', category: 2, symbolSize: 30 },
        { id: '3', name: 'PON 1/1/2', category: 2, symbolSize: 30 },
        { id: '4', name: 'ODC-01', category: 3, symbolSize: 25 },
        { id: '5', name: 'ODP-01', category: 4, symbolSize: 20 },
        { id: '6', name: 'ODP-02', category: 4, symbolSize: 20 },
        { id: '7', name: 'ONT-John', category: 5, symbolSize: 15 },
        { id: '8', name: 'ONT-Jane', category: 5, symbolSize: 15 },
      ],
      links: [
        { source: '0', target: '1' },
        { source: '1', target: '2' },
        { source: '1', target: '3' },
        { source: '2', target: '4' },
        { source: '4', target: '5' },
        { source: '4', target: '6' },
        { source: '5', target: '7' },
        { source: '5', target: '8' },
      ],
      categories: [
        { name: 'Router' },
        { name: 'OLT' },
        { name: 'PON Port' },
        { name: 'ODC' },
        { name: 'ODP' },
        { name: 'ONT' },
      ]
    };

    const option = {
      title: {
        text: 'Network Logical Topology',
        subtext: 'Hierarchy: MikroTik -> OLT -> PON -> ODC -> ODP -> ONT',
        top: 'bottom',
        left: 'right'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      legend: [{
        data: mockData.categories.map(a => a.name)
      }],
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: 'Network Topology',
          type: 'graph',
          layout: 'force',
          data: mockData.nodes,
          links: mockData.links,
          categories: mockData.categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          force: {
            repulsion: 300,
            edgeLength: 100
          },
          lineStyle: {
            color: 'source',
            curveness: 0.1
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10
            }
          }
        }
      ]
    };

    myChart.setOption(option);
    
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Logical Topology</h1>
      <Card className="flex-1 min-h-[600px]">
        <CardContent className="p-6 h-full flex flex-col">
          <div ref={chartRef} className="flex-1 w-full h-full min-h-[500px]" />
        </CardContent>
      </Card>
    </div>
  );
}