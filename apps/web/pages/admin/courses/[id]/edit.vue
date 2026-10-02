<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-16">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/courses" class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-sm">
        <i class="pi pi-arrow-left text-sm"></i>
      </NuxtLink>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
          {{ course?.title || 'Curso não encontrado' }}
        </h1>
        <p class="text-xs text-slate-500">Edite dados do curso, módulos e aulas com sincronização em tempo real</p>
      </div>
      <NuxtLink
        v-if="course"
        :to="`/student/courses/${course.slug}`"
        target="_blank"
        class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
      >
        <i class="pi pi-eye text-brand-600"></i>
        Ver como Aluno
      </NuxtLink>
    </div>

    <!-- Feedback toast -->
    <div v-if="feedbackMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
      <i class="pi pi-check-circle text-emerald-600"></i> {{ feedbackMsg }}
    </div>

    <!-- Course not found -->
    <div v-if="!course" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <i class="pi pi-exclamation-circle text-4xl text-slate-300"></i>
      <p class="mt-3 text-slate-500 font-semibold">Curso não encontrado</p>
      <NuxtLink to="/admin/courses" class="mt-3 inline-block text-brand-600 text-xs font-bold">← Voltar</NuxtLink>
    </div>

    <template v-if="course">
      <!-- ─── Edit Course Form ─── -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-800 flex items-center gap-2">
            <i class="pi pi-pencil text-brand-600"></i> Dados do Curso
          </h2>
          <span
            :class="['px-2.5 py-1 rounded-md text-[11px] font-bold', course.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200']"
          >
            {{ course.isPublished ? '● Publicado' : '○ Rascunho' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">Título</label>
            <input v-model="editForm.title" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
            <select v-model="editForm.category" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50">
              <option>ENEM</option><option>Medicina</option><option>Exatas</option><option>Humanas</option><option>Militares / Concursos</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Preço (R$)</label>
            <input v-model.number="editForm.priceReais" type="number" step="0.01" min="0" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição Curta</label>
            <textarea v-model="editForm.description" rows="2" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL da Thumbnail</label>
            <input v-model="editForm.thumbnailUrl" type="url" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button @click="saveCourse" :disabled="savingCourse" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer">
            <i v-if="savingCourse" class="pi pi-spin pi-spinner"></i>
            <span>{{ savingCourse ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
          <button
            @click="coursesStore.togglePublish(course!.id)"
            :class="['px-5 py-2.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer', course.isPublished ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200']"
          >
            <i :class="['pi mr-1', course.isPublished ? 'pi-eye-slash' : 'pi-check-circle']"></i>
            {{ course.isPublished ? 'Despublicar (ocultar dos alunos)' : 'Publicar para os Alunos' }}
          </button>
        </div>
      </div>

      <!-- ─── Modules & Lessons ─── -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <i class="pi pi-list text-brand-600"></i>
            Módulos & Aulas
            <span class="text-xs font-normal text-slate-400 ml-1">({{ course.totalLessons }} aulas · {{ course.totalDurationMinutes }} min)</span>
          </h2>
          <button
            @click="showAddModule = true"
            class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i class="pi pi-plus"></i> Novo Módulo
          </button>
        </div>

        <!-- Modules list -->
        <div v-if="course.modules.length === 0" class="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <i class="pi pi-folder text-4xl text-slate-200"></i>
          <p class="mt-2 text-slate-400 text-sm">Nenhum módulo ainda. Crie o primeiro!</p>
        </div>

        <div
          v-for="(mod, mIdx) in course.modules"
          :key="mod.id"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <!-- Module header -->
          <div class="flex items-center justify-between p-5 bg-slate-50/70 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{{ mIdx + 1 }}</div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">{{ mod.title }}</h3>
                <p class="text-xs text-slate-400">{{ mod.lessons.length }} aula(s)</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openEditModule(mod)"
                class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                title="Editar Módulo"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="openAddLesson(mod.id)"
                class="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <i class="pi pi-plus text-[10px]"></i> Aula
              </button>
              <button
                @click="deleteModule(mod.id)"
                class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs transition-colors cursor-pointer"
                title="Excluir Módulo"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Lessons list -->
          <div class="divide-y divide-slate-100">
            <div
              v-for="(lesson, lIdx) in mod.lessons"
              :key="lesson.id"
              class="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/50 transition-colors"
            >
              <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {{ lIdx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ lesson.title }}</p>
                <div class="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span><i class="pi pi-clock text-[10px]"></i> {{ lesson.durationMinutes }} min</span>
                  <span v-if="lesson.isFreePreview" class="text-indigo-600 font-bold">Degustação</span>
                  <span v-if="!lesson.isPublished" class="text-amber-500 font-bold">Rascunho</span>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <button
                  @click="openEditLesson(mod.id, lesson)"
                  class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                  title="Editar Aula"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                  @click="deleteLesson(mod.id, lesson.id)"
                  class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs transition-colors cursor-pointer"
                  title="Excluir Aula"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <div v-if="mod.lessons.length === 0" class="px-5 py-4 text-xs text-slate-400 italic">
              Nenhuma aula neste módulo. Clique em "+ Aula" para adicionar.
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ─── Modal: Add Module ─── -->
    <div v-if="showAddModule" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-bold text-slate-900">Novo Módulo</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título do Módulo *</label>
          <input v-model="newModule.title" type="text" placeholder="Ex: Módulo 1 — Matemática Básica" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
        </div>
        <div class="flex gap-3">
          <button @click="showAddModule = false; newModule.title = ''" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Cancelar</button>
          <button @click="saveModule" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">Salvar Módulo</button>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Edit Module ─── -->
    <div v-if="editingModule" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-bold text-slate-900">Editar Módulo</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título do Módulo *</label>
          <input v-model="editModuleForm.title" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
        </div>
        <div class="flex gap-3">
          <button @click="editingModule = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Cancelar</button>
          <button @click="saveEditModule" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">Salvar Alterações</button>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Add Lesson ─── -->
    <div v-if="showAddLesson" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-bold text-slate-900">Nova Aula</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título da Aula *</label>
          <input v-model="newLesson.title" type="text" placeholder="Ex: Leis de Newton Aplicadas" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Duração (minutos)</label>
            <input v-model.number="newLesson.durationMinutes" type="number" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL do Vídeo</label>
            <input v-model="newLesson.videoUrl" type="url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input type="checkbox" v-model="newLesson.isFreePreview" class="rounded text-brand-600" />
            <span class="font-semibold text-slate-700">Degustação gratuita</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input type="checkbox" v-model="newLesson.isPublished" class="rounded text-brand-600" />
            <span class="font-semibold text-slate-700">Publicar já</span>
          </label>
        </div>
        <div class="flex gap-3">
          <button @click="showAddLesson = false" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Cancelar</button>
          <button @click="saveLesson" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">Salvar Aula</button>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Edit Lesson ─── -->
    <div v-if="editingLesson" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-bold text-slate-900">Editar Aula</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Título da Aula *</label>
          <input v-model="editLessonForm.title" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Duração (minutos)</label>
            <input v-model.number="editLessonForm.durationMinutes" type="number" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL do Vídeo</label>
            <input v-model="editLessonForm.videoUrl" type="url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input type="checkbox" v-model="editLessonForm.isFreePreview" class="rounded text-brand-600" />
            <span class="font-semibold text-slate-700">Degustação gratuita</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input type="checkbox" v-model="editLessonForm.isPublished" class="rounded text-brand-600" />
            <span class="font-semibold text-slate-700">Publicado</span>
          </label>
        </div>
        <div class="flex gap-3">
          <button @click="editingLesson = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Cancelar</button>
          <button @click="saveEditLesson" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">Salvar Alterações</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCoursesStore } from '~/stores/courses';
import type { CourseModule, Lesson } from '~/stores/courses';

definePageMeta({ layout: 'admin' });

const route = useRoute();
const courseId = route.params.id as string;
const coursesStore = useCoursesStore();

onMounted(() => {
  coursesStore.fetchCourses();
});

const course = computed(() => coursesStore.getCourseById(courseId));

useHead({
  title: computed(() => `Editar: ${course.value?.title || '...'} — Admin`),
});

const feedbackMsg = ref('');
const showFeedback = (msg: string) => {
  feedbackMsg.value = msg;
  setTimeout(() => { feedbackMsg.value = ''; }, 3000);
};

// ── Edit form ──────────────────────────────────────────────────────
const savingCourse = ref(false);
const editForm = ref({
  title: '',
  category: 'ENEM',
  priceReais: 0,
  description: '',
  thumbnailUrl: '',
});

watch(
  () => course.value,
  (c) => {
    if (c) {
      editForm.value = {
        title: c.title,
        category: c.category,
        priceReais: c.priceCents / 100,
        description: c.description,
        thumbnailUrl: c.thumbnailUrl,
      };
    }
  },
  { immediate: true },
);

const saveCourse = async () => {
  savingCourse.value = true;
  try {
    await coursesStore.updateCourse(courseId, {
      title: editForm.value.title,
      category: editForm.value.category,
      priceCents: Math.round(editForm.value.priceReais * 100),
      isFree: editForm.value.priceReais === 0,
      description: editForm.value.description,
      thumbnailUrl: editForm.value.thumbnailUrl,
    });
    showFeedback('Curso atualizado com sucesso no banco de dados!');
  } finally {
    savingCourse.value = false;
  }
};

// ── Modules ──────────────────────────────────────────────────────
const showAddModule = ref(false);
const newModule = ref({ title: '' });

const editingModule = ref<CourseModule | null>(null);
const editModuleForm = ref({ title: '' });

const saveModule = async () => {
  if (!newModule.value.title.trim()) return;
  await coursesStore.addModule(courseId, {
    title: newModule.value.title,
    isPublished: true,
    sortOrder: (course.value?.modules.length || 0) + 1,
  });
  newModule.value.title = '';
  showAddModule.value = false;
  showFeedback('Módulo criado com sucesso!');
};

const openEditModule = (mod: CourseModule) => {
  editingModule.value = mod;
  editModuleForm.value = { title: mod.title };
};

const saveEditModule = async () => {
  if (!editingModule.value || !editModuleForm.value.title.trim()) return;
  await coursesStore.updateModule(courseId, editingModule.value.id, {
    title: editModuleForm.value.title,
  });
  editingModule.value = null;
  showFeedback('Módulo atualizado com sucesso!');
};

const deleteModule = async (moduleId: string) => {
  if (confirm('Excluir este módulo e todas as suas aulas permanentemente?')) {
    await coursesStore.deleteModule(courseId, moduleId);
    showFeedback('Módulo excluído!');
  }
};

// ── Lessons ──────────────────────────────────────────────────────
const showAddLesson = ref(false);
const activeModuleId = ref('');
const newLesson = ref({
  title: '',
  durationMinutes: 20,
  videoUrl: '',
  isFreePreview: false,
  isPublished: true,
});

const editingLesson = ref<Lesson | null>(null);
const editLessonModuleId = ref('');
const editLessonForm = ref({
  title: '',
  durationMinutes: 20,
  videoUrl: '',
  isFreePreview: false,
  isPublished: true,
});

const openAddLesson = (moduleId: string) => {
  activeModuleId.value = moduleId;
  showAddLesson.value = true;
  newLesson.value = { title: '', durationMinutes: 20, videoUrl: '', isFreePreview: false, isPublished: true };
};

const saveLesson = async () => {
  if (!newLesson.value.title.trim()) return;
  const slug = newLesson.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const mod = course.value?.modules.find((m) => m.id === activeModuleId.value);

  await coursesStore.addLesson(courseId, activeModuleId.value, {
    title: newLesson.value.title,
    slug,
    durationMinutes: newLesson.value.durationMinutes,
    isFreePreview: newLesson.value.isFreePreview,
    isPublished: newLesson.value.isPublished,
    sortOrder: (mod?.lessons.length || 0) + 1,
    videoUrl: newLesson.value.videoUrl,
  });

  showAddLesson.value = false;
  showFeedback('Aula adicionada com sucesso!');
};

const openEditLesson = (moduleId: string, lesson: Lesson) => {
  editingLesson.value = lesson;
  editLessonModuleId.value = moduleId;
  editLessonForm.value = {
    title: lesson.title,
    durationMinutes: lesson.durationMinutes,
    videoUrl: lesson.videoUrl || '',
    isFreePreview: Boolean(lesson.isFreePreview),
    isPublished: Boolean(lesson.isPublished),
  };
};

const saveEditLesson = async () => {
  if (!editingLesson.value || !editLessonForm.value.title.trim()) return;
  await coursesStore.updateLesson(courseId, editLessonModuleId.value, editingLesson.value.id, {
    title: editLessonForm.value.title,
    durationMinutes: editLessonForm.value.durationMinutes,
    videoUrl: editLessonForm.value.videoUrl,
    isFreePreview: editLessonForm.value.isFreePreview,
    isPublished: editLessonForm.value.isPublished,
  });

  editingLesson.value = null;
  showFeedback('Aula atualizada com sucesso!');
};

const deleteLesson = async (moduleId: string, lessonId: string) => {
  if (confirm('Excluir esta aula permanentemente?')) {
    await coursesStore.deleteLesson(courseId, moduleId, lessonId);
    showFeedback('Aula excluída!');
  }
};
</script>
