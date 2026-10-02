<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- Quiz not found -->
    <div v-if="!quiz" class="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <i class="pi pi-exclamation-circle text-5xl text-slate-600"></i>
      <h2 class="text-2xl font-bold text-white">Simulado não encontrado</h2>
      <p class="text-slate-400 text-sm">Este simulado pode ter sido despublicado pelo administrador.</p>
      <NuxtLink to="/student/quizzes" class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors">
        ← Ver Simulados Disponíveis
      </NuxtLink>
    </div>

    <!-- No questions -->
    <div v-else-if="questions.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <i class="pi pi-list-check text-5xl text-slate-600"></i>
      <h2 class="text-2xl font-bold text-white">Sem questões configuradas</h2>
      <p class="text-slate-400 text-sm">O administrador ainda não adicionou questões a este simulado.</p>
      <NuxtLink to="/student/quizzes" class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors">
        ← Voltar
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Top Header -->
      <header class="h-14 sm:h-16 bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 flex-shrink-0 gap-2">
        <div class="flex items-center gap-2 sm:gap-4 min-w-0">
          <NuxtLink to="/student/quizzes" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
            <i class="pi pi-arrow-left text-sm"></i>
          </NuxtLink>
          <div class="min-w-0">
            <h1 class="text-[10px] sm:text-xs text-brand-400 font-bold uppercase tracking-wider truncate">
              {{ isSubmitted ? 'Resultado Final' : 'Simulado em Andamento' }}
            </h1>
            <p class="text-xs sm:text-sm font-extrabold text-white truncate max-w-[160px] sm:max-w-sm md:max-w-lg">{{ quiz.title }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div v-if="!isSubmitted" :class="['px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 border transition-all', remainingSeconds < 300 ? 'bg-red-950/80 text-red-400 border-red-500 animate-pulse' : 'bg-slate-800 text-slate-200 border-slate-700']">
            <i class="pi pi-clock text-[11px]"></i><span>{{ formattedTimer }}</span>
          </div>
          <button v-if="!isSubmitted" @click="showSubmitModal = true" class="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
            <i class="pi pi-check-circle"></i><span class="hidden sm:inline">Finalizar</span>
          </button>
          <NuxtLink v-if="isSubmitted" to="/student/quizzes" class="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2">
            <i class="pi pi-list"></i><span class="hidden sm:inline">Ver Simulados</span>
          </NuxtLink>
        </div>
      </header>

      <!-- EXAM MODE -->
      <div v-if="!isSubmitted" class="flex-1 flex flex-col lg:flex-row overflow-hidden" style="height: calc(100vh - 56px)">

        <!-- ── Mobile: compact question navigator strip ── -->
        <div class="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex-shrink-0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-300">{{ answeredCount }}/{{ questions.length }} respondidas</span>
            <button @click="showNavDrawer = !showNavDrawer" class="text-xs text-brand-400 font-bold flex items-center gap-1">
              <i :class="showNavDrawer ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-[10px]"></i>
              {{ showNavDrawer ? 'Fechar' : 'Cartão de Respostas' }}
            </button>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-brand-600 rounded-full transition-all" :style="{ width: `${(answeredCount / questions.length) * 100}%` }"></div>
          </div>
          <!-- Expandable grid -->
          <div v-if="showNavDrawer" class="mt-3 grid grid-cols-8 gap-1.5">
            <button v-for="(q, idx) in questions" :key="q.id" @click="currentQuestionIndex = idx; showNavDrawer = false"
              :class="['h-8 rounded-lg font-bold text-xs transition-all flex items-center justify-center border', currentQuestionIndex === idx ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-slate-900' : '', userAnswers[q.id] ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400']">
              {{ idx + 1 }}
            </button>
          </div>
        </div>

        <!-- ── Desktop: sidebar ── -->
        <aside class="hidden lg:flex w-72 bg-slate-900 border-r border-slate-800 p-4 space-y-4 flex-shrink-0 flex-col overflow-y-auto">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Cartão de Respostas</h3>
            <span class="text-xs font-bold text-brand-400">{{ answeredCount }} / {{ questions.length }}</span>
          </div>
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-brand-600 rounded-full transition-all" :style="{ width: `${(answeredCount / questions.length) * 100}%` }"></div>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="(q, idx) in questions" :key="q.id" @click="currentQuestionIndex = idx"
              :class="['w-full h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border', currentQuestionIndex === idx ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-900' : '', userAnswers[q.id] ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200']">
              {{ idx + 1 }}
            </button>
          </div>
          <p v-if="unansweredCount > 0" class="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <i class="pi pi-exclamation-triangle"></i> {{ unansweredCount }} sem resposta
          </p>
        </aside>

        <!-- Main Question area -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div class="max-w-3xl mx-auto space-y-5">
            <div class="flex items-center justify-between text-xs font-bold text-slate-400">
              <span class="px-3 py-1 rounded-lg bg-slate-900 text-brand-400 border border-slate-800">{{ currentQuestion.subject }}</span>
              <span>Questão {{ currentQuestionIndex + 1 }} de {{ questions.length }}</span>
            </div>

            <div class="bg-slate-900/60 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-4">
              <p class="text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-line">{{ currentQuestion.statement }}</p>
              <div class="space-y-2.5 pt-2">
                <button v-for="opt in currentQuestion.options" :key="opt.id" @click="selectOption(currentQuestion.id, opt.id)"
                  :class="['w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left text-sm font-medium transition-all flex items-center gap-3 sm:gap-4', userAnswers[currentQuestion.id] === opt.id ? 'bg-brand-600/20 border-brand-500 text-white' : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300']">
                  <span :class="['w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0', userAnswers[currentQuestion.id] === opt.id ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400']">{{ opt.label }}</span>
                  <span class="flex-1 leading-snug">{{ opt.text }}</span>
                </button>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="flex items-center justify-between pt-1">
              <button @click="currentQuestionIndex--" :disabled="currentQuestionIndex === 0"
                :class="['px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2', currentQuestionIndex > 0 ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-slate-600 cursor-not-allowed']">
                <i class="pi pi-chevron-left"></i> Anterior
              </button>
              <button v-if="currentQuestionIndex < questions.length - 1" @click="currentQuestionIndex++" class="px-4 sm:px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-2">
                Próxima <i class="pi pi-chevron-right"></i>
              </button>
              <button v-else @click="showSubmitModal = true" class="px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2">
                Entregar <i class="pi pi-check"></i>
              </button>
            </div>
          </div>
        </main>
      </div>

      <!-- RESULT MODE -->
      <div v-else class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div class="max-w-4xl mx-auto space-y-8">
          <div class="bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-800 text-center space-y-4 shadow-2xl">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl border"
              :class="resultSummary.percentage >= 60 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'">
              <i :class="resultSummary.percentage >= 60 ? 'pi pi-trophy' : 'pi pi-chart-line'"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-white">Simulado Concluído!</h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800">
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span class="text-xs text-slate-400 block font-semibold">Pontuação</span>
                <span class="text-xl sm:text-2xl font-black" :class="resultSummary.percentage >= 60 ? 'text-emerald-400' : 'text-amber-400'">{{ resultSummary.percentage }}%</span>
              </div>
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span class="text-xs text-slate-400 block font-semibold">Acertos</span>
                <span class="text-xl sm:text-2xl font-black text-white">{{ resultSummary.correctCount }}/{{ questions.length }}</span>
              </div>
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span class="text-xs text-slate-400 block font-semibold">Erros</span>
                <span class="text-xl sm:text-2xl font-black text-red-400">{{ resultSummary.incorrectCount }}</span>
              </div>
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span class="text-xs text-slate-400 block font-semibold">Tempo</span>
                <span class="text-xl sm:text-2xl font-black text-amber-400">{{ resultSummary.timeSpentFormatted }}</span>
              </div>
            </div>
          </div>

          <!-- Gabarito -->
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-white flex items-center gap-2"><i class="pi pi-list text-brand-400"></i> Gabarito Comentado</h3>
            <div v-for="(q, idx) in questions" :key="q.id" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border space-y-4" :class="userAnswers[q.id] === correctOptionId(q) ? 'border-emerald-800/60' : 'border-red-900/60'">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400">Questão {{ idx + 1 }}</span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{{ q.subject }}</span>
                </div>
                <span :class="['px-3 py-1 rounded-md text-xs font-bold', userAnswers[q.id] === correctOptionId(q) ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800']">
                  {{ userAnswers[q.id] === correctOptionId(q) ? '✓ Acertou' : '✗ Errou' }}
                </span>
              </div>
              <p class="text-sm text-slate-200 font-medium leading-relaxed">{{ q.statement }}</p>
              <div class="space-y-2">
                <div v-for="opt in q.options" :key="opt.id"
                  class="flex items-start gap-3 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-medium"
                  :class="[opt.isCorrect ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : opt.id === userAnswers[q.id] && !opt.isCorrect ? 'bg-red-950/60 border border-red-800 text-red-300' : 'bg-slate-950/40 border border-slate-800 text-slate-500']">
                  <span class="font-extrabold w-5 flex-shrink-0 text-center">{{ opt.label }}</span>
                  <span class="flex-1 leading-snug">{{ opt.text }}</span>
                  <span v-if="opt.isCorrect" class="ml-auto text-emerald-400 font-bold flex-shrink-0">✓</span>
                  <span v-else-if="opt.id === userAnswers[q.id]" class="ml-auto text-red-400 font-bold flex-shrink-0">✗</span>
                </div>
              </div>
              <div v-if="q.explanation" class="p-3 sm:p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-xs space-y-1">
                <p class="font-extrabold text-amber-400 flex items-center gap-1.5"><i class="pi pi-lightbulb"></i> Resolução:</p>
                <p class="text-slate-300 leading-relaxed">{{ q.explanation }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4 pb-8">
            <NuxtLink to="/student/quizzes" class="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-3">
              <i class="pi pi-arrow-left"></i> Voltar para os Simulados
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Submit Modal -->
      <div v-if="showSubmitModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
        <div class="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md text-center space-y-6 shadow-2xl">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto text-xl sm:text-2xl"><i class="pi pi-send"></i></div>
          <div>
            <h3 class="text-lg sm:text-xl font-extrabold text-white">Deseja entregar o simulado?</h3>
            <p class="text-slate-400 text-xs mt-2">Você respondeu <strong class="text-white">{{ answeredCount }}</strong> de <strong class="text-white">{{ questions.length }}</strong> questões.</p>
            <p v-if="unansweredCount > 0" class="text-amber-400 text-xs mt-1 font-semibold">⚠️ {{ unansweredCount }} questão(ões) em branco = erradas.</p>
          </div>
          <div class="flex gap-3">
            <button @click="showSubmitModal = false" class="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">Continuar</button>
            <button @click="submitQuiz" class="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg">Confirmar</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuizzesStore } from '~/stores/quizzes';
import { useQuestionsStore } from '~/stores/questions';
import type { Question } from '~/stores/questions';

definePageMeta({ layout: false });

const route = useRoute();
const quizId = route.params.id as string;
const quizzesStore = useQuizzesStore();
const questionsStore = useQuestionsStore();

const quiz = computed(() => quizzesStore.getById(quizId));
const questions = computed<Question[]>(() => {
  if (!quiz.value) return [];
  return quiz.value.questionIds
    .map((id) => questionsStore.getById(id))
    .filter(Boolean) as Question[];
});

useHead({
  title: computed(() => `${quiz.value?.title || 'Simulado'} — StudyEAD`),
});

const currentQuestionIndex = ref(0);
const userAnswers = ref<Record<string, string>>({});
const showSubmitModal = ref(false);
const showNavDrawer = ref(false);
const isSubmitted = ref(false);
const startTime = ref(Date.now());
let timerInterval: any = null;

const remainingSeconds = ref(computed(() => (quiz.value?.timeLimitMinutes || 60) * 60).value);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const answeredCount = computed(() => Object.keys(userAnswers.value).length);
const unansweredCount = computed(() => questions.value.length - answeredCount.value);

const formattedTimer = computed(() => {
  const h = Math.floor(remainingSeconds.value / 3600);
  const m = Math.floor((remainingSeconds.value % 3600) / 60);
  const s = remainingSeconds.value % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const resultSummary = ref({ percentage: 0, correctCount: 0, incorrectCount: 0, timeSpentFormatted: '—' });

const correctOptionId = (q: Question) => q.options.find((o) => o.isCorrect)?.id;

const selectOption = (qId: string, optId: string) => {
  userAnswers.value = { ...userAnswers.value, [qId]: optId };
};

watch(
  () => quiz.value,
  (q) => {
    if (q?.timeLimitMinutes && remainingSeconds.value === 3600) {
      remainingSeconds.value = q.timeLimitMinutes * 60;
    }
  },
  { immediate: true },
);

const submitQuiz = async () => {
  clearInterval(timerInterval);
  showSubmitModal.value = false;

  const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;

  let correct = 0;
  for (const q of questions.value) {
    const correctId = correctOptionId(q);
    if (correctId && userAnswers.value[q.id] === correctId) correct++;
  }

  const total = questions.value.length;
  const percentage = total > 0 ? Number(((correct / total) * 100).toFixed(1)) : 0;

  resultSummary.value = {
    percentage,
    correctCount: correct,
    incorrectCount: total - correct,
    timeSpentFormatted: `${m}m ${s}s`,
  };

  const attemptRecord = {
    id: `att-${Date.now()}`,
    quizId,
    title: quiz.value?.title || 'Simulado',
    category: quiz.value?.category || 'Geral',
    score: percentage,
    correctCount: correct,
    totalQuestions: total,
    timeSpentFormatted: `${m}m ${s}s`,
    date: new Date().toLocaleDateString('pt-BR'),
    timestamp: Date.now(),
  };

  if (process.client) {
    try {
      const stored = localStorage.getItem('studyead_quiz_attempts');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(attemptRecord);
      localStorage.setItem('studyead_quiz_attempts', JSON.stringify(list));
    } catch {}
  }

  isSubmitted.value = true;
  await quizzesStore.submitQuizAttempt(quizId, userAnswers.value, elapsed);

  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(async () => {
  await Promise.all([
    quizzesStore.fetchQuizzes(),
    questionsStore.fetchQuestions(),
  ]);
  if (quiz.value?.timeLimitMinutes) {
    remainingSeconds.value = quiz.value.timeLimitMinutes * 60;
  }
  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) { remainingSeconds.value--; }
    else { submitQuiz(); }
  }, 1000);
});

onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });
</script>
