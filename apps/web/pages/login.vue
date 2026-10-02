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
      <form class="space-y-4" @submit.prevent="handleSubmit" novalidate>
        <!-- E-mail -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              E-mail
            </label>
            <span v-if="emailTouched && isEmailValid" class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <i class="pi pi-check text-[10px]"></i> E-mail válido
            </span>
          </div>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              @blur="emailTouched = true"
              @input="emailTouched = true"
              placeholder="seuemail@exemplo.com"
              class="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/60"
              :class="[
                emailTouched && emailError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                  : emailTouched && isEmailValid
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              ]"
            />
            <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <i v-if="emailTouched && isEmailValid" class="pi pi-check-circle text-emerald-500"></i>
              <i v-else-if="emailTouched && emailError" class="pi pi-exclamation-circle text-red-500"></i>
              <i v-else class="pi pi-envelope text-slate-400"></i>
            </div>
          </div>
          <p v-if="emailTouched && emailError" class="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1 animate-fade-in">
            <i class="pi pi-times-circle text-[10px]"></i>
            {{ emailError }}
          </p>
        </div>

        <!-- Senha -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Senha
            </label>
          </div>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              @blur="passwordTouched = true"
              @input="passwordTouched = true"
              placeholder="••••••••"
              class="w-full pl-4 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/60"
              :class="[
                passwordTouched && passwordError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                  : passwordTouched && isPasswordValid
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
              :title="showPassword ? 'Ocultar senha' : 'Ver senha'"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
          <p v-if="passwordTouched && passwordError" class="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1 animate-fade-in">
            <i class="pi pi-times-circle text-[10px]"></i>
            {{ passwordError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
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
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { loginSchema } from '@studyead/validators';

useHead({
  title: 'Entrar — Cursinho Alpha',
});

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

const emailTouched = ref(false);
const passwordTouched = ref(false);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const emailError = computed(() => {
  const val = email.value.trim();
  if (!val) return 'Informe o seu e-mail de acesso';
  if (!emailRegex.test(val)) return 'Digite um e-mail válido (ex: seuemail@exemplo.com)';
  return '';
});

const isEmailValid = computed(() => !emailError.value);

const passwordError = computed(() => {
  if (!password.value) return 'Informe sua senha de acesso';
  if (password.value.length < 6) return 'A senha deve conter pelo menos 6 caracteres';
  return '';
});

const isPasswordValid = computed(() => !passwordError.value);

const fillCredentials = (u: string, p: string) => {
  email.value = u;
  password.value = p;
  emailTouched.value = true;
  passwordTouched.value = true;
  errorMessage.value = '';
};

const handleSubmit = async () => {
  errorMessage.value = '';
  emailTouched.value = true;
  passwordTouched.value = true;

  if (emailError.value) {
    errorMessage.value = emailError.value;
    return;
  }

  if (passwordError.value) {
    errorMessage.value = passwordError.value;
    return;
  }

  const validation = loginSchema.safeParse({
    email: email.value.trim(),
    password: password.value,
  });

  if (!validation.success) {
    errorMessage.value = validation.error.errors[0]?.message || 'Dados inválidos';
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
