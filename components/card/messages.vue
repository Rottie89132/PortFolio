<template>
    <div v-if="item.loaded" class="p-3 xl:p-2.5 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
        <div class="flex items-center justify-between gap-2">
            <h2 class="text-xs dark:text-white font-bold truncate md:text-base">
                {{ isAdmin ? item.email : 'Je hebt een bericht verstuurd' }}
            </h2>
            <p class="text-[0.65em] dark:text-white md:text-sm opacity-70">
                {{ useTimeAgo(item.created_at).value }}
            </p>
        </div>
        <p class="dark:text-white text-balance mt-1 md:mt-0 mr-11 md:mr-32 xl:mr-32 text-xs line-clamp-2 opacity-80">
            {{ item.message }}
        </p>
        <div v-if="isAdmin" class="flex mt-2.5 md:mt-2 items-center gap-3">
            <NuxtLink :to="`/dashboard/berichten/${item._id}`" class="px-4 py-1 text-xs font-semibold text-white dark:text-black dark:bg-white dark:ring-white bg-black rounded-md ring-2 ring-black">
                Bekijken
            </NuxtLink>
            <MessagesMarked :PostRead="item.read" />
            <button v-if="DeleteMail" @click="DeleteMail(item)" class="px-[0.45em] rounded-md py-1 text-xs flex justify-center items-center font-semibold dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200">
                <Icon name="material-symbols:delete-outline" size="1.3em"></Icon>
            </button>
        </div>
        <div v-else class="flex mt-2.5 md:mt-2 items-center gap-3">
            <NuxtLink :to="`/berichten/${item._id}`" class="px-4 py-1 text-xs font-semibold text-white dark:text-black dark:bg-white dark:ring-white bg-black rounded-md ring-2 ring-black">
                Bekijken
            </NuxtLink>
            <MessagesRead :PostRead="item.read" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const { item, isAdmin, DeleteMail } = defineProps<{
        item: any;
        isAdmin: boolean;
        DeleteMail?: (item: any) => void;
    }>();


</script>
