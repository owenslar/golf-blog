<template>
    <div class="card card-compact shadow-xl col-span-1 max-w-sm m-2 p-6 bg-white border gorder-gray-200 rounded-lg shadow-sm">
        <div class="card-body">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ props.blog.name }} played a round!</h5>
            <h6 class="mb-2 text-2xl tracking-tight text-gray-700">{{ props.blog.course }}</h6>
            <p class="mb-3 font-normal text-gray-700">They played {{ props.blog.scores.length }} holes and scored {{ score }}.</p>
            <NuxtLink :to="`/blogs/${blog.id}`" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus-ring-4 focus:outline-none focus:ring-blue-300">
                <p>View Details</p>
            </NuxtLink>
        </div>
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
