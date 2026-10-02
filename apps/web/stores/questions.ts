/**
 * Store compartilhada de Questões.
 * Admin cria → Alunos resolvem as mesmas questões.
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  sortOrder: number;
}

export interface Question {
  id: string;
  subject: string;
  topic?: string;
  difficulty: Difficulty;
  statement: string;
  statementImageUrl?: string;
  explanation?: string;
  tags: string[];
  options: QuestionOption[];
  createdAt: string;
}

const seedQuestions: Question[] = [
  {
    id: 'q-001',
    subject: 'Física',
    topic: 'Mecânica / Cinemática',
    difficulty: 'medium',
    statement: 'Um veículo trafega em uma rodovia retilínea com velocidade constante de 72 km/h. Ao avistar um obstáculo, o motorista aciona os freios com desaceleração constante de 4 m/s² até a parada completa.\n\nQual é a distância percorrida pelo veículo durante o processo de frenagem?',
    explanation: 'Conversão: 72 km/h = 20 m/s.\nUsando Torricelli: v² = v₀² + 2aΔs → 0 = 400 + 2×(-4)×Δs → Δs = 50 metros.',
    tags: ['cinemática', 'ENEM', 'frenagem'],
    createdAt: '2026-09-01',
    options: [
      { id: 'q-001-a', label: 'A', text: '50 metros', isCorrect: true, sortOrder: 1 },
      { id: 'q-001-b', label: 'B', text: '100 metros', isCorrect: false, sortOrder: 2 },
      { id: 'q-001-c', label: 'C', text: '25 metros', isCorrect: false, sortOrder: 3 },
      { id: 'q-001-d', label: 'D', text: '72 metros', isCorrect: false, sortOrder: 4 },
    ],
  },
  {
    id: 'q-002',
    subject: 'Matemática',
    topic: 'Geometria Plana',
    difficulty: 'easy',
    statement: 'Uma praça circular possui raio medindo 10 metros. A prefeitura deseja cercar toda a praça com uma fita de isolamento.\n\nConsiderando π = 3,14, quantos metros de fita serão necessários no mínimo?',
    explanation: 'Circunferência = 2πr = 2 × 3,14 × 10 = 62,8 metros.',
    tags: ['geometria', 'circunferência', 'ENEM'],
    createdAt: '2026-09-02',
    options: [
      { id: 'q-002-a', label: 'A', text: '31,4 metros', isCorrect: false, sortOrder: 1 },
      { id: 'q-002-b', label: 'B', text: '62,8 metros', isCorrect: true, sortOrder: 2 },
      { id: 'q-002-c', label: 'C', text: '314 metros', isCorrect: false, sortOrder: 3 },
      { id: 'q-002-d', label: 'D', text: '100 metros', isCorrect: false, sortOrder: 4 },
    ],
  },
  {
    id: 'q-003',
    subject: 'Química',
    topic: 'Estequiometria',
    difficulty: 'hard',
    statement: 'Na combustão completa de 1 mol de gás metano (CH₄) em presença de oxigênio (O₂), produzem-se CO₂ e H₂O.\n\nQual é o volume de CO₂ produzido nas CNTP? (Volume molar = 22,4 L/mol)',
    explanation: 'Equação: CH₄ + 2O₂ → CO₂ + 2H₂O.\n1 mol CH₄ produz 1 mol CO₂.\nNas CNTP: 1 mol = 22,4 Litros.',
    tags: ['estequiometria', 'combustão', 'ENEM', 'CNTP'],
    createdAt: '2026-09-03',
    options: [
      { id: 'q-003-a', label: 'A', text: '22,4 Litros', isCorrect: true, sortOrder: 1 },
      { id: 'q-003-b', label: 'B', text: '44,8 Litros', isCorrect: false, sortOrder: 2 },
      { id: 'q-003-c', label: 'C', text: '11,2 Litros', isCorrect: false, sortOrder: 3 },
      { id: 'q-003-d', label: 'D', text: '18,0 Litros', isCorrect: false, sortOrder: 4 },
    ],
  },
  {
    id: 'q-004',
    subject: 'Biologia',
    topic: 'Genética / DNA',
    difficulty: 'medium',
    statement: 'O DNA possui estrutura em dupla hélice formada por pares de bases nitrogenadas.\n\nSe uma fita do DNA tem a sequência ATCGTA, qual é a sequência complementar na outra fita?',
    explanation: 'Regra de complementaridade: A↔T e C↔G.\nATCGTA → TAGCAT.',
    tags: ['DNA', 'biologia', 'ENEM', 'genética'],
    createdAt: '2026-09-04',
    options: [
      { id: 'q-004-a', label: 'A', text: 'TAGCAT', isCorrect: true, sortOrder: 1 },
      { id: 'q-004-b', label: 'B', text: 'ATCGTA', isCorrect: false, sortOrder: 2 },
      { id: 'q-004-c', label: 'C', text: 'UAGCAU', isCorrect: false, sortOrder: 3 },
      { id: 'q-004-d', label: 'D', text: 'GCATCG', isCorrect: false, sortOrder: 4 },
    ],
  },
  {
    id: 'q-005',
    subject: 'Matemática',
    topic: 'Probabilidade / Conjuntos',
    difficulty: 'medium',
    statement: 'Em um grupo de 100 estudantes, 60 estudam Física, 50 estudam Química e 20 estudam ambas as disciplinas.\n\nQual é a probabilidade de um estudante escolhido ao acaso estudar APENAS Química?',
    explanation: 'Apenas Química = 50 − 20 = 30. Probabilidade = 30/100 = 30%.',
    tags: ['probabilidade', 'conjuntos', 'ENEM'],
    createdAt: '2026-09-05',
    options: [
      { id: 'q-005-a', label: 'A', text: '30%', isCorrect: true, sortOrder: 1 },
      { id: 'q-005-b', label: 'B', text: '50%', isCorrect: false, sortOrder: 2 },
      { id: 'q-005-c', label: 'C', text: '20%', isCorrect: false, sortOrder: 3 },
      { id: 'q-005-d', label: 'D', text: '40%', isCorrect: false, sortOrder: 4 },
    ],
  },
  {
    id: 'q-006',
    subject: 'Física',
    topic: 'Eletrodinâmica',
    difficulty: 'medium',
    statement: 'Um circuito elétrico contém um gerador ideal de 12 V e três resistores iguais de 6 Ω ligados em paralelo.\n\nQual é a corrente elétrica total fornecida pelo gerador?',
    explanation: 'Req (paralelo) = 6/3 = 2 Ω. Lei de Ohm: I = V/R = 12/2 = 6 A.',
    tags: ['eletricidade', 'resistência', 'ENEM'],
    createdAt: '2026-09-06',
    options: [
      { id: 'q-006-a', label: 'A', text: '2 Ampères', isCorrect: false, sortOrder: 1 },
      { id: 'q-006-b', label: 'B', text: '6 Ampères', isCorrect: true, sortOrder: 2 },
      { id: 'q-006-c', label: 'C', text: '12 Ampères', isCorrect: false, sortOrder: 3 },
      { id: 'q-006-d', label: 'D', text: '4 Ampères', isCorrect: false, sortOrder: 4 },
    ],
  },
];

const STORAGE_KEY = 'studyead_questions';

function loadInitialQuestions(): Question[] {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler questões do localStorage:', e);
    }
  }
  return seedQuestions;
}

export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref<Question[]>(loadInitialQuestions());

  if (process.client) {
    watch(
      questions,
      (newVal) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        } catch (e) {
          console.error('Erro ao salvar questões no localStorage:', e);
        }
      },
      { deep: true }
    );

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          questions.value = JSON.parse(e.newValue);
        } catch {}
      }
    });
  }

  const bySubject = computed(() => {
    const map: Record<string, Question[]> = {};
    for (const q of questions.value) {
      if (!map[q.subject]) map[q.subject] = [];
      map[q.subject].push(q);
    }
    return map;
  });

  const subjects = computed(() => [...new Set(questions.value.map((q) => q.subject))].sort());

  const loading = ref(false);
  const error = ref('');

  async function fetchQuestions(subjectFilter?: string) {
    loading.value = true;
    error.value = '';
    try {
      if (process.client) {
        const { $api } = useNuxtApp();
        const url = subjectFilter ? `/questions?subject=${encodeURIComponent(subjectFilter)}&limit=100` : '/questions?limit=100';
        const res: any = await $api(url);
        const items = res?.data?.items || res?.data || res?.items;
        if (Array.isArray(items) && items.length > 0) {
          for (const item of items) {
            const existingIdx = questions.value.findIndex((q) => q.id === item.id);
            if (existingIdx !== -1) {
              questions.value[existingIdx] = { ...questions.value[existingIdx], ...item };
            } else {
              questions.value.push(item);
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('API GET /questions indisponível, usando cache persistente:', err?.message);
    } finally {
      loading.value = false;
    }
  }

  function getById(id: string) {
    return questions.value.find((q) => q.id === id);
  }

  async function addQuestion(data: Omit<Question, 'id' | 'createdAt'>) {
    const tempId = `q-${Date.now()}`;
    const newQuestion: Question = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    questions.value.unshift(newQuestion);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api('/questions', {
          method: 'POST',
          body: {
            statement: data.statement,
            statementImageUrl: data.statementImageUrl || undefined,
            explanation: data.explanation || undefined,
            subject: data.subject,
            topic: data.topic || undefined,
            difficulty: data.difficulty,
            tags: data.tags || [],
            options: data.options.map((opt, idx) => ({
              label: opt.label || String.fromCharCode(65 + idx),
              text: opt.text,
              imageUrl: opt.imageUrl || undefined,
              isCorrect: Boolean(opt.isCorrect),
              sortOrder: opt.sortOrder || idx + 1,
            })),
          },
        });
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          newQuestion.id = createdId;
        }
      } catch (err: any) {
        console.warn('API POST /questions fallback local:', err?.message);
      }
    }
    return newQuestion.id;
  }

  async function updateQuestion(id: string, patch: Partial<Question>) {
    const idx = questions.value.findIndex((q) => q.id === id);
    if (idx !== -1) {
      questions.value[idx] = { ...questions.value[idx], ...patch };
    }

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/questions/${id}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT /questions/${id} fallback local:`, err?.message);
      }
    }
  }

  async function deleteQuestion(id: string) {
    questions.value = questions.value.filter((q) => q.id !== id);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/questions/${id}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE /questions/${id} fallback local:`, err?.message);
      }
    }
  }

  async function submitAnswer(questionId: string, selectedOptionId: string) {
    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api(`/questions/${questionId}/answer`, {
          method: 'POST',
          body: { selectedOptionId },
        });
        return res?.data || res;
      } catch (err: any) {
        console.warn(`API POST answer fallback local:`, err?.message);
      }
    }
    // Fallback local
    const q = getById(questionId);
    const selected = q?.options.find((o) => o.id === selectedOptionId);
    const correct = q?.options.find((o) => o.isCorrect);
    return {
      isCorrect: selected?.isCorrect || false,
      correctOptionId: correct?.id,
      explanation: q?.explanation,
    };
  }

  function resetToDefault() {
    questions.value = [...seedQuestions];
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    questions, loading, error, bySubject, subjects,
    fetchQuestions, getById, addQuestion, updateQuestion, deleteQuestion, submitAnswer, resetToDefault,
  };
});

