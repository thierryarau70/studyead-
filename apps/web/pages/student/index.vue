<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Header banner -->
    <div class="p-8 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
      <div class="relative z-10 max-w-2xl space-y-2">
        <span class="inline-block px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-semibold backdrop-blur-sm">
          Painel de Estudos
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Pronto para continuar os estudos, {{ authStore.user?.name?.split(' ')[0] || 'Aluno' }}?
        </h1>
        <p class="text-brand-100 text-sm">
          Você completou 14 aulas nesta semana. Mantenha o ritmo para alcançar sua meta de aprovação.
        </p>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="p-5 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-book"></i>
        </div>
        <div>
          <p class="text-xs font-medium text-surface-500">Cursos Ativos</p>
          <p class="text-2xl font-bold text-surface-900">2</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-video"></i>
        </div>
        <div>
          <p class="text-xs font-medium text-surface-500">Aulas Assistidas</p>
          <p class="text-2xl font-bold text-surface-900">28 / 64</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-check-circle"></i>
        </div>
        <div>
          <p class="text-xs font-medium text-surface-500">Questões Respondidas</p>
          <p class="text-2xl font-bold text-surface-900">142</p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl flex-shrink-0">
          <i class="pi pi-chart-pie"></i>
        </div>
        <div>
          <p class="text-xs font-medium text-surface-500">Taxa de Acertos</p>
          <p class="text-2xl font-bold text-emerald-600">82.5%</p>
        </div>
      </div>
    </div>

    <!-- Active Courses Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-surface-900 flex items-center gap-2">
          <i class="pi pi-bookmark text-brand-600"></i>
          Meus Cursos em Andamento
        </h2>
        <NuxtLink to="/student/courses" class="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Ver todos os cursos →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sample Course Card 1 -->
        <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <span class="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Extensivo ENEM
              </span>
              <h3 class="text-base font-bold text-surface-900 mt-2">
                Preparatório ENEM & Vestibulares Medicina
              </h3>
            </div>
            <span class="text-xs font-bold text-brand-600">43%</span>
          </div>

          <!-- Progress bar -->
          <div class="space-y-1.5">
            <div class="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
              <div class="h-full bg-brand-600 rounded-full w-[43%]"></div>
            </div>
            <p class="text-[11px] text-surface-500">22 de 51 aulas completadas</p>
          </div>

          <div class="pt-2 flex items-center justify-between border-t border-surface-100">
            <span class="text-xs text-surface-500">Última aula: Física Quântica Básica</span>
            <NuxtLink
              to="/student/courses/enem"
              class="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              Continuar
              <i class="pi pi-play text-[10px]"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Sample Course Card 2 -->
        <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <span class="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Redação
              </span>
              <h3 class="text-base font-bold text-surface-900 mt-2">
                Laboratório de Redação Nota 1000
              </h3>
            </div>
            <span class="text-xs font-bold text-purple-600">75%</span>
          </div>

          <!-- Progress bar -->
          <div class="space-y-1.5">
            <div class="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-600 rounded-full w-[75%]"></div>
            </div>
            <p class="text-[11px] text-surface-500">12 de 16 aulas completadas</p>
          </div>

          <div class="pt-2 flex items-center justify-between border-t border-surface-100">
            <span class="text-xs text-surface-500">Última aula: Estrutura da Proposta de Intervenção</span>
            <NuxtLink
              to="/student/courses/redacao"
              class="px-3.5 py-1.5 rounded-lg bg-surface-900 hover:bg-surface-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              Continuar
              <i class="pi pi-play text-[10px]"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'student',
});

useHead({
  title: 'Dashboard do Aluno — Cursinho Alpha',
});

const authStore = useAuthStore();
</script>
