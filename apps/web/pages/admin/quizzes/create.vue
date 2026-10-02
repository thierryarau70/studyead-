<template>
  <div class="max-w-5xl mx-auto pb-16 space-y-8">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/quizzes" class="p-2 rounded-lg hover:bg-surface-200 text-surface-500 hover:text-surface-900 transition-colors">
        <i class="pi pi-arrow-left text-sm"></i>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Novo Simulado</h1>
        <p class="text-sm text-slate-500">Monte o simulado selecionando questões do banco</p>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ successMsg }}
    </div>
    <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-times-circle text-red-600"></i> {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Left: Settings Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Configurações</h2>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Título *</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Ex: Simulado ENEM 1º Dia"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Descrição</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Descreva o simulado..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition resize-none"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Categoria</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Ex: ENEM 2027, Treinamento Curto"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tempo (min)</label>
              <input
                v-model.number="form.timeLimitMinutes"
                type="number"
                min="5"
                max="600"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tentativas</label>
              <input
                v-model.number="form.maxAttempts"
                type="number"
                min="1"
                max="99"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Exibir gabarito</label>
            <select
              v-model="form.showAnswersAfter"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
            >
              <option value="submission">Após submissão</option>
              <option value="deadline">Após prazo</option>
              <option value="never">Nunca</option>
            </select>
          </div>

          <div class="flex flex-col gap-3 pt-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.shuffleQuestions" type="checkbox" class="w-4 h-4 accent-brand-600 rounded">
              <span class="text-sm text-slate-700">Embaralhar questões</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.shuffleOptions" type="checkbox" class="w-4 h-4 accent-brand-600 rounded">
              <span class="text-sm text-slate-700">Embaralhar alternativas</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.isPublished" type="checkbox" class="w-4 h-4 accent-brand-600 rounded">
              <span class="text-sm text-slate-700">Publicar imediatamente</span>
            </label>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-brand-50 border border-brand-200 rounded-2xl p-5 space-y-3">
          <h3 class="text-sm font-bold text-brand-800">Resumo do Simulado</h3>
          <div class="text-sm text-brand-700 space-y-1">
            <div class="flex justify-between">
              <span>Questões selecionadas</span>
              <span class="font-bold">{{ selectedIds.size }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tempo por questão</span>
              <span class="font-bold">
                {{ selectedIds.size > 0 ? Math.round(form.timeLimitMinutes / selectedIds.size) : '—' }} min
              </span>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button
          @click="handleSave"
          :disabled="saving || !form.title || selectedIds.size === 0"
          class="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-save"></i>
          {{ saving ? 'Salvando...' : 'Criar Simulado' }}
        </button>
      </div>

      <!-- Right: Question Picker -->
      <div class="lg:col-span-3 space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Bank header -->
          <div class="p-5 border-b border-slate-100">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Banco de Questões
              </h2>
              <span class="text-xs text-slate-500">
                {{ selectedIds.size }} selecionada(s) de {{ filteredQuestions.length }}
              </span>
            </div>
            <!-- Filters -->
            <div class="flex gap-3">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar questão..."
                class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              />
              <select
                v-model="filterSubject"
                class="px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
              >
                <option value="">Todas as matérias</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <!-- Questions list -->
          <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            <div
              v-for="q in filteredQuestions"
              :key="q.id"
              @click="toggleQuestion(q.id)"
              :class="[
                'p-4 cursor-pointer transition-colors flex gap-3',
                selectedIds.has(q.id) ? 'bg-brand-50 hover:bg-brand-100' : 'hover:bg-slate-50'
              ]"
            >
              <!-- Checkbox visual -->
              <div
                :class="[
                  'w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                  selectedIds.has(q.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-300'
                ]"
              >
                <i v-if="selectedIds.has(q.id)" class="pi pi-check text-white text-xs"></i>
              </div>
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                    {{ q.subject }}
                  </span>
                  <span :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                    q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  ]">
                    {{ q.difficulty === 'easy' ? 'Fácil' : q.difficulty === 'medium' ? 'Médio' : 'Difícil' }}
                  </span>
                </div>
                <p class="text-sm text-slate-800 line-clamp-2 leading-snug">{{ q.statement }}</p>
              </div>
            </div>

            <div v-if="filteredQuestions.length === 0" class="p-8 text-center text-sm text-slate-400">
              <i class="pi pi-search text-2xl mb-2 block"></i>
              Nenhuma questão encontrada
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuestionsStore } from '~/stores/questions';
import { useQuizzesStore } from '~/stores/quizzes';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Criar Simulado — Admin StudyEAD' });

const questionsStore = useQuestionsStore();
const quizzesStore = useQuizzesStore();

const saving = ref(false);
const successMsg = ref('');
const errorMsg = ref('');
const searchTerm = ref('');
const filterSubject = ref('');
const selectedIds = ref<Set<string>>(new Set());

const form = ref({
  title: '',
  description: '',
  category: '',
  timeLimitMinutes: 90,
  maxAttempts: 3,
  shuffleQuestions: false,
  shuffleOptions: false,
  showAnswersAfter: 'submission' as 'submission' | 'deadline' | 'never',
  isPublished: false,
});

const subjects = computed(() => questionsStore.subjects);

const filteredQuestions = computed(() => {
  let list = questionsStore.questions;
  if (filterSubject.value) {
    list = list.filter(q => q.subject === filterSubject.value);
  }
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    list = list.filter(q =>
      q.statement.toLowerCase().includes(term) ||
      q.subject.toLowerCase().includes(term) ||
      (q.topic?.toLowerCase().includes(term))
    );
  }
  return list;
});

function toggleQuestion(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  // Trigger reactivity
  selectedIds.value = new Set(selectedIds.value);
}

async function handleSave() {
  if (!form.value.title.trim()) {
    errorMsg.value = 'O título é obrigatório.';
    return;
  }
  if (selectedIds.value.size === 0) {
    errorMsg.value = 'Selecione ao menos uma questão.';
    return;
  }

  saving.value = true;
  errorMsg.value = '';
  try {
    await quizzesStore.addQuiz({
      ...form.value,
      questionIds: [...selectedIds.value],
    });
    successMsg.value = `Simulado "${form.value.title}" criado com sucesso!`;
    setTimeout(() => navigateTo('/admin/quizzes'), 1500);
  } catch (err: any) {
    errorMsg.value = err?.message || 'Erro ao criar simulado.';
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  questionsStore.fetchQuestions();
});
</script>
