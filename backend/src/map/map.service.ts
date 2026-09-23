import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  async getNodesGeoJson() {
    const pops = await this.prisma.pop.findMany({
      where: { latitude: { not: null }, longitude: { not: null } }
    });
    const devices = await this.prisma.device.findMany({
      where: { latitude: { not: null }, longitude: { not: null } }
    });
    const nodes = await this.prisma.networkNode.findMany({
      where: { latitude: { not: null }, longitude: { not: null } }
    });

    const features = [];

    for (const pop of pops) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(pop.longitude), Number(pop.latitude)]
        },
        properties: {
          id: pop.id,
          type: 'POP',
          name: pop.name,
          status: pop.isActive ? 'ACTIVE' : 'INACTIVE',
          code: pop.code
        }
      });
    }

    for (const dev of devices) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(dev.longitude), Number(dev.latitude)]
        },
        properties: {
          id: dev.id,
          type: dev.type,
          name: dev.name,
          status: dev.status,
          ip: dev.ipAddress
        }
      });
    }

    for (const node of nodes) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(node.longitude), Number(node.latitude)]
        },
        properties: {
          id: node.id,
          type: node.type,
          name: node.name,
          status: node.status
        }
      });
    }

    return {
      type: 'FeatureCollection',
      features
    };
  }

  async getRoutesGeoJson() {
    const routes = await this.prisma.fiberRoute.findMany({
      where: { geometry: { not: null } }
    });

    const features = routes.map(route => {
      // route.geometry is expected to be a GeoJSON Geometry object
      return {
        type: 'Feature',
        geometry: route.geometry,
        properties: {
          id: route.id,
          name: route.name,
          fiberType: route.fiberType,
          length: route.totalLengthKm ? Number(route.totalLengthKm) : null,
          status: route.status
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features
    };
  }

  async getTopology() {
    const pops = await this.prisma.pop.findMany();
    const devices = await this.prisma.device.findMany();
    const networkNodes = await this.prisma.networkNode.findMany();

    const nodes = [];
    const edges = [];

    // Add Pop nodes
    pops.forEach(pop => {
      nodes.push({ id: pop.id, label: pop.name, type: 'POP', group: 'pop' });
    });

    // Add Device nodes & edges to Pop
    devices.forEach(dev => {
      nodes.push({ id: dev.id, label: dev.name, type: dev.type, status: dev.status, group: 'device' });
      if (dev.popId) {
        edges.push({ source: dev.popId, target: dev.id, type: 'hierarchy' });
      }
    });

    // Add NetworkNode nodes & edges
    networkNodes.forEach(node => {
      nodes.push({ id: node.id, label: node.name, type: node.type, status: node.status, group: 'node' });
      if (node.popId) {
        edges.push({ source: node.popId, target: node.id, type: 'hierarchy' });
      }
      if (node.parentNodeId) {
        edges.push({ source: node.parentNodeId, target: node.id, type: 'parent-child' });
      }
    });

    // NetworkLinks (Device to Device)
    const links = await this.prisma.networkLink.findMany();
    links.forEach(link => {
      edges.push({
        id: link.id,
        source: link.sourceDeviceId,
        target: link.targetDeviceId,
        type: link.linkType || 'link',
        status: link.status
      });
    });

    // FiberRoutes (Node to Node)
    const routes = await this.prisma.fiberRoute.findMany();
    routes.forEach(route => {
      edges.push({
        id: route.id,
        source: route.sourceNodeId,
        target: route.targetNodeId,
        type: 'fiber',
        status: route.status,
        label: route.name
      });
    });

    return { nodes, edges };
  }
}
