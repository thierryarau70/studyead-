<template>
  <div class="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
      
      <!-- Header -->
      <div class="text-center space-y-2">
        <div 
          class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-transform hover:scale-105"
          :class="isPreRegistered ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-brand-600 text-white shadow-brand-600/30'"
        >
          <i :class="isPreRegistered ? 'pi pi-verified text-2xl' : 'pi pi-user-plus text-2xl font-bold'"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          {{ isPreRegistered ? 'Ativar Sua Conta' : 'Crie sua conta de aluno' }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500">
          {{ isPreRegistered ? 'Defina sua senha pessoal para liberar o acesso aos cursos' : 'Cadastre-se para acessar os cursos e simulados' }}
        </p>
      </div>

      <!-- Pre-registration Detected Alert -->
      <div 
        v-if="isPreRegistered" 
        class="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 shadow-sm animate-fade-in"
      >
        <div class="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
          <i class="pi pi-check text-base font-bold"></i>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">Pré-cadastro Encontrado</span>
          </div>
          <h3 class="text-sm font-extrabold text-slate-900 mt-1">
            Olá, {{ preRegName || name }}! 👋
          </h3>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">
            Seus dados já foram iniciados pelo cursinho. Escolha uma senha segura abaixo para concluir a ativação e entrar na sua sala de estudos.
          </p>
        </div>
      </div>

      <!-- Already Registered Notice -->
      <div v-if="alreadyRegistered" class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <i class="pi pi-info-circle text-amber-600 text-lg mt-0.5 shrink-0"></i>
        <div>
          <p class="text-xs font-bold text-amber-900">Conta já ativada</p>
          <p class="text-xs text-amber-700 mt-0.5">Este e-mail já possui um cadastro ativo no portal.</p>
          <NuxtLink to="/login" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 underline mt-2 hover:text-amber-950">
            Fazer login agora <i class="pi pi-arrow-right text-[10px]"></i>
          </NuxtLink>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-base flex-shrink-0"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Success Notification before redirect -->
      <div v-if="activationSuccess" class="p-4 bg-emerald-500 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Conta ativada com sucesso! Redirecionando...</span>
      </div>

      <!-- Form -->
      <form v-if="!activationSuccess" class="space-y-4" @submit.prevent="handleSubmit">
        <!-- E-mail -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            E-mail <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              @blur="handleEmailBlur"
              placeholder="seuemail@exemplo.com"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50/60 transition-colors"
              :class="{'border-emerald-300 bg-emerald-50/20': isPreRegistered}"
            />
            <div v-if="checkingEmail" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <i class="pi pi-spin pi-spinner text-sm"></i>
            </div>
            <div v-else-if="isPreRegistered" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
              <i class="pi pi-check-circle text-base"></i>
            </div>
          </div>
          <p v-if="isPreRegistered" class="text-[11px] text-emerald-600 font-semibold mt-1">
            ✓ E-mail vinculado ao seu pré-cadastro
          </p>
        </div>

        <!-- Nome Completo -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nome Completo <span class="text-red-500">*</span>
            </label>
            <span v-if="isPreRegistered" class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Confirmado
            </span>
          </div>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Seu nome completo"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50/60"
          />
        </div>

        <!-- Telefone / WhatsApp -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Telefone / WhatsApp (Opcional)
          </label>
          <input
            v-model="phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50/60"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {{ isPreRegistered ? 'Defina sua Senha de Acesso' : 'Senha' }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Mínimo 8 caracteres (Ex: Estudo@2026)"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-slate-50/60"
          />
          <p class="text-[11px] text-slate-400 mt-1">
            Recomendado: 8+ caracteres, uma letra maiúscula e um número
          </p>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading || checkingEmail || activationSuccess"
          class="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
          :class="isPreRegistered 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:shadow-emerald-600/40' 
            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 hover:shadow-brand-600/40'"
        >
          <i v-if="authStore.loading" class="pi pi-spin pi-spinner"></i>
          <i v-else-if="isPreRegistered" class="pi pi-bolt"></i>
          <i v-else class="pi pi-check"></i>
          <span>
            {{ authStore.loading ? 'Ativando Conta...' : (isPreRegistered ? 'Ativar Conta e Acessar Cursos' : 'Finalizar Cadastro') }}
          </span>
        </button>
      </form>

      <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Já concluiu seu cadastro anteriormente?
        <NuxtLink to="/login" class="font-extrabold text-brand-600 hover:text-brand-700 hover:underline">
          Entrar no portal
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { registerSchema } from '@studyead/validators';

useHead({
  title: 'Criar / Ativar Conta — Cursinho Alpha',
});

const route = useRoute();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const errorMessage = ref('');
const checkingEmail = ref(false);
const isPreRegistered = ref(false);
const alreadyRegistered = ref(false);
const preRegName = ref('');
const activationSuccess = ref(false);

async function checkEmailStatus(emailToCheck: string) {
  if (!emailToCheck || !emailToCheck.includes('@') || emailToCheck.length < 5) return;
  checkingEmail.value = true;
  try {
    const res: any = await authStore.checkPreRegistration(emailToCheck.trim());
    if (res?.isPreRegistered) {
      isPreRegistered.value = true;
      alreadyRegistered.value = false;
      if (res.name && !name.value) {
        name.value = res.name;
        preRegName.value = res.name;
      }
      if (res.phone && !phone.value) {
        phone.value = res.phone;
      }
    } else if (res?.alreadyRegistered) {
      alreadyRegistered.value = true;
      isPreRegistered.value = false;
    } else {
      isPreRegistered.value = false;
      alreadyRegistered.value = false;
    }
  } catch (e) {
    console.warn('Erro ao checar pré-cadastro:', e);
  } finally {
    checkingEmail.value = false;
  }
}

function handleEmailBlur() {
  checkEmailStatus(email.value);
}

onMounted(() => {
  const queryEmail = (route.query.email as string) || '';
  if (queryEmail) {
    email.value = queryEmail.trim();
    checkEmailStatus(queryEmail.trim());
  }
});

const handleSubmit = async () => {
  errorMessage.value = '';

  const validation = registerSchema.safeParse({
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value?.trim() || null,
    password: password.value,
  });

  if (!validation.success) {
    errorMessage.value = validation.error.errors[0]?.message || 'Dados inválidos';
    return;
  }

  try {
    await authStore.register(validation.data);
    activationSuccess.value = true;
    setTimeout(async () => {
      await navigateTo('/student');
    }, 1200);
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || err?.message || 'Falha ao ativar conta. Verifique sua conexão e tente novamente.';
  }
};
</script>

