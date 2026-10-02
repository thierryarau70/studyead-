<template>
  <div class="space-y-8 max-w-4xl mx-auto pb-16">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Configurações da Plataforma</h1>
      <p class="text-sm text-slate-500">Personalize a identidade visual e dados do cursinho</p>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-6">
      <!-- Branding -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 class="font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-palette text-brand-600"></i> Identidade Visual
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nome do Cursinho</label>
            <input
              v-model="settings.siteName"
              type="text"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail de Contato</label>
            <input
              v-model="settings.contactEmail"
              type="email"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">URL do Logo</label>
            <input
              v-model="settings.logoUrl"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Cor Primária da Plataforma</label>
            <div class="flex items-center gap-3">
              <input
                v-model="settings.primaryColor"
                type="color"
                class="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer bg-slate-50"
              />
              <input
                v-model="settings.primaryColor"
                type="text"
                class="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 class="font-bold text-slate-800 flex items-center gap-2">
          <i class="pi pi-share-alt text-brand-600"></i> Redes Sociais
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
            <input
              v-model="settings.instagram"
              type="url"
              placeholder="https://instagram.com/..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">YouTube</label>
            <input
              v-model="settings.youtube"
              type="url"
              placeholder="https://youtube.com/..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
            <input
              v-model="settings.whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">TikTok</label>
            <input
              v-model="settings.tiktok"
              type="url"
              placeholder="https://tiktok.com/@..."
              class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </div>
        </div>
      </div>

      <!-- Success banner -->
      <div v-if="saved" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
        <i class="pi pi-check-circle text-emerald-600"></i>
        Configurações salvas com sucesso!
      </div>

      <!-- Action -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner"></i>
          <span>{{ saving ? 'Salvando...' : 'Salvar Configurações' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'admin',
});

useHead({
  title: 'Configurações — Admin',
});

const saving = ref(false);
const saved = ref(false);

const settings = ref({
  siteName: 'Cursinho Alpha',
  contactEmail: 'contato@cursinhoalpha.com.br',
  logoUrl: '',
  primaryColor: '#2563EB',
  instagram: '',
  youtube: '',
  whatsapp: '',
  tiktok: '',
});

const saveSettings = async () => {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 800));
  saving.value = false;
  saved.value = true;
  setTimeout(() => (saved.value = false), 3000);
};
</script>
