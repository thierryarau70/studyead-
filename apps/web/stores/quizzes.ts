/**
 * Store compartilhada de Simulados com persistência no LocalStorage.
 * Admin cria/configura → Alunos realizam os simulados.
 * Qualquer alteração fica salva mesmo dando F5/Reload ou sincronizando entre abas.
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type ShowAnswers = 'submission' | 'deadline' | 'never';

export interface QuizQuestion {
  questionId: string;
  sortOrder: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswersAfter: ShowAnswers;
  isPublished: boolean;
  courseId?: string;
  questionIds: string[]; // references to questions store
  attemptsCount: number;
  category: string;
  createdAt: string;
}

const STORAGE_KEY = 'studyead_quizzes';

const seedQuizzes: Quiz[] = [
  {
    id: 'sim-1',
    title: 'Simulado 1º Dia ENEM — Linguagens & Humanas',
    description: '45 questões de Linguagens e 45 de Ciências Humanas com cronômetro rigoroso.',
    category: 'ENEM 2027',
    timeLimitMinutes: 180,
    maxAttempts: 3,
    shuffleQuestions: false,
    shuffleOptions: false,
    showAnswersAfter: 'submission',
    isPublished: true,
    questionIds: ['q-005', 'q-002'],
    attemptsCount: 87,
    createdAt: '2026-09-10',
  },
  {
    id: 'sim-2',
    title: 'Simulado 2º Dia ENEM — Matemática & Ciências da Natureza',
    description: 'Questões de Física, Química, Biologia e Matemática com tri ajustado.',
    category: 'ENEM 2027',
    timeLimitMinutes: 180,
    maxAttempts: 3,
    shuffleQuestions: false,
    shuffleOptions: false,
    showAnswersAfter: 'submission',
    isPublished: true,
    questionIds: ['q-006', 'q-001', 'q-003', 'q-004', 'q-005'],
    attemptsCount: 34,
    createdAt: '2026-09-11',
  },
  {
    id: 'sim-3',
    title: 'Mini-Simulado Diagnóstico de Física e Matemática',
    description: 'Simulado rápido de 45 minutos para teste de agilidade e resolução de problemas.',
    category: 'Treinamento Curto',
    timeLimitMinutes: 45,
    maxAttempts: 5,
    shuffleQuestions: true,
    shuffleOptions: false,
    showAnswersAfter: 'submission',
    isPublished: true,
    questionIds: ['q-001', 'q-002', 'q-006'],
    attemptsCount: 21,
    createdAt: '2026-09-12',
  },
];

function loadInitialQuizzes(): Quiz[] {
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
      console.error('Erro ao ler simulados do localStorage:', e);
    }
  }
  return seedQuizzes;
}

export const useQuizzesStore = defineStore('quizzes', () => {
  const quizzes = ref<Quiz[]>(loadInitialQuizzes());

  // Salva no localStorage sempre que houver alteração
  if (process.client) {
    watch(
      quizzes,
      (newVal) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        } catch (e) {
          console.error('Erro ao salvar simulados no localStorage:', e);
        }
      },
      { deep: true }
    );

    // Sincronização entre abas em tempo real
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          quizzes.value = JSON.parse(e.newValue);
        } catch {}
      }
    });
  }

  const loading = ref(false);
  const error = ref('');

  const publishedQuizzes = computed(() => quizzes.value.filter((q) => q.isPublished));
  const allQuizzes = computed(() => quizzes.value);


  async function fetchQuizzes() {
    loading.value = true;
    error.value = '';
    try {
      if (process.client) {
        const { $api } = useNuxtApp();
        const res: any = await $api('/quizzes/all');
        const items = res?.data || res;
        if (Array.isArray(items) && items.length > 0) {
          for (const item of items) {
            const existingIdx = quizzes.value.findIndex((q) => q.id === item.id);
            const formattedQuiz: Quiz = {
              id: item.id,
              title: item.title,
              description: item.description || '',
              timeLimitMinutes: item.timeLimitMinutes || 60,
              maxAttempts: item.maxAttempts || 3,
              shuffleQuestions: Boolean(item.shuffleQuestions),
              shuffleOptions: Boolean(item.shuffleOptions),
              showAnswersAfter: item.showAnswersAfter || 'submission',
              isPublished: Boolean(item.isPublished),
              courseId: item.courseId,
              questionIds: item.questionIds || [],
              attemptsCount: item.attemptsCount || 0,
              category: item.category || 'Geral',
              createdAt: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            };
            if (existingIdx !== -1) {
              quizzes.value[existingIdx] = { ...quizzes.value[existingIdx], ...formattedQuiz };
            } else {
              quizzes.value.push(formattedQuiz);
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('API GET /quizzes/all indisponível, usando cache persistente:', err?.message);
    } finally {
      loading.value = false;
    }
  }

  function getById(id: string) {
    return quizzes.value.find((q) => q.id === id);
  }

  async function addQuiz(data: Omit<Quiz, 'id' | 'attemptsCount' | 'createdAt'>) {
    const tempId = `sim-${Date.now()}`;
    const newQuiz: Quiz = {
      ...data,
      id: tempId,
      attemptsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    quizzes.value.unshift(newQuiz);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api('/quizzes', {
          method: 'POST',
          body: {
            title: data.title,
            description: data.description,
            timeLimitMinutes: data.timeLimitMinutes,
            maxAttempts: data.maxAttempts,
            shuffleQuestions: data.shuffleQuestions || false,
            shuffleOptions: data.shuffleOptions || false,
            showAnswersAfter: data.showAnswersAfter || 'submission',
            questionIds: data.questionIds || [],
            courseId: data.courseId,
          },
        });
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          newQuiz.id = createdId;
        }
      } catch (err: any) {
        console.warn('API POST /quizzes fallback local:', err?.message);
      }
    }
    return newQuiz.id;
  }

  async function updateQuiz(id: string, patch: Partial<Quiz>) {
    const idx = quizzes.value.findIndex((q) => q.id === id);
    if (idx !== -1) {
      quizzes.value[idx] = { ...quizzes.value[idx], ...patch };
    }

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/quizzes/${id}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT /quizzes/${id} fallback local:`, err?.message);
      }
    }
  }

  async function deleteQuiz(id: string) {
    quizzes.value = quizzes.value.filter((q) => q.id !== id);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/quizzes/${id}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE /quizzes/${id} fallback local:`, err?.message);
      }
    }
  }

  async function togglePublish(id: string) {
    const q = quizzes.value.find((q) => q.id === id);
    if (q) {
      const nextPublished = !q.isPublished;
      await updateQuiz(id, { isPublished: nextPublished });
    }
  }

  function recordAttempt(id: string) {
    const q = quizzes.value.find((q) => q.id === id);
    if (q) {
      q.attemptsCount++;
    }
  }

  async function submitQuizAttempt(quizId: string, answers: Record<string, string>, timeSpentSeconds: number) {
    recordAttempt(quizId);
    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api(`/quizzes/${quizId}/submit`, {
          method: 'POST',
          body: { answers, timeSpentSeconds },
        });
        return res?.data || res;
      } catch (err: any) {
        console.warn('API POST quiz submit fallback local:', err?.message);
      }
    }
    return null;
  }

  function resetToDefault() {
    quizzes.value = [...seedQuizzes];
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    quizzes,
    loading,
    error,
    publishedQuizzes,
    allQuizzes,
    fetchQuizzes,
    getById,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublish,
    recordAttempt,
    submitQuizAttempt,
    resetToDefault,
  };
});
