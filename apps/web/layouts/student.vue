<template>
  <div class="min-h-screen flex bg-surface-100 text-surface-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-surface-200 flex flex-col fixed inset-y-0 z-40">
      <!-- Brand -->
      <div class="h-16 px-6 flex items-center gap-3 border-b border-surface-200">
        <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30">
          <i class="pi pi-graduation-cap text-lg"></i>
        </div>
        <div>
          <h1 class="text-sm font-bold text-surface-900 leading-tight">Cursinho Alpha</h1>
          <span class="text-xs text-brand-600 font-medium">Área do Aluno</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink
          to="/student"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/student' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
        >
          <i class="pi pi-th-large text-base"></i>
          Visão Geral
        </NuxtLink>

        <NuxtLink
          to="/student/courses"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/student/courses') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
        >
          <i class="pi pi-book text-base"></i>
          Meus Cursos
        </NuxtLink>

        <NuxtLink
          to="/student/quizzes"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/student/quizzes') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
        >
          <i class="pi pi-check-circle text-base"></i>
          Simulados & Testes
        </NuxtLink>

        <NuxtLink
          to="/student/progress"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/student/progress' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
        >
          <i class="pi pi-chart-line text-base"></i>
          Meu Progresso
        </NuxtLink>

        <div class="pt-4 mt-4 border-t border-surface-200">
          <NuxtLink
            to="/student/profile"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/student/profile' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
          >
            <i class="pi pi-user text-base"></i>
            Meu Perfil
          </NuxtLink>
        </div>
      </nav>

      <!-- User footer -->
      <div class="p-4 border-t border-surface-200 bg-surface-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {{ authStore.user?.name?.charAt(0) || 'A' }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-surface-900 truncate">{{ authStore.user?.name || 'Aluno' }}</p>
              <p class="text-[11px] text-surface-500 truncate">{{ authStore.user?.email }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-1.5 text-surface-400 hover:text-red-600 transition-colors rounded-md"
            title="Sair"
          >
            <i class="pi pi-sign-out text-sm"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 ml-64 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-surface-200 px-8 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h2 class="text-base font-semibold text-surface-800">
            Bem-vindo(a), <span class="text-brand-600">{{ authStore.user?.name || 'Aluno' }}</span>
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/courses"
            class="text-xs font-medium text-surface-600 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
          >
            <i class="pi pi-search text-xs"></i>
            Explorar mais cursos
          </NuxtLink>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
