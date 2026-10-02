<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-16">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 sm:p-10 text-white shadow-xl">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/20 backdrop-blur-md">
          <i class="pi pi-book text-[11px]"></i> Catálogo de Cursos
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">Meus Cursos</h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Explore todos os cursos disponíveis para você.
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input v-model="searchQuery" type="text" placeholder="Buscar cursos..." class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>
      <select v-model="categoryFilter" class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
        <option value="">Todas as Categorias</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Courses Grid -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="course in filteredCourses"
        :key="course.id"
        :to="`/student/courses/${course.slug}`"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-video overflow-hidden bg-slate-900">
          <img
            :src="course.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'"
            :alt="course.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-brand-600 text-white">{{ course.category }}</span>
        </div>

        <!-- Info -->
        <div class="p-5 flex flex-col flex-1 space-y-3">
          <h3 class="text-base font-extrabold text-slate-900 leading-tight line-clamp-2">{{ course.title }}</h3>
          <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">{{ course.description }}</p>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span class="flex items-center gap-1"><i class="pi pi-play-circle text-brand-500"></i> {{ course.totalLessons }} aulas</span>
            <span class="flex items-center gap-1"><i class="pi pi-clock text-brand-500"></i> {{ course.totalDurationMinutes }} min</span>
          </div>

          <!-- Price / CTA -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-lg font-black text-slate-900">
              {{ course.isFree ? 'Gratuito' : `R$ ${(course.priceCents / 100).toFixed(2).replace('.', ',')}` }}
            </span>
            <span class="px-4 py-2 rounded-xl bg-brand-600 group-hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5">
              Acessar <i class="pi pi-arrow-right text-[10px]"></i>
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <i class="pi pi-search text-5xl text-slate-200"></i>
      <p class="mt-4 text-slate-500 font-semibold">Nenhum curso encontrado para a sua busca</p>
      <button @click="searchQuery = ''; categoryFilter = ''" class="mt-3 text-brand-600 text-xs font-bold hover:underline">
        Limpar filtros
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCoursesStore } from '~/stores/courses';

definePageMeta({ layout: 'student' });
useHead({ title: 'Meus Cursos — StudyEAD' });

const coursesStore = useCoursesStore();
const searchQuery = ref('');
const categoryFilter = ref('');

onMounted(() => {
  coursesStore.fetchCourses();
});

const categories = computed(() => [...new Set(coursesStore.publishedCourses.map((c) => c.category))].sort());

const filteredCourses = computed(() =>
  coursesStore.publishedCourses.filter((c) => {
    const matchSearch = !searchQuery.value || c.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !categoryFilter.value || c.category === categoryFilter.value;
    return matchSearch && matchCat;
  }),
);
</script>
