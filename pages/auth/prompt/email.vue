<template>
	<VitePwaManifest />
	<div class="fixed left-0 w-full h-full landscape">
		<div class="flex items-center justify-center h-full w-full">
			<div class="flex flex-col items-center gap-4">
				<h1 class="text-4xl font-bold dark:text-white">Authenticating</h1>
				<p class="dark:text-white">We zijn nu je account aan het verifiëren.</p>
				<div class="w-full overflow-hidden bg-gray-300 rounded-md">
					<div class="h-4 animate-progress bg-indigo-500"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const { $pwa, $csrfFetch, $PusherOnStart } = useNuxtApp();
	const id = useRoute().query.token;

	onMounted(async () => {
		$PusherOnStart();

		await $csrfFetch("/api/register/verification", { method: "post", body: { token: id } })
			.then(() => navigateTo("/profile"))
			.catch(() => {
				throw createError({
					statusCode: 410,
					message: "The requested resource is no longer available",
					statusMessage: "Deze link is niet geldig of is verlopen.",
					fatal: true,
				});
		});
	});
</script>

<style scoped>
	.animate-progress {
		width: 100%;
		animation: progress 2s linear infinite;
	}

	@keyframes progress {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(100%);
		}
	}
</style>
