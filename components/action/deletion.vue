<template>
    <p class=" font-medium text-sm opacity-70 mb-8">
        Account verwijderen. Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
    </p>
    <button @click="AccountDeletion" aria-label="Sumbit" class="relative flex items-center justify-center w-full mt-3 mb-3 duration-300 ease-in outline-none btn-focus btn-login">Verwijderen</button>
</template>

<script setup>

const AccountDeletion = async () => {
    await $fetch("/api/register", { method: "delete" })
    return navigateTo("/")
}

</script>


