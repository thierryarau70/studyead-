<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-16">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 sm:p-10 text-white shadow-xl">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/20 backdrop-blur-md">
          <i class="pi pi-clock text-[11px]"></i> Simulados com Temporizador
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">Simulados Oficiais</h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Treine com cronômetro real e confira o gabarito comentado ao finalizar.
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="quizzesStore.publishedQuizzes.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
      <i class="pi pi-clock text-5xl text-slate-200"></i>
      <h2 class="mt-4 text-xl font-bold text-slate-600">Nenhum simulado disponível</h2>
      <p class="text-sm text-slate-400 mt-1">Os simulados serão publicados em breve pelo administrador.</p>
    </div>

    <!-- Quizzes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="quiz in quizzesStore.publishedQuizzes"
        :key="quiz.id"
        class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-md text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">{{ quiz.category }}</span>
            <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
              <i class="pi pi-clock text-amber-500"></i> {{ quiz.timeLimitMinutes }} min
            </span>
          </div>

          <h3 class="text-xl font-extrabold text-slate-900">{{ quiz.title }}</h3>
          <p class="text-xs text-slate-500 leading-relaxed">{{ quiz.description }}</p>

          <div class="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl text-center">
              <span class="text-slate-400 block font-semibold">Questões</span>
              <span class="font-extrabold text-slate-800 text-sm">{{ quiz.questionIds.length }} itens</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl text-center">
              <span class="text-slate-400 block font-semibold">Tentativas</span>
              <span class="font-extrabold text-slate-800 text-sm">0 / {{ quiz.maxAttempts }}</span>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-slate-100 flex items-center justify-between mt-4">
          <div class="text-xs text-slate-400 italic">Ainda não realizado</div>
          <NuxtLink
            :to="`/student/quizzes/${quiz.id}`"
            class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
          >
            <span>Iniciar Prova</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuizzesStore } from '~/stores/quizzes';

definePageMeta({ layout: 'student' });
useHead({ title: 'Simulados — StudyEAD' });

const quizzesStore = useQuizzesStore();

onMounted(() => {
  quizzesStore.fetchQuizzes();
});
</script>
