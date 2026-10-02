<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- Top Player Header -->
    <header class="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 flex-shrink-0">
      <div class="flex items-center gap-4 min-w-0">
        <NuxtLink
          :to="backToCourseUrl"
          class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          title="Voltar ao Curso"
        >
          <i class="pi pi-arrow-left text-sm"></i>
        </NuxtLink>
        <div class="truncate">
          <h1 class="text-xs text-brand-400 font-bold uppercase tracking-wider truncate">
            {{ currentCourse?.title || 'Curso EAD' }}
          </h1>
          <p class="text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
            {{ activeLesson?.title || 'Carregando aula...' }}
          </p>
        </div>
      </div>

      <!-- Header Controls -->
      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <!-- Prev Lesson Button -->
        <button
          @click="goToPrevLesson"
          :disabled="!prevLesson"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
            prevLesson ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer' : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
          ]"
          title="Aula Anterior"
        >
          <i class="pi pi-chevron-left text-[10px]"></i>
          <span class="hidden sm:inline">Anterior</span>
        </button>

        <!-- Next Lesson Button -->
        <button
          @click="goToNextLesson"
          :disabled="!nextLesson"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
            nextLesson ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer' : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
          ]"
          title="Próxima Aula"
        >
          <span class="hidden sm:inline">Próxima</span>
          <i class="pi pi-chevron-right text-[10px]"></i>
        </button>

        <!-- Mark as Completed Toggle Button -->
        <button
          v-if="activeLesson"
          @click="toggleActiveLessonCompletion"
          :class="[
            'px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer',
            isCurrentCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/30'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-900/30'
          ]"
        >
          <i :class="['pi text-xs', isCurrentCompleted ? 'pi-check-circle' : 'pi-circle']"></i>
          <span class="hidden xs:inline">{{ isCurrentCompleted ? 'Concluída' : 'Marcar Concluída' }}</span>
        </button>

        <!-- Toggle Sidebar Button (Listar Módulos / Ocultar) -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          :class="[
            'px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md',
            sidebarOpen
              ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-900/40'
          ]"
          :title="sidebarOpen ? 'Ocultar lista de módulos' : 'Listar todos os módulos do curso'"
        >
          <i :class="['pi text-xs', sidebarOpen ? 'pi-times text-slate-400' : 'pi-list']"></i>
          <span>{{ sidebarOpen ? 'Ocultar' : 'Listar Módulos' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Content Layout (Player + Drawer/Sidebar) -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      <!-- Left Screen: Video & Tabs -->
      <div class="flex-1 overflow-y-auto space-y-6 p-4 sm:p-6">
        <!-- Video Player Box -->
        <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
          <iframe
            v-if="activeLesson?.videoUrl && isEmbed"
            :src="embedVideoUrl"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video
            v-else
            ref="videoPlayerRef"
            controls
            :poster="activeLesson?.posterUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'"
            class="w-full h-full object-cover"
            @ended="onVideoEnded"
          >
            <source :src="activeLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'" type="video/mp4" />
            Seu navegador não suporta a execução de vídeos.
          </video>
        </div>

        <!-- Lesson Meta Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {{ activeModule?.title || 'Módulo Atual' }}
              </span>
              <span class="text-xs text-slate-400">
                <i class="pi pi-clock text-[10px]"></i> {{ activeLesson?.durationMinutes || 15 }} minutos
              </span>
              <span v-if="isCurrentCompleted" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <i class="pi pi-check text-[9px]"></i> Aula Concluída
              </span>
            </div>
            <h2 class="text-xl font-black text-white">
              {{ activeLesson?.title || 'Aula Selecionada' }}
            </h2>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="activeTab = 'notes'"
              class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            >
              <i class="pi pi-pencil text-amber-400"></i> Anotar
            </button>
            <button
              @click="activeTab = 'materials'"
              class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            >
              <i class="pi pi-file-pdf text-red-400"></i> PDF ({{ lessonMaterials.length }})
            </button>
          </div>
        </div>

        <!-- Content Tabs Header -->
        <div class="border-b border-slate-800 flex items-center gap-2 text-xs font-bold overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer',
              activeTab === tab.id
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            ]"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab 1: Visão Geral -->
        <div v-if="activeTab === 'overview'" class="space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="pi pi-info-circle text-brand-400"></i>
            Resumo e Objetivos de Aprendizagem
          </h3>
          <p>
            {{ activeLesson?.description || `Nesta aula do ${activeModule?.title || 'módulo'}, vamos aprofundar nos tópicos essenciais para o seu aprendizado com resolução prática de exemplos e fixação de conceitos cobrados nas provas.` }}
          </p>

          <div class="pt-4 border-t border-slate-800 space-y-2">
            <h4 class="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Tópicos Chave desta Aula:</h4>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <li v-for="topic in lessonTopics" :key="topic" class="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <i class="pi pi-check text-emerald-400"></i>
                <span class="text-slate-200 font-medium">{{ topic }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab 2: Materiais para Download -->
        <div v-if="activeTab === 'materials'" class="space-y-3">
          <div
            v-for="mat in lessonMaterials"
            :key="mat.id"
            class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-brand-500/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center text-lg">
                <i class="pi pi-file-pdf"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">{{ mat.title }}</h4>
                <p class="text-xs text-slate-400">{{ mat.size }} • Formato PDF para Impressão</p>
              </div>
            </div>

            <a
              :href="mat.url"
              target="_blank"
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <i class="pi pi-download text-[11px]"></i>
              <span>Baixar</span>
            </a>
          </div>
        </div>

        <!-- Tab 3: Minhas Anotações -->
        <div v-if="activeTab === 'notes'" class="space-y-3 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="pi pi-pencil text-amber-400"></i>
              Caderno de Anotações Pessoais
            </h3>
            <span class="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <i class="pi pi-cloud-upload"></i> Salvo automaticamente
            </span>
          </div>

          <textarea
            v-model="userNotes"
            @input="saveNotes"
            rows="6"
            placeholder="Digite suas anotações desta aula aqui... Elas ficarão salvas para quando você revisar."
            class="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm leading-relaxed"
          ></textarea>
        </div>

        <!-- Tab 4: Questões da Aula -->
        <div v-if="activeTab === 'questions'" class="space-y-6">
          <div
            v-for="(q, qIdx) in lessonQuestions"
            :key="q.id"
            class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
          >
            <div class="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Questão {{ qIdx + 1 }} de {{ lessonQuestions.length }}</span>
              <span class="px-2.5 py-0.5 rounded bg-brand-900/40 text-brand-300 border border-brand-800">
                {{ q.subject }}
              </span>
            </div>

            <p class="text-sm text-slate-200 font-medium leading-relaxed">
              {{ q.statement }}
            </p>

            <!-- Options list -->
            <div class="space-y-2.5 pt-2">
              <button
                v-for="opt in q.options"
                :key="opt.id"
                @click="selectedAnswers[q.id] = opt.id"
                :class="[
                  'w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer',
                  selectedAnswers[q.id] === opt.id
                    ? (opt.isCorrect ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-red-950/60 border-red-500 text-red-200')
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                ]"
              >
                <span class="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {{ opt.label }}
                </span>
                <span class="flex-1">{{ opt.text }}</span>
              </button>
            </div>

            <!-- Resolution Feedback -->
            <div
              v-if="selectedAnswers[q.id]"
              class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300"
            >
              <h5 class="font-extrabold text-amber-400 flex items-center gap-1.5">
                <i class="pi pi-lightbulb"></i> Comentário do Professor:
              </h5>
              <p>{{ q.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Syllabus Sidebar Drawer -->
      <aside
        v-if="sidebarOpen"
        class="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 z-20 flex-shrink-0 animate-fade-in"
      >
        <!-- Sidebar Header with Progress and Close X Button -->
        <div class="p-4 border-b border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <i class="pi pi-list text-brand-400"></i>
              Conteúdo do Curso
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-brand-400">{{ courseProgressPercentage }}% Concluído</span>
              <!-- Close Sidebar Button (X) -->
              <button
                @click="sidebarOpen = false"
                class="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Fechar barra de módulos (X)"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              :style="{ width: `${courseProgressPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Collapsible Modules List -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          <div v-for="mod in currentCourseModules" :key="mod.id" class="border-b border-slate-800/60 last:border-b-0">
            <!-- Module Clickable Accordion Header -->
            <button
              type="button"
              @click="toggleModule(mod.id)"
              class="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div class="flex items-center gap-2.5 min-w-0 pr-2">
                <i
                  :class="[
                    'pi text-[10px] transition-transform duration-200',
                    isModuleOpen(mod.id) ? 'pi-chevron-down text-brand-400' : 'pi-chevron-right text-slate-500'
                  ]"
                ></i>
                <span class="text-xs font-extrabold text-slate-300 group-hover:text-white truncate">
                  {{ mod.title }}
                </span>
              </div>
              <span class="text-[10px] text-slate-500 font-semibold flex-shrink-0 bg-slate-800 px-2 py-0.5 rounded">
                {{ mod.lessons.length }} aula(s)
              </span>
            </button>

            <!-- Module Lessons List -->
            <div v-show="isModuleOpen(mod.id)" class="px-3 pb-3 space-y-1">
              <div
                v-for="les in mod.lessons"
                :key="les.id"
                @click="navigateToLesson(les.id)"
                :class="[
                  'w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-3 cursor-pointer group',
                  les.id === currentLessonId
                    ? 'bg-brand-600/25 text-brand-300 font-bold border border-brand-500/40 shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300'
                ]"
              >
                <!-- Checkbox Button + Title -->
                <div class="flex items-center gap-2.5 truncate min-w-0">
                  <button
                    type="button"
                    @click.stop="toggleLessonCompletion(les.id)"
                    class="p-1 -m-1 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer flex-shrink-0"
                    :title="isLessonCompleted(les.id) ? 'Marcar como não concluída' : 'Marcar como concluída'"
                  >
                    <i
                      :class="[
                        'pi text-sm transition-transform active:scale-125',
                        isLessonCompleted(les.id) ? 'pi-check-circle text-emerald-400' : 'pi-circle text-slate-600 group-hover:text-slate-400'
                      ]"
                    ></i>
                  </button>
                  <span class="truncate" :class="{ 'line-through text-slate-500': isLessonCompleted(les.id) && les.id !== currentLessonId }">
                    {{ les.title }}
                  </span>
                </div>

                <span class="text-[10px] text-slate-500 flex-shrink-0 font-medium">
                  {{ les.durationMinutes }}m
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '~/stores/courses';
import type { Course, CourseModule, Lesson } from '~/stores/courses';

definePageMeta({
  layout: false, // Custom full-screen video player layout
});

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();

const sidebarOpen = ref(true);
const activeTab = ref('overview');
const userNotes = ref('');
const selectedAnswers = ref<Record<string, string>>({});
const videoPlayerRef = ref<HTMLVideoElement | null>(null);

// Controle do Accordion de Módulos
const openModules = ref<Record<string, boolean>>({});

function toggleModule(modId: string) {
  openModules.value[modId] = !isModuleOpen(modId);
}

function isModuleOpen(modId: string) {
  // Por padrão, se não definido explicitamente como false, fica aberto
  return openModules.value[modId] !== false;
}

const STORAGE_COMPLETED_KEY = 'studyead_completed_lessons';
const STORAGE_NOTES_PREFIX = 'studyead_notes_';

// Carregar lições concluídas do localStorage
const completedLessons = ref<string[]>([]);

function loadCompletedLessons() {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (stored) {
        completedLessons.value = JSON.parse(stored);
        return;
      }
    } catch {}
  }
  completedLessons.value = ['l-101', 'l-102'];
}

