<template>
    <div id="navbar">
        <nav role="navigation">
            <v-list>
                <v-list-item-group>
                    <router-link to="/" class="router-link">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-home</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Home</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link to="/play" v-if="authenticated" class="router-link">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-play</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Play</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link to="/leaderboards" v-if="authenticated" class="router-link">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-trophy-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Leaderboards</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link to="/register" v-if="!authenticated" class="router-link">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Register</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link to="/login" v-if="!authenticated" class="router-link">
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-login</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Login</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <!-- username -->
                    <v-list-item v-if="authenticated" disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ user.username }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                </v-list-item-group>
            </v-list>
        </nav>
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

<style scoped>
.router-link {
    text-decoration: none;
}
</style>