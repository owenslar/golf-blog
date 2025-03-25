<template>
        <label for="course" class="mr-2 font-bold text-xl">Course:</label>
        <input type="text" id="course" v-model="props.formData.course" placeholder=" golf course" class="border rounded-lg border-gray-200 text-xl"><br>
</template>

<script setup>
    const props = defineProps({
        formData: {
            type: Object,
            required: true
        }
    });
</script>