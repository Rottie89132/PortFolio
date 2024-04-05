<template>
	<NuxtPage />
</template>

<style>
	.page-enter-active,
	.page-leave-active {
		@apply transition-opacity duration-500 md:duration-0;
	}
	.page-enter-from,
	.page-leave-to {
		@apply opacity-0 md:opacity-100;
	}
</style>
