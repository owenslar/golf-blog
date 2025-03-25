<template>
        <label for="description" class="font-bold text-xl mr-2">Description:</label>
        <textarea type="text" id="description" v-model="props.formData.description" placeholder=" talk about your round" class="border rounded-lg border-gray-200 text-xl h-[200px]"></textarea><br>
</template>

<script setup>
    const props = defineProps({
        formData: {
            type: Object,
            required: true
        }
    });
</script>