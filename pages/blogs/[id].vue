<template>
    <div>
        <div v-if="blog" class="flex flex-col border card shadow-xl  m-2 p-6 bg-white border gorder-gray-200 rounded-lg shadow-sm">
            <div class="flex flex-row">
                <h1 class="mt-4 ml-4 mr-1 text-2xl font-bold">Round Logged By:</h1>
                <div v-if="blog.name" class="mt-4 ml-4 mr-4 text-2xl">{{ blog.name }}</div>
                <div v-else-if="blog.name === ''" class="mt-4 ml-4 mr-4 text-2xl">N/A</div>
                <div v-else class="mt-4 ml-4 mr-4 text-2xl">loading name...</div>
            </div>
            <div class="flex flex-row">
                <div class="mt-1 ml-4 text-lg font-bold">username:</div>
                <div v-if="blog.username" class="mt-1 ml-4 text-lg">{{ blog.username }}</div>
                <div v-else-if="blog.username === ''" class="mt-1 ml-4 text-lg">N/A</div>
                <div v-else class="mt-1 ml-4 text-lg">loading username...</div>
            </div>
            <br>
            <div class="flex flex-row">
                <div class="mt-4 ml-4 mr-1 text-2xl font-bold">Course: </div>
                <div v-if="blog.course"class="m-4 text-2xl">{{ blog.course }}</div>
                <div v-else-if="blog.course === ''" class="m-4 text-2xl font-bold">N/A</div>
                <div v-else class="m-4 text-2xl font-bold">loading course...</div>
            </div>
            <div v-if="blog.scores"class="m-4">
                <p>Scorecard:</p>
                <Scorecard :blog="blog"></Scorecard>
            </div>
            <div class="m-4 text-2xl font-bold">Description:</div>
            <div v-if="blog.description" class="ml-4 mt-0 text-xl">{{ blog.description }}</div>
            <div v-else-if="blog.description === ''" class="ml-4 mt-0 text-xl">No Description</div>
            <div v-else class="ml-4 mt-0 text-xl">loading description...</div>
        </div>
        <div v-else class="mt-8 mb-4 text-4xl font-bold text-center">Blog not found</div>
    </div>
</template>

<script setup>

    import axios from 'axios';

    const { id } = useRoute().params;

    const blog = ref({});

    onMounted(async () => {
        try {
            const response = await axios.get(`/api/blogs/${id}`);
            if (response) {
                blog.value = response.data;
            } else {
                blog.value = null;
            }
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            blog.value = null;
        }
    });
</script>

<style scoped>

</style>