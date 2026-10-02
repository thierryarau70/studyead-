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
          Acesse os cursos liberados para a sua matrícula ou solicite a liberação de novos módulos.
        </p>
      </div>
    </div>

    <!-- Filter Bar with Enrollment Tabs -->
    <div class="space-y-4">
      <!-- Tabs: All vs Enrolled vs Available -->
      <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          @click="enrollmentFilter = 'all'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="enrollmentFilter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        >
          <span>Todos os Cursos</span>
          <span class="px-2 py-0.5 rounded-full text-[10px]" :class="enrollmentFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
            {{ coursesStore.publishedCourses.length }}
          </span>
        </button>
        <button
          @click="enrollmentFilter = 'enrolled'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="enrollmentFilter === 'enrolled' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        >
          <i class="pi pi-check-circle text-xs"></i>
          <span>Meus Cursos Liberados</span>
          <span class="px-2 py-0.5 rounded-full text-[10px]" :class="enrollmentFilter === 'enrolled' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'">
            {{ myEnrolledCoursesCount }}
          </span>
        </button>
        <button
          v-if="!authStore.canAccessAllCourses"
          @click="enrollmentFilter = 'locked'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
          :class="enrollmentFilter === 'locked' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        >
          <i class="pi pi-lock text-xs"></i>
          <span>Não Matriculados</span>
          <span class="px-2 py-0.5 rounded-full text-[10px]" :class="enrollmentFilter === 'locked' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'">
            {{ lockedCoursesCount }}
          </span>
        </button>
      </div>

      <!-- Search & Category Filters -->
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
    </div>

    <!-- Courses Grid -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
        :class="isEnrolled(course.id) ? 'border-slate-200' : 'border-slate-200/80 bg-slate-50/40'"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-video overflow-hidden bg-slate-900">
          <img
            :src="course.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'"
            :alt="course.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            :class="{'grayscale-30 opacity-90': !isEnrolled(course.id)}"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
          
          <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-brand-600 text-white">
              {{ course.category }}
            </span>
          </div>

          <!-- Status badge top-right -->
          <div class="absolute top-3 right-3">
            <span
              v-if="isEnrolled(course.id)"
              class="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-950/40"
            >
              <i class="pi pi-check text-[10px]"></i> Liberado
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-800/90 text-amber-300 border border-amber-400/30 flex items-center gap-1 backdrop-blur-sm"
            >
              <i class="pi pi-lock text-[10px]"></i> Bloqueado
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-5 flex flex-col flex-1 space-y-3">
          <h3 class="text-base font-extrabold text-slate-900 leading-tight line-clamp-2">
            {{ course.title }}
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {{ course.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span class="flex items-center gap-1"><i class="pi pi-play-circle text-brand-500"></i> {{ course.totalLessons }} aulas</span>
            <span class="flex items-center gap-1"><i class="pi pi-clock text-brand-500"></i> {{ course.totalDurationMinutes }} min</span>
          </div>

          <!-- Action CTA -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">
              {{ isEnrolled(course.id) ? 'Acesso Liberado' : 'Requer Matrícula' }}
            </span>

            <!-- If enrolled: Direct Access -->
            <NuxtLink
              v-if="isEnrolled(course.id)"
              :to="`/student/courses/${course.slug}`"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
            >
              Acessar Aulas <i class="pi pi-arrow-right text-[10px]"></i>
            </NuxtLink>

            <!-- If not enrolled: Request access modal -->
            <button
              v-else
              @click="openRequestAccessModal(course)"
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i class="pi pi-lock text-[10px]"></i> Solicitar Acesso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <i class="pi pi-search text-5xl text-slate-200"></i>
      <p class="mt-4 text-slate-500 font-semibold">Nenhum curso encontrado para os filtros selecionados</p>
      <button @click="searchQuery = ''; categoryFilter = ''; enrollmentFilter = 'all'" class="mt-3 text-brand-600 text-xs font-bold hover:underline cursor-pointer">
        Limpar filtros
      </button>
    </div>

    <!-- ─── Request Access Modal ─── -->
    <div v-if="showRequestModal && requestedCourse" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in text-center">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <i class="pi pi-lock"></i>
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            Matrícula Necessária
          </span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-2">
            {{ requestedCourse.title }}
          </h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            Este curso não está incluído na sua grade atual de estudos. Para liberar o acesso completo às aulas, simulados e apostilas, solicite a liberação com a coordenação pedagógica.
          </p>
        </div>

        <div class="space-y-2 pt-2">
          <a
            :href="getCoordinationWhatsAppLink(requestedCourse.title)"
            target="_blank"
            class="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
          >
            <i class="pi pi-whatsapp text-sm"></i>
            <span>Pedir Liberação no WhatsApp</span>
          </a>
          <button
            @click="showRequestModal = false; requestedCourse = null"
            class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCoursesStore } from '~/stores/courses';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ layout: 'student' });
useHead({ title: 'Meus Cursos — StudyEAD' });

const coursesStore = useCoursesStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const categoryFilter = ref('');
const enrollmentFilter = ref<'all' | 'enrolled' | 'locked'>('all');

const showRequestModal = ref(false);
const requestedCourse = ref<any>(null);

onMounted(() => {
  coursesStore.fetchCourses();
  authStore.fetchMe();
});

const isEnrolled = (courseId: string) => {
  if (authStore.canAccessAllCourses) return true;
  const enrolled = authStore.enrolledCourseIds;
  return Array.isArray(enrolled) && enrolled.includes(courseId);
};

const myEnrolledCoursesCount = computed(() => {
  if (authStore.canAccessAllCourses) return coursesStore.publishedCourses.length;
  const enrolled = authStore.enrolledCourseIds || [];
  return coursesStore.publishedCourses.filter((c) => enrolled.includes(c.id)).length;
});

const lockedCoursesCount = computed(() => {
  if (authStore.canAccessAllCourses) return 0;
  const enrolled = authStore.enrolledCourseIds || [];
  return coursesStore.publishedCourses.filter((c) => !enrolled.includes(c.id)).length;
});

const categories = computed(() => [...new Set(coursesStore.publishedCourses.map((c) => c.category))].sort());

const filteredCourses = computed(() =>
  coursesStore.publishedCourses.filter((c) => {
    const matchSearch = !searchQuery.value || c.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !categoryFilter.value || c.category === categoryFilter.value;
    
    let matchEnrollment = true;
    if (enrollmentFilter.value === 'enrolled') {
      matchEnrollment = isEnrolled(c.id);
    } else if (enrollmentFilter.value === 'locked') {
      matchEnrollment = !isEnrolled(c.id);
    }

    return matchSearch && matchCat && matchEnrollment;
  }),
);

function openRequestAccessModal(course: any) {
  requestedCourse.value = course;
  showRequestModal.value = true;
}

function getCoordinationWhatsAppLink(courseTitle: string) {
  const studentName = authStore.user?.name || 'Aluno';
  const email = authStore.user?.email || '';
  const message = `Olá, coordenação! Sou o aluno ${studentName} (${email}) e gostaria de solicitar a liberação do curso "${courseTitle}" na minha conta da plataforma.`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
</script>
