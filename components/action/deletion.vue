<template>
	<p class="font-medium text-sm opacity-70 mb-8">Account verwijderen. Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</p>
	<button @click="AccountDeletion" :disabled="loading" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
		<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
		<p v-else>Verwijderen</p>
	</button>
</template>

<script setup lang="ts">
	const { $csrfFetch }: any = useNuxtApp();
	const loading = ref(false);
	const { status, DelayStatus } = defineModels<{
		status: Boolean;
		DelayStatus: Boolean;
	}>();

	const closeModal = () => {
		DelayStatus.value = false;
		setTimeout(() => {
			status.value = false;
		}, 100);
	};

	const AccountDeletion = async () => {
		loading.value = true;
		await $csrfFetch("/api/register", { method: "delete" });
		setTimeout(() => {
			loading.value = false;
			closeModal();
			setTimeout(() => navigateTo("/"), 1000);
		}, 500);
	};
</script>
