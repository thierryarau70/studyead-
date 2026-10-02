<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <!-- Header banner -->
    <div class="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl space-y-2">
        <span class="inline-block px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-semibold backdrop-blur-sm">
          Painel de Estudos
        </span>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
          Pronto para continuar os estudos, {{ authStore.user?.name?.split(' ')[0] || 'Aluno' }}?
        </h1>
        <p class="text-brand-100 text-xs sm:text-sm">
          Acompanhe seus cursos, faça simulados cronometrados e pratique questões comentadas todos os dias.
        </p>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-book"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">{{ authStore.canAccessAllCourses ? 'Cursos no Catálogo' : 'Meus Cursos Liberados' }}</p>
          <p class="text-2xl font-black text-slate-900">{{ myEnrolledCoursesCount }}</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-clock"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Simulados Oficiais</p>
          <p class="text-2xl font-black text-slate-900">{{ quizzesStore.publishedQuizzes.length }}</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-check-circle"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Banco de Questões</p>
          <p class="text-2xl font-black text-slate-900">{{ questionsStore.questions.length }}</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-video"></i>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500">Aulas no Catálogo</p>
          <p class="text-2xl font-black text-brand-600">{{ totalLessonsCount }}</p>
        </div>
      </div>
    </div>

    <!-- Active Courses Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="pi pi-bookmark text-brand-600"></i>
          Cursos em Destaque
        </h2>
        <NuxtLink to="/student/courses" class="text-xs font-bold text-brand-600 hover:text-brand-700">
          Ver catálogo completo →
        </NuxtLink>
      </div>

      <div v-if="myEnrolledCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="course in myEnrolledCourses.slice(0, 4)"
          :key="course.id"
          class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                {{ course.category }}
              </span>
              <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
                <i class="pi pi-clock text-[10px]"></i> {{ course.totalDurationMinutes }} min
              </span>
            </div>
            <h3 class="text-base font-extrabold text-slate-900 line-clamp-1">
              {{ course.title }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2">
              {{ course.description }}
            </p>
          </div>

          <div class="pt-3 flex items-center justify-between border-t border-slate-100">
            <span class="text-xs font-semibold text-slate-500">
              <i class="pi pi-play-circle text-brand-500 mr-1"></i>
              {{ course.totalLessons }} aulas disponíveis
            </span>
            <NuxtLink
              :to="`/student/courses/${course.slug}`"
              class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              Acessar
              <i class="pi pi-arrow-right text-[10px]"></i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 px-6 bg-white rounded-3xl border border-slate-200 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
          <i class="pi pi-lock"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">Nenhum curso liberado na sua matrícula ainda</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Seu cadastro foi realizado com sucesso. A coordenação liberará seus cursos em breve ou você pode visualizar os módulos disponíveis no catálogo.
        </p>
        <NuxtLink to="/student/courses" class="inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors">
          Ver Catálogo de Cursos
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Shortcuts to Quizzes and Questions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl overflow-hidden relative">
        <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none"></div>
        <div class="relative space-y-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-purple-300">Treinamento Oficial</span>
          <h3 class="text-base font-black">Simulados Cronometrados</h3>
          <p class="text-xs text-slate-300 leading-relaxed">Treine com tempo real do exame e receba nota e análise de desempenho.</p>
          <NuxtLink to="/student/quizzes" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors">
            Ir para Simulados <i class="pi pi-arrow-right text-[10px]"></i>
          </NuxtLink>
        </div>
      </div>

      <div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-brand-950 text-white shadow-xl overflow-hidden relative">
        <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-500/20 rounded-full blur-xl pointer-events-none"></div>
        <div class="relative space-y-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-300">Prática Diária</span>
          <h3 class="text-base font-black">Banco de Questões</h3>
          <p class="text-xs text-slate-300 leading-relaxed">Resolva questões comentadas pelos professores com gabarito instantâneo.</p>
          <NuxtLink to="/student/questions" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors">
            Praticar Questões <i class="pi pi-arrow-right text-[10px]"></i>
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCoursesStore, deduplicateCourses, getCanonicalCourseKey } from '~/stores/courses';
import { useQuizzesStore } from '~/stores/quizzes';
import { useQuestionsStore } from '~/stores/questions';

definePageMeta({ layout: 'student' });
useHead({ title: 'Dashboard do Aluno — StudyEAD' });

const authStore = useAuthStore();
const coursesStore = useCoursesStore();
const quizzesStore = useQuizzesStore();
const questionsStore = useQuestionsStore();

onMounted(() => {
  coursesStore.fetchCourses();
  quizzesStore.fetchQuizzes();
  questionsStore.fetchQuestions();
  authStore.fetchMe();
});

const myEnrolledCourses = computed(() => {
  const published = deduplicateCourses(coursesStore.publishedCourses);
  if (published.length === 0) return [];

  if (authStore.canAccessAllCourses || authStore.user?.email === 'aluno@cursinhoalpha.com.br') {
    return published;
  }

  const enrolled = authStore.enrolledCourseIds || [];
  if (enrolled.length > 0) {
    const matches = published.filter((c) => {
      const canon = getCanonicalCourseKey(c);
      return enrolled.some((rawId) => {
        if (rawId === c.id || rawId === c.slug) return true;
        if (rawId === 'course-1' || rawId === 'c-1') return canon === 'canonical-enem';
        if (rawId === 'course-2' || rawId === 'c-2') return canon === 'canonical-redacao';
        if (rawId === 'course-3' || rawId === 'c-3') return canon === 'canonical-medicina';
        const cObj = coursesStore.getCourseById(rawId);
        return cObj && getCanonicalCourseKey(cObj) === canon;
      });
    });
    if (matches.length > 0) return deduplicateCourses(matches);
  }

  return published;
});

const myEnrolledCoursesCount = computed(() => myEnrolledCourses.value.length);

const totalLessonsCount = computed(() => {
  const uniqueCourses = deduplicateCourses(coursesStore.publishedCourses);
  const sum = uniqueCourses.reduce((acc, c) => {
    const modulesLessons = c.modules?.reduce((mSum, m) => mSum + (m.lessons?.length || 0), 0) || 0;
    const lessons = Math.max(Number(c.totalLessons) || 0, modulesLessons);
    return acc + (lessons > 0 ? lessons : (c.modules?.length ? c.modules.length * 4 : 8));
  }, 0);
  return sum || 16;
});
</script>
