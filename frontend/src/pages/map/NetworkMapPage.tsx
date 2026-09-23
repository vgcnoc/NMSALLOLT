import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NetworkMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showInactive, setShowInactive] = useState(true);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [106.8272, -6.1751],
      zoom: 12,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Mock data for routes
      const routesData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: 1, name: 'Main Backbone', status: 'active' },
            geometry: {
              type: 'LineString',
              coordinates: [
                [106.8272, -6.1751],
                [106.8372, -6.1851],
                [106.8472, -6.1751]
              ]
            }
          }
        ]
      };

      // Mock data for nodes
      const nodesData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: 'node1', name: 'POP-01', type: 'POP', status: 'ONLINE', details: 'Core Router' },
            geometry: { type: 'Point', coordinates: [106.8272, -6.1751] }
          },
          {
            type: 'Feature',
            properties: { id: 'node2', name: 'ODC-01', type: 'ODC', status: 'ONLINE', details: 'Dist Box 1' },
            geometry: { type: 'Point', coordinates: [106.8372, -6.1851] }
          },
          {
            type: 'Feature',
            properties: { id: 'node3', name: 'ODP-01', type: 'ODP', status: 'OFFLINE', details: 'Pole Box 1' },
            geometry: { type: 'Point', coordinates: [106.8472, -6.1751] }
          }
        ]
      };

      map.current.addSource('routes', {
        type: 'geojson',
        data: routesData as any
      });

      map.current.addLayer({
        id: 'routes-layer',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4
        }
      });

      map.current.addSource('nodes', {
        type: 'geojson',
        data: nodesData as any
      });

      map.current.addLayer({
        id: 'nodes-layer',
        type: 'circle',
        source: 'nodes',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'status'],
            'ONLINE', '#22c55e',
            'OFFLINE', '#ef4444',
            '#94a3b8'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      map.current.on('click', 'nodes-layer', (e) => {
        if (!e.features || !e.features[0]) return;
        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const props = feature.properties as any;

        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-lg mb-1">${props.name}</h3>
            <div class="flex gap-2 mb-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">${props.type}</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${props.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${props.status}</span>
            </div>
            <p class="text-sm text-gray-500 mb-3">${props.details}</p>
            <a href="/devices/${props.id}" class="text-sm text-blue-600 hover:underline">View Device Details &rarr;</a>
          </div>
        `;

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map.current!);
      });

      map.current.on('mouseenter', 'nodes-layer', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'nodes-layer', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    if (showRoutes) {
      map.current.setLayoutProperty('routes-layer', 'visibility', 'visible');
    } else {
      map.current.setLayoutProperty('routes-layer', 'visibility', 'none');
    }
  }, [showRoutes]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    if (showInactive) {
      map.current.setFilter('nodes-layer', null);
    } else {
      map.current.setFilter('nodes-layer', ['==', 'status', 'ONLINE']);
    }
  }, [showInactive]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Network Map</h1>
        <div className="flex gap-4 bg-white p-2 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Switch id="routes" checked={showRoutes} onCheckedChange={setShowRoutes} />
            <Label htmlFor="routes">Fiber Routes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="inactive" checked={showInactive} onCheckedChange={setShowInactive} />
            <Label htmlFor="inactive">Offline Nodes</Label>
          </div>
        </div>
      </div>
      
      <Card className="flex-1 min-h-[600px] relative overflow-hidden p-0">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border w-48 z-10">
          <h4 className="font-semibold mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-sm" />
              <span className="text-sm">Online Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow-sm" />
              <span className="text-sm">Offline Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-[#3b82f6] rounded" />
              <span className="text-sm">Fiber Route</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}