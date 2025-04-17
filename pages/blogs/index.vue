<template>
    <h1 class="mt-3 mb-4 text-2xl font-bold text-center">Check out what others are doing below!</h1>
    <div v-if="loadingBlogs" class="mt-3 mb-4 text-xl text-center">
        Loading blogs...
    </div>
    <div v-else-if="blogs.length === 0 || !blogs" class="mt-3 mb-4 text-xl text-center">
        No blogs to display. Create a blog to see it here!
    </div>
    <div v-else class="flex flex-row flex-wrap">
        <div v-for="blog in blogs">
            <BlogCard :blog="blog" />
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';

    const blogs = ref([]);
    const loadingBlogs = ref(true);

    onMounted(async () => {
        try {
            loadingBlogs.value = true;
            const response = await axios.get('/api/blogs');
            blogs.value = response.data;
            loadingBlogs.value = false;
        } catch (error) {
            console.error('Failed to fetch message:', error);
        }
    });

</script>