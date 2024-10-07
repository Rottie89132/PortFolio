<template>
	<ClientOnly>
		<Transition name="modal">
			<div v-if="status" class="fixed top-0 z-10 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" class="mx-6 mb-[8%] md:mb-0 outline-none rounded-xl" ref="modal">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="DelayStatus">
							<div class="p-8 bg-white md:max-w-[30vw] rounded-2xl">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">{{ texthead }}</h1>
									<button @click="closeModal">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<p class="mb-6 font-medium opacity-70">{{ textbase }}</p>
								<Form class="" @submit="handleRequest" :validation-schema="schema" v-slot="{ meta }">
									<slot></slot>
									<div v-if="type == 'Inloggen'" class="flex">
										<p class=" text-balance">
											<span @click="forgotPassword" class="text-sm select-none cursor-pointer underline text-neutral-800 hover:text-neutral-900">Wachtwoord vergeten?</span>
											<span> of </span>
											<span @click="maakAccount" class="text-sm select-none underline cursor-pointer text-neutral-800 hover:text-neutral-900">aanmelden</span>
										</p>
									</div>

									<div v-if="type != 'Contact' && type != 'Inloggen'" class="flex justify-between items-start">
										<div @click="KeerTerug()" class="text-sm select-none underline cursor-pointer text-neutral-800 hover:text-neutral-900">Terug naar inloggen</div>
									</div>

									<button :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
										<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
										<p v-else>{{ textLabel }}</p>
									</button>
									<span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
									<span role="alert" v-if="MessageSend && type == 'Contact'" class="flex text-xs text-left">Je bericht is vestuured</span>
									<span role="alert" v-if="MessageSend && type == 'Aanmelden'" class="flex text-xs text-left">Je account is aangemaakt, controleer je email om je account te activeren</span>
									<span role="alert" v-if="MessageSend && type == 'Vergeten'" class="flex text-xs text-left"> Er is een email verstuurd naar het opgegeven email adres </span>
								</Form>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { texthead, textbase, textLabel, status, DelayStatus, AuthModule, type } = defineModels<{
		texthead: String;
		textbase: String;
		textLabel: String;
		status: Boolean;
		DelayStatus: Boolean;
		AuthModule: Boolean;
		type: String;
	}>();

	const msgError = ref();
	const modal = ref(null);
	const modalDelay = ref(null);
	const loading = ref(false);
	const MessageSend = ref(false);
	const phoneRegExp = /^\+[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/;
	let schema: any;

	const updateAuthState = (typeValue: string | String, textheadValue: string | String, textbaseValue: string | String, textLabelValue: string | String, authModuleValue: boolean | Boolean) => {
		DelayStatus.value = false;

		type.value = typeValue;
		texthead.value = textheadValue;
		textbase.value = textbaseValue;
		textLabel.value = textLabelValue;
		AuthModule.value = authModuleValue;

		setTimeout(() => (DelayStatus.value = true), 1000);
	};

	const forgotPassword = () => {
		updateAuthState("Vergeten", "Vergeten", "Vul je email adres in om een link te ontvangen om je wachtwoord te resetten", "Verstuur", false);
	};

	const maakAccount = () => {
		updateAuthState("Aanmelden", "Aanmelden", "Vul je gegevens in om een account aan te maken", "Aanmelden", false);
	};

	const KeerTerug = () => {
		updateAuthState("Inloggen", "Inloggen", "Vul je gegevens in om een account aan te maken", "Inloggen", true);
	};

	watch(AuthModule, (Auth: Boolean) => {
		if (Auth)
			schema = yup.object().shape({
				email: yup.string().email().required("email is verplicht"),
				wachtwoord: yup.string().min(8).max(32).required("wachtwoord is verplicht"),
			});
		else if (type.value == "Contact")
			schema = yup.object().shape({
				email: yup.string().email().required("email is verplicht"),
				naam: yup.string().required("naam is verplicht"),
				bericht: yup
					.string()
					.required("bericht is verplicht")
					.min(50, "bericht moet minimaal 50 tekens bevatten")
					.max(2500, "bericht mag maximaal 2500 tekens bevatten")
					.test("word-count", "bericht moet meer dan 6 woorden bevatten", (value) => {
						if (!value) return false;
						const wordCount = value.trim().split(/\s+/).length;
						return wordCount > 6;
					}),
				telefoon: yup.string().matches(phoneRegExp, " telefoon nummer is niet geldig").optional(),
			});
		else
			schema = yup.object().shape({
				email: yup.string().email().required("email is verplicht"),
				wachtwoord: yup.string().min(8).max(32).required("wachtwoord is verplicht"),
				confirmatie: yup
					.string()
					.oneOf([yup.ref("wachtwoord")], "ingevoerde wachtwoorden komen niet overeen!")
					.required("wachtwoord confirmatie is verplicht"),
			});
	});

	if (AuthModule.value)
		schema = yup.object().shape({
			email: yup.string().email().required("email is verplicht"),
			wachtwoord: yup.string().min(8).max(32).required("wachtwoord is verplicht"),
		});
	else if (type.value == "Contact")
		schema = yup.object().shape({
			email: yup.string().email().required("email is verplicht"),
			naam: yup.string().required("naam is verplicht"),
			bericht: yup
				.string()
				.required("bericht is verplicht")
				.min(50, "bericht moet minimaal 50 tekens bevatten")
				.max(2500, "bericht mag maximaal 2500 tekens bevatten")
				.test("word-count", "bericht moet meer dan 6 woorden bevatten", (value) => {
					if (!value) return false;
					const wordCount = value.trim().split(/\s+/).length;
					return wordCount > 6;
				}),
			telefoon: yup.string().matches(phoneRegExp, " telefoon nummer is niet geldig").optional(),
		});
	else
		schema = yup.object().shape({
			email: yup.string().email().required("email is verplicht"),
			wachtwoord: yup.string().min(8).max(32).required("wachtwoord is verplicht"),
			confirmatie: yup
				.string()
				.oneOf([yup.ref("wachtwoord")], "ingevoerde wachtwoorden komen niet overeen!")
				.required("wachtwoord confirmatie is verplicht"),
		});

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});

	onClickOutside(modal, () => {
		closeModal();
	});

	const closeModal = () => {
		DelayStatus.value = false;
		setTimeout(() => {
			status.value = false;
		}, 100);
		MessageSend.value = false;
	};

	const handleRequest = async (values: any, actions: any) => {
		loading.value = true;
		const { data, error, pending, refresh }: Record<string, any> = AuthModule.value ? await useCsrfFetch("/api/auth", { method: "post", body: values }) : type.value == "Contact" ? await useCsrfFetch("/api/berichten", { method: "post", body: values }) : type.value == "Vergeten" ? await useCsrfFetch("/api/forgot", { method: "post", body: values }) : await useCsrfFetch("/api/register", { method: "post", body: values });

		const store = useSessionsStore();
		store.setSession(data.value);

		if (error.value) {
			loading.value = false;

			if (error.value.data?.statusCode == 401) msgError.value = AuthModule.value ? "Incorrecte email of wachtwoord opgegeven" : "Er is iets mis gegaan, probeer het later opnieuw";
			else if (error.value.data?.statusCode == 429) msgError.value = "Je hebt te veel berichten gestuurd, probeer het later opnieuw";
			else if (error.value.data?.statusCode == 409) msgError.value = "Er is al een account met dit email adres geregistreerd gebruik een ander email adres";
			else msgError.value = "Een onbekende fout is opgetreden, probeer het later opnieuw";

			setTimeout(() => {
				actions.resetForm();
				msgError.value = "";
			}, 5000);
		} else {
			MessageSend.value = AuthModule.value ? false : true;
			loading.value = false;
			actions.resetForm();

			if (AuthModule.value) closeModal();

			setTimeout(() => {
				store.setSession({ ...data.value, authorized: data.value.user.Admin });

				if (AuthModule.value && data.value.user.is2FAEnabled) navigateTo(`/auth/prompt/2fa?token=${data.value.user.Id}`);
				else if (AuthModule.value && data.value.user.Admin) navigateTo("/dashboard");
				else if (AuthModule.value) navigateTo("/profile");
				else if (AuthModule.value && data.value.user.Admin) navigateTo("/dashboard");
				else if (AuthModule.value) navigateTo("/profile");

				if (type.value != "Aanmelden" && type.value != "Vergeten") MessageSend.value = false;
			}, 1000);
		}
	};
</script>

<style scoped>
	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.8s ease;
	}

	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
	}

	.modalDelay-enter-active,
	.modalDelay-leave-active {
		transition: all 1s ease;
	}

	.modalDelay-enter-from,
	.modalDelay-leave-to {
		opacity: 0;
		transform: translateY(12em);
	}
</style>
