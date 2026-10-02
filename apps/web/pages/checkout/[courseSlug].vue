<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Breadcrumb / Back -->
      <NuxtLink to="/student/courses" class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors">
        <i class="pi pi-arrow-left"></i> Voltar ao Catálogo
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Course Summary -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <i class="pi pi-shopping-bag text-brand-600"></i> Resumo do Pedido de Matrícula
            </h2>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                :src="course.thumbnailUrl"
                :alt="course.title"
                class="w-full sm:w-28 aspect-video rounded-xl object-cover bg-slate-900 flex-shrink-0"
              />
              <div class="space-y-1">
                <span class="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-brand-50 text-brand-700">
                  {{ course.category }}
                </span>
                <h3 class="text-base font-extrabold text-slate-900 line-clamp-1">{{ course.title }}</h3>
                <p class="text-xs text-slate-500">Acesso vitalício + Certificado Incluso</p>
              </div>
            </div>

            <!-- Coupon Input -->
            <div class="space-y-2 pt-2">
              <label class="block text-xs font-semibold text-slate-700">Cupom de Desconto</label>
              <div class="flex gap-2">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Ex: PROMO50 ou ALPHA10"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 uppercase bg-slate-50/50 font-mono"
                />
                <button
                  type="button"
                  @click="applyCoupon"
                  class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Aplicar
                </button>
              </div>
              <p v-if="couponSuccess" class="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <i class="pi pi-check"></i> {{ couponSuccess }}
              </p>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-3 pt-4 border-t border-slate-100">
              <label class="block text-xs font-semibold text-slate-700">Forma de Pagamento</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="paymentMethod = 'pix'"
                  :class="[
                    'p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-3',
                    paymentMethod === 'pix' ? 'border-brand-600 bg-brand-50/40 text-brand-900 ring-2 ring-brand-500' : 'border-slate-200 bg-white text-slate-700'
                  ]"
                >
                  <i class="pi pi-qrcode text-lg text-emerald-600"></i>
                  <div>
                    <span class="block text-sm font-extrabold">PIX</span>
                    <span class="text-[10px] text-slate-500 font-normal">Aprovação Instantânea</span>
                  </div>
                </button>

                <button
                  type="button"
                  @click="paymentMethod = 'card'"
                  :class="[
                    'p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-3',
                    paymentMethod === 'card' ? 'border-brand-600 bg-brand-50/40 text-brand-900 ring-2 ring-brand-500' : 'border-slate-200 bg-white text-slate-700'
                  ]"
                >
                  <i class="pi pi-credit-card text-lg text-brand-600"></i>
                  <div>
                    <span class="block text-sm font-extrabold">Cartão de Crédito</span>
                    <span class="text-[10px] text-slate-500 font-normal">Até 12x sem juros</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Order Total Card -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 class="text-base font-extrabold text-slate-900">Total do Pedido</h3>

            <div class="space-y-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div class="flex justify-between">
                <span>Valor Original:</span>
                <span>R$ {{ (course.priceCents / 100).toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="discountCents > 0" class="flex justify-between text-emerald-600 font-bold">
                <span>Desconto Aplicado:</span>
                <span>- R$ {{ (discountCents / 100).toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>

            <div class="flex justify-between items-baseline">
              <span class="text-sm font-extrabold text-slate-900">Total Final:</span>
              <span class="text-3xl font-black text-brand-600">
                R$ {{ (finalPriceCents / 100).toFixed(2).replace('.', ',') }}
              </span>
            </div>

            <button
              @click="handleCheckout"
              :disabled="loading"
              class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ loading ? 'Processando Matrícula...' : 'Concluir Matrícula Instantânea' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const couponCode = ref('');
const couponSuccess = ref('');
const discountCents = ref(0);
const paymentMethod = ref('pix');
const loading = ref(false);

const course = ref({
  title: 'Preparatório Extensivo ENEM 2027 completo',
  category: 'ENEM',
  priceCents: 29900,
  thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=60'
});

const finalPriceCents = computed(() => {
  return Math.max(0, course.value.priceCents - discountCents.value);
});

const applyCoupon = () => {
  if (couponCode.value.toUpperCase() === 'PROMO50') {
    discountCents.value = 5000;
    couponSuccess.value = 'Cupom PROMO50 aplicado! Desconto de R$ 50,00';
  } else if (couponCode.value.toUpperCase() === 'ALPHA10') {
    discountCents.value = 2990;
    couponSuccess.value = 'Cupom ALPHA10 aplicado! 10% de Desconto';
  } else {
    couponSuccess.value = 'Cupom inválido ou expirado.';
    discountCents.value = 0;
  }
};

const handleCheckout = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push('/student/courses/preparatorio-enem-2027');
  }, 1000);
};
</script>
