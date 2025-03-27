<template>
    <div class="flex h-96 flex-col grow justify-center justify-items-center items-center content-center">
        <div class="mt-3 mb-4 text-4xl font-bold text-center">Check out the new blogs!</div>
        <div>
            <NuxtLink to="/blogs" class="m-2 inline-flex items-center px-3 py-2 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus-ring-4 focus:outline-none focus:ring-blue-300">Blogs</NuxtLink>
            <button @click="$emit('switchStateEvent')" class="m-2 inline-flex items-center px-3 py-2 text-lg font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-blue-700 focus-ring-4 focus:outline-none focus:ring-gray-300">Logout</button>
        </div>
    </div>
</template>

<script setup>
    defineEmits(['switchStateEvent']);
</script>