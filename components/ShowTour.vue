<template>
    <div>
        <VTour ref="tour" :skipButton="skip" :prevButton="Vorige" :nextButton="volgende" :finishButton="finish" :steps="steps" />

    </div>
</template>

<script setup>
    const tour = ref(null);

    const volgende = { label: "Volgende" };
	const Vorige = { label: "Vorige" };
	const skip = { label: "Overslaan" };
	const finish = { label: "Voltooien" };

	const steps = useTour();

    onMounted(() => {
        setTimeout(() => {
			tour.value?.startTour();
		}, 500);
    });

</script>

<style lang="scss" scoped>

</style>