<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Visão Geral da Plataforma</h1>
        <p class="text-sm text-slate-500">Métricas pedagógicas, alunos e cursos em tempo real</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/courses/create"
          class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <i class="pi pi-plus"></i>
          Novo Curso
        </NuxtLink>
        <NuxtLink
          to="/admin/questions"
          class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <i class="pi pi-list-check text-brand-600"></i>
          Banco de Questões
        </NuxtLink>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Total de Alunos</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="pi pi-users text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">{{ usersStore.users.length }}</p>
        <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> {{ usersStore.totalActive }} ativos
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Cursos</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <i class="pi pi-book text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">{{ coursesStore.allCourses.length }}</p>
        <p class="text-xs text-slate-500">
          <strong class="text-emerald-600">{{ coursesStore.publishedCourses.length }}</strong> publicados · {{ coursesStore.allCourses.length - coursesStore.publishedCourses.length }} rascunho
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Banco de Questões</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <i class="pi pi-list-check text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">{{ questionsStore.questions.length }}</p>
        <p class="text-xs text-brand-600 font-semibold">{{ questionsStore.subjects.length }} disciplinas cadastradas</p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Simulados</span>
          <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <i class="pi pi-clock text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">{{ quizzesStore.allQuizzes.length }}</p>
        <p class="text-xs text-slate-500">
          <strong class="text-purple-600">{{ quizzesStore.publishedQuizzes.length }}</strong> simulados ativos
        </p>
      </div>
    </div>

    <!-- Recent Users & Quick Access Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Users Table -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900">Usuários & Alunos Recentes</h2>
          <NuxtLink to="/admin/users" class="text-xs font-bold text-brand-600 hover:text-brand-700">
            Gerenciar todos →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th class="pb-3">Usuário</th>
                <th class="pb-3">Perfil</th>
                <th class="pb-3">Cadastro</th>
                <th class="pb-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3 flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                    :class="user.isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 text-xs">{{ user.name }}</p>
                    <p class="text-[11px] text-slate-400">{{ user.email }}</p>
                  </div>
                </td>
                <td class="py-3">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                    {{ user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Professor' : 'Aluno' }}
                  </span>
                </td>
                <td class="py-3 text-xs text-slate-500">{{ user.createdAt }}</td>
                <td class="py-3">
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1', user.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200']">
                    <span :class="['w-1.5 h-1.5 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                    {{ user.isActive ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Shortcuts & System Status -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h2 class="text-base font-bold text-slate-900">Ações Rápidas</h2>

        <div class="space-y-2.5">
          <NuxtLink
            to="/admin/courses"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span class="flex items-center gap-2"><i class="pi pi-book text-brand-600"></i> Gerenciar Cursos & Aulas</span>
            <i class="pi pi-chevron-right text-slate-400 text-[10px]"></i>
          </NuxtLink>

          <NuxtLink
            to="/admin/quizzes"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span class="flex items-center gap-2"><i class="pi pi-clock text-purple-600"></i> Gerenciar Simulados</span>
            <i class="pi pi-chevron-right text-slate-400 text-[10px]"></i>
          </NuxtLink>

          <NuxtLink
            to="/admin/questions"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span class="flex items-center gap-2"><i class="pi pi-list-check text-amber-600"></i> Banco de Questões</span>
            <i class="pi pi-chevron-right text-slate-400 text-[10px]"></i>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span class="flex items-center gap-2"><i class="pi pi-users text-blue-600"></i> Gestão de Alunos</span>
            <i class="pi pi-chevron-right text-slate-400 text-[10px]"></i>
          </NuxtLink>

          <NuxtLink
            to="/admin/coupons"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span class="flex items-center gap-2"><i class="pi pi-ticket text-emerald-600"></i> Cupons de Desconto</span>
            <i class="pi pi-chevron-right text-slate-400 text-[10px]"></i>
          </NuxtLink>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <NuxtLink
            to="/student"
            target="_blank"
            class="w-full py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <i class="pi pi-external-link"></i>
            Acessar Área do Aluno
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCoursesStore } from '~/stores/courses';
import { useUsersStore } from '~/stores/users';
import { useQuestionsStore } from '~/stores/questions';
import { useQuizzesStore } from '~/stores/quizzes';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Painel Administrativo — StudyEAD' });

const coursesStore = useCoursesStore();
const usersStore = useUsersStore();
const questionsStore = useQuestionsStore();
const quizzesStore = useQuizzesStore();

onMounted(() => {
  coursesStore.fetchCourses();
  usersStore.fetchUsers();
  questionsStore.fetchQuestions();
  quizzesStore.fetchQuizzes();
});

const recentUsers = computed(() => usersStore.users.slice(0, 5));
</script>
