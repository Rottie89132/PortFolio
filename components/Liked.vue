<template>
	<div @click="like" class="flex liked items-center justify-center gap-1 px-[0.6rem] py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 text-neutral-600">
		<Icon v-if="!failed" :class="liked ? 'dark:text-indigo-500 text-indigo-600 like-animation' : 'dark:text-gray-500 text-gray-300'" class="transition-all delay-200" name="prime:thumbs-up-fill" size="1.9em"></Icon>
		<div v-else class="relative group">
			<Icon class="transition-all delay-200 dark:text-red-500 text-red-600 failed-animation" name="prime:thumbs-up-fill" size="1.9em"></Icon>

			<div class="absolute -ml-[10.8em] text-center w-40 -top-[1.4em] transform -translate-y-full dark:bg-red-500 bg-red-600 text-white text-xs rounded-md py-1 px-2 transition duration-200 ease-in-out">
				<p v-if="status == 401" class="text-center p-[0.45em] z-20 dark:bg-red-500 bg-red-600">
					<span class="font-semibold"> Je moet ingelogd zijn om te liken! </span>
				</p>

				<p v-else class="text-center p-[0.45em] z-20 dark:bg-red-500 bg-red-600">
					<span class="font-semibold"> Er is iets misgegaan! </span>
				</p>

				<div class="absolute w-3 h-3 dark:bg-red-500 bg-red-600 transform rotate-45 -bottom-[0.44em] right-2 -translate-x-1/2"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import confetti from "canvas-confetti";

	const { id, liked } = defineModels<{
		id: Number;
		liked: Boolean;
	}>();

	const failed = ref(false);
	const status = ref();

	const like = async (event: any) => {
		if (!liked.value) {
			const { error } = await useCsrfFetch(`/api/repo/like/${id.value}`, {
				method: "patch",
			});

			if (!error.value) liked.value = true;
			else {
				status.value = error.value.data.statusCode;
				failed.value = true;
			}

			setTimeout(() => {
				if (!error.value) {
					const x = event.clientX / window.innerWidth;
					const y = event.clientY / window.innerHeight + 0.07;
					const likes = confetti.shapeFromPath({ path: "M7.24 11v9H5.63c-.9 0-1.62-.72-1.62-1.61v-5.77c0-.89.73-1.62 1.62-1.62zM18.5 9.5h-4.78V6c0-1.1-.9-2-1.99-2h-.09c-.4 0-.76.24-.92.61L7.99 11v9h9.2c.73 0 1.35-.52 1.48-1.24l1.32-7.5c.16-.92-.54-1.76-1.48-1.76Z" });

					confetti({
						particleCount: 80,
						spread: 40,
						origin: { x, y },
						ticks: 100,
						decay: 0.8,
						shapes: [likes],
						colors: ["#6366F1", "#4F46E5"],
					});
				}
				setTimeout(() => {
					failed.value = false;
				}, 2000);
			}, 500);
		} else {
			const { error } = await useCsrfFetch(`/api/repo/like/${id.value}`, { method: "delete" });
			if (!error.value) liked.value = false;
			else {
				status.value = error.value.data.statusCode;
				failed.value = true;
			}
		}
	};
</script>

<style scoped>
	@keyframes like-animation {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes failed-animation {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		25%,
		75% {
			transform: scale(0.9) rotate(-20deg);
			animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
		}
		50% {
			transform: scale(1.1) rotate(20deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
	}

	.like-animation {
		animation: like-animation 0.5s ease-in-out;
	}

	.failed-animation {
		animation: failed-animation 0.5s ease-in-out;
	}
</style>
