<template>
	<ClientOnly>
		<Transition name="modal">
			<div v-if="status" class="fixed top-0 z-10 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" class="mx-6 mb-[8%] md:mb-0 outline-none rounded-xl" ref="modal">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="DelayStatus">
							<div class="p-8 bg-white md:max-w-[30vw] rounded-2xl">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">{{ title }}</h1>
									<button @click="closeModal">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<slot></slot>
								<div v-if="type != '2fa' && type != 'delete' && type != 'details'">
									<p class="mb-6 font-medium text-sm opacity-70">
										<span v-if="type == 'password'"> Een nieuw wachtwoord aanmaken voor je account. Vul hieronder het gewenste wachtwoord in. </span>
										<span v-else> Een nieuwe gebruikersnaam aanmaken voor je account. Vul hieronder de gewenste gebruikersnaam in. </span>
									</p>
									<Form class="" @submit="handleRequest" :validation-schema="schema" v-slot="{ meta }">
										<slot></slot>
										<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
										<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
										<button :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
											<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
											<p v-else>Bijwerken</p>
										</button>
										<span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
										<span role="alert" v-if="MessageSend" class="flex text-xs text-left">Je wachtwoord is gewijzigd</span>
									</Form>
								</div>
								<div v-if="type == 'details'">
									<p class="mb-6 font-medium text-sm opacity-70">Persoonlijke gegevens van je account wijzigen.</p>
									<Form @submit="handleRequest" :validation-schema="schemaPut" v-slot="{ meta }">
										<FieldInput :name="'Naam'" :type="'text'" :label="'Naam'" />
										<FieldInput :name="'Email'" :type="'email'" :label="'Email'" />
										<button :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
											<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
											<p v-else>Bijwerken</p>
										</button>
										<span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
										<span role="alert" v-if="MessageSend" class="flex text-xs text-left">Je account gegevens zijn gewijzigd</span>
									</Form>
								</div>
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

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: false,
		validateOnModelUpdate: true,
	});

	const { status, DelayStatus, title, type, email, username } = defineModels<{
		status: Boolean;
		DelayStatus: Boolean;
		title: String;
		type: String;
		email: String;
		username: String;
	}>();

	const modal = ref(null);
	const modalDelay = ref(null);
	const msgError = ref();
	const loading = ref(false);
	const MessageSend = ref(false);

	onClickOutside(modal, () => {
		closeModal();
	});

	const closeModal = () => {
		DelayStatus.value = false;
		setTimeout(() => {
			status.value = false;
		}, 100);
	};

	const schema = yup.object().shape({
		wachtwoord: yup.string().min(8).max(32).required("wachtwoord is verplicht"),
		confirmatie: yup
			.string()
			.oneOf([yup.ref("wachtwoord")], "ingevoerde wachtwoorden komen niet overeen!")
			.required("wachtwoord confirmatie is verplicht"),
	});

	const schemaPut = yup.object().shape({
		Naam: yup.string().min(4).max(32).optional(),
		Email: yup.string().email().optional(),
	});

	const handleRequest = async (values: any, actions: any) => {
		MessageSend.value = false;
		loading.value = true;

		const { data, error, pending, refresh }: Record<string, any> = type.value == "password" ? await useCsrfFetch("/api/users", { method: "patch", body: values }) : await useCsrfFetch("/api/users", { method: "put", body: values });

		if (error.value) {
			loading.value = false;

			if (error.value.data?.statusCode == 429) {
				msgError.value = "Je hebt te veel berichten gestuurd, probeer het later opnieuw";
			} else {
				msgError.value = "Een onbekende fout is opgetreden, probeer het later opnieuw";
			}

			setTimeout(() => {
				actions.resetForm();
				msgError.value = "";
				setTimeout(() => {
					MessageSend.value = false;
				}, 2000);
			}, 5000);
		} else {
			MessageSend.value = true;
			loading.value = false;
			actions.resetForm();
			setTimeout(() => {
				closeModal();
				MessageSend.value = false;

				if (type.value != "password") {
					email.value = data.value.user.Email;
					username.value = data.value.user.Username;
				}
			}, 2000);
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
