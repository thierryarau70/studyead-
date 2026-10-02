<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Meu Progresso
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe em tempo real suas aulas concluídas, resolução de questões e simulados
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="refreshData"
          class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          title="Recarregar dados de progresso"
        >
          <i class="pi pi-refresh text-xs" :class="{ 'animate-spin': isRefreshing }"></i>
          <span>Atualizar Progresso</span>
        </button>
      </div>
    </div>

    <!-- Overall Progress Hero Card -->
    <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-xl space-y-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-brand-100 backdrop-blur-md">
            <i class="pi pi-chart-line text-[11px]"></i> Aproveitamento Geral
          </span>
          <div class="flex items-baseline gap-3 mt-2">
            <p class="text-4xl sm:text-5xl font-black tracking-tight">
              {{ overallScore }}%
            </p>
            <span class="text-xs sm:text-sm text-brand-200 font-medium">
              {{ overallScoreBadge }}
            </span>
          </div>
          <p class="text-brand-100 text-xs mt-1 max-w-md">
            Média ponderada calculada a partir das questões resolvidas e simulados finalizados.
          </p>
        </div>

        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
          🎯
        </div>
      </div>

      <!-- Real Counters Grid -->
      <div class="pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center relative z-10">
        <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
          <p class="text-2xl sm:text-3xl font-extrabold">{{ totalQuestionsAnswered }}</p>
          <p class="text-xs text-brand-100 mt-0.5">Questões Resolvidas</p>
          <p class="text-[11px] text-brand-200/80 mt-1">
            {{ correctQuestionsCount }} acertos ({{ questionAccuracy }}%)
          </p>
        </div>

        <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
          <p class="text-2xl sm:text-3xl font-extrabold">{{ completedLessonsCount }}</p>
          <p class="text-xs text-brand-100 mt-0.5">Aulas Assistidas</p>
          <p class="text-[11px] text-brand-200/80 mt-1">
            de {{ totalLessonsInCatalog }} aulas no catálogo
          </p>
        </div>

        <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
          <p class="text-2xl sm:text-3xl font-extrabold">{{ totalSimuladosDone }}</p>
          <p class="text-xs text-brand-100 mt-0.5">Simulados Realizados</p>
          <p class="text-[11px] text-brand-200/80 mt-1">
            Média de {{ averageSimuladoScore }}%
          </p>
        </div>
      </div>
    </div>

    <!-- Enrolled Courses Progress -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <i class="pi pi-book text-brand-600"></i> Andamento nos Cursos Liberados
        </h2>
        <NuxtLink to="/student/courses" class="text-xs font-bold text-brand-600 hover:text-brand-800">
          Catálogo completo →
        </NuxtLink>
      </div>

      <div v-if="enrolledCoursesProgress.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          v-for="item in enrolledCoursesProgress"
          :key="item.course.id"
          class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-200 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div class="space-y-1.5">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
              {{ item.course.category }}
            </span>
            <h3 class="text-sm font-bold text-slate-900 line-clamp-1">
              {{ item.course.title }}
            </h3>
            <p class="text-[11px] text-slate-500">
              {{ item.completedCount }} de {{ item.totalLessons }} aulas assistidas
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400 font-medium">Progresso</span>
              <span class="font-black text-brand-700">{{ item.percent }}%</span>
            </div>
            <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500 bg-brand-600"
                :style="{ width: `${item.percent}%` }"
              ></div>
            </div>

            <NuxtLink
              :to="`/student/courses/${item.course.slug}`"
              class="block w-full py-2 text-center rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-bold transition-colors mt-2"
            >
              Continuar Estudando →
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs space-y-2">
        <p class="font-bold text-slate-700">Nenhum curso liberado ainda</p>
        <p>A coordenação pedagógica liberará seus módulos em breve ou confira os cursos disponíveis.</p>
        <NuxtLink to="/student/courses" class="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Ver Catálogo
        </NuxtLink>
      </div>
    </div>

    <!-- Subject Performance Breakdown (Real Data) -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <i class="pi pi-chart-bar text-brand-600"></i> Desempenho Real por Disciplina
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Estatísticas calculadas a partir das respostas submetidas no Banco de Questões
          </p>
        </div>

        <NuxtLink to="/student/questions" class="text-xs font-bold text-brand-600 hover:text-brand-800">
          Resolver mais questões →
        </NuxtLink>
      </div>

      <div v-if="subjectBreakdown.length > 0" class="space-y-4">
        <div
          v-for="sub in subjectBreakdown"
          :key="sub.name"
          class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2.5"
        >
          <div class="flex items-center justify-between text-sm flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800">{{ sub.name }}</span>
              <span class="text-xs text-slate-500 font-medium">
                ({{ sub.answered }} resolvida(s) · {{ sub.correct }} acerto(s))
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <span
                v-if="sub.answered > 0"
                class="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                :class="[
                  sub.percent >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  sub.percent >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                ]"
              >
                {{ sub.percent }}% de acerto
              </span>
              <span v-else class="text-[11px] font-semibold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                Não praticado
              </span>
              <NuxtLink
                :to="`/student/questions`"
                class="text-[11px] font-bold text-brand-600 hover:underline"
              >
                Praticar
              </NuxtLink>
            </div>
          </div>

          <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="[
                sub.percent >= 80 ? 'bg-emerald-500' :
                sub.percent >= 60 ? 'bg-amber-500' :
                sub.answered > 0 ? 'bg-red-500' : 'bg-slate-300'
              ]"
              :style="{ width: `${sub.percent}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs space-y-2">
        <i class="pi pi-question-circle text-3xl text-slate-300"></i>
        <p class="font-bold text-slate-700">Nenhuma questão respondida ainda</p>
        <p>Pratique questões comentadas para visualizar seus gráficos de taxa de acerto por disciplina!</p>
        <NuxtLink to="/student/questions" class="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Ir para o Banco de Questões
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Real Quiz Results -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <i class="pi pi-clock text-brand-600"></i> Histórico de Simulados Realizados
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">Resultados reais com pontuação e data de realização</p>
        </div>
        <NuxtLink to="/student/quizzes" class="text-xs font-bold text-brand-600 hover:text-brand-800">
          Ver Simulados →
        </NuxtLink>
      </div>

      <div v-if="realQuizAttempts.length > 0" class="space-y-3 pt-1">
        <div
          v-for="attempt in realQuizAttempts"
          :key="attempt.id"
          class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 gap-3"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {{ attempt.category || 'Simulado' }}
              </span>
              <span class="text-xs text-slate-400">· Realizado em {{ attempt.date }}</span>
            </div>
            <p class="font-bold text-slate-900 text-sm">{{ attempt.title }}</p>
            <p class="text-xs text-slate-500">
              {{ attempt.correctCount }} de {{ attempt.totalQuestions }} questões corretas · Tempo: {{ attempt.timeSpentFormatted || 'Concluído' }}
            </p>
          </div>

          <div class="flex items-center gap-3 self-end sm:self-center">
            <span
              :class="[
                'font-black text-xl px-3 py-1 rounded-xl',
                attempt.score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                attempt.score >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
              ]"
            >
              {{ attempt.score }}%
            </span>
            <NuxtLink
              :to="`/student/quizzes/${attempt.quizId}`"
              class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Refazer
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs space-y-2">
        <i class="pi pi-clock text-3xl text-slate-300"></i>
        <p class="font-bold text-slate-700">Nenhum simulado realizado ainda</p>
        <p>Faça seu primeiro simulado com tempo controlado para treinar sua velocidade de prova!</p>
        <NuxtLink to="/student/quizzes" class="inline-block mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors">
          Fazer um Simulado Agora
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCoursesStore, deduplicateCourses, getCanonicalCourseKey } from '~/stores/courses';
import { useQuestionsStore } from '~/stores/questions';
import { useQuizzesStore } from '~/stores/quizzes';

