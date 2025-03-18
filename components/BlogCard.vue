<template>
    <div class="card text-center">
        <p class="font-bold text-gray-500 m-4 truncate">{{ props.blog.username }} played a round!</p>
        <p class="font-bold text-gray-500 m-4 truncate">They played {{ props.blog.scores.length }} holes and scored {{ score }}.</p>
        <NuxtLink :to="`/blogs/${blog.id}`">
            <p class="btn my-4 font-bold text-gray-700">View Details</p>
        </NuxtLink>
    </div>
</template>

<script setup>
    const props = defineProps({
        blog: {
            type: Object,
            required: true
        }
    });

    let score = 0;
    props.blog.scores.forEach(number => {
        score += number;
    });
</script>