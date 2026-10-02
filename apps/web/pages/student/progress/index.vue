<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-16">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Meu Progresso</h1>
      <p class="text-sm text-slate-500">Acompanhe sua evolução por disciplina e meta de aprovação</p>
    </div>

    <!-- Overall Progress Card -->
    <div class="p-8 rounded-2xl bg-gradient-to-r from-brand-700 to-indigo-700 text-white shadow-lg space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-brand-200 text-sm font-medium">Meta de Aprovação</p>
          <p class="text-4xl font-black mt-1">68.5%</p>
          <p class="text-brand-200 text-xs mt-1">Média geral de acertos</p>
        </div>
        <div class="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">
          🎯
        </div>
      </div>
      <div class="pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-extrabold">142</p>
          <p class="text-xs text-brand-200">Questões Resolvidas</p>
        </div>
        <div>
          <p class="text-2xl font-extrabold">28</p>
          <p class="text-xs text-brand-200">Aulas Assistidas</p>
        </div>
        <div>
          <p class="text-2xl font-extrabold">3</p>
          <p class="text-xs text-brand-200">Simulados Feitos</p>
        </div>
      </div>
    </div>

    <!-- Subject Performance -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <h2 class="font-bold text-slate-900 flex items-center gap-2">
        <i class="pi pi-chart-bar text-brand-600"></i> Desempenho por Disciplina
      </h2>
      <div class="space-y-4">
        <div v-for="subject in subjects" :key="subject.name" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-slate-800">{{ subject.name }}</span>
              <span class="text-xs text-slate-400">({{ subject.answered }} questões)</span>
            </div>
            <span
              :class="[
                'font-bold text-sm',
                subject.percent >= 80 ? 'text-emerald-600' :
                subject.percent >= 60 ? 'text-amber-600' : 'text-red-600'
              ]"
            >
              {{ subject.percent }}%
            </span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="[
                subject.percent >= 80 ? 'bg-emerald-500' :
                subject.percent >= 60 ? 'bg-amber-500' : 'bg-red-500'
              ]"
              :style="{ width: `${subject.percent}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Quiz Results -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="font-bold text-slate-900 flex items-center gap-2">
          <i class="pi pi-clock text-brand-600"></i> Últimos Simulados Realizados
        </h2>
        <NuxtLink to="/student/quizzes" class="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Ver todos →
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <div
          v-for="result in recentResults"
          :key="result.id"
          class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
        >
          <div>
            <p class="font-semibold text-slate-800 text-sm">{{ result.title }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ result.date }}</p>
          </div>
          <span
            :class="[
              'font-black text-lg',
              result.score >= 80 ? 'text-emerald-600' :
              result.score >= 60 ? 'text-amber-600' : 'text-red-600'
            ]"
          >
            {{ result.score }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student',
});

useHead({
  title: 'Meu Progresso — StudyEAD',
});

const subjects = [
  { name: 'Matemática', answered: 48, percent: 82 },
  { name: 'Física', answered: 32, percent: 75 },
  { name: 'Química', answered: 28, percent: 63 },
  { name: 'Biologia', answered: 18, percent: 55 },
  { name: 'Linguagens', answered: 16, percent: 90 },
];

const recentResults = [
  { id: 1, title: 'Simulado 1º Dia ENEM — Linguagens & Humanas', score: 86.6, date: '28/09/2026' },
  { id: 2, title: 'Mini-Simulado Diagnóstico de Física', score: 90.0, date: '25/09/2026' },
];
</script>
