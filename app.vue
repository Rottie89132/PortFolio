<template>
	<NuxtPage />
</template>

<style>
	.page-enter-active,
	.page-leave-active {
		@apply transition-opacity;
	}
	.page-enter-from,
	.page-leave-to {
		@apply duration-300 md:duration-0 opacity-0 md:opacity-100;
	}
</style>
