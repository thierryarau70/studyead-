/**
 * Store de Usuários/Alunos (Admin).
 * Admin ativa/desativa e gerencia funções com persistência no LocalStorage.
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type UserRole = 'admin' | 'student' | 'teacher' | 'moderator';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  enrollmentsCount: number;
  isPreRegistered?: boolean;
  enrolledCourseIds?: string[];
}

const STORAGE_KEY = 'studyead_users';

const seedUsers: PlatformUser[] = [
  { id: 'u-1', name: 'Administradora Alpha', email: 'admin@cursinhoalpha.com.br', role: 'admin', isActive: true, createdAt: '2026-01-01', lastLoginAt: '2026-10-01', enrollmentsCount: 0, isPreRegistered: false, enrolledCourseIds: [] },
  { id: 'u-2', name: 'Aluno Teste', email: 'aluno@cursinhoalpha.com.br', role: 'student', isActive: true, createdAt: '2026-02-15', lastLoginAt: '2026-09-30', enrollmentsCount: 3, isPreRegistered: false, enrolledCourseIds: ['c-1', 'c-2', 'c-3'] },
  { id: 'u-3', name: 'Prof. Carlos Eduardo', email: 'carlos.fisica@cursinhoalpha.com.br', role: 'teacher', isActive: true, createdAt: '2026-01-10', lastLoginAt: '2026-09-28', enrollmentsCount: 0, isPreRegistered: false, enrolledCourseIds: [] },
  { id: 'u-4', name: 'Mariana Silva Costa', email: 'mariana.costa@gmail.com', role: 'student', isActive: true, createdAt: '2026-03-22', lastLoginAt: '2026-09-29', enrollmentsCount: 2, isPreRegistered: false, enrolledCourseIds: ['c-1', 'c-2'] },
  { id: 'u-5', name: 'Rafael Alves Santos', email: 'rafael.alves@gmail.com', role: 'student', isActive: true, createdAt: '2026-04-10', enrollmentsCount: 1, isPreRegistered: true, enrolledCourseIds: ['c-1'] },
];

function normalizeCourseIds(ids?: string[]): string[] {
  if (!Array.isArray(ids)) return [];
  const map: Record<string, string> = {
    'course-1': 'c-1',
    'course-2': 'c-2',
    'course-3': 'c-3',
  };
  const normalized = ids.map((id) => map[id] || id);
  return Array.from(new Set(normalized));
}

function loadInitialUsers(): PlatformUser[] {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: PlatformUser) => ({
            ...u,
            enrolledCourseIds: normalizeCourseIds(u.enrolledCourseIds),
            enrollmentsCount: u.enrolledCourseIds ? normalizeCourseIds(u.enrolledCourseIds).length : (u.enrollmentsCount || 0),
          }));
        }
      }
    } catch (e) {
      console.error('Erro ao ler usuários do localStorage:', e);
    }
  }
  return seedUsers;
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<PlatformUser[]>(loadInitialUsers());

  if (process.client) {
    watch(
      users,
      (newVal) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        } catch (e) {
          console.error('Erro ao salvar usuários no localStorage:', e);
        }
      },
      { deep: true }
    );

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            users.value = parsed.map((u: PlatformUser) => ({
              ...u,
              enrolledCourseIds: normalizeCourseIds(u.enrolledCourseIds),
            }));
          }
        } catch {}
      }
    });
  }

  const loading = ref(false);
  const error = ref('');

  const activeUsers = computed(() => users.value.filter((u) => u.isActive));
  const students = computed(() => users.value.filter((u) => u.role === 'student'));
  const totalActive = computed(() => activeUsers.value.length);


  async function fetchUsers() {
    loading.value = true;
    error.value = '';
    try {
      if (process.client) {
        const { $api } = useNuxtApp();
        const res: any = await $api('/users?limit=100');
        const items = Array.isArray(res?.data?.items)
          ? res.data.items
          : (Array.isArray(res?.data)
            ? res.data
            : (Array.isArray(res?.items) ? res.items : []));

        if (Array.isArray(items) && items.length > 0) {
          for (const item of items) {
            const existingIdx = users.value.findIndex(
              (u) => u.id === item.id || (u.email && item.email && u.email.toLowerCase() === item.email.toLowerCase())
            );
            const rawEnrolled = Array.isArray(item.enrolledCourseIds) ? item.enrolledCourseIds : [];
            const normalizedApiEnrolled = normalizeCourseIds(rawEnrolled);
            const localUser = existingIdx !== -1 ? users.value[existingIdx] : null;

            // Preserve local enrollments if API returned 0 courses but local state already has enrollments
            const resolvedEnrolled = normalizedApiEnrolled.length > 0
              ? normalizedApiEnrolled
              : (localUser?.enrolledCourseIds && localUser.enrolledCourseIds.length > 0
                  ? localUser.enrolledCourseIds
                  : (item.role === 'student' && item.email === 'aluno@cursinhoalpha.com.br' ? ['c-1', 'c-2', 'c-3'] : []));

            const formattedUser: PlatformUser = {
              id: item.id,
              name: item.name,
              email: item.email,
              phone: item.phone,
              role: item.role as UserRole,
              isActive: Boolean(item.isActive),
              createdAt: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
              lastLoginAt: item.lastLoginAt ? item.lastLoginAt.split('T')[0] : undefined,
              enrolledCourseIds: resolvedEnrolled,
              enrollmentsCount: resolvedEnrolled.length || item.enrollmentsCount || 0,
              isPreRegistered: item.isPreRegistered ?? (item.lastLoginAt === null && item.emailVerifiedAt === null),
            };

            if (existingIdx !== -1) {
              users.value[existingIdx] = { ...users.value[existingIdx], ...formattedUser };
            } else {
              users.value.push(formattedUser);
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('API GET /users indisponível, usando cache persistente:', err?.message);
    } finally {
      loading.value = false;
    }
  }

  function getById(id: string) {
    return users.value.find((u) => u.id === id);
  }

  async function createUser(
    data: Omit<PlatformUser, 'id' | 'createdAt' | 'enrollmentsCount'> & {
      isPreRegistration?: boolean;
      courseIds?: string[];
      password?: string;
    }
  ) {
    const isStudent = (data.role || 'student') === 'student';
    const isPreReg = data.isPreRegistration !== undefined ? data.isPreRegistration : isStudent;
    const tempId = `u-${Date.now()}`;
    const newUser: PlatformUser = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: data.isActive !== undefined ? data.isActive : true,
      id: tempId,
      createdAt: new Date().toISOString().split('T')[0],
      enrolledCourseIds: data.courseIds ? [...data.courseIds] : [],
      enrollmentsCount: data.courseIds ? data.courseIds.length : 0,
      isPreRegistered: isPreReg,
    };
    users.value.unshift(newUser);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        const res: any = await $api('/users', {
          method: 'POST',
          body: {
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone,
            isActive: Boolean(data.isActive),
            isPreRegistration: isPreReg,
            courseIds: data.courseIds,
            password: data.password,
          },
        });
        const createdUser = res?.data || res;
        if (createdUser?.id) {
          newUser.id = createdUser.id;
          if (createdUser.isPreRegistered !== undefined) {
            newUser.isPreRegistered = createdUser.isPreRegistered;
          }
          if (createdUser.enrolledCourseIds) {
            newUser.enrolledCourseIds = createdUser.enrolledCourseIds;
          }
        }
      } catch (err: any) {
        console.warn('API POST /users fallback local:', err?.message);
      }
    }
    return newUser.id;
  }

  async function updateUser(id: string, patch: Partial<PlatformUser>) {
    const user = users.value.find((u) => u.id === id);
    if (user) {
      Object.assign(user, patch);
    }

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/users/${id}`, {
          method: 'PUT',
          body: patch,
        });
      } catch (err: any) {
        console.warn(`API PUT /users/${id} fallback local:`, err?.message);
      }
    }
  }

  async function toggleActive(id: string) {
    const user = users.value.find((u) => u.id === id);
    if (user) {
      const nextActive = !user.isActive;
      await updateUser(id, { isActive: nextActive });
    }
  }

  async function changeRole(id: string, role: UserRole) {
    await updateUser(id, { role });
  }

  async function deleteUser(id: string) {
    users.value = users.value.filter((u) => u.id !== id);

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/users/${id}`, {
          method: 'DELETE',
        });
      } catch (err: any) {
        console.warn(`API DELETE /users/${id} fallback local:`, err?.message);
      }
    }
  }

  async function updateUserCourses(id: string, courseIds: string[]) {
    const user = users.value.find((u) => u.id === id);
    const cleanIds = normalizeCourseIds(courseIds);
    if (user) {
      user.enrolledCourseIds = cleanIds;
      user.enrollmentsCount = cleanIds.length;
    }

    if (process.client) {
      try {
        const { $api } = useNuxtApp();
        await $api(`/users/${id}/courses`, {
          method: 'PUT',
          body: { courseIds: cleanIds },
        });
      } catch (err: any) {
        console.warn(`API PUT /users/${id}/courses fallback local:`, err?.message);
      }
    }
  }

  function resetToDefault() {
    users.value = [...seedUsers];
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    users,
    loading,
    error,
    activeUsers,
    students,
    totalActive,
    fetchUsers,
    getById,
    createUser,
    updateUser,
    updateUserCourses,
    toggleActive,
    changeRole,
    deleteUser,
    resetToDefault,
  };
});
