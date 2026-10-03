<template>
  <div class="max-w-6xl mx-auto pb-16 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin/quizzes"
          class="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-sm"
          title="Voltar para Simulados"
        >
          <i class="pi pi-arrow-left text-sm"></i>
        </NuxtLink>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Montador de Simulado</h1>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Banco de Questões
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500">
            Configure as regras e selecione questões diretamente do banco pedagógico
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/quizzes"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          Cancelar
        </NuxtLink>
        <button
          @click="handleSave"
          :disabled="saving || !form.title.trim() || selectedIds.size === 0"
          class="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-check"></i>
          <span>{{ saving ? 'Salvando...' : 'Salvar & Criar' }}</span>
        </button>
      </div>
    </div>

    <!-- Feedback messages -->
    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-center gap-3 animate-fade-in shadow-sm">
      <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
      <div>
        <p class="font-bold">{{ successMsg }}</p>
        <p class="text-xs text-emerald-700">Redirecionando para a listagem de simulados...</p>
      </div>
    </div>
    <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm flex items-center gap-3 animate-fade-in shadow-sm">
      <i class="pi pi-times-circle text-red-600 text-lg"></i>
      <p class="font-medium">{{ errorMsg }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Settings & Summary (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <!-- Settings Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i class="pi pi-cog text-brand-600"></i> Parâmetros da Prova
            </h2>
            <span class="text-xs font-bold text-slate-400">Etapa 1 de 2</span>
          </div>

          <!-- Título -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700">Título do Simulado *</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Ex: Simulado ENEM 1º Dia — Humanas e Linguagens"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 bg-slate-50 transition font-medium"
            />
          </div>

          <!-- Descrição -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700">Instruções / Descrição</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Ex: Prova com 45 questões. Cronômetro regressivo com cálculo automático de nota TRI."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 bg-slate-50 transition resize-none font-medium"
            />
          </div>

          <!-- Curso Vinculado & Categoria -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Curso Vinculado</label>
              <select
                v-model="form.courseId"
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40 bg-slate-50 font-medium"
              >
                <option value="">Geral (Todos os Cursos)</option>
                <option v-for="c in coursesStore.courses" :key="c.id" :value="c.id">
                  {{ c.title }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Categoria / Rótulo</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="Ex: ENEM 2027, Fuvest"
                class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40 bg-slate-50 font-medium"
              />
            </div>
          </div>

          <!-- Tempo e Tentativas -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Tempo Limite (min)</label>
              <div class="relative">
                <input
                  v-model.number="form.timeLimitMinutes"
                  type="number"
                  min="5"
                  max="600"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/40 bg-slate-50 font-semibold"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">minutos</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Máx. Tentativas</label>
              <input
                v-model.number="form.maxAttempts"
                type="number"
                min="1"
                max="50"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/40 bg-slate-50 font-semibold"
              />
            </div>
          </div>

          <!-- Exibição de Gabarito -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700">Exibição do Gabarito & Resoluções</label>
            <select
              v-model="form.showAnswersAfter"
              class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/40 bg-slate-50 font-medium"
            >
              <option value="submission">Imediatamente após o aluno finalizar</option>
              <option value="deadline">Apenas após o encerramento do prazo</option>
              <option value="never">Nunca (prova confidencial)</option>
            </select>
          </div>

          <!-- Opções extras -->
          <div class="pt-2 border-t border-slate-100 space-y-2.5">
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input v-model="form.shuffleQuestions" type="checkbox" class="w-4 h-4 text-brand-600 rounded" />
              <span class="text-xs font-semibold text-slate-700">Embaralhar ordem das questões</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input v-model="form.shuffleOptions" type="checkbox" class="w-4 h-4 text-brand-600 rounded" />
              <span class="text-xs font-semibold text-slate-700">Embaralhar alternativas (A, B, C, D, E)</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input v-model="form.isPublished" type="checkbox" class="w-4 h-4 text-brand-600 rounded" />
              <span class="text-xs font-semibold text-slate-700">Publicar imediatamente para os alunos</span>
            </label>
          </div>
        </div>

        <!-- Selected Questions & Metrics Summary -->
        <div class="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-square text-brand-400"></i>
              <h3 class="text-sm font-extrabold uppercase tracking-wide">Questões Selecionadas</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-500 text-white">
              {{ selectedIds.size }} questão(ões)
            </span>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
              <span class="text-slate-300 block text-[11px]">Tempo por Questão</span>
              <span class="text-base font-bold text-white">
                {{ selectedIds.size > 0 ? (form.timeLimitMinutes / selectedIds.size).toFixed(1) : '—' }} min
              </span>
            </div>
            <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
              <span class="text-slate-300 block text-[11px]">Dificuldade Média</span>
              <span class="text-base font-bold text-brand-300">{{ averageDifficultyLabel }}</span>
            </div>
          </div>

          <!-- Subject distribution -->
          <div v-if="selectedSubjectsBreakdown.length > 0" class="space-y-1.5 pt-2 border-t border-white/10">
            <span class="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Distribuição por Matéria:</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="item in selectedSubjectsBreakdown"
                :key="item.subject"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/15 text-slate-200 border border-white/10"
              >
                {{ item.subject }}: {{ item.count }}
              </span>
            </div>
          </div>

          <!-- Selected questions mini list -->
          <div v-if="selectedQuestionsList.length > 0" class="space-y-2 pt-2 border-t border-white/10">
            <div class="flex items-center justify-between text-xs text-slate-300">
              <span class="font-semibold">Ordem na Prova</span>
              <button
                @click="clearAllSelected"
                class="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
              >
                Limpar seleção
              </button>
            </div>
            <div class="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              <div
                v-for="(q, idx) in selectedQuestionsList"
                :key="q.id"
                class="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/10 text-xs border border-white/5 hover:bg-white/15 transition-colors"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-5 h-5 rounded-full bg-brand-500/40 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-[11px] font-bold text-brand-300 truncate flex-shrink-0">{{ q.subject }}</span>
                  <span class="truncate text-slate-300 text-[11px]">{{ q.statement }}</span>
                </div>
                <button
                  @click.stop="toggleQuestion(q.id)"
                  class="text-slate-400 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                  title="Remover do simulado"
                >
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action inside Card -->
          <button
            @click="handleSave"
            :disabled="saving || !form.title.trim() || selectedIds.size === 0"
            class="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-check"></i>
            <span>{{ saving ? 'Criando Simulado...' : `Concluir & Salvar (${selectedIds.size} Questões)` }}</span>
          </button>
        </div>
      </div>

      <!-- Right Column: Question Bank Explorer (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Explorer Header & Filters -->
          <div class="p-6 border-b border-slate-100 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 class="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <i class="pi pi-database text-brand-600"></i> Banco Pedagógico de Questões
                </h2>
                <p class="text-xs text-slate-500">
                  {{ filteredQuestions.length }} questão(ões) disponível(is) para vincular
                </p>
              </div>
              <!-- Bulk Actions -->
              <div class="flex items-center gap-2">
                <button
                  @click="selectAllFiltered"
                  class="px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Adicionar todas as questões listadas ao simulado"
                >
                  + Selecionar Visíveis
                </button>
                <button
                  @click="clearAllSelected"
                  class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                  title="Desmarcar todas"
                >
                  Limpar
                </button>
              </div>
            </div>

            <!-- Filter Controls -->
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <!-- Search -->
              <div class="sm:col-span-6 relative">
                <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar por enunciado, tag ou assunto..."
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition"
                />
              </div>

              <!-- Subject Filter -->
              <div class="sm:col-span-3">
                <select
                  v-model="filterSubject"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/50 bg-slate-50 font-medium"
                >
                  <option value="">Todas as Matérias</option>
                  <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>

              <!-- Difficulty Filter -->
              <div class="sm:col-span-3">
                <select
                  v-model="filterDifficulty"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/50 bg-slate-50 font-medium"
                >
                  <option value="">Todas Dificuldades</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Questions Interactive List -->
          <div class="divide-y divide-slate-100 max-h-[680px] overflow-y-auto">
            <div
              v-for="q in filteredQuestions"
              :key="q.id"
              :class="[
                'p-4 transition-colors',
                selectedIds.has(q.id) ? 'bg-brand-50/70 border-l-4 border-brand-600' : 'hover:bg-slate-50'
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Checkbox -->
                <button
                  type="button"
                  @click="toggleQuestion(q.id)"
                  :class="[
                    'w-6 h-6 rounded-lg border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer',
                    selectedIds.has(q.id) ? 'bg-brand-600 border-brand-600 shadow-sm' : 'border-slate-300 hover:border-brand-500 bg-white'
                  ]"
                >
                  <i v-if="selectedIds.has(q.id)" class="pi pi-check text-white text-xs font-bold"></i>
                </button>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-brand-100 text-brand-800 uppercase tracking-wide">
                      {{ q.subject }}
                    </span>
                    <span v-if="q.topic" class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {{ q.topic }}
                    </span>
                    <span :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-md',
                      q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                      q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ q.difficulty === 'easy' ? 'Fácil' : q.difficulty === 'medium' ? 'Médio' : 'Difícil' }}
                    </span>
                  </div>

                  <!-- Enunciado -->
                  <p
                    @click="toggleQuestion(q.id)"
                    class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed cursor-pointer"
                    :class="expandedQuestionId === q.id ? '' : 'line-clamp-2'"
                  >
                    {{ q.statement }}
                  </p>

                  <!-- Expanded View: Options & Resolution -->
                  <div v-if="expandedQuestionId === q.id" class="mt-3 pt-3 border-t border-slate-200/80 space-y-2 animate-fade-in">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Alternativas de Resposta:</span>
                    <div class="space-y-1.5">
                      <div
                        v-for="opt in q.options"
                        :key="opt.id"
                        :class="[
                          'p-2.5 rounded-xl border text-xs flex items-center gap-2.5',
                          opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700'
                        ]"
                      >
                        <span :class="[
                          'w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] flex-shrink-0',
                          opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        ]">
                          {{ opt.label }}
                        </span>
                        <span class="flex-1">{{ opt.text }}</span>
                        <span v-if="opt.isCorrect" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Gabarito Correto
                        </span>
                      </div>
                    </div>

                    <div v-if="q.explanation" class="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <span class="font-extrabold flex items-center gap-1.5 text-amber-800">
                        <i class="pi pi-lightbulb"></i> Comentário Pedagógico:
                      </span>
                      <p class="leading-relaxed">{{ q.explanation }}</p>
                    </div>
                  </div>

                  <!-- Footer of question card -->
                  <div class="mt-2.5 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      @click="toggleExpand(q.id)"
                      class="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                    >
                      <i :class="expandedQuestionId === q.id ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-[10px]"></i>
                      <span>{{ expandedQuestionId === q.id ? 'Ocultar detalhes' : 'Ver alternativas completas' }}</span>
                    </button>

                    <button
                      type="button"
                      @click="toggleQuestion(q.id)"
                      :class="[
                        'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer',
                        selectedIds.has(q.id) ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-700 hover:bg-brand-600 hover:text-white'
                      ]"
                    >
                      {{ selectedIds.has(q.id) ? 'Remover' : '+ Adicionar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty search state -->
            <div v-if="filteredQuestions.length === 0" class="p-12 text-center text-slate-400 space-y-2">
              <i class="pi pi-search text-3xl block text-slate-300"></i>
              <p class="font-bold text-sm text-slate-600">Nenhuma questão encontrada</p>
              <p class="text-xs">Tente ajustar o termo de pesquisa ou limpar os filtros de matéria e dificuldade.</p>
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
import { useCoursesStore } from '~/stores/courses';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Montador de Simulado — Admin StudyEAD' });

const questionsStore = useQuestionsStore();
const quizzesStore = useQuizzesStore();
const coursesStore = useCoursesStore();

const saving = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const searchTerm = ref('');
const filterSubject = ref('');
const filterDifficulty = ref('');
const expandedQuestionId = ref<string | null>(null);

const selectedIds = ref<Set<string>>(new Set());

const form = ref({
  title: '',
  description: '',
  category: 'ENEM 2027',
  courseId: '',
  timeLimitMinutes: 90,
  maxAttempts: 3,
  shuffleQuestions: false,
  shuffleOptions: false,
  showAnswersAfter: 'submission' as 'submission' | 'deadline' | 'never',
  isPublished: true,
});

onMounted(() => {
  questionsStore.fetchQuestions();
  coursesStore.fetchCourses();
});

const subjects = computed(() => questionsStore.subjects || []);

const filteredQuestions = computed(() => {
  let list = questionsStore.questions || [];
  if (filterSubject.value) {
    list = list.filter((q) => q.subject === filterSubject.value);
  }
  if (filterDifficulty.value) {
    list = list.filter((q) => q.difficulty === filterDifficulty.value);
  }
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    list = list.filter((q) =>
      q.statement.toLowerCase().includes(term) ||
      q.subject.toLowerCase().includes(term) ||
      (q.topic && q.topic.toLowerCase().includes(term)) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(term)))
    );
  }
  return list;
});