function persistCompletedLessons() {
  if (process.client) {
    try {
      localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completedLessons.value));
    } catch {}
  }
}

onMounted(() => {
  coursesStore.fetchCourses();
  loadCompletedLessons();
  loadNotes();
});

// Acessar ID da aula atual da rota
const currentLessonId = computed(() => (route.params.id as string) || 'l-101');

// Encontrar a aula, o módulo e o curso ativos dinamicamente
const activeData = computed(() => {
  const targetId = currentLessonId.value;

  for (const course of coursesStore.allCourses) {
    for (const mod of course.modules) {
      const foundLesson = mod.lessons.find((l) => l.id === targetId);
      if (foundLesson) {
        return {
          course,
          module: mod,
          lesson: foundLesson,
        };
      }
    }
  }

  // Fallback: se não achar pelo ID direto, usar a primeira aula do primeiro curso
  const firstCourse = coursesStore.allCourses[0];
  if (firstCourse && firstCourse.modules.length > 0 && firstCourse.modules[0].lessons.length > 0) {
    return {
      course: firstCourse,
      module: firstCourse.modules[0],
      lesson: firstCourse.modules[0].lessons[0],
    };
  }

  return { course: null, module: null, lesson: null };
});

const currentCourse = computed<Course | null>(() => activeData.value.course);
const activeModule = computed<CourseModule | null>(() => activeData.value.module);
const activeLesson = computed<Lesson | null>(() => activeData.value.lesson);

