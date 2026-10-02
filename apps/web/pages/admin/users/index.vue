<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Alunos & Usuários</h1>
        <p class="text-sm text-slate-500">
          {{ store.users.length }} cadastros ·
          <span class="text-emerald-600 font-semibold">{{ store.totalActive }} ativos</span>
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <i class="pi pi-user-plus"></i> Novo Usuário
      </button>
    </div>

    <!-- Filter -->
    <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <select
        v-model="roleFilter"
        class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Todos os Perfis</option>
        <option value="student">Alunos</option>
        <option value="teacher">Professores</option>
        <option value="moderator">Moderadores</option>
        <option value="admin">Admins</option>
      </select>
      <select
        v-model="statusFilter"
        class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Todos os Status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Usuário</th>
              <th class="p-4">Perfil</th>
              <th class="p-4">Matrículas</th>
              <th class="p-4">Último Acesso</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    :class="user.isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900">{{ user.name }}</p>
                    <p class="text-xs text-slate-400">{{ user.email }}</p>
                    <p v-if="user.phone" class="text-[11px] text-slate-400">{{ user.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <select
                  :value="user.role"
                  @change="store.changeRole(user.id, ($event.target as HTMLSelectElement).value as any)"
                  class="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="student">Aluno</option>
                  <option value="teacher">Professor</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="p-4 text-xs text-slate-600 font-semibold">{{ user.enrollmentsCount }} matrícula(s)</td>
              <td class="p-4 text-xs text-slate-400">{{ user.lastLoginAt || 'Nunca' }}</td>
              <td class="p-4">
                <button
                  @click="store.toggleActive(user.id)"
                  :class="[
                    'px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer',
                    user.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  ]"
                  :title="user.isActive ? 'Clique para desativar conta' : 'Clique para ativar conta'"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                  {{ user.isActive ? 'Ativo' : 'Inativo' }}
                </button>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(user)"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs cursor-pointer"
                    title="Editar dados do usuário"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="confirmDeleteUser(user)"
                    class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs cursor-pointer"
                    title="Excluir usuário"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <i class="pi pi-users text-4xl text-slate-200"></i>
        <p class="mt-2 text-slate-400 font-semibold">Nenhum usuário encontrado</p>
      </div>
    </div>

    <!-- ─── Create User Modal ─── -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <i class="pi pi-user-plus text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Novo Usuário</h3>
              <p class="text-xs text-slate-400">Cadastre um novo usuário na plataforma</p>
            </div>
          </div>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleCreateUser" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
            <input
              v-model="createForm.name"
              type="text"
              required
              placeholder="Ex: João da Silva"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
            <input
              v-model="createForm.email"
              type="email"
              required
              placeholder="joao@exemplo.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Perfil *</label>
              <select
                v-model="createForm.role"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
              >
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
                <option value="moderator">Moderador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Telefone (opcional)</label>
              <input
                v-model="createForm.phone"
                type="tel"
                placeholder="(11) 98765-4321"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Senha Inicial</label>
            <input
              v-model="createForm.password"
              type="text"
              placeholder="Mudar@123 (padrão)"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>

          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" v-model="createForm.isActive" class="rounded text-brand-600 focus:ring-brand-500" />
            <span class="text-xs font-semibold text-slate-700">Conta Ativa</span>
          </label>

          <div class="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner"></i>
              <span>{{ saving ? 'Cadastrando...' : 'Cadastrar Usuário' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── Edit User Modal ─── -->
    <div v-if="showEditModal && editingUser" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <i class="pi pi-pencil text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Editar Usuário</h3>
              <p class="text-xs text-slate-400">{{ editingUser.email }}</p>
            </div>
          </div>
          <button @click="showEditModal = false; editingUser = null" class="text-slate-400 hover:text-slate-600">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleUpdateUser" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Perfil</label>
              <select
                v-model="editForm.role"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
              >
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
                <option value="moderator">Moderador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Telefone</label>
              <input
                v-model="editForm.phone"
                type="tel"
                placeholder="(11) 98765-4321"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
              />
            </div>
          </div>

          <label class="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" v-model="editForm.isActive" class="rounded text-brand-600 focus:ring-brand-500" />
            <span class="text-xs font-semibold text-slate-700">Conta Ativa</span>
          </label>

          <div class="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showEditModal = false; editingUser = null"
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner"></i>
              <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── Delete confirm modal ─── -->
    <div v-if="userToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <div class="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
          <i class="pi pi-user-minus"></i>
        </div>
        <h3 class="font-extrabold text-slate-900 text-lg">Excluir usuário?</h3>
        <p class="text-sm text-slate-500">
          <strong>{{ userToDelete.name }}</strong> perderá o acesso permanentemente à plataforma.
        </p>
        <div class="flex gap-3 pt-2">
          <button @click="userToDelete = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button @click="doDeleteUser" class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsersStore } from '~/stores/users';
import type { PlatformUser, UserRole } from '~/stores/users';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Alunos & Usuários — Admin' });

const store = useUsersStore();
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const userToDelete = ref<PlatformUser | null>(null);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingUser = ref<PlatformUser | null>(null);
const saving = ref(false);

const createForm = ref({
  name: '',
  email: '',
  role: 'student' as UserRole,
  phone: '',
  password: 'Mudar@123',
  isActive: true,
});

const editForm = ref({
  name: '',
  role: 'student' as UserRole,
  phone: '',
  isActive: true,
});

onMounted(() => {
  store.fetchUsers();
});

const filteredUsers = computed(() =>
  store.users.filter((u) => {
    const matchSearch =
      !searchQuery.value ||
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchRole = !roleFilter.value || u.role === roleFilter.value;
    const matchStatus = !statusFilter.value || (statusFilter.value === 'active' ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  }),
);

function openCreateModal() {
  createForm.value = {
    name: '',
    email: '',
    role: 'student',
    phone: '',
    password: 'Mudar@123',
    isActive: true,
  };
  showCreateModal.value = true;
}

async function handleCreateUser() {
  if (!createForm.value.name.trim() || !createForm.value.email.trim()) return;
  saving.value = true;
  try {
    await store.createUser({
      name: createForm.value.name,
      email: createForm.value.email,
      role: createForm.value.role,
      phone: createForm.value.phone || undefined,
      isActive: createForm.value.isActive,
    });
    showCreateModal.value = false;
  } finally {
    saving.value = false;
  }
}

function openEditModal(user: PlatformUser) {
  editingUser.value = user;
  editForm.value = {
    name: user.name,
    role: user.role,
    phone: user.phone || '',
    isActive: user.isActive,
  };
  showEditModal.value = true;
}

async function handleUpdateUser() {
  if (!editingUser.value) return;
  saving.value = true;
  try {
    await store.updateUser(editingUser.value.id, {
      name: editForm.value.name,
      role: editForm.value.role,
      phone: editForm.value.phone || undefined,
      isActive: editForm.value.isActive,
    });
    showEditModal.value = false;
    editingUser.value = null;
  } finally {
    saving.value = false;
  }
}

const confirmDeleteUser = (user: PlatformUser) => {
  userToDelete.value = user;
};

const doDeleteUser = async () => {
  if (userToDelete.value) {
    await store.deleteUser(userToDelete.value.id);
    userToDelete.value = null;
  }
};
</script>
