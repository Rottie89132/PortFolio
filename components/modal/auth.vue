<template>
	<ModalBase v-model:type="type" v-model:texthead="texthead" v-model:textbase="textbase" v-model:status="status" v-model:DelayStatus="DelayStatus" v-model:textLabel="textLabel" v-model:AuthModule="AuthModule">
		<div v-if="AuthModule && type != 'Vergeten'">
			<FieldInput :name="'email'" :type="'email'" :label="'Gebruikersnaam'" :autocomplete="'username'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" :autocomplete="'current-password'" />
		</div>
		<div v-else-if="type == 'Vergeten'">
			<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" :autocomplete="'section-vergeten email'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Nieuwe wachtwoord'" :autocomplete="'section-vergeten new-password'" :autoFix="true" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" :autocomplete="'section-vergeten new-password'" :autoFix="true" />
		</div>
		<div v-else-if="type == 'Aanmelden'">
			<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" :autocomplete="'section-aanmelden email'" />
			<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" :autocomplete="'section-aanmelden new-password'" :autoFix="true" />
			<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" :autocomplete="'section-aanmelden new-password'" :autoFix="true" />
		</div>
		<div v-else>
			<div class="flex gap-4">
				<FieldInput :name="'naam'" :type="'name'" :label="'Naam'" :autocomplete="'name'" />
				<FieldInput :name="'email'" :type="'email'" :label="'Email'" :autocomplete="'email'" />
			</div>
			<FieldInput :name="'telefoon'" :type="'phone'" :label="'Telefoon'" :autocomplete="'tel-local-prefix'" />
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
