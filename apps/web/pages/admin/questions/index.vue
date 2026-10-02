<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Banco de Questões</h1>
        <p class="text-sm text-slate-500">{{ store.questions.length }} questão(ões) · alunos veem em tempo real</p>
      </div>
      <NuxtLink to="/admin/questions/create" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer">
        <i class="pi pi-plus"></i> Nova Questão
      </NuxtLink>
    </div>

    <!-- Feedback toast -->
    <div v-if="feedbackMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ feedbackMsg }}
    </div>

    <!-- Filters -->
    <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input v-model="searchQuery" type="text" placeholder="Buscar por enunciado, disciplina ou assunto..." class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>
      <div class="flex gap-2">
        <select v-model="subjectFilter" class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">Todas as Disciplinas</option>
          <option v-for="s in store.subjects" :key="s">{{ s }}</option>
        </select>
        <select v-model="difficultyFilter" class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">Todas as Dificuldades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Média</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Enunciado</th>
              <th class="p-4">Disciplina / Assunto</th>
              <th class="p-4">Dificuldade</th>
              <th class="p-4">Alternativas</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr v-for="q in filteredQuestions" :key="q.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4 max-w-xs">
                <p class="text-sm font-semibold text-slate-900 line-clamp-2">{{ q.statement }}</p>
                <span class="text-xs text-slate-400">ID: {{ q.id }}</span>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">{{ q.subject }}</span>
                <p class="text-xs text-slate-400 mt-1">{{ q.topic || '—' }}</p>
              </td>
              <td class="p-4">
                <span :class="['px-2.5 py-1 rounded-md text-[11px] font-bold', q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200']">
                  {{ q.difficulty === 'easy' ? 'Fácil' : q.difficulty === 'medium' ? 'Média' : 'Difícil' }}
                </span>
              </td>
              <td class="p-4 text-xs text-slate-500">{{ q.options.length }} alternativas</td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditModal(q)" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer" title="Editar Questão">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button @click="confirmDeleteQ(q.id)" class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer" title="Excluir Questão">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredQuestions.length === 0" class="text-center py-14">
        <i class="pi pi-list-check text-4xl text-slate-200"></i>
        <p class="mt-3 text-slate-400 font-semibold text-sm">Nenhuma questão encontrada</p>
      </div>
    </div>

    <!-- Edit Modal (Complete) -->
    <div v-if="showEditModal && editingQuestion" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-slate-900 text-lg">Editar Questão</h3>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600"><i class="pi pi-times"></i></button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Disciplina *</label>
            <input v-model="editForm.subject" type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Assunto / Tópico</label>
            <input v-model="editForm.topic" type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Dificuldade</label>
            <select v-model="editForm.difficulty" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50">
              <option value="easy">Fácil</option>
              <option value="medium">Média</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Enunciado *</label>
          <textarea v-model="editForm.statement" rows="4" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"></textarea>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <label class="block text-xs font-semibold text-slate-700">Alternativas (selecione a correta)</label>
          <div v-for="(opt, idx) in editForm.options" :key="idx" class="flex items-center gap-3">
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs flex-shrink-0"
              :class="opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'"
            >
              {{ opt.label }}
            </div>
            <input v-model="opt.text" type="text" class="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
            <button
              type="button"
              @click="markCorrectOption(idx)"
              :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer', opt.isCorrect ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700']"
            >
              <i class="pi pi-check mr-1"></i>{{ opt.isCorrect ? 'Correta' : 'Marcar' }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Resolução Comentada / Gabarito</label>
          <textarea v-model="editForm.explanation" rows="3" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"></textarea>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="showEditModal = false" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">Cancelar</button>
          <button @click="saveEdit" :disabled="saving" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2">
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuestionsStore } from '~/stores/questions';
import type { Question } from '~/stores/questions';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Banco de Questões — Admin' });

const store = useQuestionsStore();
const searchQuery = ref('');
const subjectFilter = ref('');
const difficultyFilter = ref('');

const showEditModal = ref(false);
const editingQuestion = ref<Question | null>(null);
const saving = ref(false);

const feedbackMsg = ref('');
const showFeedback = (msg: string) => {
  feedbackMsg.value = msg;
  setTimeout(() => { feedbackMsg.value = ''; }, 3000);
};

const editForm = ref({
  subject: '',
  topic: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  statement: '',
  explanation: '',
  options: [] as { id: string; label: string; text: string; isCorrect: boolean; sortOrder: number }[],
});

onMounted(() => {
  store.fetchQuestions();
});

const filteredQuestions = computed(() =>
  store.questions.filter((q) => {
    const matchSearch = !searchQuery.value || q.statement.toLowerCase().includes(searchQuery.value.toLowerCase()) || q.subject.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchSubject = !subjectFilter.value || q.subject === subjectFilter.value;
    const matchDiff = !difficultyFilter.value || q.difficulty === difficultyFilter.value;
    return matchSearch && matchSubject && matchDiff;
  }),
);

const openEditModal = (q: Question) => {
  editingQuestion.value = q;
  editForm.value = {
    subject: q.subject,
    topic: q.topic || '',
    difficulty: q.difficulty || 'medium',
    statement: q.statement,
    explanation: q.explanation || '',
    options: JSON.parse(JSON.stringify(q.options)),
  };
  showEditModal.value = true;
};

const markCorrectOption = (idx: number) => {
  editForm.value.options.forEach((opt, i) => {
    opt.isCorrect = i === idx;
  });
};

const confirmDeleteQ = async (id: string) => {
  if (confirm('Excluir esta questão permanentemente?')) {
    await store.deleteQuestion(id);
    showFeedback('Questão excluída com sucesso!');
  }
};

const saveEdit = async () => {
  if (!editingQuestion.value) return;
  saving.value = true;
  try {
    await store.updateQuestion(editingQuestion.value.id, {
      subject: editForm.value.subject,
      topic: editForm.value.topic,
      difficulty: editForm.value.difficulty,
      statement: editForm.value.statement,
      explanation: editForm.value.explanation,
      options: editForm.value.options,
    });
    showEditModal.value = false;
    editingQuestion.value = null;
    showFeedback('Questão atualizada com sucesso no banco de dados!');
  } finally {
    saving.value = false;
  }
};
</script>
