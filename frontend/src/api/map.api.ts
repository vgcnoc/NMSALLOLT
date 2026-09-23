import { api } from './api';

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any[];
  };
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export const mapApi = {
  getNodes: () => api.get<GeoJSONFeatureCollection>('/map/nodes'),
  getRoutes: () => api.get<GeoJSONFeatureCollection>('/map/routes'),
  getTopology: () => api.get<any>('/network/topology'),
};
