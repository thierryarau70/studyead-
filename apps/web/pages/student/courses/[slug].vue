<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-16">
    <!-- Course not found -->
    <div v-if="!course" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <i class="pi pi-exclamation-circle text-5xl text-slate-200"></i>
      <h2 class="mt-4 text-xl font-bold text-slate-700">Curso não encontrado</h2>
      <p class="text-sm text-slate-400 mt-1">Este curso pode ter sido despublicado ou o link está incorreto.</p>
      <NuxtLink to="/student/courses" class="mt-4 inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold">
        ← Voltar ao Catálogo
      </NuxtLink>
    </div>

    <template v-if="course">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <NuxtLink to="/student" class="hover:text-brand-600 transition-colors">Dashboard</NuxtLink>
        <i class="pi pi-chevron-right text-[10px]"></i>
        <NuxtLink to="/student/courses" class="hover:text-brand-600 transition-colors">Cursos</NuxtLink>
        <i class="pi pi-chevron-right text-[10px]"></i>
        <span class="text-slate-900 truncate max-w-xs">{{ course.title }}</span>
      </nav>

      <!-- Hero Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Left: Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 rounded-md text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">{{ course.category }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{{ course.title }}</h1>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">{{ course.description }}</p>

            <!-- Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                <span class="text-xs text-slate-500 font-medium block">Total de Aulas</span>
                <span class="text-lg font-bold text-slate-900">{{ course.totalLessons }} aulas</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                <span class="text-xs text-slate-500 font-medium block">Carga Horária</span>
                <span class="text-lg font-bold text-slate-900">{{ course.totalDurationMinutes }} min</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                <span class="text-xs text-slate-500 font-medium block">Certificado</span>
                <span class="text-lg font-bold text-emerald-600">Incluso</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-center">
                <span class="text-xs text-slate-500 font-medium block">Acesso</span>
                <span class="text-lg font-bold text-brand-600">Vitalício</span>
              </div>
            </div>
          </div>

          <!-- Modules Accordion -->
          <div class="space-y-4 pt-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <i class="pi pi-list text-brand-600"></i> Conteúdo Programático
              </h2>
              <span class="text-xs text-slate-500">{{ course.modules.length }} módulos · {{ totalLessonsCount }} aulas</span>
            </div>

            <div v-if="course.modules.length === 0" class="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm">
              As aulas serão disponibilizadas em breve.
            </div>

            <div class="space-y-3">
              <div v-for="(mod, mIndex) in course.modules" :key="mod.id" class="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button @click="toggleModule(mod.id)" class="w-full p-5 text-left flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/80 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{{ mIndex + 1 }}</div>
                    <div>
                      <h3 class="text-base font-bold text-slate-900">{{ mod.title }}</h3>
                      <p class="text-xs text-slate-500">{{ mod.lessons.length }} aulas</p>
                    </div>
                  </div>
                  <i :class="['pi text-slate-400 transition-transform duration-300', activeModule === mod.id ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                </button>

                <div v-show="activeModule === mod.id" class="divide-y divide-slate-100">
                  <div v-for="lesson in mod.lessons" :key="lesson.id" class="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs', lesson.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400']">
                        <i :class="['pi text-[11px]', lesson.isCompleted ? 'pi-check' : 'pi-play']"></i>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-slate-800">{{ lesson.title }}</h4>
                        <div class="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span><i class="pi pi-clock text-[10px]"></i> {{ lesson.durationMinutes }} min</span>
                          <span v-if="lesson.isFreePreview" class="text-indigo-600 font-bold">Degustação</span>
                        </div>
                      </div>
                    </div>
                    <NuxtLink
                      :to="`/student/lessons/${lesson.id}`"
                      class="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-600 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
                    >
                      Assistir <i class="pi pi-play text-[10px]"></i>
                    </NuxtLink>
                  </div>
                  <div v-if="mod.lessons.length === 0" class="p-4 text-xs text-slate-400 italic">
                    Aulas em breve...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <div class="sticky top-24 space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
            <!-- Thumbnail -->
            <div class="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer" @click="gotoFirstLesson">
              <img :src="course.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'" :alt="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div class="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                  <i class="pi pi-play ml-1"></i>
                </div>
              </div>
            </div>

            <!-- Price & CTA -->
            <div class="space-y-4">
              <div v-if="!course.isFree" class="flex items-baseline gap-2">
                <span class="text-3xl font-black text-slate-900">R$ {{ (course.priceCents / 100).toFixed(2).replace('.', ',') }}</span>
                <span v-if="course.originalPriceCents" class="text-xs text-slate-400 line-through">R$ {{ (course.originalPriceCents / 100).toFixed(2).replace('.', ',') }}</span>
              </div>
              <button @click="gotoFirstLesson" class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25">
                <i class="pi pi-play"></i>
                <span>{{ course.totalLessons > 0 ? 'Começar Agora' : 'Acessar Curso' }}</span>
              </button>
            </div>

            <!-- Features -->
            <ul class="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Videoaulas em HD</li>
              <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> PDFs e apostilas</li>
              <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Listas de exercícios com gabarito</li>
              <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Suporte com tutores</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '~/stores/courses';

definePageMeta({ layout: 'student' });

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();

const slug = route.params.slug as string;
const course = computed(() => coursesStore.getCourseBySlug(slug));

onMounted(() => {
  coursesStore.fetchCourses();
});

useHead({
  title: computed(() => `${course.value?.title || 'Curso'} — StudyEAD`),
});

const activeModule = ref('');

watch(
  () => course.value,
  (c) => {
    if (c?.modules?.[0] && !activeModule.value) {
      activeModule.value = c.modules[0].id;
    }
  },
  { immediate: true },
);

const totalLessonsCount = computed(() =>
  course.value?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0,
);

const firstLessonId = computed(() =>
  course.value?.modules[0]?.lessons[0]?.id || '',
);

const toggleModule = (moduleId: string) => {
  activeModule.value = activeModule.value === moduleId ? '' : moduleId;
};

const gotoFirstLesson = () => {
  if (firstLessonId.value) {
    router.push(`/student/lessons/${firstLessonId.value}`);
  }
};
</script>
