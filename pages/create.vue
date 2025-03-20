<template>
    Create page
    <form @submit.prevent="handleSubmit">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="formData.name"><br>

        <label for="course">Course:</label>
        <input type="text" id="course" v-model="formData.course"><br>

        <button type="submit">Submit</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                formData: {
                    name: '',
                    course: '',
                }
            }
        },
        methods: {
            handleSubmit() {
                const jsonData = JSON.stringify(this.formData);
                console.log(jsonData);
            }
        }
    }
</script>