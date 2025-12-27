const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const specialty = process.argv[2] || 'Neurology';

async function main() {
  console.log(`Checking DB for specialty: "${specialty}"`);

  const exact = await prisma.user.findMany({
    where: {
      role: 'DOCTOR',
      specialty: specialty,
    },
    select: { id: true, name: true, email: true, specialty: true, verificationStatus: true },
  });

  const ci = await prisma.user.findMany({
    where: {
      role: 'DOCTOR',
      specialty: { contains: specialty, mode: 'insensitive' },
    },
    select: { id: true, name: true, email: true, specialty: true, verificationStatus: true },
  });

  console.log(`\nExact matches: ${exact.length}`);
  console.table(exact);

  console.log(`\nCase-insensitive contains matches: ${ci.length}`);
  console.table(ci);

  if (exact.length === 0 && ci.length > 0) {
    console.log('\nNote: matches found only by case-insensitive contains; you might want to normalize specialties when saving or querying.');
  }

  if (exact.length === 0 && ci.length === 0) {
    console.log('\nNo doctors found for this specialty. Check that your DATABASE_URL points to the correct database or that doctors are marked with `verificationStatus: VERIFIED`.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
