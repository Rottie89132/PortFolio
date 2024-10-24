<template>
	<div class="absolute overflow-hidden -top-8 w-full left-0 h-2 dark:bg-neutral-800 bg-neutral-300 rounded-md">
		<div class="h-full dark:bg-white bg-black transition-transform duration-200" :style="{ width: Width + '%' }"></div>
	</div>
</template>

<script setup lang="ts">

    defineProps<{Width: number;}>();	
    
</script>
