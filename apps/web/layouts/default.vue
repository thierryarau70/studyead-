<template>
  <div class="min-h-screen flex flex-col bg-surface-50 text-surface-900">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 glass border-b border-surface-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <i class="pi pi-graduation-cap text-xl font-bold"></i>
          </div>
          <div>
            <span class="text-xl font-bold tracking-tight text-surface-900 group-hover:text-brand-600 transition-colors">Cursinho Alpha</span>
            <span class="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-md border border-brand-200">EAD</span>
          </div>
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">Início</NuxtLink>
          <NuxtLink to="/courses" class="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">Cursos Preparatórios</NuxtLink>
          <NuxtLink to="/about" class="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">Sobre o Cursinho</NuxtLink>
          <NuxtLink to="/contact" class="text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors">Fale Conosco</NuxtLink>
        </nav>

        <!-- Auth Actions -->
        <div class="flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-900 text-white hover:bg-surface-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <i class="pi pi-shield"></i>
              Painel Admin
            </NuxtLink>
            <NuxtLink
              v-else
              to="/student"
              class="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20 flex items-center gap-2"
            >
              <i class="pi pi-book"></i>
              Área do Aluno
            </NuxtLink>
            <button
              @click="handleLogout"
              class="p-2 text-surface-500 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <i class="pi pi-sign-out text-lg"></i>
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-surface-700 hover:text-brand-600 transition-colors"
            >
              Entrar
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-sm shadow-brand-600/25 hover:shadow-md hover:shadow-brand-600/30"
            >
              Criar Conta
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-surface-900 text-surface-300 border-t border-surface-800 pt-12 pb-8 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <i class="pi pi-graduation-cap"></i>
              </div>
              <span class="text-lg font-bold text-white">Cursinho Alpha</span>
            </div>
            <p class="text-sm text-surface-400 leading-relaxed">
              Preparação de excelência para vestibulares e concursos com metodologia comprovada, banco de questões e simulados.
            </p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Cursos</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/courses" class="hover:text-white transition-colors">Extensivo ENEM</NuxtLink></li>
              <li><NuxtLink to="/courses" class="hover:text-white transition-colors">Carreiras Policiais</NuxtLink></li>
              <li><NuxtLink to="/courses" class="hover:text-white transition-colors">Tribunais e Administrativo</NuxtLink></li>
              <li><NuxtLink to="/courses" class="hover:text-white transition-colors">Redação Nota Mil</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Plataforma</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/student" class="hover:text-white transition-colors">Área do Aluno</NuxtLink></li>
              <li><NuxtLink to="/login" class="hover:text-white transition-colors">Acessar Aulas</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-white transition-colors">Nossa Metodologia</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Suporte Pedagógico</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Atendimento</h4>
            <p class="text-sm text-surface-400 mb-2">Segunda a Sexta: 08h às 20h</p>
            <p class="text-sm text-surface-400 mb-4">contato@cursinhoalpha.com.br</p>
            <div class="flex items-center gap-3">
              <a href="#" class="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-brand-600 transition-colors text-white">
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-brand-600 transition-colors text-white">
                <i class="pi pi-youtube"></i>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-brand-600 transition-colors text-white">
                <i class="pi pi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-surface-500 gap-4">
          <p>© 2026 Cursinho Alpha. Todos os direitos reservados.</p>
          <p>Plataforma construída para alta performance e escalabilidade.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  navigateTo('/');
};
</script>
