<template>
	<Icon name="fad:h-expand" size="2.2em" class="md:absolute md:-top-16 dark:text-white" @click="openMenu = true">
	</Icon>

	<div class="items-center hidden gap-6 font-bold md:flex dark:text-white">
		<NuxtLink class="opacity-50 hover:opacity-80" to="/portfolio">Home</NuxtLink>
		<ClientOnly>
			<NuxtLink class="opacity-50 hover:opacity-80" :to="repoLink">Projecten</NuxtLink>
			<NuxtLink class="opacity-50 hover:opacity-80" to="/about">About</NuxtLink>
			<template #fallback>
				<NuxtLink class="opacity-50 hover:opacity-80" to="/Repos">Projecten</NuxtLink>
				<NuxtLink class="opacity-50 hover:opacity-80" to="/about">About</NuxtLink>
			</template>
		</ClientOnly>
	</div>
	<Transition name="menu">
		<div v-if="openMenu" class="absolute top-0 left-0 z-10 w-full h-full p-4 pb-5 bg-black bg-opacity-20">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'"
				class="w-full md:h-full p-5 dark:bg-[#0e0e0e] bg-white rounded-3xl">
				<button @click="openMenu = false">
					<Icon class="dark:text-white" name="pajamas:close-xs" size="2.2em"></Icon>
				</button>
				<div class="grid text-[3.2em] dark:text-white font-black mt-6 leading-[1.2em]">
					<NuxtLink class="dark:opacity-60 opacity-20 hover:opacity-80" to="/portfolio">Home</NuxtLink>
					<ClientOnly>
						<NuxtLink class="dark:opacity-60 opacity-20 hover:opacity-80" :to="repoLink">Projecten
						</NuxtLink>
						<template #fallback>
							<NuxtLink to="/Repos" class="dark:opacity-60 opacity-20 hover:opacity-80">Projecten
							</NuxtLink>
						</template>
					</ClientOnly>
					<NuxtLink class="dark:opacity-60 opacity-20 hover:opacity-80" to="/about">About</NuxtLink>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
	const { $pwa } = useNuxtApp();
	const repoLink = ref();
	const openMenu = ref(false);
	const Installed = ref(false);

	const currentPage = useLocalStorage("RepoPage").value;
	repoLink.value = `/Repos?Page=${currentPage || 1}`;

	onMounted(() => {
		if ($pwa.isInstalled) {
			Installed.value = true;
		}
	});
</script>

<style scoped>
	.router-link-active {
		@apply opacity-100 dark:bg-white dark:text-neutral-900 bg-neutral-800 text-white rounded-lg p-2;
	}
</style>
