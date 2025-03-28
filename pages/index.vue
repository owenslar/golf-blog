<template>
    <div v-if="!loggedIn">
        <LoggedOut @loginEvent="login" @registerEvent="register"></LoggedOut>
    </div>
    <div v-else>
        <LoggedIn @logoutEvent="logout"></LoggedIn>
    </div>
</template>

<script setup>

    import axios from 'axios';

    const loggedIn = ref(false);

    const switchState = () => {
        loggedIn.value = !loggedIn.value;
    }

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/login', { username: username, password: password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            localStorage.setItem('authToken', response.data.authToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch (error) {
            console.error('Failed to login:', error);
            window.alert(error);
            return;
        }
        switchState();
    }

    const register = async (username, password) => {
        try {
            const response = await axios.post('/api/register', { username: username, password: password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            localStorage.setItem('authToken', response.data.authToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch (error) {
            console.error('Failed to register:', error);
            window.alert(error);
            return;
        }
        switchState();
    }

    const logout = async () => {
        try {
            const token = localStorage.getItem('refreshToken');
            const response = await axios.delete('/api/logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.clear();
        } catch (error) {
            console.error('Failed to logout', error);
            window.alert(error);
            return;
        }
        switchState();
    }
</script>
