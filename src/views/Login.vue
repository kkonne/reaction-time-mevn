<template>
  <div id="login">
    <h1 class="mb-3">Login page</h1>

    <form @submit.prevent="loginUser">

        <v-input>
            <v-text-field
            v-model="emailInput"
            label="Email">
            </v-text-field>
        </v-input>

        <v-input>
            <v-text-field
            v-model="passwordInput"
            label="Password"
            type="password">
            </v-text-field>
        </v-input>

        <v-btn
        type="submit"
        elevation="2"
        outlined
        tile
        :disabled="!emailInput || !passwordInput"
        >Login</v-btn>
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