<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-16">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Vendas & Pedidos</h1>
      <p class="text-sm text-slate-500">Histórico de transações e pagamentos recebidos</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Faturamento Total</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i class="pi pi-dollar text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">R$ 48.900</p>
        <p class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <i class="pi pi-arrow-up-right text-[10px]"></i> +24% vs mês anterior
        </p>
      </div>
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Pedidos no Mês</span>
          <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <i class="pi pi-shopping-cart text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">164</p>
        <p class="text-xs text-slate-400">Últimos 30 dias</p>
      </div>
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-slate-500">
          <span class="text-xs font-semibold uppercase tracking-wider">Ticket Médio</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <i class="pi pi-chart-line text-sm"></i>
          </div>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">R$ 298</p>
        <p class="text-xs text-slate-400">Por pedido aprovado</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 class="font-bold text-slate-900">Pedidos Recentes</h2>
        <div class="relative">
          <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar pedido..."
            class="pl-8 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Aluno</th>
              <th class="p-4">Curso</th>
              <th class="p-4">Valor</th>
              <th class="p-4">Método</th>
              <th class="p-4">Status</th>
              <th class="p-4">Data</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="p-4 font-semibold text-slate-900">{{ order.studentName }}</td>
              <td class="p-4 text-xs text-slate-600">{{ order.courseName }}</td>
              <td class="p-4 font-bold text-slate-900">R$ {{ order.valueCents }}</td>
              <td class="p-4 text-xs text-slate-500">{{ order.method }}</td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-md text-[11px] font-bold',
                    order.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  ]"
                >
                  {{ order.status === 'paid' ? 'Pago' : order.status === 'pending' ? 'Pendente' : 'Cancelado' }}
                </span>
              </td>
              <td class="p-4 text-xs text-slate-400">{{ order.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'admin',
});

useHead({
  title: 'Vendas & Pedidos — Admin',
});

const searchQuery = ref('');

const orders = ref([
  { id: 'o-1', studentName: 'Mariana Costa', courseName: 'Extensivo ENEM 2027', valueCents: '299,00', method: 'Cartão de Crédito', status: 'paid', date: '01/10/2026' },
  { id: 'o-2', studentName: 'Gabriel Souza', courseName: 'Física Intensiva Medicina', valueCents: '199,00', method: 'PIX', status: 'paid', date: '01/10/2026' },
  { id: 'o-3', studentName: 'Larissa Mendes', courseName: 'Laboratório de Redação', valueCents: '149,00', method: 'Boleto', status: 'pending', date: '30/09/2026' },
  { id: 'o-4', studentName: 'Rafael Alves', courseName: 'Extensivo ENEM 2027', valueCents: '299,00', method: 'PIX', status: 'paid', date: '29/09/2026' },
]);

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value;
  return orders.value.filter(
    (o) =>
      o.studentName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.courseName.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
</script>
