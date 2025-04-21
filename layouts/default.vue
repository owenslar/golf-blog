<template>
    <div class="flex flex-col min-h-screen bg-neutral-100 text-neutral-700">
        <header class="shadow-sm bg-emerald-200 font-sans text-2xl">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold">Golf Blog Home</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/blogs">Blogs</NuxtLink></li>
                    <li><NuxtLink to="/create">Create</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <div class="container mx-auto p-4">
            <slot />
        </div>
        <div class="mt-auto text-center text-gray-400 mb-4">
            <span>Made by Owen Larson</span>
        </div>
    </div>
</template>

<script setup>
useHead({
    link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
})
</script>