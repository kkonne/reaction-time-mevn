<template>
  <div id="login">
      <h1>Login page</h1>
      
      <form @submit.prevent="loginUser">
            <label for="login-email">Email</label>
            <input v-model="emailInput" type="email" name="login-email">

            <br>

            <label for="login-password">Password</label>
            <input v-model="passwordInput" type="password" name="login-password">

            <br>

            <input type="submit" value="Login">
        </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: "Login",

    data(){
        return {
            emailInput: "",
            passwordInput: "",
        }
    },

    methods: {
        ...mapActions({
            login: 'auth/login'
        }),

        loginUser(){
            this.login({
                email: this.emailInput,
                password: this.passwordInput,
            })
            .then(() => {
                this.$router.replace({
                    name: 'Play'
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },
}
</script>

<style scoped>

</style>