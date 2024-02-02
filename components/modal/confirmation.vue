<template>
    <ClientOnly>
        <Transition name="modal">
            <div v-if="status" class="fixed top-0 z-10 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
                <div tabindex="0" class="mx-6 mb-[8%] md:mb-0 outline-none rounded-xl" ref="modal">
                    <Transition name="modalDelay">
                        <div v-if="DelayStatus" ref="modalDelay">
                            <div class="p-4 bg-white md:max-w-[30vw] rounded-xl ">
                                <div class="flex items-center gap-2 ">
                                    <h1 class="text-xl font-bold mb-1 ">{{ texthead }}</h1>
                                </div>
                                <NuxtImg draggable="false" src="/Trash.svg" class="w-full my-2 bg-gray-100 rounded-2xl h-48 mb-5" />
                                <p class=" font-medium opacity-70 mb-5 leading-[1.2em] xl:text-lg xl:leading-5">{{ textbase }}</p>
                                <slot></slot>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </ClientOnly>
</template>


<script setup lang="ts">

const { texthead, textbase, status, DelayStatus  } = defineModels<{
    texthead: String, textbase: String, status: Boolean, DelayStatus: Boolean,
}>()

const modal = ref(null)
const modalDelay = ref(null)

onClickOutside(modal, () => { closeModal() })
const closeModal = () => {
    DelayStatus.value = false;
    setTimeout(() => { status.value = false }, 100)
}



</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: all 0.8s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modalDelay-enter-active,
.modalDelay-leave-active {
    transition: all 1s ease;
}

.modalDelay-enter-from,
.modalDelay-leave-to {
    opacity: 0;
    transform: translateY(12em);
}

</style>
