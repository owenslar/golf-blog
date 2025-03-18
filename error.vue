<template>
    <div>
        <p>{{  error.statusCode }}</p>
        <p>Oops</p>
        <p>{{ error.message }}</p>
        <button @click="handleClearError">Go Home...</button>
    </div>
</template>

<script setup>
    defineProps(['error'])

    const handleClearError = () => clearError({ redirect: '/' })
</script>