definePageMeta({ layout: 'student' });
useHead({ title: 'Meu Progresso — StudyEAD' });

const authStore = useAuthStore();
const coursesStore = useCoursesStore();
const questionsStore = useQuestionsStore();
const quizzesStore = useQuizzesStore();

const isRefreshing = ref(false);

const completedLessons = ref<string[]>([]);
const answeredMap = ref<Record<string, string>>({});
const realQuizAttempts = ref<any[]>([]);

function loadClientProgress() {
  if (process.client) {
    try {
      const storedLessons = localStorage.getItem('studyead_completed_lessons');
      completedLessons.value = storedLessons ? JSON.parse(storedLessons) : [];

      const storedAnswers = localStorage.getItem('studyead_student_question_answers');
      answeredMap.value = storedAnswers ? JSON.parse(storedAnswers) : {};

      const storedAttempts = localStorage.getItem('studyead_quiz_attempts');
      realQuizAttempts.value = storedAttempts ? JSON.parse(storedAttempts) : [];
    } catch (e) {
      console.error('Erro ao ler progresso do estudante:', e);
    }
  }
}

async function refreshData() {
  isRefreshing.value = true;
  loadClientProgress();
  await Promise.all([
    coursesStore.fetchCourses(),
    questionsStore.fetchQuestions(),
    quizzesStore.fetchQuizzes(),
    authStore.fetchMe(),
  ]);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 400);
}

onMounted(() => {
  refreshData();
});

// ── Real Question Stats ───────────────────────────────────────────
const totalQuestionsAnswered = computed(() => Object.keys(answeredMap.value).length);

const correctQuestionsCount = computed(() => {
  let count = 0;
  for (const [qId, optId] of Object.entries(answeredMap.value)) {
    const q = questionsStore.getById(qId);
    if (q) {
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (correctOpt && correctOpt.id === optId) {
        count++;
      }
    }
  }
  return count;
});

const questionAccuracy = computed(() => {
  if (totalQuestionsAnswered.value === 0) return 0;
  return Math.round((correctQuestionsCount.value / totalQuestionsAnswered.value) * 100);
});

// ── Real Lesson Stats ─────────────────────────────────────────────
const completedLessonsCount = computed(() => completedLessons.value.length);