const currentCourseModules = computed(() => {
  return currentCourse.value?.modules || [];
});

// Lista linear de todas as aulas do curso para navegação Anterior/Próxima
const allCourseLessons = computed<Lesson[]>(() => {
  const list: Lesson[] = [];
  for (const mod of currentCourseModules.value) {
    for (const l of mod.lessons) {
      list.push(l);
    }
  }
  return list;
});

const currentLessonIndex = computed(() => {
  return allCourseLessons.value.findIndex((l) => l.id === activeLesson.value?.id);
});

const prevLesson = computed<Lesson | null>(() => {
  const idx = currentLessonIndex.value;
  if (idx > 0) return allCourseLessons.value[idx - 1];
  return null;
});

const nextLesson = computed<Lesson | null>(() => {
  const idx = currentLessonIndex.value;
  if (idx !== -1 && idx < allCourseLessons.value.length - 1) {
    return allCourseLessons.value[idx + 1];
  }
  return null;
});

// URL para voltar ao curso
const backToCourseUrl = computed(() => {
  if (currentCourse.value?.slug) {
    return `/student/courses/${currentCourse.value.slug}`;
  }
  return '/student/courses';
});

// Progresso e Conclusão
function isLessonCompleted(id: string) {
  return completedLessons.value.includes(id);
}

