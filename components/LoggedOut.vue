<template>
    <div class="flex h-96 flex-col grow justify-center justify-items-center items-center content-center">
        <div class="mt-3 mb-4 text-4xl font-bold text-center">Welcome to Owen's Golf Blog Site!</div>
        <div class="mt-3 mb-6 text-2xl font-bold text-center">Log in to get started</div>
        <div>
            <span class="border rounded-tl-lg rounded-bl-lg p-4 text-2xl border-grey border-2 bg-gray-300">Username</span>
            <input class="border rounded-tr-lg rounded-br-lg p-4 text-2xl border-gray border-2" type="text" v-model="username" placeholder="username" />
        </div>
        <div>
            <span class="border rounded-tl-lg rounded-bl-lg p-4 text-2xl border-grey border-2 bg-gray-300">Password </span>
            <input class="border rounded-tr-lg rounded-br-lg p-4 text-2xl border-gray border-2" type="text" v-model="password" placeholder="password">
        </div>
        <div>
            <button @click="emitLogin" class="m-2 inline-flex items-center px-3 py-2 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus-ring-4 focus:outline-none focus:ring-blue-300">Login</button>
            <button @click="emitRegister" class="m-2 inline-flex items-center px-3 py-2 text-lg font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-gray-700 focus-ring-4 focus:outline-none focus:ring-gray-300">Create</button>
        </div>
    </div>
</template>

<script setup>
    let username = null;
    let password = null;
    
    const emit = defineEmits(['loginEvent', 'registerEvent']);

    const emitLogin = () => {
        if (username === null || password === null) {
            window.alert("Please enter both a username and password");
            return;
        }
        emit('loginEvent', username, password);
    }

    const emitRegister = () => {
        if (username === null || password === null) {
        window.alert("Please enter both a username and a password");
            return;
        }
        emit('registerEvent', username, password);
    }
</script>
