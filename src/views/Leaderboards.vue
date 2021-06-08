<template>
  <div class="about">
    <h1>Leaderboards</h1>

    <div v-if="rankings">
      <p v-for="(rank, i) in rankings.rows" :key="i">
        {{ rank.reactionTime }}
      </p>
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
        this.rankings = response.data;
      }).catch((error) => {
        console.log(error)
      });
    }
  }
}
</script>