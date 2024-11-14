<template>
	<ModalBase v-model:type="type" v-model:texthead="texthead" v-model:textbase="textbase" v-model:status="status" v-model:DelayStatus="DelayStatus" v-model:textLabel="textLabel" v-model:AuthModule="AuthModule">
		<div v-if="AuthModule && type != 'Vergeten'">
			<FieldInput :name="'email'" :type="'email'" :label="'Gebuikersnaam'" :autocomplete="'username'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" :autocomplete="'current-password'" />
		</div>
		<div v-else-if="type == 'Vergeten'">
			<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" :autocomplete="'username'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Nieuwe wachtwoord'" :autocomplete="'new-password'" :autoFix="true" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" :autocomplete="'nwq-password'" :autoFix="true" />
		</div>
		<div v-else-if="type == 'Aanmelden'">
			<FieldInput :name="'email'" :type="'email'" :label="'Email'" :autocomplete="'email'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" :autocomplete="'new-password'" :autoFix="true" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" :autocomplete="'new-password'" :autoFix="true" />
		</div>
		<div v-else>
			<div class="flex gap-4">
				<FieldInput :name="'naam'" :type="'name'" :label="'Naam'" :autocomplete="'username'" />
				<FieldInput :name="'email'" :type="'email'" :label="'Email'" :autocomplete="'username'" />
			</div>
			<FieldInput :name="'telefoon'" :type="'phone'" :label="'Telefoon'" :autocomplete="'phone'" />
			<FieldTextarea :name="'bericht'" :type="'bericht'" :label="'bericht'" :value="'Laat een berichtje achter'" />
		</div>
	</ModalBase>
</template>

<script setup lang="ts">
	const { texthead, textbase, textLabel, status, DelayStatus, AuthModule, type } = defineModels<{
		texthead: String;
		textbase: String;
		textLabel: String;
		status: Boolean;
		DelayStatus: Boolean;
		AuthModule: Boolean;
		type: String;
	}>();
</script>
