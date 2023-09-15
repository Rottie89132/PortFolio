<template>
    <div class="flex pr-8 py-5 justify-between text-white font-extrabold text-xl">
        <div class=" flex gap-10">
            <NuxtLink class=" transition-all delay-200 opacity-40 hover:opacity-60" to="/">Home</NuxtLink>
            <NuxtLink class="transition-all delay-200 opacity-40 hover:opacity-60" to="projecten">Projecten</NuxtLink>
            <NuxtLink class=" transition-all delay-200 opacity-40 hover:opacity-60" to="About">About</NuxtLink>
            <NuxtLink class="transition-all delay-200 opacity-40 hover:opacity-60" to="Contact">Contact</NuxtLink>
        </div>
        <button class="transition-all delay-200 opacity-40 hover:opacity-60">Inlogen</button>
    </div>
</template>

<style scoped>

.router-link-active {
    @apply opacity-100
}

</style>
