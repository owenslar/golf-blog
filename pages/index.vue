<template>
    <div v-if="!loggedIn">
        <LoggedOut @switchStateEvent="switchState"></LoggedOut>
    </div>
    <div v-else>
        <LoggedIn @switchStateEvent="switchState"></LoggedIn>
    </div>
</template>

<script setup>
    const loggedIn = ref(false);

    const switchState = () => {
        loggedIn.value = !loggedIn.value;
        console.log(loggedIn);
    }
</script>
