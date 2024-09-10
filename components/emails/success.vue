<script lang="ts" setup>
	
	import { Tailwind, Html, Head, Preview, Body } from '@vue-email/components';
	
	
	defineProps({
		Username: { type: String, default: "Bezoeker" },
	
	});
</script>

<template>
	<Tailwind>
		<Html>
			<Head>
				<title>Account geactiveerd</title>
			</Head>
			<Preview> Uw account is succesvol geverifieerd en geactiveerd. Bedankt voor uw interesse in mijn portfolio. </Preview>
			<Body class="">
				<div class="w-full pb-6 pt-2 max-w-sm">
					<div class="">
						<h2 class="text-3xl -mt-4 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Acount geactiveerd.</h2>
						<p class="max-w-[600px] mb-2 -mt-5 text-gray-500 md:text-xl text-sm break-words text-balance">
							Beste <span class="font-black text-indigo-600">{{ Username }}</span
							><br /><br />
							Ik ben blij u te informeren dat uw account succesvol is geverifieerd en geactiveerd, waardoor u nu volledige toegang heeft tot mijn portfolio.
						</p>
					</div>
				</div>
			</Body>
		</Html>
	</Tailwind>
</template>