const totalLessonsInCatalog = computed(() => {
  const sum = coursesStore.publishedCourses.reduce((acc, c) => {
    const modulesLessons = c.modules?.reduce((mSum, m) => mSum + (m.lessons?.length || 0), 0) || 0;
    const lessons = Math.max(Number(c.totalLessons) || 0, modulesLessons);
    return acc + (lessons > 0 ? lessons : (c.modules?.length ? c.modules.length * 4 : 8));
  }, 0);
  return sum || 16;
});

// ── Real Quiz Stats ───────────────────────────────────────────────
const totalSimuladosDone = computed(() => realQuizAttempts.value.length);

const averageSimuladoScore = computed(() => {
  if (realQuizAttempts.value.length === 0) return 0;
  const sum = realQuizAttempts.value.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  return Math.round(sum / realQuizAttempts.value.length);
});

// ── Overall Approvação Score ──────────────────────────────────────
const overallScore = computed(() => {
  const hasQuestions = totalQuestionsAnswered.value > 0;
  const hasQuizzes = totalSimuladosDone.value > 0;

  if (hasQuestions && hasQuizzes) {
    return Math.round((questionAccuracy.value * 0.5) + (averageSimuladoScore.value * 0.5));
  }
  if (hasQuestions) return questionAccuracy.value;
  if (hasQuizzes) return averageSimuladoScore.value;
  return 0;
});

const overallScoreBadge = computed(() => {
  const score = overallScore.value;
  if (score >= 80) return 'Excelente aproveitamento! 🌟';
  if (score >= 60) return 'Bom ritmo de estudos! 🚀';
  if (score > 0) return 'Continue praticando! 📚';
  return 'Inicie seus estudos para calcular';
});

// ── Real Subject Performance Breakdown ────────────────────────────
const subjectBreakdown = computed(() => {
  // Collect all unique subjects from question bank
  const subjectMap = new Map<string, { total: number; answered: number; correct: number }>();

  // Initialize with all questions in store
  for (const q of questionsStore.questions) {
    const sub = q.subject?.trim() || 'Geral';
    if (!subjectMap.has(sub)) {
      subjectMap.set(sub, { total: 0, answered: 0, correct: 0 });
    }
    subjectMap.get(sub)!.total++;
  }

  // Fallback defaults if store has few questions
  const defaultSubs = ['Matemática', 'Física', 'Química', 'Biologia', 'Linguagens'];
  for (const d of defaultSubs) {
    if (!subjectMap.has(d)) {
      subjectMap.set(d, { total: 10, answered: 0, correct: 0 });
    }
  }

  // Count user answers
  for (const [qId, optId] of Object.entries(answeredMap.value)) {
    const q = questionsStore.getById(qId);
    if (q) {
      const sub = q.subject?.trim() || 'Geral';
      if (!subjectMap.has(sub)) {
        subjectMap.set(sub, { total: 1, answered: 0, correct: 0 });
      }
      const entry = subjectMap.get(sub)!;
      entry.answered++;
      const isCorrect = q.options.find((o) => o.isCorrect)?.id === optId;
      if (isCorrect) {
        entry.correct++;
      }
    }
  }

  return Array.from(subjectMap.entries())
    .map(([name, data]) => {
      const percent = data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0;
      return {
        name,
        total: data.total,
        answered: data.answered,
        correct: data.correct,
        percent,
      };
    })
    .sort((a, b) => b.answered - a.answered || a.name.localeCompare(b.name));
});

// ── Real Enrolled Courses Progress ─────────────────────────────────
const enrolledCoursesProgress = computed(() => {
  const published = deduplicateCourses(coursesStore.publishedCourses);
  const enrolledRaw = authStore.enrolledCourseIds || [];

  return published
    .filter((c) => {
      if (authStore.canAccessAllCourses || authStore.user?.email === 'aluno@cursinhoalpha.com.br') return true;
      if (enrolledRaw.length === 0) return true;
      const canon = getCanonicalCourseKey(c);
      return enrolledRaw.some((rawId) => {
        if (rawId === c.id || rawId === c.slug) return true;
        if (rawId === 'c-1' || rawId === 'course-1') return canon === 'canonical-enem';
        if (rawId === 'c-2' || rawId === 'course-2') return canon === 'canonical-redacao';
        if (rawId === 'c-3' || rawId === 'course-3') return canon === 'canonical-medicina';
        const cObj = coursesStore.getCourseById(rawId);
        return cObj && getCanonicalCourseKey(cObj) === canon;
      });
    })
    .map((c) => {
      // Find all lesson IDs for this course
      const allLessonIds: string[] = [];
      c.modules?.forEach((m) => {
        m.lessons?.forEach((l) => allLessonIds.push(l.id));
      });
      const totalLessons = allLessonIds.length > 0 ? allLessonIds.length : (Number(c.totalLessons) || 6);

      // Check how many are in completedLessons
      const completedCount = allLessonIds.filter((id) => completedLessons.value.includes(id)).length;
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

      return {
        course: c,
        totalLessons,
        completedCount,
        percent,
      };
    });
});
</script>
