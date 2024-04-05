<template>
	<NuxtPage />
</template>

<style>
	.page-enter-active,
	.page-leave-active {
		@apply transition-opacity delay-200 md:delay-0 duration-500 md:duration-0 ease-in-out;
	}
	.page-enter-from,
	.page-leave-to {
		@apply opacity-0 md:opacity-100;
	}
</style>
