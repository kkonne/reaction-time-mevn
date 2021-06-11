<template>
  <div id="register">
        <h1 class="mb-3">Register page</h1>

        <form @submit.prevent="registerNewUser">

            <v-input>
                <v-text-field
                v-model="emailInput"
                label="Email"
                :rules="emailRules"
                hide-details="auto">
                </v-text-field>
            </v-input>

            <v-input>
                <v-text-field
                v-model="usernameInput"
                label="Username"
                :rules="usernameRules"
                hide-details="auto">
                </v-text-field>
            </v-input>

            <v-input>
                <v-text-field
                v-model="passwordInput"
                label="Password"
                type="password"
                :rules="passwordRules"
                hide-details="auto">
                </v-text-field>
            </v-input>

            <v-btn
            type="submit"
            elevation="2"
            outlined
            tile
            :disabled="!emailInput || !usernameInput || !passwordInput"
            >Register</v-btn>
        </form>

        <v-alert
        v-if="resData"
        color="red"
        icon="$mdiAccount"
        type="error">
        {{ resData.error }}</v-alert>
  </div>
</template>

<script>
export default {
    name: "Register",

    data(){
        return {
            resData: undefined,
            emailInput: "",
            usernameInput: "",
            passwordInput: "",
            emailRules: [
                value => !!value || 'Required.',
                value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
                },
            ],
            usernameRules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Minimum 3 characters',
            ],
            passwordRules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 8) || 'Minimum 8 characters',
                value => {
                const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return pattern.test(value) || 'Minimum 1 uppercase, 1 lowercase letter and 1 number.'
                },
                value => {
                const pattern = /[!.:()/#$@!%&*?]/;
                return pattern.test(value) || 'Minimum 1 special character.'
                }
            ],
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
            .then(response => {
                console.log(response);

                this.emailInput = "";
                this.usernameInput = "";
                this.passwordInput = "";
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
}
</script>

<style scoped>

</style>