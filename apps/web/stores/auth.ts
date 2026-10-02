import { defineStore } from 'pinia';
import { UserRole } from '@studyead/shared-types';
import type { User, AuthUserResponse } from '@studyead/shared-types';
import type { LoginInput, RegisterInput } from '@studyead/validators';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: (typeof window !== 'undefined' && localStorage.getItem('study_user')
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem('study_user')!);
          } catch {
            return null;
          }
        })()
      : null) as (Omit<User, 'passwordHash'> & { enrolledCourseIds?: string[] }) | null,
    token: (typeof window !== 'undefined' ? localStorage.getItem('study_token') : null) as string | null,
    tenantId: '00000000-0000-0000-0000-000000000001',
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === UserRole.ADMIN || state.user?.role === UserRole.SUPER_ADMIN,
    isStudent: (state) => state.user?.role === UserRole.STUDENT,
    canAccessAllCourses: (state) =>
      state.user?.role === UserRole.ADMIN ||
      state.user?.role === UserRole.SUPER_ADMIN ||
      (state.user?.role as any) === 'teacher',
    enrolledCourseIds: (state) => state.user?.enrolledCourseIds || [],
  },

  actions: {
    setAuth(authData: AuthUserResponse & { user?: { enrolledCourseIds?: string[] } }) {
      this.user = authData.user as any;
      this.token = authData.tokens.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('study_token', authData.tokens.accessToken);
        if (authData.user) {
          localStorage.setItem('study_user', JSON.stringify(authData.user));
        }
      }
    },

    async login(input: LoginInput) {
      const { $api } = useNuxtApp();
      this.loading = true;
      try {
        const response: any = await $api('/auth/login', {
          method: 'POST',
          body: input,
        });

        const authData: AuthUserResponse = response.data || response;
        this.setAuth(authData);
        return authData;
      } finally {
        this.loading = false;
      }
    },

    async register(input: RegisterInput) {
      const { $api } = useNuxtApp();
      this.loading = true;
      try {
        const response: any = await $api('/auth/register', {
          method: 'POST',
          body: input,
        });

        const authData: AuthUserResponse = response.data || response;
        this.setAuth(authData);
        return authData;
      } finally {
        this.loading = false;
      }
    },

    async checkPreRegistration(email: string) {
      if (!email || !email.includes('@')) return null;
      const { $api } = useNuxtApp();
      try {
        const response: any = await $api(`/auth/check-pre-registration?email=${encodeURIComponent(email)}`);
        return response?.data || response;
      } catch {
        return null;
      }
    },

    async fetchMe() {
      if (!this.token) return null;
      const { $api } = useNuxtApp();
      try {
        const response: any = await $api('/auth/me');
        this.user = response.data || response;
        if (typeof window !== 'undefined' && this.user) {
          localStorage.setItem('study_user', JSON.stringify(this.user));
        }
        return this.user;
      } catch {
        this.logout();
        return null;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('study_token');
        localStorage.removeItem('study_user');
      }
    },
  },
});
