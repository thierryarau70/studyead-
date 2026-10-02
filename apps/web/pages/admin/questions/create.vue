<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-16">
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/questions" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm">
        <i class="pi pi-arrow-left text-sm"></i>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Nova Questão</h1>
        <p class="text-xs text-slate-500">Salva no banco e aparece automaticamente nos simulados</p>
      </div>
    </div>

    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ successMsg }}
    </div>

    <form @submit.prevent="handleCreate" class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
      <!-- 1. Metadata -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">1. Identificação</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Disciplina *</label>
            <select v-model="form.subject" required class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50">
              <option value="">Selecione</option>
              <option v-for="s in availableSubjects" :key="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Assunto / Tópico</label>
            <input v-model="form.topic" type="text" placeholder="Ex: Cinemática, Funções..." class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Dificuldade *</label>
            <select v-model="form.difficulty" required class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50">
              <option value="easy">Fácil</option>
              <option value="medium">Média</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Statement -->
      <div class="space-y-3">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">2. Enunciado *</h3>
        <textarea v-model="form.statement" required rows="5" placeholder="Digite aqui o enunciado completo da questão..." class="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"></textarea>
      </div>

      <!-- 3. Options -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">3. Alternativas *</h3>
        <p class="text-xs text-slate-400">Preencha cada alternativa e clique em "Marcar" na correta.</p>
        <div v-for="(opt, idx) in form.options" :key="idx" class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0"
            :class="form.correctIndex === idx ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'"
          >{{ opt.label }}</div>
          <input v-model="opt.text" type="text" :placeholder="`Texto da alternativa ${opt.label}`" required class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50" />
          <button
            type="button"
            @click="form.correctIndex = idx"
            :class="['px-3 py-1.5 rounded-xl text-xs font-bold transition-all', form.correctIndex === idx ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700']"
          >
            <i class="pi pi-check mr-1"></i>{{ form.correctIndex === idx ? 'Correta' : 'Marcar' }}
          </button>
        </div>
      </div>

      <!-- 4. Explanation -->
      <div class="space-y-3">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">4. Resolução / Gabarito</h3>
        <textarea v-model="form.explanation" rows="4" placeholder="Explique passo a passo a resolução..." class="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"></textarea>
      </div>

      <!-- Footer -->
      <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
        <NuxtLink to="/admin/questions" class="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">Cancelar</NuxtLink>
        <button type="submit" :disabled="loading" class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2">
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <span>{{ loading ? 'Salvando...' : 'Salvar Questão' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionsStore } from '~/stores/questions';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Nova Questão — Admin' });

const router = useRouter();
const store = useQuestionsStore();
const loading = ref(false);
const successMsg = ref('');

const availableSubjects = [
  'Matemática', 'Física', 'Química', 'Biologia',
  'História', 'Geografia', 'Linguagens',
  'Filosofia', 'Sociologia', 'Inglês',
];

const form = ref({
  subject: '',
  topic: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  statement: '',
  explanation: '',
  correctIndex: 0,
  options: [
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' },
    { label: 'E', text: '' },
  ],
});

const handleCreate = async () => {
  loading.value = true;
  try {
    await store.addQuestion({
      subject: form.value.subject,
      topic: form.value.topic,
      difficulty: form.value.difficulty,
      statement: form.value.statement,
      explanation: form.value.explanation,
      tags: [],
      options: form.value.options.map((opt, idx) => ({
        id: `opt-${idx}-${Date.now()}`,
        label: opt.label,
        text: opt.text,
        isCorrect: idx === form.value.correctIndex,
        sortOrder: idx + 1,
      })),
    });

    successMsg.value = 'Questão criada com sucesso no banco de dados!';
    setTimeout(() => router.push('/admin/questions'), 1000);
  } catch (err: any) {
    console.error('Erro ao cadastrar questão:', err);
  } finally {
    loading.value = false;
  }
};
</script>
