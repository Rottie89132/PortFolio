<script lang="ts" setup>

	import { Tailwind, Html, Head, Preview, Button, Body } from '@vue-email/components';

	defineProps({
		url: { type: String, default: "/" },
		Username: { type: String, default: "Bezoeker" },
	});

</script>

<template>
	<Tailwind>
		<Html>
			<Head>
				<title>Wachtwoord resetten</title>
			</Head>
			<Preview> Uw heeft een wachtwoord reset aangevraagd voor uw account. </Preview>
			<Body class=" ">
				<div class="w-full pb-6 pt-2 max-w-sm">
					<div class="">
						<h2 class="text-3xl -mt-4 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Wachtwoord resetten</h2>
						<p class="max-w-[600px] mb-4 -mt-5 text-gray-500 md:text-xl text-sm">
							Beste <span class="font-black text-indigo-600">{{ Username }}</span
							><br /><br />
							U heeft een wachtwoord reset aangevraagd voor uw account. Klik op de onderstaande knop om uw wachtwoord te resetten.
						</p>
						<Button :href="url" class="text-indigo-600 font-black text-sm rounded-md no-underline"> Wachtwoord resetten </Button>
					</div>
					<div class="w-full max-w-sm">
						<p class="text-gray-500 text-sm mt-5"><span class="font-black">Deze link is 24 uur geldig.</span> Als u geen wachtwoord reset heb aangevraagd, kunt u deze email negeren.</p>
					</div>
				</div>
			</Body>
		</Html>
	</Tailwind>
</template>
