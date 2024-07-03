<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 select-none md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="flex items-center justify-center w-full md:h-full p-5 md:rounded-none rounded-3xl bg-gradient-to-r from-teal-50 to-yellow-50 dark:from-[#131313] dark:to-[#22221E] overflow-auto">
				<div class="md:w-[60%]">
					<h1 class="text-[4.8em] md:text-[6em] font-black leading-[0.9em] mb-2 dark:text-white">Even wachten</h1>
					<p v-if="!message.statusCode" class="mt-4 dark:text-white text-base md:text-lg md:w-[65%]">{{ message }}</p>
					<p v-else class="mt-4 text-base font-semibold text-[#B92538] md:text-lg md:w-[65%]">{{ message.message }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const { $pwa, $PusherOnStart } = useNuxtApp();
	const message = ref("");
	const loading = ref(false);
	const Installed = ref(false);

	message.value = "We zijn nu even de connectie aan het maken heb geduld. Je wordt zo door gestuurd naar de juiste pagina";
	const { code, installation_id } = useRoute().query;
	if (!code || !installation_id) navigateTo("/");

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
	});

	const handleInstall = () => {
		loading.value = true;
		message.value = "We zijn nu even de connectie aan het maken heb geduld. Je wordt zo door gestuurd naar de juiste pagina";
		setTimeout(async () => {
			loading.value = false;
			const { error } = await useCsrfFetch(`/api/repo/auth/${code}/${installation_id}`, { method: "POST" });

			if (error.value)
				return (message.value = {
					statusCode: error.value.data.statusCode,
					statusMessage: error.value.data.statusMessage,
					message: error.value.data.message,
				});

			setTimeout(() => {
				message.value = "Je wordt nu door gestuurd naar de juiste pagina";
			}, 3000);

			setTimeout(() => {
				navigateTo("/dashboard/Repos");
			}, 4000);
		}, 3000);
	};

	if (document) {
		handleInstall();
	}
</script>
