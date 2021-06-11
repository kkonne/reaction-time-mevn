<template>
  <div class="about">
    <h1 class="mb-3">Leaderboards</h1>

    <p>Browse the fastest players that walk this earth 🌍</p>

    <div v-if="rankings">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Username
              </th>
              <th class="text-left">
                Reaction time (ms)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(rank, i) in rankings"
              :key="i"
            >
              <td>{{ rank.user.username }}</td>
              <td>{{ rank.reactionTime }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Leaderboards",

  data(){
    return {
      rankings: undefined,
    }
  },

  computed: {
    ...mapGetters({
        authenticated: 'auth/authenticated',
        user: 'auth/user',
    }),
  },

  mounted(){
    if(this.authenticated){
      this.axios.get('ranking/top').then((response) => {
        this.rankings = response.data.rows.slice(0,16);
      }).catch((error) => {
        console.log(error)
      });
    }
  }
}
</script>