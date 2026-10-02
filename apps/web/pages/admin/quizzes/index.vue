<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Simulados</h1>
        <p class="text-sm text-slate-500">{{ quizzesStore.allQuizzes.length }} simulado(s) · questões vinculadas do banco</p>
      </div>
      <button @click="showCreateModal = true" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer">
        <i class="pi pi-plus"></i> Novo Simulado
      </button>
    </div>

    <!-- Feedback toast -->
    <div v-if="feedbackMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ feedbackMsg }}
    </div>

    <!-- Quizzes Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Simulado</th>
              <th class="p-4">Questões</th>
              <th class="p-4">Tempo</th>
              <th class="p-4">Realizações</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="quiz in quizzesStore.allQuizzes" :key="quiz.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4">
                <h4 class="font-bold text-slate-900 line-clamp-1">{{ quiz.title }}</h4>
                <p class="text-xs text-slate-400 mt-0.5">{{ quiz.category }}</p>
              </td>
              <td class="p-4">
                <span class="font-bold text-slate-900">{{ quiz.questionIds.length }}</span>
                <span class="text-xs text-slate-400 ml-1">questões</span>
              </td>
              <td class="p-4 text-xs font-semibold text-slate-600">{{ quiz.timeLimitMinutes }} min</td>
              <td class="p-4 text-xs font-semibold text-slate-600">{{ quiz.attemptsCount }} realizações</td>
              <td class="p-4">
                <span :class="['px-2.5 py-1 rounded-md text-[11px] font-bold', quiz.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200']">
                  {{ quiz.isPublished ? 'Publicado' : 'Rascunho' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditQuiz(quiz)" class="p-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors text-xs cursor-pointer" title="Editar Simulado & Questões">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="togglePublish(quiz.id)"
                    :class="['p-2 rounded-lg transition-colors text-xs cursor-pointer', quiz.isPublished ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600']"
                    :title="quiz.isPublished ? 'Despublicar' : 'Publicar'"
                  >
                    <i :class="['pi', quiz.isPublished ? 'pi-eye-slash' : 'pi-check-circle']"></i>
                  </button>
                  <button @click="confirmDeleteQuiz(quiz.id)" class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs cursor-pointer" title="Excluir Simulado">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="quizzesStore.allQuizzes.length === 0" class="text-center py-12">
        <i class="pi pi-clock text-4xl text-slate-200"></i>
        <p class="mt-2 text-slate-400 font-semibold text-sm">Nenhum simulado cadastrado</p>
      </div>
    </div>

    <!-- ─── CREATE QUIZ MODAL ─── -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-slate-900 text-lg">Novo Simulado</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-700"><i class="pi pi-times"></i></button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
          <input v-model="newQuiz.title" type="text" placeholder="Ex: Simulado ENEM 1º Dia" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
          <textarea v-model="newQuiz.description" rows="2" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
            <input v-model="newQuiz.category" type="text" placeholder="ENEM 2027" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tempo Limite (min)</label>
            <input v-model.number="newQuiz.timeLimitMinutes" type="number" min="5" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Máx. Tentativas</label>
            <input v-model.number="newQuiz.maxAttempts" type="number" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer text-xs pb-3">
              <input type="checkbox" v-model="newQuiz.isPublished" class="rounded text-brand-600" />
              <span class="font-semibold text-slate-700">Publicar imediatamente</span>
            </label>
          </div>
        </div>

        <!-- Question picker -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">Selecionar Questões do Banco ({{ newQuiz.questionIds.length }} selecionadas)</label>
          <div class="space-y-2 max-h-52 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <label v-for="q in questionsStore.questions" :key="q.id" class="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <input type="checkbox" :value="q.id" v-model="newQuiz.questionIds" class="mt-0.5 flex-shrink-0 text-brand-600 rounded" />
              <div class="min-w-0">
                <span class="text-[11px] font-bold text-brand-600">{{ q.subject }}</span>
                <p class="text-xs text-slate-700 line-clamp-1">{{ q.statement }}</p>
              </div>
            </label>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="showCreateModal = false" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">Cancelar</button>
          <button @click="saveNewQuiz" :disabled="saving" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2">
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'Salvando...' : 'Criar Simulado' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── FULL EDIT QUIZ MODAL ─── -->
    <div v-if="editingQuiz" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-slate-900 text-lg">Editar Simulado</h3>
          <button @click="editingQuiz = null" class="text-slate-400 hover:text-slate-700"><i class="pi pi-times"></i></button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
          <input v-model="editQuizForm.title" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
          <textarea v-model="editQuizForm.description" rows="2" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
            <input v-model="editQuizForm.category" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tempo Limite (min)</label>
            <input v-model.number="editQuizForm.timeLimitMinutes" type="number" min="5" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Máx. Tentativas</label>
            <input v-model.number="editQuizForm.maxAttempts" type="number" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 cursor-pointer text-xs pb-3">
              <input type="checkbox" v-model="editQuizForm.isPublished" class="rounded text-brand-600" />
              <span class="font-semibold text-slate-700">Publicado</span>
            </label>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-700">Questões do Simulado ({{ editQuizForm.questionIds.length }} selecionadas)</label>
          </div>
          <div class="space-y-2 max-h-52 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <label v-for="q in questionsStore.questions" :key="q.id" class="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <input type="checkbox" :value="q.id" v-model="editQuizForm.questionIds" class="mt-0.5 flex-shrink-0 text-brand-600 rounded" />
              <div class="min-w-0">
                <span class="text-[11px] font-bold text-brand-600">{{ q.subject }}</span>
                <p class="text-xs text-slate-700 line-clamp-1">{{ q.statement }}</p>
              </div>
            </label>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="editingQuiz = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">Cancelar</button>
          <button @click="saveEditQuiz" :disabled="saving" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2">
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuizzesStore } from '~/stores/quizzes';
import { useQuestionsStore } from '~/stores/questions';
import type { Quiz } from '~/stores/quizzes';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Simulados — Admin' });

const quizzesStore = useQuizzesStore();
const questionsStore = useQuestionsStore();

const saving = ref(false);
const feedbackMsg = ref('');
const showFeedback = (msg: string) => {
  feedbackMsg.value = msg;
  setTimeout(() => { feedbackMsg.value = ''; }, 3000);
};

onMounted(() => {
  quizzesStore.fetchQuizzes();
  questionsStore.fetchQuestions();
});

// Create
const showCreateModal = ref(false);
const newQuiz = ref({
  title: '',
  description: '',
  category: 'ENEM 2027',
  timeLimitMinutes: 180,
  maxAttempts: 3,
  isPublished: true,
  questionIds: [] as string[],
});

const saveNewQuiz = async () => {
  if (!newQuiz.value.title.trim()) return;
  saving.value = true;
  try {
    await quizzesStore.addQuiz({
      title: newQuiz.value.title,
      description: newQuiz.value.description,
      category: newQuiz.value.category,
      timeLimitMinutes: newQuiz.value.timeLimitMinutes,
      maxAttempts: newQuiz.value.maxAttempts,
      isPublished: newQuiz.value.isPublished,
      questionIds: [...newQuiz.value.questionIds],
      shuffleQuestions: false,
      shuffleOptions: false,
      showAnswersAfter: 'submission',
    });
    showCreateModal.value = false;
    newQuiz.value = { title: '', description: '', category: 'ENEM 2027', timeLimitMinutes: 180, maxAttempts: 3, isPublished: true, questionIds: [] };
    showFeedback('Simulado criado com sucesso no banco de dados!');
  } finally {
    saving.value = false;
  }
};

// Full Edit
const editingQuiz = ref<Quiz | null>(null);
const editQuizForm = ref({
  title: '',
  description: '',
  category: '',
  timeLimitMinutes: 180,
  maxAttempts: 3,
  isPublished: true,
  questionIds: [] as string[],
});

const openEditQuiz = (quiz: Quiz) => {
  editingQuiz.value = quiz;
  editQuizForm.value = {
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    timeLimitMinutes: quiz.timeLimitMinutes,
    maxAttempts: quiz.maxAttempts,
    isPublished: quiz.isPublished,
    questionIds: [...quiz.questionIds],
  };
};

const saveEditQuiz = async () => {
  if (!editingQuiz.value || !editQuizForm.value.title.trim()) return;
  saving.value = true;
  try {
    await quizzesStore.updateQuiz(editingQuiz.value.id, {
      title: editQuizForm.value.title,
      description: editQuizForm.value.description,
      category: editQuizForm.value.category,
      timeLimitMinutes: editQuizForm.value.timeLimitMinutes,
      maxAttempts: editQuizForm.value.maxAttempts,
      isPublished: editQuizForm.value.isPublished,
      questionIds: [...editQuizForm.value.questionIds],
    });
    editingQuiz.value = null;
    showFeedback('Simulado atualizado com sucesso!');
  } finally {
    saving.value = false;
  }
};

const togglePublish = async (id: string) => {
  await quizzesStore.togglePublish(id);
  showFeedback('Status de publicação atualizado!');
};

const confirmDeleteQuiz = async (id: string) => {
  if (confirm('Excluir este simulado permanentemente?')) {
    await quizzesStore.deleteQuiz(id);
    showFeedback('Simulado excluído com sucesso!');
  }
};
</script>
