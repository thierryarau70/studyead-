const API_BASE = 'https://studyead.onrender.com/api/v1';

async function main() {
  console.log('Logging in as admin...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@cursinhoalpha.com.br',
      password: 'Admin@123456',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.data.tokens.accessToken;
  console.log('Login successful!');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 1. Create Courses
  const coursesToSeed = [
    {
      title: 'Preparatório Extensivo ENEM 2027 Completo',
      slug: 'preparatorio-enem-2027-completo',
      description: 'Curso completo cobrindo todas as 4 áreas do conhecimento do ENEM + Redação nota 1000.',
      longDescription: 'O curso mais completo para quem quer gabaritar o ENEM. Metodologia testada com mais de 12.000 alunos aprovados.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
      category: 'ENEM',
      tags: ['ENEM', 'vestibular', 'extensivo'],
      priceCents: 29900,
      originalPriceCents: 49900,
      isFree: false,
    },
    {
      title: 'Medicina Alta Performance — Bio & Química',
      slug: 'medicina-alta-performance',
      description: 'Foco total nas segundas fases dos vestibulares mais concorridos do país (FUVEST, UNICAMP, UNESP).',
      longDescription: 'Aprofundamento com resolução de mais de 3.000 exercícios discursivos e plantão de dúvidas individual.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
      category: 'Medicina',
      tags: ['medicina', 'fuvest', 'unicamp', 'biologia'],
      priceCents: 49900,
      originalPriceCents: 79900,
      isFree: false,
    },
  ];

  for (const c of coursesToSeed) {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(c),
      });
      const data = await res.json();
      if (data.data?.id) {
        // Also update to published
        await fetch(`${API_BASE}/courses/${data.data.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ isPublished: true }),
        });
        console.log(`Course created & published: ${c.title}`);
      } else {
        console.log(`Course creation note (${c.title}):`, data.message);
      }
    } catch (e) {
      console.warn(`Error creating course ${c.title}:`, e.message);
    }
  }

  // 2. Create Questions
  const questionsToSeed = [
    {
      subject: 'Física',
      topic: 'Mecânica / Cinemática',
      difficulty: 'medium',
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
      difficulty: 'easy',
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
      difficulty: 'hard',
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
      difficulty: 'medium',
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

  const createdQuestionIds = [];
  for (const q of questionsToSeed) {
    try {
      const res = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(q),
      });
      const data = await res.json();
      if (data.data?.id) {
        createdQuestionIds.push(data.data.id);
        console.log(`Question created: ${q.subject} (${data.data.id})`);
      } else {
        console.log(`Question creation note:`, data.message);
      }
    } catch (e) {
      console.warn(`Error creating question:`, e.message);
    }
  }

  // 3. Create Simulado with created questions
  if (createdQuestionIds.length > 0) {
    try {
      const res = await fetch(`${API_BASE}/quizzes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Simulado 1º Dia ENEM — Linguagens & Humanas',
          description: 'Simulado com cronômetro rigoroso e gabarito comentado ao finalizar.',
          category: 'ENEM 2027',
          timeLimitMinutes: 180,
          maxAttempts: 3,
          shuffleQuestions: false,
          shuffleOptions: false,
          showAnswersAfter: 'submission',
          questionIds: createdQuestionIds,
        }),
      });
      const data = await res.json();
      if (data.data?.id) {
        console.log(`Quiz created: ${data.data.title} (${data.data.id})`);
        await fetch(`${API_BASE}/quizzes/${data.data.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ isPublished: true }),
        });
        console.log('Quiz published successfully!');
      } else {
        console.log('Quiz creation note:', data.message);
      }
    } catch (e) {
      console.warn('Error creating quiz:', e.message);
    }
  }

  console.log('Seeding remote API completed!');
}

main().catch(console.error);
