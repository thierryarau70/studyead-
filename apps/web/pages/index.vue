<template>
  <div class="space-y-24 pb-20">
    <!-- Hero Section -->
    <section class="relative pt-16 pb-24 overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-amber-100/30 blur-3xl -z-10 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-sm">
              <span class="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
              Matrículas Abertas • Turmas 2026
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-950 tracking-tight leading-[1.12]">
              Sua aprovação nos melhores vestibulares e concursos começa <span class="text-gradient">aqui</span>.
            </h1>

            <p class="text-lg text-surface-600 max-w-2xl leading-relaxed">
              Videoaulas diretas ao ponto, materiais didáticos em PDF, banco de questões com gabarito comentado e simulados cronometrados com metodologia de alto rendimento.
            </p>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <NuxtLink
                to="/register"
                class="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all duration-200 text-center flex items-center justify-center gap-2 group"
              >
                Começar Agora
                <i class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </NuxtLink>

              <NuxtLink
                to="/student/courses"
                class="px-8 py-4 rounded-xl bg-white hover:bg-surface-50 text-surface-800 font-semibold text-base border border-surface-200 shadow-sm transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <i class="pi pi-compass text-brand-600"></i>
                Ver Todos os Cursos
              </NuxtLink>
            </div>

            <!-- Social proof metrics -->
            <div class="pt-6 border-t border-surface-200/80 grid grid-cols-3 gap-6">
              <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-surface-900">+12.000</p>
                <p class="text-xs text-surface-500 font-medium">Alunos Aprovados</p>
              </div>
              <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-brand-600">94.8%</p>
                <p class="text-xs text-surface-500 font-medium">Índice de Satisfação</p>
              </div>
              <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-surface-900">+50.000</p>
                <p class="text-xs text-surface-500 font-medium">Questões no Banco</p>
              </div>
            </div>
          </div>

          <!-- Right Column / Visual Card -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              <!-- Glow behind card -->
              <div class="absolute -inset-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl blur opacity-30"></div>

              <!-- Main Interactive Preview Card -->
              <div class="relative bg-white rounded-2xl shadow-xl border border-surface-200 p-6 space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-surface-100">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                      <i class="pi pi-play text-brand-600"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-surface-900">Extensivo Medicina & ENEM</h4>
                      <p class="text-xs text-surface-500">Módulo 04: Física Mecânica</p>
                    </div>
                  </div>
                  <span class="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                    Ao Vivo / Gravado
                  </span>
                </div>

                <!-- Simulated Video Player Preview -->
                <div class="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-tr from-surface-900 to-surface-800 flex items-center justify-center shadow-inner group cursor-pointer">
                  <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <i class="pi pi-play text-xl fill-current ml-1"></i>
                  </div>
                  <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-surface-300">
                    <span>Aula 12: Leis de Newton aplicadas</span>
                    <span class="bg-black/40 px-2 py-0.5 rounded text-[10px]">28:40</span>
                  </div>
                </div>

                <!-- Course Progress Preview -->
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-semibold text-surface-700">
                    <span>Progresso do Aluno</span>
                    <span class="text-brand-600">72% Concluído</span>
                  </div>
                  <div class="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full w-[72%]"></div>
                  </div>
                </div>

                <!-- Quick exercises badge -->
                <div class="p-3.5 bg-surface-50 rounded-xl border border-surface-200/60 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <i class="pi pi-check-circle text-emerald-600 text-lg"></i>
                    <span class="text-xs font-medium text-surface-800">45/50 questões resolvidas neste módulo</span>
                  </div>
                  <span class="text-xs font-bold text-emerald-600">90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Pillars Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h2 class="text-xs font-bold tracking-widest text-brand-600 uppercase">Tudo o que você precisa</h2>
        <h3 class="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
          A estrutura pedagógica ideal para acelerar seu resultado
        </h3>
        <p class="text-base text-surface-600">
          Chega de plataformas desorganizadas. No Cursinho Alpha você estuda com foco, mede cada etapa e foca nas suas dificuldades.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Pillar 1 -->
        <div class="p-8 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <i class="pi pi-video"></i>
          </div>
          <h4 class="text-xl font-bold text-surface-900">Videoaulas em Alta Definição</h4>
          <p class="text-sm text-surface-600 leading-relaxed">
            Aulas gravadas com qualidade máxima, sem travamentos, suporte a acelerador de vídeo e controle preciso de progresso de cada minuto assistido.
          </p>
        </div>

        <!-- Pillar 2 -->
        <div class="p-8 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <i class="pi pi-list-check"></i>
          </div>
          <h4 class="text-xl font-bold text-surface-900">Banco de Questões & Gabarito</h4>
          <p class="text-sm text-surface-600 leading-relaxed">
            Resolva milhares de questões categorizadas por banca, disciplina e dificuldade. Tenha acesso a resolução passo a passo e explicações claras.
          </p>
        </div>

        <!-- Pillar 3 -->
        <div class="p-8 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-5">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <i class="pi pi-clock"></i>
          </div>
          <h4 class="text-xl font-bold text-surface-900">Simulados Cronometrados</h4>
          <p class="text-sm text-surface-600 leading-relaxed">
            Treine em condições reais de prova com cronômetro integrado, relatório detalhado de acertos e diagnóstico imediato de áreas para reforço.
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>

        <div class="max-w-2xl space-y-6 relative z-10">
          <span class="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
            Garantia de Qualidade
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para dar o próximo passo rumo à sua aprovação?
          </h2>
          <p class="text-surface-200 text-base leading-relaxed">
            Crie sua conta agora mesmo, acesse aulas de demonstração gratuitas e conheça a metodologia que mais aprova.
          </p>
          <div class="pt-2 flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/register"
              class="px-8 py-4 rounded-xl bg-white hover:bg-surface-100 text-brand-900 font-bold text-base shadow-lg transition-all text-center"
            >
              Criar Conta Gratuita
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all text-center"
            >
              Já sou Aluno
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Landing page setup
useHead({
  title: 'Cursinho Alpha — Plataforma EAD Preparatória',
});
</script>
