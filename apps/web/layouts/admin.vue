<template>
  <div class="min-h-screen flex bg-surface-100 text-surface-900">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Admin Sidebar -->
    <aside
      :class="[
        'w-64 bg-surface-900 text-surface-200 flex flex-col fixed inset-y-0 z-40 border-r border-surface-800 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Brand -->
      <div class="h-16 px-6 flex items-center gap-3 border-b border-surface-800 bg-surface-950">
        <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
          <i class="pi pi-shield text-lg font-bold"></i>
        </div>
        <div>
          <h1 class="text-sm font-bold text-white leading-tight">Painel Gestor</h1>
          <span class="text-xs text-brand-400 font-semibold">Cursinho Alpha</span>
        </div>
        <!-- Close button (mobile) -->
        <button
          class="ml-auto lg:hidden p-1 text-surface-400 hover:text-white"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <div class="text-[11px] uppercase tracking-wider text-surface-400 font-semibold px-3 py-2">
          Geral
        </div>
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/admin' ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-chart-bar text-base"></i>
          Dashboard
        </NuxtLink>

        <div class="text-[11px] uppercase tracking-wider text-surface-400 font-semibold px-3 pt-5 pb-2">
          Pedagógico
        </div>
        <NuxtLink
          to="/admin/courses"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/courses') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-book text-base"></i>
          Cursos & Aulas
        </NuxtLink>

        <NuxtLink
          to="/admin/questions"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/questions') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-list-check text-base"></i>
          Banco de Questões
        </NuxtLink>

        <NuxtLink
          to="/admin/quizzes"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/quizzes') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-file-edit text-base"></i>
          Simulados
        </NuxtLink>

        <div class="text-[11px] uppercase tracking-wider text-surface-400 font-semibold px-3 pt-5 pb-2">
          Alunos & Vendas
        </div>
        <NuxtLink
          to="/admin/users"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/users') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-users text-base"></i>
          Alunos & Matrículas
        </NuxtLink>

        <NuxtLink
          to="/admin/sales"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/sales') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-dollar text-base"></i>
          Vendas & Pedidos
        </NuxtLink>

        <NuxtLink
          to="/admin/coupons"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path.startsWith('/admin/coupons') ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-ticket text-base"></i>
          Cupons de Desconto
        </NuxtLink>

        <div class="text-[11px] uppercase tracking-wider text-surface-400 font-semibold px-3 pt-5 pb-2">
          Sistema
        </div>
        <NuxtLink
          to="/admin/settings"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/admin/settings' ? 'bg-brand-600 text-white font-semibold' : 'text-surface-300 hover:bg-surface-800 hover:text-white'"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-cog text-base"></i>
          Configurações
        </NuxtLink>
      </nav>

      <!-- Admin footer -->
      <div class="p-4 border-t border-surface-800 bg-surface-950">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-full bg-surface-800 text-brand-400 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {{ authStore.user?.name?.charAt(0) || 'A' }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white truncate">{{ authStore.user?.name || 'Administrador' }}</p>
              <p class="text-[11px] text-surface-400 truncate">Acesso Geral</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-1.5 text-surface-400 hover:text-red-400 transition-colors rounded-md"
            title="Sair"
          >
            <i class="pi pi-sign-out text-sm"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 lg:ml-64 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-surface-200 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <!-- Hamburger (mobile) -->
          <button
            class="lg:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
            @click="sidebarOpen = true"
          >
            <i class="pi pi-bars text-base"></i>
          </button>
          <span class="hidden sm:flex px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema Operacional
          </span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            target="_blank"
            class="text-xs font-medium text-surface-600 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
          >
            <i class="pi pi-external-link text-xs"></i>
            <span class="hidden sm:inline">Visualizar Site Público</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-5 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const sidebarOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
