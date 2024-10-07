<template>
    <ModalBase v-model:type="type" v-model:texthead="texthead" v-model:textbase="textbase" v-model:status="status"
        v-model:DelayStatus="DelayStatus" v-model:textLabel="textLabel" v-model:AuthModule="AuthModule">
        <div v-if="AuthModule && type != 'Vergeten'">
            <FieldInput :name="'email'" :type="'email'" :label="'Gebuikersnaam'" />
            <FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
        </div>
        <div v-else-if="type == 'Vergeten'">
            <FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
            <FieldInput :name="'wachtwoord'" :type="'password'" :label="'Nieuwe wachtwoord'" />
            <FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
        </div>
        <div v-else-if="type == 'Aanmelden'">
			<FieldInput :name="'email'" :type="'email'" :label="'Email'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
		</div>
        <div v-else>
            <FieldInput :name="'naam'" :type="'name'" :label="'Contact persoon'" />
            <FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
            <FieldTextarea :name="'bericht'" :type="'bericht'" :label="'bericht'" />
            <FieldInput :name="'telefoon'" :value="'+31 06 12 34 56 78'" :type="'phone'" :label="'Telefoon'" />
        </div>
    </ModalBase>
</template>

<script setup lang="ts">

    const { texthead, textbase, textLabel, status, DelayStatus, AuthModule, type } = defineModels < {
        texthead: String;
        textbase: String;
        textLabel: String;
        status: Boolean;
        DelayStatus: Boolean;
        AuthModule: Boolean;
        type: String;
    }>();
    
</script>
