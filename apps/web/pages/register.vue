<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-surface-200">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/30">
          <i class="pi pi-user-plus text-xl font-bold"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-surface-900 tracking-tight">
          Crie sua conta de aluno
        </h2>
        <p class="text-sm text-surface-500">
          Cadastre-se para acessar os cursos e simulados
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-base flex-shrink-0"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            Nome Completo
          </label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Seu nome completo"
            class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seuemail@exemplo.com"
            class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            Telefone / WhatsApp (Opcional)
          </label>
          <input
            v-model="phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
            Senha (mínimo 8 caracteres com maiúscula e número)
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-surface-50/50"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          <i v-if="authStore.loading" class="pi pi-spin pi-spinner"></i>
          <span>{{ authStore.loading ? 'Cadastrando...' : 'Finalizar Cadastro' }}</span>
        </button>
      </form>

      <div class="text-center text-xs text-surface-500">
        Já possui uma conta cadastrada?
        <NuxtLink to="/login" class="font-bold text-brand-600 hover:text-brand-700">
          Entrar aqui
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { registerSchema } from '@studyead/validators';

useHead({
  title: 'Criar Conta — Cursinho Alpha',
});

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';

  const validation = registerSchema.safeParse({
    name: name.value,
    email: email.value,
    phone: phone.value || null,
    password: password.value,
  });

  if (!validation.success) {
    errorMessage.value = validation.error.errors[0].message;
    return;
  }

  try {
    await authStore.register(validation.data);
    await navigateTo('/student');
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || err?.message || 'Falha ao criar conta. Tente novamente.';
  }
};
</script>
