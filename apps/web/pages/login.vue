<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-surface-200">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/30">
          <i class="pi pi-lock text-xl font-bold"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-surface-900 tracking-tight">
          Acesse sua conta
        </h2>
        <p class="text-sm text-surface-500">
          Informe seus dados de acesso da plataforma
        </p>
      </div>

      <!-- Quick Demo Credentials Selector -->
      <div class="p-3 bg-brand-50 rounded-xl border border-brand-200/60 text-xs space-y-2">
        <p class="font-semibold text-brand-800 flex items-center gap-1.5">
          <i class="pi pi-bolt text-brand-600"></i>
          Credenciais de Teste (Clique para preencher):
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="fillCredentials('coordenacao@cursinhoalpha.com.br', 'Admin@123456')"
            class="px-2.5 py-1.5 bg-white rounded-lg border border-brand-200 text-brand-700 font-medium hover:bg-brand-100 transition-colors text-left"
          >
            🔑 Administrador
          </button>
          <button
            type="button"
            @click="fillCredentials('aluno@cursinhoalpha.com.br', 'Aluno@123456')"
            class="px-2.5 py-1.5 bg-white rounded-lg border border-brand-200 text-brand-700 font-medium hover:bg-brand-100 transition-colors text-left"
          >
            🎓 Aluno
          </button>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-base flex-shrink-0"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            Senha
          </label>
          <div class="relative">
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <i v-if="authStore.loading" class="pi pi-spin pi-spinner"></i>
          <span>{{ authStore.loading ? 'Entrando...' : 'Entrar na Plataforma' }}</span>
        </button>
      </form>

      <div class="text-center text-xs text-surface-500">
        Não tem uma conta ainda?
        <NuxtLink to="/register" class="font-bold text-brand-600 hover:text-brand-700">
          Cadastre-se aqui
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { loginSchema } from '@studyead/validators';

useHead({
  title: 'Entrar — Cursinho Alpha',
});

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const fillCredentials = (u: string, p: string) => {
  email.value = u;
  password.value = p;
  errorMessage.value = '';
};

const handleSubmit = async () => {
  errorMessage.value = '';

  const validation = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  });

  if (!validation.success) {
    errorMessage.value = validation.error.errors[0].message;
    return;
  }

  try {
    const authData = await authStore.login(validation.data);

    if (authStore.isAdmin) {
      await navigateTo('/admin');
    } else {
      await navigateTo('/student');
    }
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || err?.message || 'Falha ao realizar login. Verifique suas credenciais.';
  }
};
</script>
