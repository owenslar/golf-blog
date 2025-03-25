<template>
    <div>
        <div class="flex flex-col border card shadow-xl  m-2 p-6 bg-white border gorder-gray-200 rounded-lg shadow-sm">
            <div class="flex flex-row">
                <h1 class="mt-4 ml-4 mr-1 text-2xl font-bold">Round Logged By:</h1>
                <div class="mt-4 ml-4 mr-4 text-2xl">{{ blog.name }}</div>
            </div>
            <div class="flex flex-row">
                <div class="mt-1 ml-4 text-lg font-bold">username:</div>
                <div class="mt-1 ml-4 text-lg">{{ blog.username }}</div>
            </div>
            <br>
            <div class="m-4 text-2xl font-bold">{{ blog.course }}</div>
            <div class="m-4">
                <p>My scorecard:</p>
                <Scorecard :blog="blog"></Scorecard>
            </div>
            <div class="m-4 text-2xl font-bold">Description:</div>
            <div class="ml-4 mt-0 text-xl">{{ blog.description }}</div>
        </div>
    </div>
</template>

<script setup>

    const { id } = useRoute().params;
    const blogs = [{ 
        id: 1,
        username: 'owenlarson',
        name: 'Owen Larson',
        course: 'Brown Deer Golf Club',
        scores: [3, 4, 6, 5, 2, 4, 5, 3, 6, 7, 4, 3, 2, 3, 3, 4, 5, 4],
        description: 'I had a good round today',
        
    },
    {
        id: 2,
        username: 'owenlarson2',
        name: 'Owen Larson',
        course: 'Finkbine Golf Course',
        scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
        description: 'Played 9 at fink',
    },
    {
        id: 3,
        username: 'owenlarson3',
        name: 'Owen Larson',
        course: 'Finkbine Golf Course',
        scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
        description: 'Played 9 at fink',
    },
    {
        id: 4,
        username: 'owenlarson4',
        name: 'Owen Larson',
        course: 'Finkbine Golf Course',
        scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
        description: 'Played 9 at fink',
    },
    {
        id: 5,
        username: 'owenlarson5',
        name: 'Owen Larson',
        course: 'Finkbine Golf Course',
        scores: [2, 4, 3, 5, 4, 3, 6, 5, 4],
        description: 'Played 9 at fink',
    }]

    const blog = blogs.find((blogData) => blogData.id === parseInt(id))
</script>

<style scoped>

</style>