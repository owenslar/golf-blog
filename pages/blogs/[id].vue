<template>
    <div>
        <p>Blog page for blog id: {{ id }}</p>
    </div>
</template>

<script setup>
    const { id } = useRoute().params;
</script>

<style scoped>

</style>