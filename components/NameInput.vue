<template>
        <label for="name" class="mr-2 text-xl font-bold">Name:</label>
        <input type="text" id="name" v-model="props.formData.name" placeholder=" your name" class="border rounded-lg border-gray-200 text-xl"><br>
</template>

<script setup>
    const props = defineProps({
        formData: {
            type: Object,
            required: true
        }
    });
</script>