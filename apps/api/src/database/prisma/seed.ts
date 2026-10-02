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

  const coordAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'coordenacao@cursinhoalpha.com.br',
      },
    },
    update: {
      role: UserRole.admin,
      isActive: true,
    },
    create: {
      tenantId: tenant.id,
      name: 'Coordenação Geral Alpha',
      email: 'coordenacao@cursinhoalpha.com.br',
      passwordHash,
      role: UserRole.admin,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`✅ Admin users seeded: ${admin.email}, ${coordAdmin.email}`);

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

  // 4. Create initial Course with Modules and Lessons
  const course = await prisma.course.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: 'preparatorio-enem-2027',
      },
    },
    update: {
      isPublished: true,
      status: 'published',
    },
    create: {
      tenantId: tenant.id,
      title: 'Preparatório Extensivo ENEM 2027 Completo',
      slug: 'preparatorio-enem-2027',
      description: 'Curso completo cobrindo todas as 4 áreas do conhecimento do ENEM + Redação nota 1000.',
      longDescription: 'O curso mais completo para quem quer gabaritar o ENEM. Metodologia testada com mais de 12.000 alunos aprovados.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
      category: 'ENEM',
      tags: ['ENEM', 'vestibular', 'extensivo'],
      priceCents: 29900,
      originalPriceCents: 49900,
      isFree: false,
      isPublished: true,
      status: 'published',
      publishedAt: new Date(),
      totalLessons: 3,
      totalDurationMinutes: 52,
      sortOrder: 1,
      modules: {
        create: [
          {
            tenantId: tenant.id,
            title: 'Módulo 1: Introdução & Estratégias',
            isPublished: true,
            sortOrder: 1,
            lessons: {
              create: [
                {
                  tenantId: tenant.id,
                  title: 'Boas-vindas e Como Organizar seu Cronograma',
                  slug: 'boas-vindas-cronograma',
                  durationMinutes: 12,
                  isPublished: true,
                  isFreePreview: true,
                  sortOrder: 1,
                },
                {
                  tenantId: tenant.id,
                  title: 'Entendendo a Matriz de Competências e a TRI',
                  slug: 'matriz-competencias-tri',
                  durationMinutes: 18,
                  isPublished: true,
                  isFreePreview: false,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            tenantId: tenant.id,
            title: 'Módulo 2: Matemática Básica Essencial',
            isPublished: true,
            sortOrder: 2,
            lessons: {
              create: [
                {
                  tenantId: tenant.id,
                  title: 'Aritmética Rápida, Frações e Decimais',
                  slug: 'aritmetica-fracoes-decimais',
                  durationMinutes: 22,
                  isPublished: true,
                  isFreePreview: false,
                  sortOrder: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✅ Course seeded: ${course.title}`);

  // 5. Create initial Questions
  const questionsData = [
    {
      subject: 'Física',
      topic: 'Mecânica / Cinemática',
      difficulty: 'medium' as const,
      statement: 'Um veículo trafega em uma rodovia retilínea com velocidade constante de 72 km/h. Ao avistar um obstáculo, o motorista aciona os freios com desaceleração constante de 4 m/s² até a parada completa.\n\nQual é a distância percorrida pelo veículo durante o processo de frenagem?',
      explanation: 'Conversão: 72 km/h = 20 m/s.\nUsando Torricelli: v² = v₀² + 2aΔs → 0 = 400 + 2×(-4)×Δs → Δs = 50 metros.',
      tags: ['cinemática', 'ENEM', 'frenagem'],
      options: [
        { label: 'A', text: '50 metros', isCorrect: true, sortOrder: 1 },
        { label: 'B', text: '100 metros', isCorrect: false, sortOrder: 2 },
        { label: 'C', text: '25 metros', isCorrect: false, sortOrder: 3 },
        { label: 'D', text: '72 metros', isCorrect: false, sortOrder: 4 },
      ],
    },
    {
      subject: 'Matemática',
      topic: 'Geometria Plana',
      difficulty: 'easy' as const,
      statement: 'Uma praça circular possui raio medindo 10 metros. A prefeitura deseja cercar toda a praça com uma fita de isolamento.\n\nConsiderando π = 3,14, quantos metros de fita serão necessários no mínimo?',
      explanation: 'Circunferência = 2πr = 2 × 3,14 × 10 = 62,8 metros.',
      tags: ['geometria', 'circunferência', 'ENEM'],
      options: [
        { label: 'A', text: '31,4 metros', isCorrect: false, sortOrder: 1 },
        { label: 'B', text: '62,8 metros', isCorrect: true, sortOrder: 2 },
        { label: 'C', text: '314 metros', isCorrect: false, sortOrder: 3 },
        { label: 'D', text: '100 metros', isCorrect: false, sortOrder: 4 },
      ],
    },
    {
      subject: 'Química',
      topic: 'Estequiometria',
      difficulty: 'hard' as const,
      statement: 'Na combustão completa de 1 mol de gás metano (CH₄) em presença de oxigênio (O₂), produzem-se CO₂ e H₂O.\n\nQual é o volume de CO₂ produzido nas CNTP? (Volume molar = 22,4 L/mol)',
      explanation: 'Equação: CH₄ + 2O₂ → CO₂ + 2H₂O.\n1 mol CH₄ produz 1 mol CO₂.\nNas CNTP: 1 mol = 22,4 Litros.',
      tags: ['estequiometria', 'combustão', 'ENEM', 'CNTP'],
      options: [
        { label: 'A', text: '22,4 Litros', isCorrect: true, sortOrder: 1 },
        { label: 'B', text: '44,8 Litros', isCorrect: false, sortOrder: 2 },
        { label: 'C', text: '11,2 Litros', isCorrect: false, sortOrder: 3 },
        { label: 'D', text: '18,0 Litros', isCorrect: false, sortOrder: 4 },
      ],
    },
    {
      subject: 'Biologia',
      topic: 'Genética / DNA',
      difficulty: 'medium' as const,
      statement: 'O DNA possui estrutura em dupla hélice formada por pares de bases nitrogenadas.\n\nSe uma fita do DNA tem a sequência ATCGTA, qual é a sequência complementar na outra fita?',
      explanation: 'Regra de complementaridade: A↔T e C↔G.\nATCGTA → TAGCAT.',
      tags: ['DNA', 'biologia', 'ENEM', 'genética'],
      options: [
        { label: 'A', text: 'TAGCAT', isCorrect: true, sortOrder: 1 },
        { label: 'B', text: 'ATCGTA', isCorrect: false, sortOrder: 2 },
        { label: 'C', text: 'UAGCAU', isCorrect: false, sortOrder: 3 },
        { label: 'D', text: 'GCATCG', isCorrect: false, sortOrder: 4 },
      ],
    },
  ];

  const createdQuestionIds: string[] = [];
  for (const qData of questionsData) {
    let question = await prisma.question.findFirst({
      where: { tenantId: tenant.id, statement: qData.statement },
    });
    if (!question) {
      question = await prisma.question.create({
        data: {
          tenantId: tenant.id,
          subject: qData.subject,
          topic: qData.topic,
          difficulty: qData.difficulty,
          statement: qData.statement,
          explanation: qData.explanation,
          tags: qData.tags,
          createdBy: admin.id,
          options: {
            create: qData.options,
          },
        },
      });
    }
    createdQuestionIds.push(question.id);
  }
  console.log(`✅ ${createdQuestionIds.length} Questions seeded`);

  // 6. Create initial Simulado / Quiz
  let quiz = await prisma.quiz.findFirst({
    where: { tenantId: tenant.id, title: 'Simulado 1º Dia ENEM — Linguagens & Humanas' },
  });
  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        tenantId: tenant.id,
        title: 'Simulado 1º Dia ENEM — Linguagens & Humanas',
        description: 'Simulado com cronômetro rigoroso e gabarito comentado ao finalizar.',
        timeLimitMinutes: 180,
        maxAttempts: 3,
        questionCount: createdQuestionIds.length,
        isPublished: true,
        quizQuestions: {
          create: createdQuestionIds.map((qId, idx) => ({
            questionId: qId,
            sortOrder: idx + 1,
          })),
        },
      },
    });
  }
  console.log(`✅ Quiz seeded: ${quiz.title}`);

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
