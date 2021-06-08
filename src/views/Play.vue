<template>
  <div id="play">
      <h1>🎮 Play the game!</h1>

      <div v-if="currentChannel">
        <button @click="leaveLobby(currentChannel)">Leave lobby</button>
      </div>

      <div v-if="lobbies">
        <div v-for="(lobby, i) in lobbies" :key="i">
          {{ `${lobby.name}: ${lobby.players.length} players` }}
          <button @click="joinLobby(lobby.channel)">Join lobby</button>
        </div>
      </div>

      <hr>

      <div v-if="game">
        <h1>Game</h1>
        <p>Test your reaction time</p>

        <p>Current lobby: {{ game.name }}</p>
        <p>Game state: {{ game.state }}</p>

        <p>Players:</p>
        <div v-for="(player, i) in game.players" :key="i">
          <p>{{ player.username }}</p>
        </div>

        <div @click="atButtonPress" class="click-cube"></div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import { mapGetters } from 'vuex';

const userToken = localStorage.getItem('token');
const socket = io(`https://zadatak-jleko.provjeri.ga/`, {
  query: {
    token: userToken
  }
});

Vue.use(VueSocketIOExt, socket);

export default {
    name: "Play",

    data(){
      return {
        lobbies: undefined,
        game: undefined,
        currentChannel: undefined,
      }
    },

    sockets: {
      connect() {
        console.log('socket.io connected');
        this.$socket.$subscribe('lobbies', lobbiesData => {
          console.log("Lobbies: ");
          console.log(lobbiesData);
          this.lobbies = lobbiesData;
        });

        // listen to lobby changes
        this.$socket.$subscribe('lobbies_update', lobbyUpdate => {
          console.log("Lobby update:");
          console.log(lobbyUpdate);
          this.lobbies = lobbyUpdate;
        });
      },
    },

    methods: {

      joinLobby(channel){
        // cant join lobby if already joined
        if(this.currentChannel){
          return;
        }

        // join lobby
        this.$socket.client.emit("joinLobby", channel);

        // save current channel
        this.currentChannel = channel;

        // subscribe for game updates
        this.$socket.$subscribe("game_update", gameUpdateData => {
          console.log("Game update:");
          console.log(gameUpdateData);

          // save current game
          this.game = gameUpdateData;

          // leave lobby if kicked out
          if(gameUpdateData.players){
            const userEmail = this.user.email;
            console.log("User email: " + userEmail);
            const isUserInGame = (gameUpdateData.players.filter(player => player.email === userEmail)) ? true : false;
            if(!isUserInGame){
              this.leaveLobby(this.currentChannel);
              return;
            }
          }else{
            this.leaveLobby(this.currentChannel);
          }
        });

        // subscribe for game finished event
        this.$socket.$subscribe("game_finished", gameFinishedData => {
          console.log("Game finished:");
          console.log(gameFinishedData);
          this.game = gameFinishedData;
          
          // leave after set time
          const secondsToLeave = 2;
          setTimeout(function(){
            this.leaveLobby(this.currentChannel);
            this.game = undefined;
          }, secondsToLeave * 1000);
        })
      },

      leaveLobby(channel){
        // cant leave lobby if not in lobby
        if(!this.currentChannel){
          return;
        }

        // leave lobby
        this.$socket.client.emit("leaveLobby", channel);

        // unsubscribe from game updates
        this.$socket.$unsubscribe("game_update");
        this.$socket.$unsubscribe("game_finished");

        // set current channel and game acccordingly
        this.currentChannel = undefined;
        this.game = undefined;
      },

      atButtonPress(){
        // initialize current date
        const t1 = new Date();

        // initialize trigger date
        const t2 = new Date(this.game.game.triggerDate);

        const currentRoundUuid = this.game.game.currentRound;
        const currentGameUuid = this.game.game.uuid;
        const playerClickDifference = t1.getTime() - t2.getTime();

        // catch error if clicked too soon
        if(playerClickDifference <= 0){
          console.log("You clicked too soon!");
          return;
        }

        this.$socket.client.emit("updateRoundResult", {roundUuid: currentRoundUuid, gameUuid: currentGameUuid, clickDifference: playerClickDifference});
      },
    },

    // compute user variable from store getter
    computed: {
      ...mapGetters({
          user: 'auth/user',
      })
    },
}
</script>

<style scoped>
.click-cube {
  width: 200px;
  height: 200px;
  background-color: red;
  border-radius: 50%;
  margin: 0 auto;
}
</style>