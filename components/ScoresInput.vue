<template>
    <input type="number" id="scores" v-model="inputValue" :placeholder="placeholderString" class="w-[50px] h-[50px] border border-gray-200 text-xl" @input="$emit('customEvent', props.num, inputValue)">
</template>

<script setup>
    const props = defineProps(['num']);
    const inputValue = null;
    defineEmits(['customEvent']);
    const placeholderString = "  " + props.num;
</script>