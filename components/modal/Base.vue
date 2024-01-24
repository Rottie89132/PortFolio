<template>
    <ClientOnly>
        <Transition name="modal">
            <div v-if="status" class="fixed top-0 z-10 flex items-end justify-center w-screen h-full bg-black md:justify-end bg-opacity-60 backdrop-blur-sm ">
                <div tabindex="0" class="mx-6 mb-[8%] md:mb-8 md:ml-[58%] xl:ml-[68%] outline-none rounded-xl" ref="modal">
                    <Transition name="modalDelay">
                        <div ref="modalDelay" v-if="DelayStatus">
                            <div class="p-8 bg-white rounded-2xl ">
                                <div class="flex items-center justify-between mb-2 ">
                                    <h1 class="text-3xl font-bold ">{{ texthead }}</h1>
                                    <button @click="closeModal"><Icon name="pajamas:close-xs" size="2em"></Icon></button>
                                </div>
                                <p class="mb-6 font-medium opacity-70">{{ textbase }}</p>
                                <Form class="" @submit="handleRequest" :validation-schema="schema"  v-slot="{ meta }" >
                                    <slot ></slot>
                                    <button :disabled="loading" id="Button" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">
                                        <Icon v-if="loading" class=" animate-spin" name="ri:refresh-line" size="1.25em"/>
                                        <p v-else>{{ textLabel }}</p>
                                    </button>
                                    <span role="alert" v-if="meta.touched && msgError" class="flex text-xs text-left text-[#B92538]">{{ msgError }}</span>
                                    <span role="alert" v-if=" MessageSend " class="flex text-xs text-left ">Je bericht is vestuured</span>
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
import { configure } from 'vee-validate';
import * as yup from 'yup';

const { texthead, textbase, textLabel, status, DelayStatus, AuthModule, type } = defineModels<{
    texthead: String, textbase: String, textLabel: String, status: Boolean, DelayStatus: Boolean, AuthModule: Boolean, type: String
}>()

const msgError = ref()
const modal = ref(null)
const modalDelay = ref(null)
const loading = ref(false)
const MessageSend =  ref(false)
const phoneRegExp = /^[0-9][0-9]{8}$/
let schema: any

watch(AuthModule, (Auth: Boolean) => {
    if(Auth) schema = yup.object().shape({
        email: yup.string().email().required(),
        wachtwoord: yup.string().min(8).max(32).required(),
    })
    
    else if(type.value == "Contact") schema = yup.object().shape({
        email: yup.string().email().required(),
        naam: yup.string().required(),
        bericht: yup.string().required(),
        telefoon: yup.string().matches(phoneRegExp, 'telefoon number is not valid')
    }) 

    else schema = yup.object().shape({
        email: yup.string().email().required(),
        wachtwoord: yup.string().min(8).max(32).required(),
        confirmatie: yup.string().oneOf([yup.ref('wachtwoord')], 'Wachtwoorden do not match!').required(),
    }) 

})

if (AuthModule.value) schema = yup.object().shape({
    email: yup.string().email().required(),
    wachtwoord: yup.string().min(8).max(32).required(),
});

else if (type.value == "Contact") schema = yup.object().shape({
    email: yup.string().email().required(),
    naam: yup.string().required(),
    bericht: yup.string().required(),
    telefoon: yup.string().matches(phoneRegExp, 'telefoon number is not valid')
});

else schema = yup.object().shape({
    email: yup.string().email().required(),
    wachtwoord: yup.string().min(8).max(32).required(),
    confirmatie: yup.string().oneOf([yup.ref('wachtwoord')], 'Wachtwoorden do not match!').required(),
});


configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
});

onClickOutside(modal, () => { closeModal() })

const closeModal = () => {
    DelayStatus.value = false;
    setTimeout(() => { status.value = false }, 100)
}

const handleRequest = async (values: any, actions: any) => {

    loading.value = true
    const { data, error, pending, refresh }: Record<string, any> = AuthModule.value ? 
        await useFetch('/api/auth', { method: "post", body: values }) : type.value == "Contact" ?
        await useFetch('/api/contact', { method: "post", body: values }) :
        await useFetch('/api/register', { method: "post", body: values })
    
    if (error.value) {
        loading.value = false

        if (error.value.data?.statusCode == 401) {
            msgError.value = AuthModule.value ? "Incorrecte email of wachtwoord opgegeven" : "Er is iets mis gegaan, probeer het later opnieuw"
        }

        else if(error.value.data?.statusCode == 429){
            msgError.value = "Je hebt te veel berichten gestuurd, probeer het later opnieuw"
        }

        else  {
            msgError.value = "Een onbekende fout is opgetreden, probeer het later opnieuw"
        }

        setTimeout(() => {
            actions.resetForm();
            msgError.value = ""
        }, 5000)
        
        
    } else {
        MessageSend.value = AuthModule.value ? false : true
        loading.value = false
        actions.resetForm();

        if(AuthModule.value) {
            closeModal()
        }

        setTimeout(() => {
            closeModal()

            if (data.value.statusCode == 200 && type.value == "Aanmelden") navigateTo('/profile')

            if(AuthModule.value && data.value.user.is2FAEnabled) navigateTo(`/auth/prompt?id=${data.value.user.Id}`)
            else if (AuthModule.value && data.value.user.Admin) navigateTo('/dashboard')
            else if (AuthModule.value) navigateTo('/profile')
            else if (AuthModule.value && data.value.user.Admin) navigateTo('/dashboard')
            else if (AuthModule.value) navigateTo('/profile') 
            
            MessageSend.value = false
        }, 1000)
    }

}

</script>

<script>





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


