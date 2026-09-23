const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const dev = await prisma.device.create({
    data: {
      name: 'ZTE-C320-Main',
      type: 'OLT',
      vendor: 'ZTE',
      model: 'C320',
      ipAddress: '10.0.0.1',
      status: 'ONLINE'
    }
  });
  await prisma.olt.create({
    data: {
      deviceId: dev.id,
      oltType: 'C320',
      totalPonPorts: 16,
      totalBoards: 2
    }
  });
  console.log('Seeded OLT');
}
main().finally(() => prisma.$disconnect());