const isCurrentCompleted = computed(() => {
  return activeLesson.value ? isLessonCompleted(activeLesson.value.id) : false;
});

function toggleLessonCompletion(id: string) {
  const idx = completedLessons.value.indexOf(id);
  if (idx > -1) {
    completedLessons.value.splice(idx, 1);
  } else {
    completedLessons.value.push(id);
  }
  persistCompletedLessons();
}

function toggleActiveLessonCompletion() {
  if (activeLesson.value) {
    toggleLessonCompletion(activeLesson.value.id);
  }
}

const courseProgressPercentage = computed(() => {
  const total = allCourseLessons.value.length;
  if (total === 0) return 0;
  const completedCount = allCourseLessons.value.filter((l) => isLessonCompleted(l.id)).length;
  return Math.round((completedCount / total) * 100);
});

// Navegação
function navigateToLesson(id: string) {
  router.push(`/student/lessons/${id}`);
}

function goToPrevLesson() {
  if (prevLesson.value) {
    navigateToLesson(prevLesson.value.id);
  }
}

function goToNextLesson() {
  if (nextLesson.value) {
    navigateToLesson(nextLesson.value.id);
  }
}

function onVideoEnded() {
  if (!isCurrentCompleted.value) {
    toggleActiveLessonCompletion();
  }
}

// Anotações por aula
function loadNotes() {
  if (process.client && activeLesson.value) {
    userNotes.value = localStorage.getItem(`${STORAGE_NOTES_PREFIX}${activeLesson.value.id}`) || '';
  }
}

