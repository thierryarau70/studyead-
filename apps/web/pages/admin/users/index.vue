<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Alunos & Usuários</h1>
        <p class="text-sm text-slate-500">
          {{ store.users.length }} cadastros ·
          <span class="text-emerald-600 font-semibold">{{ store.totalActive }} ativos</span> ·
          <span class="text-amber-600 font-semibold">{{ preRegisteredCount }} pré-cadastros</span>
        </p>
      </div>
      <div class="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
        <button
          @click="openPreRegisterModal"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <i class="pi pi-bolt"></i> Novo Aluno (Pré-Cadastro)
        </button>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <i class="pi pi-user-plus"></i> Outro Perfil (Staff)
        </button>
      </div>
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
        <option value="pre_registered">Pré-Cadastro (Aguardando)</option>
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
              <th class="p-4">Cursos Liberados</th>
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
                    :class="user.isPreRegistered ? 'bg-amber-100 text-amber-800' : (user.isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500')"
                  >
                    {{ (user.name || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-bold text-slate-900">{{ user.name || 'Sem nome' }}</p>
                      <span v-if="user.isPreRegistered" class="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                        Pré-cadastro
                      </span>
                    </div>
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
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {{ getUserEnrollmentsCount(user) }} curso(s)
                  </span>
                  <button
                    v-if="user.role === 'student'"
                    @click="openManageCoursesModal(user)"
                    class="text-[11px] font-bold text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Escolher quais cursos este aluno pode acessar"
                  >
                    <i class="pi pi-cog text-[10px]"></i> Escolher
                  </button>
                </div>
              </td>
              <td class="p-4 text-xs text-slate-400">
                <span v-if="user.isPreRegistered" class="text-amber-600 font-semibold">Aguardando ativação</span>
                <span v-else>{{ user.lastLoginAt || 'Nunca' }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-if="user.isPreRegistered"
                    class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5"
                    title="Aguardando o aluno definir a senha e ativar a conta"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pré-Cadastro
                  </span>
                  <button
                    v-else
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
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="user.role === 'student'"
                    @click="openManageCoursesModal(user)"
                    class="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors text-xs cursor-pointer"
                    title="Definir cursos liberados para este aluno"
                  >
                    <i class="pi pi-book"></i>
                  </button>
                  <button
                    v-if="user.isPreRegistered || (!user.lastLoginAt && user.role === 'student')"
                    @click="openActivationLinkModal(user)"
                    class="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-xs cursor-pointer"
                    title="Copiar link de ativação / Enviar WhatsApp"
                  >
                    <i class="pi pi-send"></i>
                  </button>
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

    <!-- ─── Pre-Register Student Modal ─── -->
    <div v-if="showPreRegisterModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <i class="pi pi-bolt text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Pré-Cadastrar Novo Aluno</h3>
              <p class="text-xs text-slate-400">Escolha os cursos liberados e envie o link de ativação</p>
            </div>
          </div>
          <button @click="showPreRegisterModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <form @submit.prevent="handlePreRegister" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Aluno *</label>
            <input
              v-model="preRegForm.name"
              type="text"
              required
              placeholder="Ex: Beatriz Albuquerque"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail do Aluno *</label>
            <input
              v-model="preRegForm.email"
              type="email"
              required
              placeholder="beatriz@gmail.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone (Opcional)</label>
            <input
              v-model="preRegForm.phone"
              type="tel"
              placeholder="(11) 98765-4321"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <p class="text-[11px] text-slate-400 mt-0.5">Permite enviar o link de ativação diretamente para o WhatsApp do aluno.</p>
          </div>

          <!-- Courses Selection for this student -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cursos Liberados para este Aluno
              </label>
              <div class="flex items-center gap-2 text-[11px]">
                <button type="button" @click="selectAllPreRegCourses" class="text-emerald-700 font-bold hover:underline cursor-pointer">
                  Marcar Todos
                </button>
                <span class="text-slate-300">·</span>
                <button type="button" @click="clearPreRegCourses" class="text-slate-500 hover:text-slate-700 cursor-pointer">
                  Desmarcar
                </button>
              </div>
            </div>
            
            <div class="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
              <label 
                v-for="course in coursesStore.courses" 
                :key="course.id"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                :class="preRegForm.selectedCourseIds.includes(course.id) ? 'bg-emerald-50/50 border-emerald-200' : ''"
              >
                <input 
                  type="checkbox" 
                  :value="course.id"
                  v-model="preRegForm.selectedCourseIds"
                  class="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-900 truncate">{{ course.title }}</p>
                  <p class="text-[10px] text-slate-500">{{ course.category }} · {{ course.totalLessons }} aulas</p>
                </div>
                <span v-if="preRegForm.selectedCourseIds.includes(course.id)" class="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Liberado
                </span>
              </label>
              <p v-if="coursesStore.courses.length === 0" class="text-xs text-slate-400 p-2 text-center">
                Nenhum curso cadastrado ainda.
              </p>
            </div>
            <p class="text-[11px] text-slate-500">
              {{ preRegForm.selectedCourseIds.length }} curso(s) selecionado(s) para este aluno.
            </p>
          </div>

          <div class="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-2.5">
            <i class="pi pi-info-circle text-emerald-600 text-sm mt-0.5 shrink-0"></i>
            <p class="text-[11px] text-emerald-800 leading-relaxed">
              O aluno não receberá uma senha padrão. Ao abrir o link de ativação, ele define a própria senha e tem acesso imediato apenas aos cursos marcados acima.
            </p>
          </div>

          <div class="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showPreRegisterModal = false"
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner"></i>
              <span>{{ saving ? 'Gerando...' : 'Criar Pré-Cadastro' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── Manage Courses Modal (Per Student) ─── -->
    <div v-if="showManageCoursesModal && managingCoursesUser" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <i class="pi pi-book text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Gerenciar Cursos do Aluno</h3>
              <p class="text-xs text-slate-500">{{ managingCoursesUser.name }} ({{ managingCoursesUser.email }})</p>
            </div>
          </div>
          <button @click="showManageCoursesModal = false; managingCoursesUser = null" class="text-slate-400 hover:text-slate-600">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Marque os cursos liberados para este aluno:
            </span>
            <div class="flex items-center gap-2 text-[11px]">
              <button type="button" @click="selectAllManagingCourses" class="text-indigo-600 font-bold hover:underline cursor-pointer">
                Marcar Todos
              </button>
              <span class="text-slate-300">·</span>
              <button type="button" @click="selectedManagingCourseIds = []" class="text-slate-500 hover:text-slate-700 cursor-pointer">
                Desmarcar
              </button>
            </div>
          </div>

          <div class="space-y-1.5 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
            <label
              v-for="course in coursesStore.courses"
              :key="course.id"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-slate-200"
              :class="selectedManagingCourseIds.includes(course.id) ? 'bg-indigo-50/50 border-indigo-200' : ''"
            >
              <input
                type="checkbox"
                :value="course.id"
                v-model="selectedManagingCourseIds"
                class="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-900 truncate">{{ course.title }}</p>
                <p class="text-[10px] text-slate-500">{{ course.category }} · {{ course.totalLessons }} aulas</p>
              </div>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded"
                :class="selectedManagingCourseIds.includes(course.id) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'"
              >
                {{ selectedManagingCourseIds.includes(course.id) ? 'Liberado' : 'Bloqueado' }}
              </span>
            </label>
          </div>

          <p class="text-xs text-slate-500">
            Total selecionado: <strong>{{ selectedManagingCourseIds.length }}</strong> de {{ coursesStore.courses.length }} cursos.
          </p>
        </div>

        <div class="flex gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="showManageCoursesModal = false; managingCoursesUser = null"
            class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleSaveStudentCourses"
            :disabled="saving"
            class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'Salvando...' : 'Salvar Matrículas' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Activation Link Sharing Modal ─── -->
    <div v-if="showActivationModal && activeActivationUser" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <i class="pi pi-verified text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900">Link de Ativação do Aluno</h3>
              <p class="text-xs text-slate-500">{{ activeActivationUser.name }} ({{ activeActivationUser.email }})</p>
            </div>
          </div>
          <button @click="showActivationModal = false; activeActivationUser = null" class="text-slate-400 hover:text-slate-600">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Link exclusivo de finalização
          </label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              readonly
              :value="getActivationLink(activeActivationUser.email)"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 select-all font-mono"
            />
            <button
              @click="copyActivationLink(activeActivationUser.email)"
              class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              :class="copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'"
            >
              <i :class="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
              <span>{{ copied ? 'Copiado!' : 'Copiar' }}</span>
            </button>
          </div>
          <p class="text-[11px] text-slate-500">
            O aluno acessa este link, confere os dados pré-cadastrados e define sua senha para acessar os cursos liberados.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            :href="getWhatsAppLink(activeActivationUser)"
            target="_blank"
            class="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <i class="pi pi-whatsapp text-sm font-bold"></i>
            <span>Enviar no WhatsApp</span>
          </a>
          <a
            :href="getEmailLink(activeActivationUser)"
            class="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <i class="pi pi-envelope text-sm"></i>
            <span>Enviar por E-mail</span>
          </a>
        </div>

        <div class="pt-2 text-right">
          <button
            @click="showActivationModal = false; activeActivationUser = null"
            class="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Create User Modal (Staff: Teachers/Admins) ─── -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <i class="pi pi-user-plus text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Novo Usuário de Equipe</h3>
              <p class="text-xs text-slate-400">Cadastre um professor, moderador ou administrador</p>
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
              placeholder="Ex: Prof. Carlos Eduardo"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
            <input
              v-model="createForm.email"
              type="email"
              required
              placeholder="carlos@cursinho.com.br"
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
                <option value="teacher">Professor</option>
                <option value="moderator">Moderador</option>
                <option value="admin">Administrador</option>
                <option value="student">Aluno</option>
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
            <label class="block text-xs font-semibold text-slate-700 mb-1">Senha de Acesso</label>
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
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner"></i>
              <span>{{ saving ? 'Cadastrando...' : 'Cadastrar Membro' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── Edit User Modal ─── -->
    <div v-if="showEditModal && editingUser" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
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
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-4 text-center animate-fade-in">
        <div class="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
          <i class="pi pi-user-minus"></i>
        </div>
        <h3 class="font-extrabold text-slate-900 text-lg">Excluir usuário?</h3>
        <p class="text-sm text-slate-500">
          <strong>{{ userToDelete.name }}</strong> perderá o acesso permanentemente à plataforma.
        </p>
        <div class="flex gap-3 pt-2">
          <button @click="userToDelete = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button @click="doDeleteUser" class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer">
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
import { useCoursesStore, getCanonicalCourseKey } from '~/stores/courses';
import type { PlatformUser, UserRole } from '~/stores/users';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Alunos & Usuários — Admin' });

const store = useUsersStore();
const coursesStore = useCoursesStore();

const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const userToDelete = ref<PlatformUser | null>(null);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showPreRegisterModal = ref(false);
const showActivationModal = ref(false);
const activeActivationUser = ref<PlatformUser | null>(null);

const showManageCoursesModal = ref(false);
const managingCoursesUser = ref<PlatformUser | null>(null);
const selectedManagingCourseIds = ref<string[]>([]);

const editingUser = ref<PlatformUser | null>(null);
const saving = ref(false);
const copied = ref(false);

const preRegForm = ref({
  name: '',
  email: '',
  phone: '',
  selectedCourseIds: [] as string[],
});

const createForm = ref({
  name: '',
  email: '',
  role: 'teacher' as UserRole,
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
  coursesStore.fetchCourses();
});

const preRegisteredCount = computed(() => 
  (store.users || []).filter((u) => u && (u.isPreRegistered || (!u.lastLoginAt && u.role === 'student'))).length
);

const filteredUsers = computed(() => {
  const users = store.users || [];
  const q = (searchQuery.value || '').trim().toLowerCase();

  return users.filter((u) => {
    if (!u) return false;
    const nameStr = (u.name || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const matchSearch = !q || nameStr.includes(q) || emailStr.includes(q);
    const matchRole = !roleFilter.value || u.role === roleFilter.value;
    
    let matchStatus = true;
    if (statusFilter.value === 'active') {
      matchStatus = Boolean(u.isActive && !u.isPreRegistered);
    } else if (statusFilter.value === 'pre_registered') {
      matchStatus = Boolean(u.isPreRegistered || (!u.lastLoginAt && u.role === 'student'));
    } else if (statusFilter.value === 'inactive') {
      matchStatus = !u.isActive;
    }

    return matchSearch && matchRole && matchStatus;
  });
});

function getUserEnrollmentsCount(user: PlatformUser) {
  if (!user || user.role !== 'student') return 0;
  const enrolledRaw = user.enrolledCourseIds || [];
  if (enrolledRaw.length === 0) {
    return user.enrollmentsCount || 0;
  }
  const matchedKeys = new Set<string>();
  const coursesList = coursesStore.courses || [];
  for (const course of coursesList) {
    const courseCanon = getCanonicalCourseKey(course);
    const isEnrolled = enrolledRaw.some((rawId) => {
      if (!rawId) return false;
      if (rawId === course.id || rawId === course.slug) return true;
      if (rawId === 'course-1' || rawId === 'c-1') return courseCanon === 'canonical-enem';
      if (rawId === 'course-2' || rawId === 'c-2') return courseCanon === 'canonical-redacao';
      if (rawId === 'course-3' || rawId === 'c-3') return courseCanon === 'canonical-medicina';
      const cObj = coursesStore.getCourseById(rawId);
      if (cObj && getCanonicalCourseKey(cObj) === courseCanon) return true;
      return false;
    });
    if (isEnrolled) {
      matchedKeys.add(courseCanon);
    }
  }
  return matchedKeys.size > 0 ? matchedKeys.size : Math.min(enrolledRaw.length, coursesList.length);
}

function openPreRegisterModal() {
  preRegForm.value = {
    name: '',
    email: '',
    phone: '',
    selectedCourseIds: coursesStore.courses.length > 0 ? [coursesStore.courses[0].id] : [],
  };
  showPreRegisterModal.value = true;
}

function selectAllPreRegCourses() {
  preRegForm.value.selectedCourseIds = coursesStore.courses.map((c) => c.id);
}

function clearPreRegCourses() {
  preRegForm.value.selectedCourseIds = [];
}

async function handlePreRegister() {
  if (!preRegForm.value.name.trim() || !preRegForm.value.email.trim()) return;
  saving.value = true;
  try {
    const createdId = await store.createUser({
      name: preRegForm.value.name.trim(),
      email: preRegForm.value.email.trim(),
      phone: preRegForm.value.phone?.trim() || undefined,
      role: 'student',
      isActive: true,
      isPreRegistration: true,
      courseIds: [...preRegForm.value.selectedCourseIds],
    });

    showPreRegisterModal.value = false;
    
    // Open the activation link dialog immediately
    const user = store.getById(createdId) || {
      id: createdId,
      name: preRegForm.value.name.trim(),
      email: preRegForm.value.email.trim(),
      phone: preRegForm.value.phone?.trim() || '',
      role: 'student' as UserRole,
      isActive: true,
      isPreRegistered: true,
      createdAt: new Date().toISOString(),
      enrolledCourseIds: [...preRegForm.value.selectedCourseIds],
      enrollmentsCount: preRegForm.value.selectedCourseIds.length,
    };
    openActivationLinkModal(user);
  } finally {
    saving.value = false;
  }
}

function openManageCoursesModal(user: PlatformUser) {
  if (!user) return;
  managingCoursesUser.value = user;
  const enrolledRaw = user.enrolledCourseIds || [];
  const matchedIds: string[] = [];
  const coursesList = coursesStore.courses || [];

  for (const course of coursesList) {
    const courseCanon = getCanonicalCourseKey(course);
    const isEnrolled = enrolledRaw.some((rawId) => {
      if (!rawId) return false;
      if (rawId === course.id || rawId === course.slug) return true;
      if (rawId === 'course-1' || rawId === 'c-1') return courseCanon === 'canonical-enem';
      if (rawId === 'course-2' || rawId === 'c-2') return courseCanon === 'canonical-redacao';
      if (rawId === 'course-3' || rawId === 'c-3') return courseCanon === 'canonical-medicina';
      const cObj = coursesStore.getCourseById(rawId);
      if (cObj && getCanonicalCourseKey(cObj) === courseCanon) return true;
      return false;
    });
    if (isEnrolled) {
      matchedIds.push(course.id);
    }
  }

  // If student has enrollments recorded or is the demo student, pre-check courses
  if (matchedIds.length === 0 && ((user.enrollmentsCount || 0) > 0 || user.email === 'aluno@cursinhoalpha.com.br')) {
    matchedIds.push(...coursesList.map((c) => c.id));
  }

  selectedManagingCourseIds.value = Array.from(new Set(matchedIds));
  showManageCoursesModal.value = true;
}

function selectAllManagingCourses() {
  selectedManagingCourseIds.value = Array.from(new Set(coursesStore.courses.map((c) => c.id)));
}

async function handleSaveStudentCourses() {
  if (!managingCoursesUser.value) return;
  saving.value = true;
  try {
    const cleanIds = Array.from(new Set(selectedManagingCourseIds.value));
    await store.updateUserCourses(managingCoursesUser.value.id, cleanIds);
    showManageCoursesModal.value = false;
    managingCoursesUser.value = null;
  } finally {
    saving.value = false;
  }
}

function getActivationLink(email: string) {
  if (process.client) {
    const origin = window.location.origin;
    return `${origin}/register?email=${encodeURIComponent(email)}`;
  }
  return `/register?email=${encodeURIComponent(email)}`;
}

function openActivationLinkModal(user: PlatformUser) {
  activeActivationUser.value = user;
  copied.value = false;
  showActivationModal.value = true;
}

async function copyActivationLink(email: string) {
  const link = getActivationLink(email);
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(link);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  }
}

function getWhatsAppLink(user: PlatformUser) {
  const link = getActivationLink(user.email);
  const cleanPhone = (user.phone || '').replace(/\D/g, '');
  const phoneParam = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
  const message = `Olá ${user.name}! Seu pré-cadastro no Cursinho foi realizado com sucesso. Para definir sua senha e começar a estudar seus cursos, acesse: ${link}`;
  return `https://wa.me/${phoneParam}?text=${encodeURIComponent(message)}`;
}

function getEmailLink(user: PlatformUser) {
  const link = getActivationLink(user.email);
  const subject = `Seu acesso ao Cursinho está liberado! Ative sua conta`;
  const body = `Olá ${user.name},\n\nSeu pré-cadastro foi criado na nossa plataforma de estudos. Para definir sua senha de acesso e liberar seus cursos, clique no link abaixo:\n\n${link}\n\nBons estudos!`;
  return `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openCreateModal() {
  createForm.value = {
    name: '',
    email: '',
    role: 'teacher',
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
    const isStudent = createForm.value.role === 'student';
    await store.createUser({
      name: createForm.value.name,
      email: createForm.value.email,
      role: createForm.value.role,
      phone: createForm.value.phone || undefined,
      password: createForm.value.password,
      isActive: createForm.value.isActive,
      isPreRegistration: isStudent,
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
