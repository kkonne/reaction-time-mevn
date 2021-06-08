<template>
  <div id="register">
        <h1>Register page</h1>

        <form @submit.prevent="registerNewUser">
            <label for="register-email">Email</label>
            <input v-model="emailInput" type="email" name="register-email">

            <br>

            <label for="register-username">Username</label>
            <input v-model="usernameInput" type="text" name="register-username">

            <br>

            <label for="register-password">Password</label>
            <input v-model="passwordInput" type="password" name="register-password">

            <br>

            <input type="submit" value="Register">
        </form>
  </div>
</template>

<script>
export default {
    name: "Register",

    data(){
        return {
            emailInput: "",
            usernameInput: "",
            passwordInput: "",
        }
    },

    methods: {
        async registerNewUser(){
            const data = JSON.stringify({
                email: this.emailInput,
                username: this.usernameInput,
                password: this.passwordInput,
            });

            await this.axios.post("auth/register/", data, {
                headers: {
                    'Content-Type': "application/json"
                },
            })
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }
    }
}
</script>

<style scoped>

</style>