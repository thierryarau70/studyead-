import { useNuxtApp } from '#app';

export function useApi() {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$api;
}
