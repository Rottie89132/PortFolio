<template>
    <p class=" font-medium text-sm opacity-70">
        Bevelig je account met 2FA. En scan de QR-code met een authenticator app op je telefoon, of voer de code
        handmatig in. <span class="font-bold select-text text-base text-indigo-600">{{ Generated.Secret }}</span>
    </p>
    <div class="my-6" v-if="Generated">
        <NuxtImg draggable="false" class=" opacity-80 w-full border-4 rounded-lg border-black"
            :src="Generated.qrCodeDataUrl"> </NuxtImg>
    </div>
    <p class=" flex items-center gap-2 text-[#B92538] font-medium text-sm opacity-70">
        <icon name="ri:information-line" size="1.2em"></icon>
        Deze wordt maar 1 keer weergegeven.
    </p>
</template>

<script setup lang="ts">


const { Generated } = defineModels<{
    Generated: any, 
}>()


</script>