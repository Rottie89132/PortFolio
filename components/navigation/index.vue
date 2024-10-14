<template>
    <div class=" z-20">
        <NavigationLinksAdmin v-if="data?.statusCode == 200 && data.authorized" />
        <NavigationLinksUser v-else-if="data?.statusCode == 200 && !data.authorized" />
        <NavigationLinks v-else />
    </div>
</template>

<script setup lang="ts">

defineProps({
    data: {
        type: Object,
        required: true
    }
})


</script>