<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-surface-900 tracking-tight">Visão Geral da Operação</h1>
        <p class="text-sm text-surface-500">Métricas pedagógicas, financeiras e de engajamento do Cursinho Alpha</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/courses/create"
          class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Novo Curso
        </NuxtLink>
        <NuxtLink
          to="/admin/questions/create"
          class="px-4 py-2 rounded-xl bg-white hover:bg-surface-50 text-surface-800 text-xs font-semibold border border-surface-200 shadow-sm transition-all flex items-center gap-2"
        >
          <i class="pi pi-pencil text-brand-600"></i>
          Nova Questão
        </NuxtLink>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-surface-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Total de Alunos</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <i class="pi pi-users text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-surface-900">1.280</p>
        <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <i class="pi pi-arrow-up-right text-[10px]"></i> +18% este mês
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-surface-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Cursos Publicados</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <i class="pi pi-book text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-surface-900">8</p>
        <p class="text-xs text-surface-500">2 cursos em rascunho</p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-surface-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Banco de Questões</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <i class="pi pi-list-check text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-surface-900">3.450</p>
        <p class="text-xs text-brand-600 font-semibold">12 disciplinas cadastradas</p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-surface-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-surface-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Faturamento (Mês)</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i class="pi pi-dollar text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-surface-900">R$ 48.900</p>
        <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <i class="pi pi-arrow-up-right text-[10px]"></i> +24% vs mês anterior
        </p>
      </div>
    </div>

    <!-- Recent Enrollments & System Health Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Enrollments Table -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-surface-900">Matrículas Recentes</h2>
          <NuxtLink to="/admin/students" class="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Gerenciar todas →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-surface-100 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                <th class="pb-3">Aluno</th>
                <th class="pb-3">Curso</th>
                <th class="pb-3">Origem</th>
                <th class="pb-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100 text-surface-700">
              <tr>
                <td class="py-3 font-medium text-surface-900">Mariana Costa</td>
                <td class="py-3">Extensivo Medicina ENEM</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">Compra Online</span></td>
                <td class="py-3"><span class="w-2 h-2 rounded-full inline-block bg-emerald-500 mr-1.5"></span>Ativo</td>
              </tr>
              <tr>
                <td class="py-3 font-medium text-surface-900">Gabriel Souza</td>
                <td class="py-3">Carreiras Policiais 2026</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">Manual (Secretaria)</span></td>
                <td class="py-3"><span class="w-2 h-2 rounded-full inline-block bg-emerald-500 mr-1.5"></span>Ativo</td>
              </tr>
              <tr>
                <td class="py-3 font-medium text-surface-900">Larissa Mendes</td>
                <td class="py-3">Redação Nota 1000</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700">Cupom PROMO50</span></td>
                <td class="py-3"><span class="w-2 h-2 rounded-full inline-block bg-emerald-500 mr-1.5"></span>Ativo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Platform Settings & Health Status -->
      <div class="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-6">
        <h2 class="text-base font-bold text-surface-900">Status dos Serviços</h2>

        <div class="space-y-4 text-xs">
          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
            <span class="font-medium text-surface-700 flex items-center gap-2">
              <i class="pi pi-server text-brand-600"></i> Backend API
            </span>
            <span class="font-semibold text-emerald-600 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
            <span class="font-medium text-surface-700 flex items-center gap-2">
              <i class="pi pi-database text-brand-600"></i> Banco PostgreSQL
            </span>
            <span class="font-semibold text-emerald-600 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Conectado
            </span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
            <span class="font-medium text-surface-700 flex items-center gap-2">
              <i class="pi pi-video text-brand-600"></i> Bunny Stream
            </span>
            <span class="font-semibold text-surface-500">Pronto</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
            <span class="font-medium text-surface-700 flex items-center gap-2">
              <i class="pi pi-credit-card text-brand-600"></i> Stripe Gateway
            </span>
            <span class="font-semibold text-surface-500">Modo Teste</span>
          </div>
        </div>

        <div class="pt-4 border-t border-surface-100">
          <NuxtLink
            to="/admin/settings"
            class="w-full py-2.5 px-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <i class="pi pi-sliders-h"></i>
            Ajustar Identidade Visual & Cores
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

useHead({
  title: 'Painel Administrativo — Cursinho Alpha',
});
</script>
