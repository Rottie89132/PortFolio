<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0 select-none">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
				<div class="w-full h-full md:h-fit p-4 md:p-12 rounded-xl md:mt-10 xl:mt-20 md:w-[89.2%] md:bg-[#F7F7F7] md:dark:bg-[#111111] bg-white dark:bg-neutral-900">
					<div class="flex items-center justify-start md:justify-end gap-4">
						<button aria-label="GaTerug" class="dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg" @click="$router.back()">
							<Icon class="text-white dark:text-black" name="ri:arrow-left-fill" size="1.2em" />
						</button>
						<ClientOnly>
							<ColorMode />
						</ClientOnly>
					</div>
					<div class="flex mt-20 md:hidden items-center justify-center">
						<Icon :class="error ? ' text-[#B92538]' : success ? ' text-[#28B925]' : 'text-indigo-600 dark:text-indigo-500'" :name="success ? 'ri:shield-check-fill' : 'ri:shield-user-fill'" size="10em" />
					</div>
					<div class="mb-3 mt-12 md:-mt-8">
						<h1 class="text-2xl text-clip md:text-left text-center font-bold text-[#131313] dark:text-white">Account verfificatie</h1>
						<p class="text-xs text-center md:text-left md:text-sm opacity-85 text-[#131313] dark:text-white">Voer de 6-cijferige code in die je via de authenticator app hebt ontvangen.</p>
					</div>
					<v-otp-input ref="otpInput" v-model:value="bindModal" class="md:pb-16 flex mt-6 items-center md:gap-4 gap-2 justify-center md:justify-normal" :input-classes="error ? ' otp-input opt-inputErorr' : success ? ' otp-input opt-inputSuccess' : 'otp-input opt-default'" separator="" :num-inputs="6" :should-auto-focus="true" input-type="number" :conditionalClass="['code-1', 'code-2', 'code-3', 'code-4', 'code-5', 'code-6']" :is-disabled="loading" @on-complete="handleOnComplete" />
					<div v-if="error || success" class="md:-mt-16 md:mb-9">
						<p v-if="error" class="text-xs text-[#B92538] font-medium mt-3 md:text-left text-center">De code is onjuist, probeer het opnieuw.</p>
						<p v-if="success" class="text-xs opacity-80 mt-3 md:text-left text-black dark:text-white text-center">
							Je wordt nu doorgestuurd als je niet wordt doorgestuurd klik dan
							<NuxtLink class="font-bold text-[#28B925]" to="/dashboard">hier</NuxtLink>.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import VOtpInput from "vue3-otp-input";

	const { $pwa, $csrfFetch, $PusherOnStart } = useNuxtApp();
	const Installed = ref(false);
	const otpInput = ref(null);
	const bindModal = ref("");
	const error = ref(false);
	const success = ref(false);
	const loading = ref(false);

	definePageMeta({
		middleware: ["two-factor-enabled"],
	});

	const handleOnComplete = (value) => {
		loading.value = true;

		setTimeout(async () => {
			const { data, error: requestError } = await useCsrfFetch("/api/auth/verification", {
				method: "POST",
				body: { token: value },
			});

			if (requestError.value) {
				error.value = true;

				setTimeout(() => {
					error.value = false;
					otpInput.value?.clearInput();
					loading.value = false;
				}, 3000);
			} else {
				success.value = true;
				setTimeout(() => {
					if (data.value.user.Admin) return navigateTo("/dashboard");
					else return navigateTo("/profile");
				}, 4000);
			}
		}, 1000);
	};

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
	});
</script>

<style>
	.otp-input {
		@apply w-9 h-9 md:w-10 md:h-10 text-center flex items-center justify-center transition-opacity delay-100 border-2 opacity-45 rounded-md outline-none focus:outline-none bg-white dark:bg-neutral-900 dark:text-white;
	}

	.opt-default {
		@apply border-black dark:border-white;
	}

	.otp-input.is-complete {
		@apply opacity-60;
	}

	.opt-inputErorr {
		@apply border-[#B92538] opacity-60 text-red-600;
	}

	.opt-inputSuccess {
		@apply border-[#28B925] opacity-60;
	}

	.otp-input:-webkit-autofill,
	.otp-input:-webkit-autofill:hover,
	.otp-input:-webkit-autofill:focus {
		@apply otpLight dark:otpDark;
	}
</style>
