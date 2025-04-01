<template>
    <NuxtLayout>
        <div class="mt-7 max-w-sm mx-auto text-center card">
            <p class="mt-7 text-7xl font-bold">{{  error.statusCode }}</p>
            <p class="mt-7 text-6xl">Error</p>
            <p class="mt-7">{{ error.message }}</p>
            <button class="mt-7 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus-ring-4 focus:outline-none focus:ring-blue-300" @click="handleClearError">Return Home</button>
        </div>
    </NuxtLayout>
</template>

<script setup>
    defineProps(['error'])

    const handleClearError = () => clearError({ redirect: '/' })
</script>