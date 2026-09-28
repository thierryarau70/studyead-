import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create or ensure default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: DEFAULT_TENANT_ID },
    update: {
      name: 'Cursinho Preparatório Alpha',
      slug: 'alpha',
      isActive: true,
    },
    create: {
      id: DEFAULT_TENANT_ID,
      name: 'Cursinho Preparatório Alpha',
      slug: 'alpha',
      isActive: true,
      settings: {
        create: {
          siteTitle: 'Cursinho Alpha — Preparatório para Concursos e Vestibulares',
          siteDescription: 'Plataforma oficial de estudos do Cursinho Alpha.',
          primaryColor: '#2563EB',
          secondaryColor: '#1E40AF',
          accentColor: '#F59E0B',
          contactEmail: 'contato@cursinhoalpha.com.br',
          contactPhone: '(11) 99999-9999',
          paymentGateway: 'stripe',
        },
      },
    },
  });

  console.log(`✅ Tenant created or updated: ${tenant.name} (${tenant.id})`);

  // 2. Create initial Admin user
  const adminEmail = 'admin@cursinhoalpha.com.br';
  const passwordHash = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: adminEmail,
      },
    },
    update: {
      role: UserRole.admin,
      isActive: true,
    },
    create: {
      tenantId: tenant.id,
      name: 'Administradora do Cursinho',
      email: adminEmail,
      passwordHash,
      role: UserRole.admin,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 3. Create sample Student user
  const studentEmail = 'aluno@cursinhoalpha.com.br';
  const studentPasswordHash = await bcrypt.hash('Aluno@123456', 12);

  const student = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: studentEmail,
      },
    },
    update: {
      role: UserRole.student,
      isActive: true,
    },
    create: {
      tenantId: tenant.id,
      name: 'Aluno Demonstração',
      email: studentEmail,
      passwordHash: studentPasswordHash,
      role: UserRole.student,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`✅ Student user seeded: ${student.email}`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
