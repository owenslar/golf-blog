<template>
    <h1 class="mt-3 mb-4 text-2xl font-bold text-center">Log your golf round below</h1>
    <div class="flex flex-col border card card-compact m-2 p-6 bg-white border-gray-200 rounded-lg shadow-sm grow">
        <div class="w-full">
            <form @submit.prevent="handleSubmit">
                <div class="flex flex-col">
                    <NameInput :formData="formData"></NameInput>
                    
                    <CourseInput :formData="formData"></CourseInput>
                    
                    <DescriptionInput :formData="formData"></DescriptionInput>

                    <label for="scores" class="font-bold text-xl mr-2">Scores:</label>
                    <div>
                        <input type="radio" id="18-holes" :value="18" v-model.number="numHoles" @change="handleScoresChange(18)">
                        <label for="18-holes"> 18 Holes </label>
                        <input type="radio" id="9-holes" :value="9" v-model.number="numHoles" @change="handleScoresChange(9)">
                        <label for="9-holes"> 9 Holes </label>
                    </div>
                    <div class="grid md:grid-cols-9 md:grid-rows-2 grid-cols-3 grid-rows-6 md:gap-2 md:w-[490px] mb-4">
                        <ScoresInput v-for="n in numHoles" :key="n" :num="n" @customEvent="addItemToArray" class="w-[50px] h-[50px]"></ScoresInput>
                    </div>
                    <button type="submit" class="justify-center w-24 shrink coinline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus-ring-4 focus:outline-none focus:ring-blue-300">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        data() {
            return {
                formData: {
                    name: '',
                    course: '',
                    scores: Array(18).fill(0),
                    description: '',
                },
                recievedData: null,
                numHoles: 18,
            }
        },
        methods: {
            async handleSubmit() {
                if (this.formData.scores.includes(0)) {
                    window.alert("Please fill in all your scores");
                    return;
                }
                if (this.formData.scores.some(number => number < 0)) {
                    window.alert("Please enter valid scores");
                    return;
                }
                if (this.formData.name === '') {
                    window.alert("Please enter a name");
                    return;
                }
                if (this.formData.course === '') {
                    window.alert("Please enter a golf course");
                }
                const jsonData = JSON.stringify(this.formData);
                try {
                    const jwt = localStorage.getItem('authToken');
                    const jwtPayload = JSON.parse(window.atob(jwt.split('.')[1]));
                    const isExpired = Date.now() >= jwtPayload.exp * 1000;
                    if (isExpired) {
                        const tokenResponse = await axios.post('/api/token', { 'token': `${localStorage.getItem('refreshToken')}`});
                        localStorage.setItem('authToken', tokenResponse.data.authToken);
                    }
                    const response = await axios.post('/api/blogs', jsonData, {
                        headers: { 'Content-Type': 'application/json',
                                    'authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                } catch (error) {
                    console.error('Failed to add blog:', error);
                    window.alert(error.response.data.error);
                    return;
                }
                await navigateTo('/blogs');
            },
            addItemToArray(index, inputValue) {
                this.recievedData = inputValue;
                if (this.recievedData !== null) {
                    this.formData.scores.splice(index - 1, 1, this.recievedData);
                    this.recievedData = null;
                }
            },
            handleScoresChange(number) {
                if (number === 18) {
                    this.formData.scores = this.formData.scores.concat(Array(9).fill(0));
                } else {
                    this.formData.scores = this.formData.scores.slice(0, 9);
                }
            }
        }
    }
</script>