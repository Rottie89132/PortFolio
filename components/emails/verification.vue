<script lang="ts" setup>

	import { Tailwind, Html, Head, Preview, Button, Body } from '@vue-email/components';

	defineProps({
		url: { type: String, default: "/" },
	});
</script>

<template>
	<Tailwind>
		<Html>
			<Head>
				<title>Verifieer je account</title>
			</Head>
			<Preview> Bedankt voor het aanmaken van een account om je account te activeren klik op de onderstaande link. </Preview>
			<Body class=" ">
				<div class="w-full pb-6 pt-2 max-w-sm">
					<div class="">
						<h2 class="text-3xl -mt-4 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Verifieer je account</h2>
						<p class="max-w-[600px] mb-4 -mt-5 text-gray-500 md:text-xl text-sm">
							Bedankt voor het aanmaken van een account. <br />
							Klik op de onderstaande link om je account te activeren.
						</p>
						<Button :href="url" class="text-indigo-600 font-black text-sm rounded-md no-underline"> Activeer account </Button>
					</div>
					<div class="w-full max-w-sm">
						<p class="text-gray-500 text-sm mt-5"><span class="font-black">Deze link is 24 uur geldig.</span> Als je geen account hebt aangemaakt, kun je deze e-mail negeren.</p>
					</div>
				</div>
			</Body>
		</Html>
	</Tailwind>
</template>
