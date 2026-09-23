import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PERMISSIONS = [
  { code: 'device.view', name: 'View Devices', module: 'Devices' },
  { code: 'device.create', name: 'Create Device', module: 'Devices' },
  { code: 'device.update', name: 'Update Device', module: 'Devices' },
  { code: 'device.delete', name: 'Delete Device', module: 'Devices' },
  { code: 'device.execute', name: 'Execute Device Commands', module: 'Devices' },
  { code: 'olt.manage', name: 'Manage OLTs', module: 'OLT' },
  { code: 'olt.view', name: 'View OLTs', module: 'OLT' },
  { code: 'ont.view', name: 'View ONTs', module: 'ONT' },
  { code: 'ont.manage', name: 'Manage ONTs', module: 'ONT' },
  { code: 'mikrotik.manage', name: 'Manage MikroTik', module: 'MikroTik' },
  { code: 'mikrotik.view', name: 'View MikroTik', module: 'MikroTik' },
  { code: 'genieacs.manage', name: 'Manage GenieACS', module: 'GenieACS' },
  { code: 'genieacs.view', name: 'View GenieACS', module: 'GenieACS' },
  { code: 'map.manage', name: 'Manage Maps', module: 'Map' },
  { code: 'map.view', name: 'View Maps', module: 'Map' },
  { code: 'alarm.manage', name: 'Manage Alarms', module: 'Alarm' },
  { code: 'alarm.view', name: 'View Alarms', module: 'Alarm' },
  { code: 'alarm.acknowledge', name: 'Acknowledge Alarms', module: 'Alarm' },
  { code: 'user.manage', name: 'Manage Users', module: 'User' },
  { code: 'user.view', name: 'View Users', module: 'User' },
  { code: 'role.manage', name: 'Manage Roles', module: 'Role' },
  { code: 'role.view', name: 'View Roles', module: 'Role' },
  { code: 'audit.view', name: 'View Audit Logs', module: 'Audit' },
  { code: 'notification.manage', name: 'Manage Notifications', module: 'Notification' },
  { code: 'report.view', name: 'View Reports', module: 'Report' },
  { code: 'discovery.execute', name: 'Execute Discovery', module: 'Discovery' },
  { code: 'settings.manage', name: 'Manage Settings', module: 'Settings' },
  { code: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard' },
];

async function main() {
  console.log('Seeding database...');

  // 1. Create Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  // 2. Create Roles
  const rolesData = [
    { name: 'Super Admin', desc: 'Full access to all features', perms: allPermissions.map(p => p.id) },
    { name: 'NOC', desc: 'Network Operations Center', perms: allPermissions.filter(p => ['dashboard.view', 'alarm.view', 'alarm.acknowledge', 'device.view', 'olt.view', 'ont.view', 'mikrotik.view'].includes(p.code)).map(p => p.id) },
    { name: 'Network Engineer', desc: 'Network Configuration', perms: allPermissions.filter(p => !['user.manage', 'role.manage'].includes(p.code)).map(p => p.id) },
    { name: 'Technician', desc: 'Field Technician', perms: allPermissions.filter(p => ['dashboard.view', 'device.view', 'ont.view', 'alarm.view', 'alarm.acknowledge'].includes(p.code)).map(p => p.id) },
    { name: 'Viewer', desc: 'Read-only access', perms: allPermissions.filter(p => p.code.endsWith('.view')).map(p => p.id) },
  ];

  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.desc },
      create: { name: r.name, description: r.desc },
    });

    // Assign permissions
    for (const pId of r.perms) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: pId } },
        update: {},
        create: { roleId: role.id, permissionId: pId },
      });
    }
  }

  // 3. Create Default Admin User
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nms.local' },
    update: { passwordHash: adminPassword },
    create: {
      name: 'System Administrator',
      email: 'admin@nms.local',
      passwordHash: adminPassword,
      isActive: true,
    },
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
