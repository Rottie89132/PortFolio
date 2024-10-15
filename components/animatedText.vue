<template>
    <div>
        <p class=" text-sm pr-2 dark:opacity-75 mt-2">{{ animatedText }}</p>
    </div>
</template>

<script setup lang="ts">

    const { text } = defineProps<({text: any})>();

    const inputText = text;
    const animatedText = ref("");

    const animateText = (input: string): Promise<void> => {
        return new Promise((resolve) => {
            let index = 0;
            animatedText.value = "";
            const interval = setInterval(() => {
                animatedText.value += input[index];
                index++;
                if (index === input.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 20);
        });
    };

    onMounted(async () => {
        await animateText(inputText);
    });
</script>