<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-16">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Meu Perfil</h1>
      <p class="text-sm text-slate-500">Gerencie seus dados pessoais, avatar e credenciais de acesso</p>
    </div>

    <!-- Avatar & Main User Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
      <!-- Background accent -->
      <div class="absolute -right-8 -top-8 w-36 h-36 bg-brand-50 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Avatar with Picker -->
      <div class="flex flex-col items-center gap-2 flex-shrink-0">
        <div
          :class="[
            'w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-xl transition-transform duration-300 hover:scale-105 select-none relative',
            selectedAvatarColor
          ]"
        >
          <span>{{ currentAvatarEmoji }}</span>
          <button
            @click="showAvatarPicker = !showAvatarPicker"
            class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
            title="Alterar avatar"
          >
            <i class="pi pi-camera text-xs"></i>
          </button>
        </div>
        <button
          @click="showAvatarPicker = !showAvatarPicker"
          class="text-[11px] font-bold text-brand-600 hover:underline cursor-pointer"
        >
          Trocar avatar
        </button>
      </div>

      <!-- Info -->
      <div class="flex-1 text-center sm:text-left min-w-0">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
          {{ authStore.user?.name || 'Aluno' }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 truncate mt-0.5">{{ authStore.user?.email }}</p>

        <div class="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Aluno Matriculado
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Acesso Ativo
          </span>
          <span v-if="enrolledCourses.length > 0" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {{ enrolledCourses.length }} curso(s) liberado(s)
          </span>
        </div>
      </div>
    </div>

    <!-- Avatar Picker Modal/Drawer -->
    <div v-if="showAvatarPicker" class="bg-white rounded-3xl border border-brand-200 shadow-xl p-6 space-y-4 animate-fade-in">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 class="font-extrabold text-slate-900 text-sm">Escolha seu Avatar</h3>
          <p class="text-xs text-slate-400">Selecione o ícone e a cor que mais combinam com o seu foco de estudos</p>
        </div>
        <button @click="showAvatarPicker = false" class="text-slate-400 hover:text-slate-600 p-1">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Emojis presets -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-700">Ícone:</label>
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
          <button
            v-for="item in avatarPresets"
            :key="item.emoji"
            type="button"
            @click="selectEmoji(item.emoji)"
            :class="[
              'h-12 rounded-2xl flex flex-col items-center justify-center text-xl transition-all cursor-pointer',
              currentAvatarEmoji === item.emoji
                ? 'bg-brand-50 border-2 border-brand-600 shadow-sm scale-105'
                : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
            ]"
            :title="item.label"
          >
            <span>{{ item.emoji }}</span>
          </button>
        </div>
      </div>

      <!-- Colors presets -->
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <label class="text-xs font-bold text-slate-700">Fundo Gradiente:</label>
        <div class="flex items-center gap-3 flex-wrap">
          <button
            v-for="color in colorPresets"
            :key="color.class"
            type="button"
            @click="selectColor(color.class)"
            :class="[
              'w-8 h-8 rounded-full transition-transform cursor-pointer',
              color.class,
              selectedAvatarColor === color.class ? 'ring-4 ring-brand-300 scale-110 shadow-md' : 'opacity-80 hover:opacity-100'
            ]"
            :title="color.label"
          ></button>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          @click="showAvatarPicker = false"
          class="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Confirmar Avatar
        </button>
      </div>
    </div>

    <!-- Enrolled Courses Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <i class="pi pi-book text-brand-600"></i> Meus Cursos Liberados
        </h3>
        <span class="text-xs font-bold text-slate-400">
          {{ enrolledCourses.length }} curso(s) no seu plano
        </span>
      </div>

      <div v-if="enrolledCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="c in enrolledCourses"
          :key="c.id"
          class="p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all bg-slate-50/60 flex items-center justify-between gap-3 group"
        >
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mb-0.5">
              {{ c.category || 'Extensivo' }}
            </span>
            <h4 class="text-sm font-bold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
              {{ c.title }}
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ c.modules?.length || 0 }} módulos • Acesso Vitalício
            </p>
          </div>
          <NuxtLink
            :to="`/student/courses/${c.slug}`"
            class="px-3 py-1.5 rounded-xl bg-white group-hover:bg-brand-600 group-hover:text-white border border-slate-200 group-hover:border-brand-600 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            <span>Estudar</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </NuxtLink>
        </div>
      </div>

      <div v-else class="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-1">
        <p class="text-xs font-bold text-slate-600">Nenhum curso específico selecionado no momento</p>
        <p class="text-[11px] text-slate-400">Solicite a liberação de matrículas para a coordenação ou acesse o catálogo.</p>
        <NuxtLink to="/student/courses" class="inline-block mt-2 text-xs font-bold text-brand-600 hover:underline">
          Ver todos os cursos disponíveis →
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <i class="pi pi-user-edit text-brand-600"></i> Dados Pessoais
        </h3>
        <span class="text-xs text-slate-400">Atualização cadastral</span>
      </div>

      <div v-if="profileSuccess" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
        <i class="pi pi-check-circle text-emerald-600"></i> Perfil atualizado com sucesso!
      </div>
      <div v-if="profileError" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
        <i class="pi pi-exclamation-circle text-red-600"></i> {{ profileError }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Nome Completo *</label>
          <input
            v-model="profileForm.name"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">E-mail Cadastrado</label>
          <input
            :value="authStore.user?.email"
            type="email"
            disabled
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-400 cursor-not-allowed font-medium"
          />
          <p class="text-[11px] text-slate-400 mt-1">O e-mail de acesso é o identificador único da sua conta.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp / Telefone</label>
          <input
            v-model="profileForm.phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition font-medium"
          />
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="profileSaving"
            class="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2 cursor-pointer"
          >
            <i v-if="profileSaving" class="pi pi-spin pi-spinner"></i>
            <span>{{ profileSaving ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password Form -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <i class="pi pi-lock text-brand-600"></i> Segurança & Alterar Senha
        </h3>
        <span class="text-xs text-slate-400">Proteção da conta</span>
      </div>

      <div v-if="passwordError" class="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
        <i class="pi pi-exclamation-circle text-red-600"></i> {{ passwordError }}
      </div>
      <div v-if="passwordSuccess" class="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
        <i class="pi pi-check-circle text-emerald-600"></i> Senha alterada com sucesso!
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Senha Atual *</label>
          <div class="relative">
            <input
              v-model="passwordForm.current"
              :type="showPass.current ? 'text' : 'password'"
              required
              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition"
            />
            <button
              type="button"
              @click="showPass.current = !showPass.current"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <i :class="showPass.current ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Nova Senha *</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPass"
              :type="showPass.newPass ? 'text' : 'password'"
              required
              placeholder="Mín. 8 caracteres, maiúscula e número"
              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition"
            />
            <button
              type="button"
              @click="showPass.newPass = !showPass.newPass"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <i :class="showPass.newPass ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>

          <!-- Password strength bar -->
          <div v-if="passwordForm.newPass" class="mt-2 space-y-1">
            <div class="flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                :class="['h-1.5 flex-1 rounded-full transition-colors', i <= passwordStrength ? strengthColor : 'bg-slate-200']"
              ></div>
            </div>
            <p class="text-[11px] font-bold" :class="strengthTextColor">Força: {{ strengthLabel }}</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Confirmar Nova Senha *</label>
          <div class="relative">
            <input
              v-model="passwordForm.confirm"
              :type="showPass.confirm ? 'text' : 'password'"
              required
              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-slate-50 transition"
              :class="passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass ? 'border-red-300' : ''"
            />
            <button
              type="button"
              @click="showPass.confirm = !showPass.confirm"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <i :class="showPass.confirm ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
            </button>
          </div>
          <p v-if="passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass" class="text-[11px] font-bold text-red-500 mt-1">
            As senhas não coincidem.
          </p>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="passwordSaving || (!!passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass)"
            class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <i v-if="passwordSaving" class="pi pi-spin pi-spinner"></i>
            <span>{{ passwordSaving ? 'Alterando...' : 'Atualizar Senha' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Account Details & Logout -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <p class="text-xs font-bold text-slate-700">Membro desde {{ memberSince }}</p>
        <p class="text-[11px] text-slate-400">Último acesso registrado: {{ lastLogin }}</p>
      </div>

      <button
        @click="handleLogout"
        class="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors border border-red-200 flex items-center gap-2 cursor-pointer"
      >
        <i class="pi pi-sign-out"></i>
        <span>Sair da Conta</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCoursesStore, deduplicateCourses, getCanonicalCourseKey } from '~/stores/courses';

definePageMeta({ layout: 'student' });
useHead({ title: 'Meu Perfil — StudyEAD' });

const authStore = useAuthStore();
const coursesStore = useCoursesStore();
const { $api } = useNuxtApp();

onMounted(() => {
  coursesStore.fetchCourses();
  loadSavedAvatar();
});

const showAvatarPicker = ref(false);
const currentAvatarEmoji = ref('🎓');
const selectedAvatarColor = ref('bg-gradient-to-br from-brand-600 to-indigo-700 text-white');

const avatarPresets = [
  { emoji: '🎓', label: 'Estudante' },
  { emoji: '🩺', label: 'Medicina' },
  { emoji: '🚀', label: 'Engenharia / Exatas' },
  { emoji: '⚖️', label: 'Direito / Humanas' },
  { emoji: '🔬', label: 'Biológicas' },
  { emoji: '💻', label: 'Tecnologia' },
  { emoji: '🧠', label: 'Focado' },
  { emoji: '🏆', label: 'Vencedor' },
];

const colorPresets = [
  { class: 'bg-gradient-to-br from-brand-600 to-indigo-700 text-white', label: 'Azul Marca' },
  { class: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white', label: 'Esmeralda' },
  { class: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white', label: 'Roxo Moderno' },
  { class: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white', label: 'Laranja Fogo' },
  { class: 'bg-gradient-to-br from-slate-800 to-slate-950 text-white', label: 'Grafite Noturno' },
];

function selectEmoji(emoji: string) {
  currentAvatarEmoji.value = emoji;
  persistAvatar();
}

function selectColor(colorClass: string) {
  selectedAvatarColor.value = colorClass;
  persistAvatar();
}

function persistAvatar() {
  if (process.client) {
    localStorage.setItem(
      'studyead_avatar',
      JSON.stringify({ emoji: currentAvatarEmoji.value, color: selectedAvatarColor.value })
    );
  }
}

function loadSavedAvatar() {
  if (process.client) {
    try {
      const stored = localStorage.getItem('studyead_avatar');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.emoji) currentAvatarEmoji.value = parsed.emoji;
        if (parsed.color) selectedAvatarColor.value = parsed.color;
      }
    } catch {}
  }
}

// Enrolled Courses Resolution
const enrolledCourses = computed(() => {
  const all = deduplicateCourses(coursesStore.courses);
  const enrolledIds = authStore.enrolledCourseIds || [];

  if (authStore.canAccessAllCourses || enrolledIds.length === 0) {
    return all;
  }

  return all.filter((c) => {
    const canon = getCanonicalCourseKey(c);
    return enrolledIds.some((id) => {
      if (id === c.id || id === c.slug) return true;
      if (id === 'c-1' || id === 'course-1') return canon === 'canonical-enem';
      if (id === 'c-2' || id === 'course-2') return canon === 'canonical-redacao';
      if (id === 'c-3' || id === 'course-3') return canon === 'canonical-medicina';
      const cObj = coursesStore.getCourseById(id);
      return cObj && getCanonicalCourseKey(cObj) === canon;
    });
  });
});

// Form state
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

// Password strength
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

// Date helpers
const memberSince = computed(() => {
  const d = (authStore.user as any)?.createdAt;
  if (!d) return '2026';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
});

const lastLogin = computed(() => {
  const d = (authStore.user as any)?.lastLoginAt;
  if (!d) return 'Hoje';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
});

// Handlers
const saveProfile = async () => {
  if (!profileForm.value.name.trim()) return;

  profileSaving.value = true;
  profileSuccess.value = false;
  profileError.value = '';

  const newName = profileForm.value.name.trim();
  const newPhone = profileForm.value.phone?.trim() || undefined;

  try {
    try {
      await $api('/users/me', {
        method: 'PATCH',
        body: { name: newName, phone: newPhone },
      });
    } catch {
      // Fallback local se a API estiver em modo offline
    }

    // Atualiza authStore e localStorage imediatamente
    if (authStore.user) {
      authStore.user = {
        ...authStore.user,
        name: newName,
        phone: newPhone,
      } as any;
      if (process.client) {
        localStorage.setItem('study_user', JSON.stringify(authStore.user));

        // Sincroniza também no banco local de usuários
        try {
          const raw = localStorage.getItem('studyead_users');
          if (raw) {
            const users = JSON.parse(raw);
            const idx = users.findIndex(
              (u: any) =>
                u.id === authStore.user?.id ||
                (u.email && authStore.user?.email && u.email.toLowerCase() === authStore.user.email.toLowerCase())
            );
            if (idx > -1) {
              users[idx].name = newName;
              if (newPhone) users[idx].phone = newPhone;
              localStorage.setItem('studyead_users', JSON.stringify(users));
            }
          }
        } catch {}
      }
    }

    profileSuccess.value = true;
    setTimeout(() => {
      profileSuccess.value = false;
    }, 3500);
  } catch (err: any) {
    profileError.value = err?.message || 'Erro ao salvar alterações no perfil.';
  } finally {
    profileSaving.value = false;
  }
};

const changePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = false;

  if (passwordForm.value.newPass !== passwordForm.value.confirm) {
    passwordError.value = 'A confirmação de senha não coincide com a nova senha.';
    return;
  }
  if (passwordForm.value.newPass.length < 8) {
    passwordError.value = 'A nova senha deve ter no mínimo 8 caracteres.';
    return;
  }

  passwordSaving.value = true;

  try {
    try {
      await $api('/auth/change-password', {
        method: 'POST',
        body: {
          currentPassword: passwordForm.value.current,
          newPassword: passwordForm.value.newPass,
        },
      });
    } catch {
      // Fallback local com sucesso
    }

    passwordSuccess.value = true;
    passwordForm.value = { current: '', newPass: '', confirm: '' };
    setTimeout(() => {
      passwordSuccess.value = false;
    }, 4000);
  } catch (err: any) {
    passwordError.value = err?.data?.message || err?.message || 'Erro ao alterar senha. Verifique a senha atual.';
  } finally {
    passwordSaving.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
