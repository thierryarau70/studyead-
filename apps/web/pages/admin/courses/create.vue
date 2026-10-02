<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-16">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/courses" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm">
        <i class="pi pi-arrow-left text-sm"></i>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Criar Novo Curso</h1>
        <p class="text-xs text-slate-500">Preencha os dados e publique para os alunos</p>
      </div>
    </div>

    <!-- Success toast -->
    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ successMsg }}
    </div>

    <form @submit.prevent="handleCreate" class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
      <!-- Section 1: Informações Básicas -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">1. Informações Básicas</h3>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título do Curso *</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Ex: Preparatório Extensivo ENEM 2027"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Slug (URL amigável)</label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="gerado automaticamente a partir do título"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50 text-slate-500 font-mono text-xs"
          />
          <p class="text-[11px] text-slate-400 mt-1">Se deixar em branco, será gerado do título.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Categoria *</label>
            <select
              v-model="form.category"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
            >
              <option value="ENEM">ENEM</option>
              <option value="Medicina">Medicina</option>
              <option value="Exatas">Exatas</option>
              <option value="Humanas">Humanas</option>
              <option value="Militares">Militares / Concursos</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Preço (R$) *</label>
            <input
              v-model.number="form.priceReais"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00 = Gratuito"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Curta *</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            placeholder="Resumo em 2 frases para o card do catálogo de cursos..."
            class="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          ></textarea>
        </div>
      </div>

      <!-- Section 2: Mídia -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">2. Imagem de Capa</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">URL da Thumbnail</label>
          <input
            v-model="form.thumbnailUrl"
            type="url"
            placeholder="https://images.unsplash.com/..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
          />
          <div v-if="form.thumbnailUrl" class="mt-3">
            <img :src="form.thumbnailUrl" alt="Preview" class="h-32 w-auto rounded-xl object-cover border border-slate-200 shadow-sm" />
          </div>
        </div>
      </div>

      <!-- Section 3: Publicação -->
      <div class="space-y-3">
        <h3 class="text-sm font-extrabold uppercase text-slate-400 tracking-wider">3. Publicação</h3>
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <div
            @click="form.isPublished = !form.isPublished"
            :class="['w-11 h-6 rounded-full relative transition-colors', form.isPublished ? 'bg-brand-600' : 'bg-slate-300']"
          >
            <span :class="['absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', form.isPublished ? 'left-6' : 'left-1']"></span>
          </div>
          <div>
            <span class="text-sm font-semibold text-slate-800">
              {{ form.isPublished ? 'Publicar imediatamente' : 'Salvar como rascunho' }}
            </span>
            <p class="text-xs text-slate-400">
              {{ form.isPublished ? 'Alunos verão este curso no catálogo.' : 'Somente administradores visualizarão.' }}
            </p>
          </div>
        </label>
      </div>

      <!-- Footer -->
      <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
        <NuxtLink to="/admin/courses" class="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <span>{{ loading ? 'Salvando...' : (form.isPublished ? 'Criar e Publicar Curso' : 'Salvar Rascunho') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCoursesStore } from '~/stores/courses';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Criar Curso — Admin' });

const router = useRouter();
const store = useCoursesStore();
const loading = ref(false);
const successMsg = ref('');

const form = ref({
  title: '',
  slug: '',
  category: 'ENEM',
  priceReais: 199.0,
  description: '',
  thumbnailUrl: '',
  isPublished: false,
});

const handleCreate = async () => {
  loading.value = true;
  try {
    await store.addCourse({
      title: form.value.title,
      slug: form.value.slug || form.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: form.value.description,
      category: form.value.category,
      tags: [],
      thumbnailUrl: form.value.thumbnailUrl,
      priceCents: Math.round(form.value.priceReais * 100),
      isFree: form.value.priceReais === 0,
      isPublished: form.value.isPublished,
      sortOrder: 99,
    });

    successMsg.value = 'Curso criado com sucesso no banco de dados! Redirecionando...';
    setTimeout(() => router.push('/admin/courses'), 1000);
  } catch (err: any) {
    console.error('Erro ao criar curso:', err);
  } finally {
    loading.value = false;
  }
};
</script>
