<template>
    <h1 class="mt-3 mb-4 text-2xl font-bold text-center">Check out what others are doing below!</h1>
    <div class="flex flex-row flex-wrap">
        <div v-for="blog in blogs">
            <BlogCard :blog="blog" />
        </div>
    </div>
</template>

<script setup>
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
</script>