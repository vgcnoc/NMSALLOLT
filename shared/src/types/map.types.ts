import { DeviceType, DeviceStatus, NetworkNodeType } from './device.types';

export interface MapDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  type: NetworkNodeType;
}

export interface MapTopology {
  nodes: { id: string; label: string; lat: number; lng: number }[];
  edges: { source: string; target: string; color?: string }[];
}

export interface FiberRouteGeoJSON {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: number[][]; // [lng, lat][]
    };
    properties: {
      id: string;
      name: string;
      status: string;
    };
  }[];
}
