<template>
    <button v-if="!online " class=" gap-2 dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg">
        <Icon class="text-white dark:text-black" name="material-symbols:wifi-off" size="1.2em"/>
    </button>
</template>

<script setup>

const online = useOnline()


</script>