const selectedQuestionsList = computed(() => {
  const allMap = new Map(questionsStore.questions.map((q) => [q.id, q]));
  return Array.from(selectedIds.value)
    .map((id) => allMap.get(id))
    .filter(Boolean) as typeof questionsStore.questions;
});

const selectedSubjectsBreakdown = computed(() => {
  const counts: Record<string, number> = {};
  for (const q of selectedQuestionsList.value) {
    counts[q.subject] = (counts[q.subject] || 0) + 1;
  }
  return Object.entries(counts).map(([subject, count]) => ({ subject, count }));
});

const averageDifficultyLabel = computed(() => {
  if (selectedQuestionsList.value.length === 0) return '—';
  const scores: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
  let sum = 0;
  for (const q of selectedQuestionsList.value) {
    sum += scores[q.difficulty] || 2;
  }
  const avg = sum / selectedQuestionsList.value.length;
  if (avg < 1.5) return 'Fácil';
  if (avg < 2.4) return 'Equilibrado';
  return 'Avançado';
});

function toggleQuestion(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  selectedIds.value = new Set(selectedIds.value);
}

function toggleExpand(id: string) {
  expandedQuestionId.value = expandedQuestionId.value === id ? null : id;
}

function selectAllFiltered() {
  for (const q of filteredQuestions.value) {
    selectedIds.value.add(q.id);
  }
  selectedIds.value = new Set(selectedIds.value);
}

