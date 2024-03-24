<template>
	<div @click="like" class="flex liked items-center justify-center gap-1 px-[0.6rem] py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 text-neutral-600">
		<Icon :class="liked ? ' dark:text-indigo-500 text-indigo-600 like-animation' : ' dark:text-gray-500 text-gray-300'" class="transition-all delay-200" name="prime:thumbs-up-fill" size="1.9em"></Icon>
	</div>
</template>

<script setup>
	import confetti from "canvas-confetti";

	const liked = ref(null);
	const Storage = useLocalStorage("SavedLikes", []);
	const probs = defineProps({
		id: { type: Number },
		name: { type: String },
		url: { type: String },
		visibility: { type: String },
	});

	const like = async (event) => {
		liked.value = liked.value == true ? false : true;
		if (liked.value) {
			setTimeout(() => {
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
			}, 500);
		}
	};

	watch(liked, (event) => {
		saveEvent({
			id: probs.id,
			name: probs.name,
			url: probs.url,
			visibility: probs.visibility,
			liked: event,
		});
	});

	const loadEvents = () => {
		const events = Storage.value;
		return events ? events : [];
	};

	const saveEvent = (event) => {
		let events = loadEvents();
		if (event.liked) {
			events = events.filter((e) => e.id !== probs.id);
			events.push(event);
		} else {
			events = events.filter((e) => e.id !== event.id);
		}
		Storage.value = events;
	};

	onMounted(() => {
		const events = loadEvents();
		const event = events.find((e) => e.id === probs.id);
		if (event) {
			liked.value = event.liked;
		}
	});
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

	.like-animation {
		animation: like-animation 0.5s ease-in-out;
	}
</style>
