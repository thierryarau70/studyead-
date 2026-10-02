<template>
  <div class="min-h-screen bg-surface-100 text-surface-900 overflow-x-hidden">
    <!-- Mobile overlay — z-40 cobre o header também -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar — z-50, sempre fixed -->
    <aside
      :class="[
        'w-64 bg-white border-r border-surface-200 flex flex-col fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Brand -->
      <div class="h-16 px-5 flex items-center gap-3 border-b border-surface-200 flex-shrink-0">
        <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/30 flex-shrink-0">
          <i class="pi pi-graduation-cap text-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-bold text-surface-900 leading-tight truncate">Cursinho Alpha</h1>
          <span class="text-xs text-brand-600 font-medium">Área do Aluno</span>
        </div>
        <!-- Close button (mobile) -->
        <button
          class="lg:hidden w-7 h-7 flex items-center justify-center text-surface-400 hover:text-surface-700 flex-shrink-0"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="isActive(item) ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
          @click="sidebarOpen = false"
        >
          <i :class="[item.icon, 'text-base w-4 text-center flex-shrink-0']"></i>
          <span class="truncate">{{ item.label }}</span>
        </NuxtLink>

        <div class="pt-3 mt-3 border-t border-surface-200">
          <NuxtLink
            to="/student/profile"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="$route.path === '/student/profile' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'"
            @click="sidebarOpen = false"
          >
            <i class="pi pi-user text-base w-4 text-center flex-shrink-0"></i>
            <span>Meu Perfil</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- User footer -->
      <div class="p-3 border-t border-surface-200 bg-surface-50 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-surface-900 truncate">{{ authStore.user?.name || 'Aluno' }}</p>
            <p class="text-[11px] text-surface-500 truncate">{{ authStore.user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="p-1.5 text-surface-400 hover:text-red-600 transition-colors rounded-md flex-shrink-0"
            title="Sair"
          >
            <i class="pi pi-sign-out text-sm"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content — ml-0 mobile, ml-64 desktop -->
    <div class="lg:ml-64 flex flex-col min-h-screen min-w-0">
      <!-- Topbar — z-30, fica abaixo do overlay (z-40) quando sidebar abre -->
      <header class="h-14 sm:h-16 bg-white border-b border-surface-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Hamburger -->
          <button
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100 transition-colors flex-shrink-0"
            @click="sidebarOpen = true"
            aria-label="Abrir menu"
          >
            <i class="pi pi-bars text-lg"></i>
          </button>
          <span class="text-sm font-semibold text-surface-800 truncate hidden sm:block">
            Bem-vindo(a), <span class="text-brand-600">{{ authStore.user?.name?.split(' ')[0] || 'Aluno' }}</span>
          </span>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <NuxtLink
            to="/student/courses"
            class="text-xs font-medium text-surface-600 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
          >
            <i class="pi pi-search text-xs"></i>
            <span class="hidden sm:inline">Explorar cursos</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const sidebarOpen = ref(false);

const navItems = [
  { to: '/student', icon: 'pi pi-th-large', label: 'Visão Geral', exact: true },
  { to: '/student/courses', icon: 'pi pi-book', label: 'Meus Cursos', exact: false },
  { to: '/student/questions', icon: 'pi pi-list-check', label: 'Banco de Questões', exact: false },
  { to: '/student/quizzes', icon: 'pi pi-clock', label: 'Simulados & Testes', exact: false },
  { to: '/student/progress', icon: 'pi pi-chart-line', label: 'Meu Progresso', exact: false },
];

const isActive = (item: { to: string; exact: boolean }) =>
  item.exact ? route.path === item.to : route.path.startsWith(item.to) && route.path !== '/student/profile';

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
