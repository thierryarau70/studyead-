/**
 * Store compartilhada de Cursos com persistência no LocalStorage.
 * Admin escreve → Alunos leem os mesmos dados.
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// ── Types ──────────────────────────────────────────────────────────
export interface LessonContent {
  id: string;
  type: 'video' | 'pdf' | 'link';
  title: string;
  url: string;
  durationSeconds?: number;
}

export interface LessonMaterial {
  id: string;
  title: string;
  size: string;
  url: string;
}

export interface LessonQuestionOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface LessonQuestion {
  id: string;
  subject?: string;
  statement: string;
  options: LessonQuestionOption[];
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description?: string;
  durationMinutes: number;
  isPublished: boolean;
  isFreePreview: boolean;
  isCompleted?: boolean;
  sortOrder: number;
  contents: LessonContent[];
  videoUrl?: string;
  posterUrl?: string;
  keyTopics?: string[];
  materials?: LessonMaterial[];
  questions?: LessonQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  priceCents: number;
  originalPriceCents?: number;
  isFree: boolean;
  isPublished: boolean;
  status: 'draft' | 'published' | 'archived';
  totalLessons: number;
  totalDurationMinutes: number;
  sortOrder: number;
  modules: CourseModule[];
}

// ── Seeded sample data ─────────────────────────────────────────────
const seedCourses: Course[] = [
  {
    id: 'c-1',
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
    totalLessons: 6,
    totalDurationMinutes: 147,
    sortOrder: 1,
    modules: [
      {
        id: 'm-1',
        title: 'Módulo 1: Introdução & Estratégias',
        isPublished: true,
        sortOrder: 1,
        lessons: [
          {
            id: 'l-101',
            title: 'Boas-vindas e Como Organizar seu Cronograma',
            slug: 'boas-vindas-cronograma',
            durationMinutes: 12,
            isPublished: true,
            isFreePreview: true,
            sortOrder: 1,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/p60rN9HrCA4',
            posterUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
            description: 'Nesta aula inaugural, estruturamos do zero a sua rotina de estudos semanal para o ENEM e vestibulares. Você vai aprender a dividir blocos de matérias e montar ciclos eficientes de revisão para manter a constância até a prova.',
            keyTopics: [
              'Divisão de blocos de estudo por tempo (técnica Pomodoro adaptada)',
              'Ciclo de revisão espaçada (24h, 7 dias e 30 dias)',
              'Como balancear estudo de teoria e resolução de exercícios práticos',
              'Definição de metas de pontuação e rotina para evitar o burnout',
            ],
            materials: [
              { id: 'm-101-1', title: 'Planilha Completa de Cronograma de Estudos 2027.pdf', size: '2.5 MB', url: '#' },
              { id: 'm-101-2', title: 'Checklist Semanal de Hábitos e Metas Imprimível.pdf', size: '1.1 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-101-1',
                statement: 'Qual a principal vantagem de adotar um ciclo de estudos por blocos alternados em vez de passar semanas estudando apenas uma mesma disciplina?',
                options: [
                  { id: 'opt-a', label: 'A', text: 'Evita a saturação neural e reforça a retenção de longo prazo por alternância de estímulos.', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: 'Elimina completamente a necessidade de fazer simulados regulares.', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: 'Permite estudar apenas as matérias com as quais você tem mais facilidade.', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: 'Reduz o volume total do conteúdo programático do edital.', isCorrect: false },
                ],
                explanation: 'Estudos cognitivos comprovam que a alternância entre matérias estimula conexões cerebrais distintas e combate a fadiga mental.',
              },
            ],
          },
          {
            id: 'l-102',
            title: 'Análise da Matriz de Referência do ENEM',
            slug: 'matriz-referencia-enem',
            durationMinutes: 18,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 2,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/bLzP-u5vWjM',
            posterUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
            description: 'Entenda detalhadamente como o INEP elabora os itens do exame a partir das 30 competências e 120 habilidades. Desmistificamos o algoritmo da TRI (Teoria de Resposta ao Item) e a coerência pedagógica das questões.',
            keyTopics: [
              'Estrutura dos 4 eixos cognitivos avaliados no exame nacional',
              'As 30 competências da matriz de referência do INEP',
              'O algoritmo da TRI: por que errar questões fáceis destrói sua nota',
              'Estratégia de classificação rápida no caderno de prova (Fáceis, Médias e Difíceis)',
            ],
            materials: [
              { id: 'm-102-1', title: 'Matriz Oficial de Competências e Habilidades INEP.pdf', size: '3.8 MB', url: '#' },
              { id: 'm-102-2', title: 'Guia Prático da TRI: Como Pontuar Mais com Menos Acertos.pdf', size: '1.9 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-102-1',
                statement: 'De acordo com os princípios da Teoria de Resposta ao Item (TRI) aplicada no ENEM, um aluno que acerta questões difíceis mas erra as fáceis terá sua pontuação reduzida devido a:',
                options: [
                  { id: 'opt-a', label: 'A', text: 'Falta de coerência pedagógica, sendo interpretado pelo modelo probabilístico como acerto ao acaso (chute).', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: 'Penalização por tempo excessivo gasto durante a prova.', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: 'Desclassificação automática da área de conhecimento.', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: 'Empate de pontuação com a média nacional dos candidatos.', isCorrect: false },
                ],
                explanation: 'A TRI avalia a probabilidade de acerto. Se um candidato erra itens com alto índice de acerto (fáceis) e acerta difíceis, o modelo reduz o peso dos acertos difíceis por incoerência probabilística.',
              },
            ],
          },
          {
            id: 'l-103',
            title: 'Técnicas de Leitura Dinâmica para Prova',
            slug: 'leitura-dinamica',
            durationMinutes: 15,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 3,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/5Hg_qSIhhL0',
            posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
            description: 'Nesta aula prática, aprenda as técnicas de leitura ativa (Scanning e Skimming) para poupar até 40 minutos na prova de Linguagens e Humanas, identificando a tese do autor e o comando da questão com agilidade.',
            keyTopics: [
              'Técnicas de Scanning & Skimming aplicadas a textos jornalísticos e literários',
              'Leitura prévia do enunciado e alternativas antes do texto base',
              'Identificação rápida de teses, operadores argumentativos e conclusões',
              'Gestão de tempo: a regra de ouro dos 3 minutos por questão',
            ],
            materials: [
              { id: 'm-103-1', title: 'Apostila Completa - Leitura Dinâmica no ENEM.pdf', size: '3.4 MB', url: '#' },
              { id: 'm-103-2', title: 'Mapa Mental - Estrutura Argumentativa e Conectivos.pdf', size: '1.2 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-103-1',
                statement: 'No processo de leitura dinâmica focado no ENEM, qual é a principal vantagem de realizar a leitura do enunciado e das alternativas ANTES da leitura do texto de apoio?',
                options: [
                  { id: 'opt-a', label: 'A', text: 'Direcionar a atenção do candidato para a intenção específica da questão ao ler o texto.', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: 'Eliminar a necessidade de ler o texto de apoio em 100% dos casos.', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: 'Garantir que a alternativa correta seja sempre a mais longa do bloco.', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: 'Substituir a interpretação textual por cálculos de probabilidade.', isCorrect: false },
                ],
                explanation: 'Ler o comando previamente transforma a leitura passiva em uma busca ativa e direcionada pela informação solicitada, economizando tempo precioso.',
              },
            ],
          },
        ],
      },
      {
        id: 'm-2',
        title: 'Módulo 2: Matemática & Suas Tecnologias',
        isPublished: true,
        sortOrder: 2,
        lessons: [
          {
            id: 'l-201',
            title: 'Razão, Proporção e Regra de Três Simples/Composta',
            slug: 'razao-proporcao',
            durationMinutes: 25,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 1,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/hL_yV6Z4BvE',
            posterUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
            description: 'Domine o tema de maior incidência em toda a Matemática do ENEM. Aprenda a reconhecer relações diretamente e inversamente proporcionais sem errar a montagem das frações e proporções.',
            keyTopics: [
              'Conceito fundamental de razão e proporção entre grandezas',
              'Propriedade fundamental das proporções (produto dos meios pelos extremos)',
              'Regra de três simples e composta com o método das setas direcionais',
              'Aplicações em escalas cartográficas, densidade demográfica e vazão',
            ],
            materials: [
              { id: 'm-201-1', title: 'Lista de 25 Exercícios Gabaritados de Razão e Proporção.pdf', size: '2.1 MB', url: '#' },
              { id: 'm-201-2', title: 'Ficha Resumo - Regra de Três Composta Passo a Passo.pdf', size: '1.3 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-201-1',
                statement: 'Um mapa está desenhado na escala 1 : 50.000. Se a distância em linha reta entre duas cidades nesse mapa mede 6 cm, a distância real em quilômetros é:',
                options: [
                  { id: 'opt-a', label: 'A', text: '3 km', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: '30 km', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: '300 km', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: '0,3 km', isCorrect: false },
                ],
                explanation: 'Distância real = 6 cm × 50.000 = 300.000 cm = 3.000 m = 3 km.',
              },
            ],
          },
          {
            id: 'l-202',
            title: 'Geometria Plana: Áreas e Perímetros Fundamentais',
            slug: 'geometria-plana',
            durationMinutes: 35,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 2,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/0Gv_3KkM4S8',
            posterUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&auto=format&fit=crop&q=80',
            description: 'Tudo o que você precisa saber sobre o cálculo de áreas de triângulos, quadriláteros, círculos e a técnica indispensável de decomposição de figuras planas compostas.',
            keyTopics: [
              'Fórmulas essenciais de área: triângulos (Herão, equilátero), trapézios e losangos',
              'Círculo: comprimento da circunferência (2πr) vs. área do disco (πr²)',
              'Técnica de decomposição de polígonos irregulares em formas básicas',
              'Problemas práticos de revestimento, pisos, custos por metro quadrado e cercamentos',
            ],
            materials: [
              { id: 'm-202-1', title: 'Formulário Visual de Geometria Plana.pdf', size: '1.8 MB', url: '#' },
              { id: 'm-202-2', title: 'Caderno de Problemas Geométricos ENEM dos últimos 5 anos.pdf', size: '3.1 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-202-1',
                statement: 'Deseja-se cobrir um piso retangular de 4 m por 6 m com ladrilhos quadrados de 20 cm de lado. A quantidade mínima de ladrilhos necessários é:',
                options: [
                  { id: 'opt-a', label: 'A', text: '600 ladrilhos', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: '120 ladrilhos', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: '2.400 ladrilhos', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: '60 ladrilhos', isCorrect: false },
                ],
                explanation: 'Área total do piso = 4 × 6 = 24 m² = 240.000 cm². Área de 1 ladrilho = 20 × 20 = 400 cm². Quantidade = 240.000 / 400 = 600 ladrilhos.',
              },
            ],
          },
          {
            id: 'l-203',
            title: 'Função Afim e Quadrática Aplicadas às Questões',
            slug: 'funcao-afim-quadratica',
            durationMinutes: 40,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 3,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/Xq_7Qv_U1Hk',
            posterUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
            description: 'Interpretação e modelagem gráfica de funções afins (taxa de variação e coeficiente linear) e funções quadráticas. Cálculo analítico do vértice da parábola para problemas de valor máximo e mínimo.',
            keyTopics: [
              'Significado geométrico do coeficiente angular (a) e linear (b) na reta',
              'Raízes e estudo do sinal da parábola',
              'Vértice da parábola: Xv = -b/(2a) e Yv = -Δ/(4a)',
              'Modelagem real de situações de lucro máximo, custo mínimo e trajetórias de projéteis',
            ],
            materials: [
              { id: 'm-203-1', title: 'Guia Completo de Funções Polinomiais no ENEM.pdf', size: '2.7 MB', url: '#' },
              { id: 'm-203-2', title: 'Gráficos e Parábolas: Exercícios Resolvidos de Vestibulares.pdf', size: '2.0 MB', url: '#' },
            ],
            questions: [
              {
                id: 'q-203-1',
                statement: 'Uma empresa modelou seu lucro diário L(x) em milhares de reais pela função L(x) = -x² + 10x - 9, onde x é a quantidade de centenas de itens vendidos. O lucro máximo diário alcançado por essa empresa é de:',
                options: [
                  { id: 'opt-a', label: 'A', text: 'R$ 16.000', isCorrect: true },
                  { id: 'opt-b', label: 'B', text: 'R$ 5.000', isCorrect: false },
                  { id: 'opt-c', label: 'C', text: 'R$ 25.000', isCorrect: false },
                  { id: 'opt-d', label: 'D', text: 'R$ 9.000', isCorrect: false },
                ],
                explanation: 'O lucro máximo ocorre no vértice: Xv = -10 / (2 × -1) = 5. Aplicando na função: L(5) = -(5)² + 10(5) - 9 = -25 + 50 - 9 = 16 (milhares de reais) = R$ 16.000.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c-2',
    title: 'Laboratório de Redação & Proposta de Intervenção',
    slug: 'laboratorio-redacao-enem',
    description: 'Aprenda o método para alcançar a nota 1000 na redação do ENEM com correções comentadas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60',
    category: 'Humanas',
    tags: ['redação', 'ENEM', 'humanas'],
    priceCents: 14900,
    isFree: false,
    isPublished: true,
    status: 'published',
    totalLessons: 2,
    totalDurationMinutes: 40,
    sortOrder: 2,
    modules: [
      {
        id: 'm-3',
        title: 'Módulo 1: Estrutura da Redação',
        isPublished: true,
        sortOrder: 1,
        lessons: [
          {
            id: 'l-301',
            title: 'Introdução: O que os avaliadores esperam?',
            slug: 'intro-avaliadores',
            durationMinutes: 20,
            isPublished: true,
            isFreePreview: true,
            sortOrder: 1,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/bLzP-u5vWjM',
            description: 'Entenda os 5 critérios de avaliação da banca examinadora e como estruturar a tese na introdução.',
          },
          {
            id: 'l-302',
            title: 'Estrutura da Proposta de Intervenção (PI)',
            slug: 'estrutura-pi',
            durationMinutes: 20,
            isPublished: true,
            isFreePreview: false,
            sortOrder: 2,
            contents: [],
            videoUrl: 'https://www.youtube.com/embed/5Hg_qSIhhL0',
            description: 'Os 5 elementos obrigatórios da proposta de intervenção: Agente, Ação, Meio/Modo, Efeito e Detalhamento.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-3',
    title: 'Física Intensiva para Medicina & FUVEST',
    slug: 'fisica-intensiva-medicina',
    description: 'Mecânica, Termologia, Eletromagnetismo e Óptica para as questões mais cobradas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
    category: 'Medicina',
    tags: ['física', 'FUVEST', 'medicina'],
    priceCents: 19900,
    isFree: false,
    isPublished: false,
    status: 'draft',
    totalLessons: 0,
    totalDurationMinutes: 0,
    sortOrder: 3,
    modules: [],
  },
];

const STORAGE_KEY = 'studyead_courses_v3';

export function getCanonicalCourseKey(course: { id?: string; slug?: string; title?: string; category?: string }): string {
  const slug = (course.slug || '').toLowerCase().trim();
  const title = (course.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const id = (course.id || '').toLowerCase().trim();

  if (id === 'c-1' || id === 'course-1' || slug.includes('enem') || title.includes('enem')) {
    return 'canonical-enem';
  }
  if (
    id === 'c-2' ||
    id === 'course-2' ||
    slug.includes('redacao') ||
    title.includes('redacao') ||
    (course.category && course.category.toLowerCase().includes('redacao'))
  ) {
    return 'canonical-redacao';
  }
  if (
    id === 'c-3' ||
    id === 'course-3' ||
    slug.includes('fisica') ||
    slug.includes('medicina') ||
    title.includes('fisica') ||
    title.includes('medicina')
  ) {
    return 'canonical-medicina';
  }
  return slug ? slug.replace(/-completo$/, '') : title;
}

export function deduplicateCourses(courseList: Course[]): Course[] {
  if (!Array.isArray(courseList)) return [];
  const seenKeys = new Map<string, Course>();

  for (const c of courseList) {
    if (!c) continue;
    const key = getCanonicalCourseKey(c);
    const existing = seenKeys.get(key);

    if (!existing) {
      seenKeys.set(key, { ...c });
    } else {
      // Merge: prefer API UUID id if available
      const isExistingUuid = existing.id && existing.id.includes('-');
      const isCurrentUuid = c.id && c.id.includes('-') && !c.id.startsWith('c-');
      const chosen = isCurrentUuid ? c : existing;
      const donor = chosen === c ? existing : c;

      const chosenLessons = chosen.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      const donorLessons = donor.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      const modules = chosenLessons >= donorLessons ? chosen.modules : donor.modules;

      const calcLessons = modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      const totalLessons = Math.max(
        Number(chosen.totalLessons) || 0,
        Number(donor.totalLessons) || 0,
        calcLessons
      );
      const totalDurationMinutes = Math.max(
        Number(chosen.totalDurationMinutes) || 0,
        Number(donor.totalDurationMinutes) || 0
      );

      const merged: Course = {
        ...donor,
        ...chosen,
        id: chosen.id || donor.id,
        description: chosen.description || donor.description,
        thumbnailUrl: chosen.thumbnailUrl || donor.thumbnailUrl,
        modules: modules && modules.length > 0 ? modules : (chosen.modules || []),
        totalLessons,
        totalDurationMinutes,
        isPublished: Boolean(chosen.isPublished ?? donor.isPublished),
        status: chosen.status || donor.status || 'published',
      };
      seenKeys.set(key, merged);
    }
  }

  return Array.from(seenKeys.values());
}

function loadInitialCourses(): Course[] {
  let initial = seedCourses;
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initial = parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler cursos do localStorage:', e);
    }
  }
  return deduplicateCourses(initial);
}

// ── Store ──────────────────────────────────────────────────────────
export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>(loadInitialCourses());
  const loading = ref(false);
  const error = ref('');

  if (process.client) {
    watch(
      courses,
      (newVal) => {
        try {
          const clean = deduplicateCourses(newVal);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
        } catch (e) {
          console.error('Erro ao salvar cursos no localStorage:', e);
        }
      },
      { deep: true }
    );

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          courses.value = deduplicateCourses(JSON.parse(e.newValue));
        } catch {}
      }
    });
  }

  // Published courses visible to students (always strictly deduplicated)
  const publishedCourses = computed(() =>
    deduplicateCourses(courses.value.filter((c) => c.isPublished)).sort((a, b) => a.sortOrder - b.sortOrder),
  );

  // All courses for admin (always strictly deduplicated)
  const allCourses = computed(() =>
    deduplicateCourses(courses.value).sort((a, b) => a.sortOrder - b.sortOrder),
  );

  function getCourseBySlug(slug: string) {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    return courses.value.find(
      (c) =>
        c.slug.toLowerCase() === cleanSlug ||
        c.slug.toLowerCase() === cleanSlug.replace(/-completo$/, '') ||
        cleanSlug === `${c.slug.toLowerCase()}-completo` ||
        c.id === cleanSlug ||
        getCanonicalCourseKey(c) === getCanonicalCourseKey({ slug: cleanSlug, title: cleanSlug, id: cleanSlug }),
    );
  }

  function getCourseById(id: string) {
    if (!id) return undefined;
    const cleanId = id.trim();
    return courses.value.find(
      (c) =>
        c.id === cleanId ||
        c.slug === cleanId ||
        getCanonicalCourseKey(c) === getCanonicalCourseKey({ id: cleanId, slug: cleanId }),
    );
  }

  async function fetchCourses() {
    loading.value = true;
    error.value = '';
    try {
      if (process.client) {
        const { $api } = useNuxtApp();
        const res: any = await $api('/courses?limit=100');
        const items = Array.isArray(res?.data?.items)
          ? res.data.items
          : (Array.isArray(res?.data)
            ? res.data
            : (Array.isArray(res?.items) ? res.items : []));

        if (Array.isArray(items) && items.length > 0) {
          const formatted = items.map((item: any) => {
            const itemCanon = getCanonicalCourseKey(item);
            const local = courses.value.find(
              (c) =>
                c.id === item.id ||
                c.slug === item.slug ||
                getCanonicalCourseKey(c) === itemCanon
            );
            const fallbackSeed = seedCourses.find(
              (s) => getCanonicalCourseKey(s) === itemCanon || s.slug === item.slug
            );
            const modules = (item.modules && item.modules.length > 0)
              ? item.modules
              : (local?.modules && local.modules.length > 0)
                ? local.modules
                : (fallbackSeed?.modules || []);
            
            const calcLessons = modules.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
            const totalLessons = item.totalLessons > 0 ? item.totalLessons : (calcLessons > 0 ? calcLessons : (local?.totalLessons || 12));
            const totalDurationMinutes = item.totalDurationMinutes > 0 ? item.totalDurationMinutes : (local?.totalDurationMinutes || 480);

            return {
              ...item,
              description: item.description || local?.description || fallbackSeed?.description || '',
              thumbnailUrl: item.thumbnailUrl || local?.thumbnailUrl || fallbackSeed?.thumbnailUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
              category: item.category || local?.category || fallbackSeed?.category || 'Geral',
              modules,
              totalLessons,
              totalDurationMinutes,
              isPublished: Boolean(item.isPublished ?? local?.isPublished ?? true),
              status: item.status || local?.status || 'published',
            };
          });

          // Merge API formatted courses with local courses, strictly deduplicating
          courses.value = deduplicateCourses([...formatted, ...courses.value]);
        }
      }
    } catch (err: any) {
      console.warn('API GET /courses indisponível, usando cache persistente:', err?.message);
    } finally {
      loading.value = false;
    }
  }

  // ── Course CRUD ────────────────────────────────────────────────
  async function addCourse(data: Omit<Course, 'id' | 'modules' | 'totalLessons' | 'totalDurationMinutes' | 'status'>) {
    const tempId = `c-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCourse: Course = {
      ...data,
      id: tempId,
      slug,
      modules: [],
      totalLessons: 0,
      totalDurationMinutes: 0,
      status: data.isPublished ? 'published' : 'draft',
    };
    courses.value.unshift(newCourse);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api('/courses', {
          method: 'POST',
          body: {
            title: data.title,
            slug,
            description: data.description,
            longDescription: data.longDescription,
            thumbnailUrl: data.thumbnailUrl || null,
            priceCents: data.priceCents || 0,
            originalPriceCents: data.originalPriceCents,
            isFree: Boolean(data.isFree),
            isPublished: Boolean(data.isPublished),
            category: data.category || 'Geral',
            tags: data.tags || [],
            sortOrder: data.sortOrder || 0,
          },
        });
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          newCourse.id = createdId;
        }
      } catch (err: any) {
        console.warn('API POST /courses fallback local:', err?.message);
      }
    }
    return newCourse.id;
  }

  async function updateCourse(id: string, patch: Partial<Course>) {
    const idx = courses.value.findIndex((c) => c.id === id);
    if (idx !== -1) {
      courses.value[idx] = {
        ...courses.value[idx],
        ...patch,
        status: patch.isPublished !== undefined
          ? (patch.isPublished ? 'published' : 'draft')
          : courses.value[idx].status,
      };
    }

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/${id}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT /courses/${id} fallback local:`, err?.message);
      }
    }
  }

  async function deleteCourse(id: string) {
    courses.value = courses.value.filter((c) => c.id !== id);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/${id}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE /courses/${id} fallback local:`, err?.message);
      }
    }
  }

  async function togglePublish(id: string) {
    const c = courses.value.find((c) => c.id === id);
    if (c) {
      const nextPublished = !c.isPublished;
      await updateCourse(id, { isPublished: nextPublished });
    }
  }

  // ── Module CRUD ────────────────────────────────────────────────
  async function addModule(courseId: string, data: Omit<CourseModule, 'id' | 'lessons'>) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    const tempId = `m-${Date.now()}`;
    const newMod: CourseModule = { ...data, id: tempId, lessons: [] };
    course.modules.push(newMod);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api(`/courses/${courseId}/modules`, {
          method: 'POST',
          body: {
            title: data.title,
            description: data.description,
            sortOrder: data.sortOrder || 0,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          },
        });
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          newMod.id = createdId;
        }
      } catch (err: any) {
        console.warn('API POST module fallback local:', err?.message);
      }
    }
    return newMod.id;
  }

  async function updateModule(courseId: string, moduleId: string, patch: Partial<CourseModule>) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    const idx = course.modules.findIndex((m) => m.id === moduleId);
    if (idx === -1) return;
    course.modules[idx] = { ...course.modules[idx], ...patch };

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/modules/${moduleId}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT module ${moduleId} fallback local:`, err?.message);
      }
    }
  }

  async function deleteModule(courseId: string, moduleId: string) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    course.modules = course.modules.filter((m) => m.id !== moduleId);
    _recalcTotals(course);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/modules/${moduleId}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE module ${moduleId} fallback local:`, err?.message);
      }
    }
  }

  // ── Lesson CRUD ────────────────────────────────────────────────
  async function addLesson(courseId: string, moduleId: string, data: Omit<Lesson, 'id' | 'contents'>) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const tempId = `l-${Date.now()}`;
    const newLesson: Lesson = { ...data, id: tempId, contents: [] };
    mod.lessons.push(newLesson);
    _recalcTotals(course);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api(`/courses/modules/${moduleId}/lessons`, {
          method: 'POST',
          body: {
            title: data.title,
            slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            durationMinutes: data.durationMinutes || 15,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
            isFreePreview: Boolean(data.isFreePreview),
            sortOrder: data.sortOrder || 0,
            description: data.description,
            videoUrl: data.videoUrl,
          },
        });
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          newLesson.id = createdId;
        }
      } catch (err: any) {
        console.warn('API POST lesson fallback local:', err?.message);
      }
    }
    return newLesson.id;
  }

  async function updateLesson(courseId: string, moduleId: string, lessonId: string, patch: Partial<Lesson>) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;
    mod.lessons[idx] = { ...mod.lessons[idx], ...patch };
    _recalcTotals(course);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/lessons/${lessonId}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT lesson ${lessonId} fallback local:`, err?.message);
      }
    }
  }

  async function deleteLesson(courseId: string, moduleId: string, lessonId: string) {
    const course = courses.value.find((c) => c.id === courseId);
    if (!course) return;
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    mod.lessons = mod.lessons.filter((l) => l.id !== lessonId);
    _recalcTotals(course);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/courses/lessons/${lessonId}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE lesson ${lessonId} fallback local:`, err?.message);
      }
    }
  }

  function _recalcTotals(course: Course) {
    let total = 0;
    let duration = 0;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        total++;
        duration += lesson.durationMinutes;
      }
    }
    course.totalLessons = total;
    course.totalDurationMinutes = duration;
  }

  function resetToDefault() {
    courses.value = JSON.parse(JSON.stringify(seedCourses));
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    courses, loading, error,
    publishedCourses, allCourses,
    getCanonicalCourseKey, deduplicateCourses,
    fetchCourses,
    getCourseBySlug, getCourseById,
    addCourse, updateCourse, deleteCourse, togglePublish,
    addModule, updateModule, deleteModule,
    addLesson, updateLesson, deleteLesson,
    resetToDefault,
  };
});
