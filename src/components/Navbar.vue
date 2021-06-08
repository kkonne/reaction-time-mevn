<template>
    <div id="navbar">
        <div id="nav">
            <ul>
                <li><router-link to="/">Home</router-link></li>

                <div v-if="authenticated">
                    <li><router-link to="/play">Play</router-link></li>
                </div>

                <li><router-link to="/leaderboards">Leaderboards</router-link></li>

                <div v-if="!authenticated">
                    <li><router-link to="/register">Register</router-link></li>
                    <li><router-link to="/login">Login</router-link></li>
                </div>

                <div v-if="authenticated">
                    <li>{{ user.username }}</li>
                </div>
            </ul>
            
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "Navbar",

    computed: {
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
        })
    }
}
</script>

<style>

</style>