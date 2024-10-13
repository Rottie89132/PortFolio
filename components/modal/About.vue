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

								<div v-if="type == 'upload'">
									<p class="mb-6 font-medium text-sm opacity-70">Werk je huidige curriculum vitae bij en upload vervolgens je nieuwe curriculum vitae.</p>
									<Form @submit="handleRequest" :validation-schema="schema" v-slot="{ meta }">
										<FieldUpload :name="'CV'" v-model="file" :type="'file'" :label="'Curriculum Vitae'" />
										<div class="text-xs mb-4 mt-3 text-green-700" v-if="meta.valid">{{ fileName }}</div>

										<button :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
											<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
											<p v-else>Uploaden</p>
										</button>

										<span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
										<span role="alert" v-if="MessageSend" class="flex text-xs text-left">Je Curriculum vitae is geüpload</span>
									</Form>
								</div>

								<div v-else-if="type == 'wijzig'">
									<p class="mb-6 font-medium text-sm opacity-70">Werk de about pagina bij en deze wordt automatisch opgeslagen.</p>
									<div class="flex items-center gap-2 mt-2 mb-5">
										<select v-model="selected" class="btn-Input">
											<option disabled value="null">Selecteer een optie</option>
											<option disabled value="new">Aanmaken nieuwe optie</option>
											<option v-for="item in items" :key="item._id" :value="item">{{ item.title }}</option>
										</select>
										<button @click="createNew" class="btn-Input-Number flex items-center justify-center"><Icon name="ri:add-line" size="1.5em" /></button>
										<button @click="deleteOption" v-if="selected && selected !== 'new'" class="btn-Input-Number flex items-center justify-center"><Icon name="ri:delete-bin-2-line" size="1.5em" /></button>
									</div>

									<Form @submit="handeWijzigRequest" :validation-schema="WijzigShema" v-slot="{ meta }">
										<hr v-if="selected" class="mb-5" />
										<div v-if="selected && selected !== 'new'" class="flex flex-col gap-2 pb-3">
											<FieldInput v-model="selected.title" :name="'title'" :type="'text'" :label="'Titel'" />
											<FieldTextarea v-model="selected.content" :type="'content'" :name="'content'" :label="'Inhoud'" />
										</div>

										<div v-if="selected == 'new'" class="flex flex-col gap-2 pb-3">
											<FieldInput v-model="Options.title" :name="'title'" :type="'text'" :label="'Titel'" />
											<FieldTextarea v-model="Options.content" :name="'content'" :type="'content'" :label="'Inhoud'" />
										</div>

										<button v-if="selected" :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
											<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
											<p v-else>{{ selected === "new" ? "Aanmaken" : "Bijwerken" }}</p>
										</button>
										<span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
										<span role="alert" v-if="MessageSend" class="flex text-xs text-left">{{ selected === "new" ? "De nieuwe optie is toegevoegd en de pagina is bijgewerkt" : "De wijzigen zijn doorgevoerd en opgeslagen" }}</span>
									</Form>
								</div>
								<div v-else>
									<p class="mb-6 font-medium text-sm opacity-70">Weet je zeker dat je deze optie <strong>({{ selected.title }})</strong> wilt verwijderen?</p>
									<div class="flex items-center gap-2 mt-2">
										<button @click="confirmDeleteOption" :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
											<Icon v-if="loading" class="animate-spin" name="ri:refresh-line" size="1.25em" />
											<p v-else>Verwijderen</p>
										</button>
									</div>
									<span role="alert" v-if="msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
									<span role="alert" v-if="MessageSend" class="flex text-xs text-left">De optie is verwijderd en de pagina is bijgewerkt</span>
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
		validateOnInput: true,
		validateOnModelUpdate: true,
	});

	const { status, DelayStatus, title, type } = defineModels<{
		status: Boolean;
		DelayStatus: Boolean;
		title: String;
		type: String;
	}>();

	const modal = ref(null);
	const modalDelay = ref(null);
	const msgError = ref();
	const loading = ref(false);
	const MessageSend = ref(false);
	const fileName = ref("");
	const file = ref(null);
	const items: any = ref([]);

	const selected: any = ref(null);
	const Options: any = ref({
		title: "",
		content: "",
	});

	watch(file, (File: any) => {
		if (File) fileName.value = File.name;
	});

	watch(type, async (data) => {
		if (data == "wijzig") {
			const { data }: any = await useFetch("/api/about");
			items.value = data.value.data;
		}
	});

	onClickOutside(modal, () => {
		closeModal();
	});

	const createNew = () => {
		selected.value = "new";
	};

	const deleteOption = () => {
		DelayStatus.value = false;
		type.value = "delete";
		title.value = "Verwijderen";

		setTimeout(() => {
			DelayStatus.value = true;
		}, 1000);
	};

	const confirmDeleteOption = async () => {
		const id = selected.value._id;
		MessageSend.value = false;
		loading.value = true;
		
		const { data, error } = await useCsrfFetch(`/api/about/${id}`, { method: "delete" });

		if (error.value) {
			loading.value = false;

			if (error.value.data?.statusCode == 429) {msgError.value = "Je hebt te veel berichten gestuurd, probeer het later opnieuw";} 
			else {msgError.value = "Een onbekende fout is opgetreden, probeer het later opnieuw";}

			setTimeout(() => {
	
				msgError.value = "";
				setTimeout(() => {
					MessageSend.value = false;
				}, 2000);
			}, 5000);
		} else {
			MessageSend.value = true;
			loading.value = false;
			
			setTimeout(() => {
				closeModal();
				MessageSend.value = false;
			}, 2000);
		}
	};

	const closeModal = async () => {
		DelayStatus.value = false;

		if (type.value != "upload") {
			const { data }: any = await useFetch("/api/about");
			items.value = data.value.data;
			selected.value = null;
		}

		setTimeout(() => {
			status.value = false;
		}, 100);
	};

	const schema = yup.object().shape({
		CV: yup
			.mixed()
			.test("fileSize", "Het bestand mag niet groter zijn dan 5MB", (value: any) => value && value.size <= 5000000)
			.test("fileType", "Het bestandstype is niet toegestaan", (value: any) => value && ["image/png"].includes(value.type))
			.required("Curriculum Vitae is verplicht"),
	});

	const WijzigShema = yup.object().shape({
		title: yup.string().required("Titel is verplicht"),
		content: yup.string().required("Inhoud is verplicht"),
	});

	const handeWijzigRequest = async (values: any, actions: any) => {
		const id = selected.value._id;
		MessageSend.value = false;
		loading.value = true;

		const { data, error } = id ? await useCsrfFetch(`/api/about/${id}`, { method: "patch", body: values }) : await useCsrfFetch("/api/about", { method: "post", body: values });

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
			}, 2000);
		}
	};

	const handleRequest = async (values: any, actions: any) => {
		MessageSend.value = false;
		loading.value = true;

		const formData = new FormData();
		formData.append("file", values.CV);
		const { data, error, pending, refresh } = await useCsrfFetch("/api/upload", { method: "post", body: formData });

		if (error.value) {
			loading.value = false;

			if (error.value.data?.statusCode == 429) {
				msgError.value = "Je hebt te veel berichten gestuurd, probeer het later opnieuw";
			} else if (error.value.data?.statusCode == 415) {
				msgError.value = "Het bestandstype is niet toegestaan, probeer het opnieuw";
			} else if (error.value.data?.statusCode == 413) {
				msgError.value = "Het bestand mag niet groter zijn dan 5MB, probeer het opnieuw";
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
				file.value = null;
				fileName.value = "";
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
