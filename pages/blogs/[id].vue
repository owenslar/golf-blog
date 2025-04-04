<template>
    <div class="overflow-x-auto">
        <div v-if="blog" class="flex flex-col border card shadow-xl m-1 p-6 bg-white border-gray-200 rounded-lg shadow-sm ">
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
            <div class="flex flex-row">
                <div class="mt-1 ml-4 text-lg font-bold">Logged on:</div>
                <div v-if="formattedDate" class="mt-1 ml-4 text-lg">{{ formattedDate }}</div>
                <div v-else class="mt-1 ml-4 text-lg">loading username...</div>
            </div>
            <div class="flex flex-row">
                <div class="mt-4 ml-4 mr-1 text-2xl font-bold">Course: </div>
                <div v-if="blog.course"class="m-4 text-2xl">{{ blog.course }}</div>
                <div v-else-if="blog.course === ''" class="m-4 text-2xl font-bold">N/A</div>
                <div v-else class="m-4 text-2xl font-bold">loading course...</div>
            </div>
            <div v-if="blog.scores"class="mt-4 mb-4 ml-4 overflow-x-auto">
                <p>Scorecard:</p>
                <div class="w-max">
                    <Scorecard :blog="blog"></Scorecard>
                </div>
            </div>
            <div class="m-4 text-2xl font-bold">Description:</div>
            <div v-if="blog.description" class="ml-4 mt-0 text-xl">{{ blog.description }}</div>
            <div v-else-if="blog.description === ''" class="ml-4 mt-0 text-xl">No Description</div>
            <div v-else class="ml-4 mt-0 text-xl">loading description...</div>
            <br>
            <button @click="deleteBlog" class="inline-flex items-center w-[68px] m-4 px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus-ring-4 focus:outline-none focus:ring-red-300">Delete</button>
        </div>
        <div v-else class="mt-8 mb-4 text-4xl font-bold text-center">Blog not found</div>
    </div>
</template>

<script setup>

    import axios from 'axios';

    const { id } = useRoute().params;

    const blog = ref({});

    const deleteBlog = async () => {
        try {
            const jwt = localStorage.getItem('authToken');
            if (!jwt) {
                window.alert("Please log in before deleting a blog");
                return;
            }
            const jwtPayload = JSON.parse(window.atob(jwt.split('.')[1]));
            const isExpired = Date.now() >= jwtPayload.exp * 1000;
            if (isExpired) {
                const tokenResponse = await axios.post('/api/token', { 'token': `${localStorage.getItem('refreshToken')}`});
                localStorage.setItem('authToken', tokenResponse.data.authToken);
            }
            const response = await axios.delete(`/api/blogs/${id}`, {
                headers: { 'authorization': `Bearer ${localStorage.getItem('authToken')}`}
            });
        } catch (error) {
            console.error('Failed to delete blog: ', error);
            window.alert(error.response.data.error);
            return;
        }
        await navigateTo('/blogs');
    }

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

    const formattedDate = computed(() => {
        if (!blog.value.date) {
            return 'Unknown Date';
        }
        const rawDate = new Date(blog.value.date);
        return rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
</script>

<style scoped>

</style>