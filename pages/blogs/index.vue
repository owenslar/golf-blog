<template>
    <h1 class="mt-3 mb-4 text-2xl font-bold text-center">Check out what others are doing below!</h1>
    <div class="flex flex-row flex-wrap">
        <div v-for="blog in blogs">
            <BlogCard :blog="blog" />
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';

    const blogs = ref([]);

    onMounted(async () => {
        try {
            const response = await axios.get('/api/blogs');
            blogs.value = response.data;
        } catch (error) {
            console.error('Failed to fetch message:', error);
        }
    });

</script>