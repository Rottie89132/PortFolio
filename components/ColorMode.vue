<template>
	<button aria-label="WijzigKleur" v-if="preferredColor == 'dark'" class="dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg" @click="toggleLight()">
		<Icon v-if="colormode.value == 'dark'" class="text-white dark:text-black" name="ri:sun-fill" size="1.2em" />
		<Icon v-else class="text-white dark:text-black" name="ri:moon-clear-fill" size="1.2em" />
	</button>
	<button aria-label="WijzigKleur" v-else-if="preferredColor == 'light'" class="dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg" @click="toggleDark()">
		<Icon v-if="colormode.value == 'dark'" class="text-white dark:text-black" name="ri:sun-fill" size="1.2em" />
		<Icon v-else class="text-white dark:text-black" name="ri:moon-clear-fill" size="1.2em" />
	</button>
</template>

<script setup>
	const colormode = useColorMode();
	const preferredColor = usePreferredColorScheme();

	if (preferredColor.value == "dark") {
		const Thema = document.querySelector('meta[name="theme-color"]');
		Thema.media = colormode.value != "dark" ? "(prefers-color-scheme: dark)" : "(prefers-color-scheme: light)";
	}

	if (preferredColor.value == "light") {
		const Thema = document.querySelector('meta[name="theme-color"]');
		Thema.media = colormode.value == "dark" ? "(prefers-color-scheme: dark)" : "(prefers-color-scheme: light)";
	}

	const toggleLight = () => {
		colormode.value = colormode.preference == "light" ? "system" : "light";
		colormode.preference = colormode.preference == "light" ? "system" : "light";

		const Thema = document.querySelector('meta[name="theme-color"]');
		Thema.media = colormode.value != "dark" ? "(prefers-color-scheme: dark)" : "(prefers-color-scheme: light)";
	};

	const toggleDark = () => {
		colormode.value = colormode.preference == "dark" ? "system" : "dark";
		colormode.preference = colormode.preference == "dark" ? "system" : "dark";

		const Thema = document.querySelector('meta[name="theme-color"]');
		Thema.media = colormode.value == "dark" ? "(prefers-color-scheme: dark)" : "(prefers-color-scheme: light)";
	};
</script>
