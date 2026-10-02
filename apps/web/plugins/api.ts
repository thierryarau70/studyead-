import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      // Build headers as a plain object so we can safely extend them
      const headers: Record<string, string> = {};

      // Carry over any existing headers
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value, key) => {
            headers[key] = value;
          });
        } else if (Array.isArray(options.headers)) {
          for (const [key, value] of options.headers) {
            headers[key] = value;
          }
        } else {
          Object.assign(headers, options.headers);
        }
      }

      // Attach Authorization Bearer token if user is logged in (and not a fallback token)
      const token = authStore.token;
      if (token && !token.startsWith('seed-')) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Attach tenant id header
      const tenantId = authStore.tenantId;
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      options.headers = headers;
    },
    onResponseError({ response }) {
      if (response.status === 401 && authStore.token) {
        // Only force logout if using a real expired JWT, not on fallback token
        if (!authStore.token.startsWith('seed-')) {
          authStore.logout();
          navigateTo('/login');
        }
      }
    },
  });

  return {
    provide: {
      api: apiFetch,
    },
  };
});
