<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-16">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-900 to-purple-950 p-8 sm:p-10 text-white shadow-xl">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-200 border border-white/20 backdrop-blur-md">
          <i class="pi pi-check-square text-[11px]"></i> Treinamento Inteligente
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Banco de Questões Comentadas
        </h1>
        <p class="text-indigo-200 text-sm sm:text-base leading-relaxed">
          Pratique com milhares de questões do ENEM e vestibulares. Filtre por disciplina, assunto ou dificuldade e veja o gabarito comentado na hora.
        </p>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
          <i class="pi pi-list-check"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Questões Respondidas</p>
          <p class="text-2xl font-black text-slate-900">{{ answeredCount }}</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
          <i class="pi pi-check-circle"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Taxa de Acertos</p>
          <p class="text-2xl font-black text-emerald-600">
            {{ correctCount }} <span class="text-xs font-bold text-slate-400">({{ accuracyPercentage }}%)</span>
          </p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
          <i class="pi pi-database"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Disponíveis no Banco</p>
          <p class="text-2xl font-black text-slate-900">{{ questionsStore.questions.length }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
        <i class="pi pi-filter text-brand-600"></i> Filtrar Questões
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Disciplina</label>
          <select
            v-model="selectedSubject"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          >
            <option value="">Todas as Disciplinas</option>
            <option v-for="s in questionsStore.subjects" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Dificuldade</label>
          <select
            v-model="selectedDifficulty"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          >
            <option value="">Todas as Dificuldades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Média</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Buscar por texto</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ex: Leis de Newton, Geometria..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredQuestions.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200">
      <i class="pi pi-list-check text-5xl text-slate-200"></i>
      <h3 class="mt-4 text-lg font-bold text-slate-700">Nenhuma questão encontrada</h3>
      <p class="text-xs text-slate-400 mt-1">Tente ajustar seus filtros de busca ou disciplina.</p>
    </div>

    <!-- Questions List -->
    <div v-else class="space-y-6">
      <div
        v-for="(q, idx) in filteredQuestions"
        :key="q.id"
        class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 transition-all hover:shadow-md"
      >
        <!-- Question Badge Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-bold border-b border-slate-100 pb-4">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
              {{ q.subject }}
            </span>
            <span v-if="q.topic" class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600">
              {{ q.topic }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span
              :class="[
                'px-2.5 py-1 rounded-md text-[11px]',
                q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              ]"
            >
              Dificuldade: {{ q.difficulty === 'easy' ? 'Fácil' : q.difficulty === 'medium' ? 'Média' : 'Difícil' }}
            </span>
            <span class="text-slate-400">Questão #{{ idx + 1 }}</span>
          </div>
        </div>

        <!-- Enunciado -->
        <p class="text-base text-slate-800 font-medium leading-relaxed whitespace-pre-line">
          {{ q.statement }}
        </p>

        <!-- Options -->
        <div class="space-y-3">
          <button
            v-for="opt in q.options"
            :key="opt.id"
            @click="submitAnswer(q.id, opt.id)"
            :disabled="answeredMap[q.id] !== undefined"
            :class="[
              'w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer',
              getOptionClass(q, opt)
            ]"
          >
            <span
              :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs transition-colors',
                getOptionBadgeClass(q, opt)
              ]"
            >
              {{ opt.label }}
            </span>
            <span class="flex-1 text-slate-800">{{ opt.text }}</span>
          </button>
        </div>

        <!-- Explanation box -->
        <div
          v-if="answeredMap[q.id] !== undefined"
          class="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs text-amber-950"
        >
          <h4 class="font-extrabold text-amber-800 flex items-center gap-1.5 text-sm">
            <i class="pi pi-lightbulb"></i> Resolução Comentada:
          </h4>
          <p class="leading-relaxed text-slate-700 text-sm">{{ q.explanation || 'Resolução comentada indisponível para esta questão.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuestionsStore } from '~/stores/questions';
import type { Question } from '~/stores/questions';

definePageMeta({ layout: 'student' });
useHead({ title: 'Banco de Questões — StudyEAD' });

const questionsStore = useQuestionsStore();

const selectedSubject = ref('');
const selectedDifficulty = ref('');
const searchQuery = ref('');

const STORAGE_ANSWERS_KEY = 'studyead_student_question_answers';

function loadStoredAnswers(): Record<string, string> {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_ANSWERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return {};
}

const answeredMap = ref<Record<string, string>>(loadStoredAnswers());

onMounted(() => {
  questionsStore.fetchQuestions();
});

const filteredQuestions = computed(() => {
  return questionsStore.questions.filter((q) => {
    const matchSubject = !selectedSubject.value || q.subject === selectedSubject.value;
    const matchDifficulty = !selectedDifficulty.value || q.difficulty === selectedDifficulty.value;
    const matchSearch =
      !searchQuery.value ||
      q.statement.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchSubject && matchDifficulty && matchSearch;
  });
});

const answeredCount = computed(() => Object.keys(answeredMap.value).length);

const correctCount = computed(() => {
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

const accuracyPercentage = computed(() => {
  if (answeredCount.value === 0) return 0;
  return Math.round((correctCount.value / answeredCount.value) * 100);
});

const submitAnswer = async (questionId: string, optionId: string) => {
  answeredMap.value[questionId] = optionId;
  if (process.client) {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answeredMap.value));
    } catch {}
  }
  await questionsStore.submitAnswer(questionId, optionId);
};

const getOptionClass = (question: Question, option: any) => {
  const chosenId = answeredMap.value[question.id];
  if (!chosenId) {
    return 'bg-slate-50/60 border-slate-200 hover:border-brand-400 hover:bg-brand-50/30 text-slate-800';
  }

  if (option.isCorrect) {
    return 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm';
  }

  if (chosenId === option.id && !option.isCorrect) {
    return 'bg-red-50 border-red-500 text-red-900';
  }

  return 'bg-slate-50/30 border-slate-100 opacity-60';
};

const getOptionBadgeClass = (question: Question, option: any) => {
  const chosenId = answeredMap.value[question.id];
  if (!chosenId) {
    return 'bg-slate-200 text-slate-700';
  }

  if (option.isCorrect) {
    return 'bg-emerald-600 text-white';
  }

  if (chosenId === option.id && !option.isCorrect) {
    return 'bg-red-600 text-white';
  }

  return 'bg-slate-200 text-slate-400';
};
</script>
