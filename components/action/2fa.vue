<template>
     <p class=" flex items-center mb-2 gap-2 text-[#B92538] font-medium text-sm opacity-70">
            <icon name="ri:information-line" size="1.2em"></icon>
            Deze wordt maar 1 keer weergegeven.
        </p>
    <p class=" font-medium text-sm md:max-w-[25vw] opacity-70">
        Beveilig je account met 2FA. En scan de QR-code met een authenticator app op je telefoon, of voer de code
        handmatig in. <span class="font-bold select-text text-base text-indigo-600">{{ Generated.Secret }}</span>
    </p>
    <div class="mt-6 mb-2" v-if="Generated">
        <NuxtImg draggable="false" class=" opacity-80 w-full border-4 rounded-lg border-black"
            :src="Generated.qrCodeDataUrl"> </NuxtImg>
    </div>
</template>

<script setup lang="ts">


const { Generated } = defineModels<{
    Generated: any, 
}>()


</script>