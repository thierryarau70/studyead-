import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      options.headers = options.headers || {};

      // Attach Authorization Bearer token if user is logged in
      if (authStore.token) {
        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${authStore.token}`;
      }

      // Attach tenant id header
      if (authStore.tenantId) {
        (options.headers as Record<string, string>)['x-tenant-id'] = authStore.tenantId;
      }
    },
    onResponseError({ response }) {
      if (response.status === 401 && authStore.token) {
        // Token expired or invalid
        authStore.logout();
        navigateTo('/login');
      }
    },
  });

  return {
    provide: {
      api: apiFetch,
    },
  };
});
