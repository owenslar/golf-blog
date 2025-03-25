<template>
    <div class="flex flex-col">
                <div class="flex flex-row flex-wrap :rounded-t-lg">
                    <div v-for="n in 9" class="border w-[50px] h-[25px] text-center border-black">{{ n }}</div>
                    <div v-if="props.blog.scores.length === 18" class="border w-[50px] h-[25px] text-center rounded-tr-lg border-black justify-start">In</div>
                    <div v-if="props.blog.scores.length === 9" class="border w-[50px] h-[25px] text-center rounded-tr-lg border-black justify-start">Total</div>
                </div>
                <div class="flex flex-row flex-wrap">
                    <div v-for="score in props.blog.scores.slice(0,9)" class="border w-[50px] h-[50px] flex items-center justify-center text-center border-black font-bold">{{ displayScore(score) }}</div>
                    <div v-if="props.blog.scores.length === 18" class="border w-[50px] h-[50px] flex items-center justify-center text-center border-black font-bold">{{ sumScores(props.blog.scores, 0, 9) }}</div>
                    <div v-if="props.blog.scores.length === 9" class="border w-[50px] h-[50px] flex items-center justify-center rounded-br-lg text-center border-black font-bold">{{ sumScores(props.blog.scores, 0, 9) }}</div>
                </div>
            </div>
            <div class="flex flex-col">
                <div v-if="props.blog.scores.length === 18" class="flex flex-row flex-wrap">
                    <div v-for="n in 9" class="border w-[50px] h-[25px] text-center border-black">{{ n + 9 }}</div>
                    <div class="border w-[50px] h-[25px] text-center border-black justify-start">Out</div>
                    <div class="border w-[50px] h-[25px] text-center rounded-tr-lg border-black justify-start">Total</div>
                </div>
                <div v-if="props.blog.scores.length === 18" class="flex flex-row flex-wrap">
                    <div v-for="score in props.blog.scores.slice(9,18)" class="border w-[50px] h-[50px] flex items-center justify-center text-center border-black font-bold">{{ score }}</div>
                    <div class="border w-[50px] h-[50px] flex items-center justify-center text-center border-black font-bold">{{ sumScores(props.blog.scores, 9, 18) }}</div>
                    <div class="border w-[50px] h-[50px] flex items-center justify-center rounded-br-lg text-center border-black font-bold">{{ sumScores(props.blog.scores, 0, 18) }}</div>
                </div>
            </div>
</template>

<script setup>
    const props = defineProps({
        blog: {
            type: Object,
            required: true
        }
    });

    function sumScores(scores, start, end) {
        const initialValue = 0;
        const sumWithInitial = scores.slice(start, end).reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
        return sumWithInitial
    }

    function displayScore(score) {
        if (score === 0) {
            return "N/A"
        } else {
            return score;
        }
    }
</script>