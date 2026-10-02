<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-16">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Meu Perfil</h1>
      <p class="text-sm text-slate-500">Atualize seus dados pessoais e senha de acesso</p>
    </div>

    <!-- Avatar & Name -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5">
      <div class="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-brand-600/30">
        {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'A' }}
      </div>
      <div>
        <h2 class="text-xl font-extrabold text-slate-900">{{ authStore.user?.name || 'Aluno' }}</h2>
        <p class="text-sm text-slate-500">{{ authStore.user?.email }}</p>
        <span class="mt-1 inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          Aluno
        </span>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <h3 class="font-bold text-slate-800 flex items-center gap-2">
        <i class="pi pi-user-edit text-brand-600"></i> Editar Dados Pessoais
      </h3>

      <div v-if="profileSaved" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i> Perfil atualizado com sucesso!
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nome Completo</label>
          <input
            v-model="profileForm.name"
            type="text"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Telefone / WhatsApp</label>
          <input
            v-model="profileForm.phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="profileSaving"
            class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
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
      <div v-if="passwordSaved" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i> Senha alterada com sucesso!
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Senha Atual</label>
          <input
            v-model="passwordForm.current"
            type="password"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nova Senha</label>
          <input
            v-model="passwordForm.newPass"
            type="password"
            required
            placeholder="Mín. 8 caracteres, com maiúscula e número"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Confirmar Nova Senha</label>
          <input
            v-model="passwordForm.confirm"
            type="password"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="passwordSaving"
            class="px-6 py-3 rounded-xl bg-surface-900 hover:bg-surface-800 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <i v-if="passwordSaving" class="pi pi-spin pi-spinner"></i>
            <span>{{ passwordSaving ? 'Alterando...' : 'Alterar Senha' }}</span>
          </button>
        </div>
      </form>
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
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'student',
});

useHead({
  title: 'Meu Perfil — StudyEAD',
});

const authStore = useAuthStore();

const profileSaving = ref(false);
const profileSaved = ref(false);
const passwordSaving = ref(false);
const passwordSaved = ref(false);
const passwordError = ref('');

const profileForm = ref({
  name: authStore.user?.name || '',
  phone: '',
});

const passwordForm = ref({
  current: '',
  newPass: '',
  confirm: '',
});

const saveProfile = async () => {
  profileSaving.value = true;
  await new Promise((r) => setTimeout(r, 700));
  profileSaving.value = false;
  profileSaved.value = true;
  setTimeout(() => (profileSaved.value = false), 3000);
};

const changePassword = async () => {
  passwordError.value = '';
  if (passwordForm.value.newPass !== passwordForm.value.confirm) {
    passwordError.value = 'As senhas não coincidem. Verifique e tente novamente.';
    return;
  }
  passwordSaving.value = true;
  await new Promise((r) => setTimeout(r, 700));
  passwordSaving.value = false;
  passwordSaved.value = true;
  passwordForm.value = { current: '', newPass: '', confirm: '' };
  setTimeout(() => (passwordSaved.value = false), 3000);
};

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