function saveNotes() {
  if (process.client && activeLesson.value) {
    localStorage.setItem(`${STORAGE_NOTES_PREFIX}${activeLesson.value.id}`, userNotes.value);
  }
}

watch(currentLessonId, () => {
  loadNotes();
  selectedAnswers.value = {};
});

// Dynamic Embed check and formatted embed URL
const isEmbed = computed(() => {
  const url = activeLesson.value?.videoUrl;
  return !!(url && (url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo')));
});

const embedVideoUrl = computed(() => {
  const rawUrl = activeLesson.value?.videoUrl;
  if (!rawUrl) return '';

  // Formato YouTube watch?v=ID ou youtu.be/ID -> embed/ID
  if (rawUrl.includes('youtube.com/watch?v=')) {
    const videoId = rawUrl.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }
  if (rawUrl.includes('youtu.be/')) {
    const videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }
  if (rawUrl.includes('youtube.com/embed/')) {
    return rawUrl;
  }
  return rawUrl;
});

// Tabs definition
const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: 'pi pi-info-circle' },
  { id: 'materials', label: 'Material em PDF', icon: 'pi pi-file-pdf' },
  { id: 'notes', label: 'Minhas Anotações', icon: 'pi pi-pencil' },
  { id: 'questions', label: 'Questões da Aula', icon: 'pi pi-question-circle' },
];

// Materiais da aula atual (específicos de cada aula)
const lessonMaterials = computed(() => {
  if (activeLesson.value?.materials && activeLesson.value.materials.length > 0) {
    return activeLesson.value.materials;
  }
  return [
    { id: 'm-1', title: `Apostila Completa — ${activeLesson.value?.title || 'Material da Aula'}.pdf`, size: '2.8 MB', url: '#' },
    { id: 'm-2', title: `Resumo Esquematizado — ${activeModule.value?.title || 'Módulo'}.pdf`, size: '1.4 MB', url: '#' },
  ];
});

// Tópicos dinâmicos exclusivos da aula atual
const lessonTopics = computed(() => {
  if (activeLesson.value?.keyTopics && activeLesson.value.keyTopics.length > 0) {
    return activeLesson.value.keyTopics;
  }
  const title = activeLesson.value?.title || '';
  return [
    `Fundamentos teóricos e conceitos centrais de ${title}`,
    'Aplicações práticas e resolução de exercícios de fixação',
    'Pegadinhas comuns e critérios cobrados em vestibulares e ENEM',
    'Metodologia de revisão e mapa mental dos pontos mais importantes',
  ];
});

// Questões dinâmicas exclusivas da aula atual
const lessonQuestions = computed(() => {
  if (activeLesson.value?.questions && activeLesson.value.questions.length > 0) {
    return activeLesson.value.questions;
  }
  return [
    {
      id: `q-${activeLesson.value?.id || '1'}`,
      subject: activeModule.value?.title || 'Matéria do Curso',
      statement: `Com relação aos conceitos abordados na aula "${activeLesson.value?.title || 'atual'}", qual é a principal diretriz para a correta resolução de questões complexas desse tema?`,
      options: [
        { id: 'opt-a', label: 'A', text: 'Decorar as fórmulas sem compreender o significado dos elementos.', isCorrect: false },
        { id: 'opt-b', label: 'B', text: 'Identificar os dados do enunciado, relacionar com os conceitos centrais e aplicar o método passo a passo.', isCorrect: true },
        { id: 'opt-c', label: 'C', text: 'Assinalar sempre a alternativa de maior tamanho do texto.', isCorrect: false },
        { id: 'opt-d', label: 'D', text: 'Ignorar o contexto prático e focar apenas na eliminação aleatória.', isCorrect: false },
      ],
      explanation: 'O método correto envolve interpretação ativa do enunciado, identificação das variáveis e raciocínio lógico estruturado.',
    },
  ];
});

useHead({
  title: computed(() => `${activeLesson.value?.title || 'Aula'} — StudyEAD`),
});
</script>
