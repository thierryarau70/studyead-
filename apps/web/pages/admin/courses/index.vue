<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Gestão de Cursos</h1>
        <p class="text-sm text-slate-500">
          {{ store.allCourses.length }} curso(s) cadastrados ·
          <span class="text-emerald-600 font-semibold">{{ store.publishedCourses.length }} publicados</span>
        </p>
      </div>
      <NuxtLink
        to="/admin/courses/create"
        class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 self-start sm:self-auto"
      >
        <i class="pi pi-plus"></i>
        <span>Criar Novo Curso</span>
      </NuxtLink>
    </div>

    <!-- Filter Bar -->
    <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar cursos por título ou categoria..."
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Todos os Status</option>
        <option value="published">Publicados</option>
        <option value="draft">Rascunhos</option>
      </select>
    </div>

    <!-- Courses Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Curso</th>
              <th class="p-4">Categoria</th>
              <th class="p-4">Preço</th>
              <th class="p-4">Aulas</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr
              v-for="course in filteredCourses"
              :key="course.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="p-4 flex items-center gap-3">
                <img
                  :src="course.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop'"
                  :alt="course.title"
                  class="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                />
                <div>
                  <h4 class="font-bold text-slate-900 line-clamp-1">{{ course.title }}</h4>
                  <span class="text-xs text-slate-400">Slug: /{{ course.slug }}</span>
                </div>
              </td>
              <td class="p-4 text-xs font-bold text-slate-600">{{ course.category }}</td>
              <td class="p-4 font-bold text-slate-900">
                {{ course.isFree ? 'Gratuito' : `R$ ${(course.priceCents / 100).toFixed(2).replace('.', ',')}` }}
              </td>
              <td class="p-4 text-xs text-slate-600 font-semibold">{{ course.totalLessons }} aulas</td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5',
                    course.isPublished
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', course.isPublished ? 'bg-emerald-500' : 'bg-amber-500']"></span>
                  {{ course.isPublished ? 'Publicado' : 'Rascunho' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- Manage modules/lessons -->
                  <NuxtLink
                    :to="`/admin/courses/${course.id}/edit`"
                    class="p-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors text-xs"
                    title="Editar Curso e Módulos"
                  >
                    <i class="pi pi-pencil"></i>
                  </NuxtLink>
                  <!-- Preview student view -->
                  <NuxtLink
                    :to="`/student/courses/${course.slug}`"
                    target="_blank"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs"
                    title="Visualizar como Aluno"
                  >
                    <i class="pi pi-eye"></i>
                  </NuxtLink>
                  <!-- Toggle publish -->
                  <button
                    @click="store.togglePublish(course.id)"
                    :class="[
                      'p-2 rounded-lg transition-colors text-xs font-bold',
                      course.isPublished
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    ]"
                    :title="course.isPublished ? 'Despublicar' : 'Publicar'"
                  >
                    <i :class="['pi', course.isPublished ? 'pi-eye-slash' : 'pi-check-circle']"></i>
                  </button>
                  <!-- Delete -->
                  <button
                    @click="confirmDelete(course)"
                    class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs"
                    title="Excluir Curso"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredCourses.length === 0" class="text-center py-16">
        <i class="pi pi-book text-4xl text-slate-200"></i>
        <p class="mt-3 text-slate-500 font-semibold">Nenhum curso encontrado</p>
        <NuxtLink to="/admin/courses/create" class="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold hover:bg-brand-100">
          Criar primeiro curso
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="courseToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
        <div class="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h3 class="text-lg font-extrabold text-slate-900">Excluir curso?</h3>
        <p class="text-sm text-slate-500">
          Isso irá remover <strong class="text-slate-800">{{ courseToDelete.title }}</strong> e todos os seus módulos e aulas permanentemente.
        </p>
        <div class="flex gap-3 pt-2">
          <button @click="courseToDelete = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
            Cancelar
          </button>
          <button @click="doDelete" class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-md">
            Excluir Permanentemente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCoursesStore } from '~/stores/courses';
import type { Course } from '~/stores/courses';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Gestão de Cursos — Admin' });

const store = useCoursesStore();
const searchQuery = ref('');
const statusFilter = ref('');
const courseToDelete = ref<Course | null>(null);

onMounted(() => {
  store.fetchCourses();
});

const filteredCourses = computed(() => {
  return store.allCourses.filter((c) => {
    const matchSearch = !searchQuery.value || c.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      !statusFilter.value ||
      (statusFilter.value === 'published' ? c.isPublished : !c.isPublished);
    return matchSearch && matchStatus;
  });
});

const confirmDelete = (course: Course) => {
  courseToDelete.value = course;
};

const doDelete = () => {
  if (courseToDelete.value) {
    store.deleteCourse(courseToDelete.value.id);
    courseToDelete.value = null;
  }
};
</script>
