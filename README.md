# ISP Network Management System (NMS)

A modern, scalable, and production-ready Network Management System designed specifically for Internet Service Providers (ISPs).

## Architecture

This is a monorepo containing:
- **Backend**: NestJS, Prisma, PostgreSQL + TimescaleDB, Redis, BullMQ
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, MapLibre, ECharts
- **Shared**: TypeScript interfaces and constants shared between frontend and backend

## Key Features

1. **OLT Management**: Vendor-agnostic driver system (ZTE, Huawei, C-Data) via SNMP and SSH.
2. **ONT/ONU Monitoring**: Real-time Rx/Tx optical power monitoring and discovery.
3. **MikroTik Integration**: RouterOS API integration for CPU, Interfaces, PPPoE sessions, and BGP peers.
4. **GenieACS (TR-069)**: CPE auto-provisioning and remote management.
5. **Network Topology & GIS**: Geographic mapping of POPs, ODCs, ODPs, and fiber routes using MapLibre.
6. **Alarms & Notifications**: Real-time alarm processing engine with threshold rules.
7. **Role-Based Access Control**: Granular permissions and audit logging.

## Development Setup

### 1. Requirements
- Node.js v20+
- Docker and Docker Compose

### 2. Infrastructure
Start the database (PostgreSQL) and queue (Redis):
```bash
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```
*Note: The backend runs on port 3000.*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend runs on port 5173.*

## Production Deployment

You can deploy the entire stack using the production Docker Compose file:

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build
```

This will spin up:
- PostgreSQL + TimescaleDB
- Redis
- Backend API Service
- Frontend Nginx Web Server (Port 80)

## Default Credentials
After running the Prisma seed, you can log in with:
- **Email**: `admin@nms.local`
- **Password**: `admin123`
