<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-16">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Meu Perfil</h1>
      <p class="text-sm text-slate-500">Atualize seus dados pessoais e senha de acesso</p>
    </div>

    <!-- Avatar & Name -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5">
      <div class="relative group">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-3xl font-black shadow-md shadow-brand-600/30 select-none">
          {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'A' }}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl font-extrabold text-slate-900 truncate">{{ authStore.user?.name || 'Aluno' }}</h2>
        <p class="text-sm text-slate-500 truncate">{{ authStore.user?.email }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Aluno
          </span>
          <span class="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Conta Ativa
          </span>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <h3 class="font-bold text-slate-800 flex items-center gap-2">
        <i class="pi pi-user-edit text-brand-600"></i> Editar Dados Pessoais
      </h3>

      <div v-if="profileSuccess" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i> Perfil atualizado com sucesso!
      </div>
      <div v-if="profileError" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-red-600"></i> {{ profileError }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nome Completo</label>
          <input
            v-model="profileForm.name"
            type="text"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 bg-slate-50 transition"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">E-mail</label>
          <input
            :value="authStore.user?.email"
            type="email"
            disabled
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
          />
          <p class="text-[11px] text-slate-400 mt-1">O e-mail não pode ser alterado.</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Telefone / WhatsApp</label>
          <input
            v-model="profileForm.phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 bg-slate-50 transition"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="profileSaving"
            class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
          >
            <i v-if="profileSaving" class="pi pi-spin pi-spinner"></i>
            <span>{{ profileSaving ? 'Salvando...' : 'Salvar Perfil' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <h3 class="font-bold text-slate-800 flex items-center gap-2">
        <i class="pi pi-lock text-brand-600"></i> Alterar Senha
      </h3>

      <div v-if="passwordError" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-exclamation-circle text-red-600"></i> {{ passwordError }}
      </div>
      <div v-if="passwordSuccess" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i> Senha alterada com sucesso!
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Senha Atual</label>
          <div class="relative">
            <input
              v-model="passwordForm.current"
              :type="showPass.current ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 bg-slate-50 transition"
            />
            <button type="button" @click="showPass.current = !showPass.current" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <i :class="showPass.current ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nova Senha</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPass"
              :type="showPass.newPass ? 'text' : 'password'"
              required
              placeholder="Mín. 8 caracteres, com maiúscula e número"
              class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 bg-slate-50 transition"
            />
            <button type="button" @click="showPass.newPass = !showPass.newPass" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <i :class="showPass.newPass ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
          <!-- Password strength -->
          <div v-if="passwordForm.newPass" class="mt-2">
            <div class="flex gap-1 mb-1">
              <div v-for="i in 4" :key="i" :class="['h-1 flex-1 rounded-full transition-colors', i <= passwordStrength ? strengthColor : 'bg-slate-200']"></div>
            </div>
            <p class="text-[11px]" :class="strengthTextColor">{{ strengthLabel }}</p>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Confirmar Nova Senha</label>
          <div class="relative">
            <input
              v-model="passwordForm.confirm"
              :type="showPass.confirm ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 bg-slate-50 transition"
              :class="passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass ? 'border-red-300 focus:border-red-400' : ''"
            />
            <button type="button" @click="showPass.confirm = !showPass.confirm" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <i :class="showPass.confirm ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
          <p v-if="passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass" class="text-[11px] text-red-500 mt-1">As senhas não coincidem.</p>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="passwordSaving || (!!passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass)"
            class="px-6 py-3 rounded-xl bg-surface-900 hover:bg-surface-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <i v-if="passwordSaving" class="pi pi-spin pi-spinner"></i>
            <span>{{ passwordSaving ? 'Alterando...' : 'Alterar Senha' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Info card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
      <h3 class="font-bold text-slate-800 flex items-center gap-2">
        <i class="pi pi-info-circle text-brand-600"></i> Informações da Conta
      </h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-xs font-semibold text-slate-500 mb-0.5">Membro desde</p>
          <p class="font-medium text-slate-800">{{ memberSince }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 mb-0.5">Último acesso</p>
          <p class="font-medium text-slate-800">{{ lastLogin }}</p>
        </div>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="bg-white rounded-2xl border border-red-100 shadow-sm p-6 space-y-3">
      <h3 class="font-bold text-red-700 flex items-center gap-2">
        <i class="pi pi-sign-out text-red-600"></i> Sair da Conta
      </h3>
      <p class="text-xs text-slate-500">Você será redirecionado para a tela de login.</p>
      <button
        @click="handleLogout"
        class="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors border border-red-200"
      >
        Sair da Plataforma
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ layout: 'student' });
useHead({ title: 'Meu Perfil — StudyEAD' });

const authStore = useAuthStore();
const { $api } = useNuxtApp();

// — Form state —
const profileSaving = ref(false);
const profileSuccess = ref(false);
const profileError = ref('');

const passwordSaving = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref('');

const showPass = ref({ current: false, newPass: false, confirm: false });

const profileForm = ref({
  name: authStore.user?.name || '',
  phone: (authStore.user as any)?.phone || '',
});

const passwordForm = ref({
  current: '',
  newPass: '',
  confirm: '',
});

// — Password strength —
const passwordStrength = computed(() => {
  const p = passwordForm.value.newPass;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-400';
  if (passwordStrength.value === 2) return 'bg-amber-400';
  if (passwordStrength.value === 3) return 'bg-yellow-400';
  return 'bg-emerald-500';
});

const strengthTextColor = computed(() => {
  if (passwordStrength.value <= 1) return 'text-red-500';
  if (passwordStrength.value === 2) return 'text-amber-600';
  if (passwordStrength.value === 3) return 'text-yellow-600';
  return 'text-emerald-600';
});

const strengthLabel = computed(() => {
  const labels = ['', 'Fraca', 'Regular', 'Boa', 'Forte'];
  return labels[passwordStrength.value] || '';
});

// — Date helpers —
const memberSince = computed(() => {
  const d = (authStore.user as any)?.createdAt;
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
});

const lastLogin = computed(() => {
  const d = (authStore.user as any)?.lastLoginAt;
  if (!d) return 'Agora';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
});

// — Actions —
const saveProfile = async () => {
  profileSaving.value = true;
  profileSuccess.value = false;
  profileError.value = '';
  try {
    const res: any = await $api('/users/me', {
      method: 'PATCH',
      body: { name: profileForm.value.name, phone: profileForm.value.phone || undefined },
    });
    const updated = res?.data || res;
    if (authStore.user) {
      authStore.user = { ...authStore.user, name: updated.name ?? authStore.user.name };
    }
    profileSuccess.value = true;
    setTimeout(() => (profileSuccess.value = false), 3000);
  } catch (err: any) {
    profileError.value = err?.data?.message || err?.message || 'Erro ao salvar perfil.';
  } finally {
    profileSaving.value = false;
  }
};

const changePassword = async () => {
  passwordError.value = '';
  if (passwordForm.value.newPass !== passwordForm.value.confirm) {
    passwordError.value = 'As senhas não coincidem.';
    return;
  }
  if (passwordForm.value.newPass.length < 8) {
    passwordError.value = 'A nova senha deve ter no mínimo 8 caracteres.';
    return;
  }
  passwordSaving.value = true;
  passwordSuccess.value = false;
  try {
    await $api('/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.newPass,
      },
    });
    passwordSuccess.value = true;
    passwordForm.value = { current: '', newPass: '', confirm: '' };
    setTimeout(() => (passwordSuccess.value = false), 4000);
  } catch (err: any) {
    passwordError.value = err?.data?.message || err?.message || 'Senha atual incorreta.';
  } finally {
    passwordSaving.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
