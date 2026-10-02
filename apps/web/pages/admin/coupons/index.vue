<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Cupons de Desconto</h1>
        <p class="text-sm text-slate-500">Crie, edite e gerencie cupons promocionais da plataforma</p>
      </div>
      <button
        @click="showCreateForm = !showCreateForm"
        class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <i class="pi pi-plus"></i>
        <span>Novo Cupom</span>
      </button>
    </div>

    <!-- Create Form (collapsible) -->
    <div v-if="showCreateForm" class="bg-white rounded-3xl border border-brand-200 p-6 shadow-sm space-y-4">
      <h3 class="font-extrabold text-slate-800">Criar Novo Cupom</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Código do Cupom *</label>
          <input
            v-model="newCoupon.code"
            type="text"
            placeholder="Ex: PROMO50"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50 uppercase"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo de Desconto</label>
          <select
            v-model="newCoupon.type"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          >
            <option value="percentage">Percentual (%)</option>
            <option value="fixed">Valor Fixo (R$)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Valor do Desconto *</label>
          <input
            v-model="newCoupon.value"
            type="number"
            placeholder="Ex: 50"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button
          @click="createCoupon"
          class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Salvar Cupom
        </button>
        <button
          @click="showCreateForm = false"
          class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Coupons Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Código</th>
              <th class="p-4">Desconto</th>
              <th class="p-4">Usos</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4">
                <span class="font-extrabold text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded-lg text-sm tracking-widest">
                  {{ coupon.code }}
                </span>
              </td>
              <td class="p-4 font-bold text-brand-600">
                {{ coupon.type === 'percentage' ? `${coupon.value}% OFF` : `R$ ${coupon.value} OFF` }}
              </td>
              <td class="p-4 text-xs text-slate-600">{{ coupon.usesCount }} / {{ coupon.maxUses || '∞' }}</td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-md text-[11px] font-bold',
                    coupon.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  ]"
                >
                  {{ coupon.isActive ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditCoupon(coupon)"
                    class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs cursor-pointer"
                    title="Editar Cupom"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="toggleActiveCoupon(coupon)"
                    class="p-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors text-xs cursor-pointer"
                    :title="coupon.isActive ? 'Desativar' : 'Ativar'"
                  >
                    <i :class="['pi', coupon.isActive ? 'pi-eye-slash' : 'pi-check']"></i>
                  </button>
                  <button
                    @click="deleteCoupon(coupon.id)"
                    class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs cursor-pointer"
                    title="Excluir"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="coupons.length === 0" class="text-center py-12">
        <i class="pi pi-ticket text-4xl text-slate-200"></i>
        <p class="mt-2 text-slate-400 font-semibold text-sm">Nenhum cupom cadastrado</p>
      </div>
    </div>

    <!-- Edit Coupon Modal -->
    <div v-if="editingCoupon" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-extrabold text-slate-900 text-lg">Editar Cupom</h3>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Código *</label>
          <input v-model="editCouponForm.code" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50 uppercase font-mono font-bold" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
            <select v-model="editCouponForm.type" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50">
              <option value="percentage">Percentual (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Valor</label>
            <input v-model.number="editCouponForm.value" type="number" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 bg-slate-50" />
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer pt-1">
          <input type="checkbox" v-model="editCouponForm.isActive" class="rounded text-brand-600" />
          <span class="text-xs font-semibold text-slate-700">Cupom Ativo</span>
        </label>
        <div class="flex gap-3 pt-2">
          <button @click="editingCoupon = null" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">Cancelar</button>
          <button @click="saveEditCoupon" class="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

definePageMeta({ layout: 'admin' });
useHead({ title: 'Cupons de Desconto — Admin' });

const STORAGE_KEY = 'studyead_admin_coupons';

const defaultCoupons = [
  { id: 'c-1', code: 'PROMO50', type: 'percentage', value: 50, usesCount: 23, maxUses: 100, isActive: true },
  { id: 'c-2', code: 'BLACKFRIDAY30', type: 'percentage', value: 30, usesCount: 87, maxUses: null, isActive: true },
  { id: 'c-3', code: 'DESCONTO100', type: 'fixed', value: 100, usesCount: 5, maxUses: 20, isActive: false },
];

function loadCoupons() {
  if (process.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return defaultCoupons;
}

const coupons = ref<any[]>(loadCoupons());

if (process.client) {
  watch(
    coupons,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
      } catch {}
    },
    { deep: true },
  );
}

const showCreateForm = ref(false);
const newCoupon = ref({ code: '', type: 'percentage', value: '' });

const editingCoupon = ref<any | null>(null);
const editCouponForm = ref({ code: '', type: 'percentage', value: 0, isActive: true });

const createCoupon = () => {
  if (!newCoupon.value.code || !newCoupon.value.value) return;
  coupons.value.unshift({
    id: `c-${Date.now()}`,
    code: newCoupon.value.code.toUpperCase().trim(),
    type: newCoupon.value.type,
    value: Number(newCoupon.value.value),
    usesCount: 0,
    maxUses: null,
    isActive: true,
  });
  newCoupon.value = { code: '', type: 'percentage', value: '' };
  showCreateForm.value = false;
};

const openEditCoupon = (coupon: any) => {
  editingCoupon.value = coupon;
  editCouponForm.value = {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    isActive: coupon.isActive,
  };
};

const saveEditCoupon = () => {
  if (!editingCoupon.value || !editCouponForm.value.code.trim()) return;
  const idx = coupons.value.findIndex((c) => c.id === editingCoupon.value.id);
  if (idx !== -1) {
    coupons.value[idx] = {
      ...coupons.value[idx],
      code: editCouponForm.value.code.toUpperCase().trim(),
      type: editCouponForm.value.type,
      value: Number(editCouponForm.value.value),
      isActive: editCouponForm.value.isActive,
    };
  }
  editingCoupon.value = null;
};

const toggleActiveCoupon = (coupon: any) => {
  coupon.isActive = !coupon.isActive;
};

const deleteCoupon = (id: string) => {
  if (confirm('Deseja excluir este cupom permanentemente?')) {
    coupons.value = coupons.value.filter((c) => c.id !== id);
  }
};
</script>