function clearAllSelected() {
  selectedIds.value.clear();
  selectedIds.value = new Set();
}

async function handleSave() {
  if (!form.value.title.trim()) {
    errorMsg.value = 'Por favor, informe o título do simulado.';
    return;
  }
  if (selectedIds.value.size === 0) {
    errorMsg.value = 'Selecione ao menos 1 questão do banco para compor o simulado.';
    return;
  }

  saving.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await quizzesStore.addQuiz({
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      category: form.value.category.trim() || 'Geral',
      courseId: form.value.courseId || undefined,
      timeLimitMinutes: form.value.timeLimitMinutes || 60,
      maxAttempts: form.value.maxAttempts || 1,
      shuffleQuestions: Boolean(form.value.shuffleQuestions),
      shuffleOptions: Boolean(form.value.shuffleOptions),
      showAnswersAfter: form.value.showAnswersAfter,
      isPublished: Boolean(form.value.isPublished),
      questionIds: Array.from(selectedIds.value),
    });

    successMsg.value = `Simulado "${form.value.title}" criado com ${selectedIds.value.size} questões vinculadas!`;
    setTimeout(() => {
      navigateTo('/admin/quizzes');
    }, 1500);
  } catch (err: any) {
    errorMsg.value = err?.message || 'Erro ao criar simulado. Tente novamente.';
  } finally {
    saving.value = false;
  }
}
</script>
