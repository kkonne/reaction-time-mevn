<template>
  <div id="play">

      <div v-if="!currentChannel">
        <h1 class="mb-3 text-center">🎮 Play the game!</h1>

        <p class="text-center">Join a lobby of your wish to start a game</p>

        <v-container>
          <v-row justify="center" align="center">
            <v-col
              v-for="(lobby, i) in lobbies"
              :key="i"
              xs="12"
              md="2">
              <v-card
                class="pa-2"
                outlined>

                <v-card-title>{{ lobby.name }}</v-card-title>

                <v-card-text class="mx-n4">
                  <div class="grey--text ms-4">
                    {{ `${lobby.players.length} players` }}
                  </div>

                  <v-divider class="mx-4 my-2"></v-divider>

                  <div class="ms-4">
                    {{ lobby.state == "IN_PROGRESS" ? "Game in progress" : (lobby.state == "WAITING" ? "Waiting for players" : "Starting the game") }}
                  </div>
                </v-card-text>

                <v-card-actions class="mx-2">
                  <v-btn
                    color="red darken-2"
                    outlined
                    @click="joinLobby(lobby.channel)"
                    :disabled="lobby.state != 'WAITING'"
                  >
                    Join
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div v-else>
        <!-- lobby info -->
        <div class="lobby-info" v-if="currentLobby">
          <v-row justify="space-between" class="text-center">
            <v-col xs="12" md="3">
              <v-btn
              @click="leaveLobby()"
              type="button"
              elevation="2"
              outlined
              tile>
              Leave lobby</v-btn>
            </v-col>
            <v-col xs="12" md="3" class="font-weight-bold"><h1>{{ currentLobby.name }}</h1></v-col>
            <v-col xs="12" md="4">{{ `Round: ${currentLobby.game.currentRoundNumber ? currentLobby.game.currentRoundNumber : "0"}` }}</v-col>
          </v-row>

          
        </div>
        
        <div v-if="currentGame" class="my-5">
          <!-- game -->
          <div v-if="!gameFinished" class="game text-center">
            <!-- if game.state == waiting -->
            <div v-if="currentGame.state == 'WAITING'">
              Waiting for players...
            </div>

            <!-- if game.state == starting -->
            <div v-if="currentGame.state == 'STARTING'">
              Game begins in {{ this.secondsUntilStart }} seconds
            </div>
            
            <!-- if game.state == in progress -->
            <div v-if="currentGame.state == 'IN_PROGRESS'">

              <div v-if="!reactionTime">
                <div v-if="!clickable" class="waiting-button">Wait...</div>
                <div v-if="clickable" @click="atButtonPress" class="reaction-button">Click!</div>
              </div>
              <div v-else>
                <div v-if="!clickable" @click="atButtonPress" class="clicked-button">Clicked.</div>
                <p>You're fast! Reaction time: {{ reactionTime }} ms</p>
              </div>

              <!-- scoreboard -->
              <div v-if="scoreboard && currentGame.state === 'IN_PROGRESS'">
                <p class="text-center">Scoreboard</p>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          User
                        </th>
                        <th class="text-left">
                          Reaction time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(rank, i) in scoreboard"
                        :key="i"
                      >
                        <td>{{ rank.user.email }}</td>
                        <td>{{ rank.reactionTime ? rank.reactionTime : 'waiting...' }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            Game finished!
            <br>
            Winner: {{ gameFinished.game.winner }}
          </div>
        </div>
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
        currentGame: undefined,
        currentChannel: undefined,
        currentLobby: undefined,
        secondsUntilStart: undefined,
        clickable: false,
        reactionTime: undefined,
        gameFinished: undefined,
        scoreboard: undefined,
      }
    },

    sockets: {
      connect() {
        this.$socket.client.on('lobbies', lobbiesData => {
          this.lobbies = lobbiesData;
        });

        // listen to lobby changes
        this.$socket.client.on('lobbies_update', lobbyUpdate => {
          this.lobbies = lobbyUpdate;

          this.currentLobby = lobbyUpdate.find((lobby) => {
            if(lobby.channel === this.currentChannel){
              return lobby
            }
          });
        });
      },
    },

    methods: {

      joinLobby(channel){
        const el = this;

        // cant join lobby if already joined
        if(this.currentChannel){
          return;
        }

        // join lobby
        this.$socket.client.emit("joinLobby", channel);

        // save current channel
        this.currentChannel = channel;

        /*
        It says in socket.io vue ext docs that .$subscribe and .$unsubscribe
        should be used however I had some issues with those so I used old
        .on and .off functions
        */

        // subscribe for game updates
        this.$socket.client.on('game_update', (gameUpdateData) => {

          // if game already exists
          if(this.currentGame){
              
            // fire this on new round
            if((this.currentGame.game.currentRound !== gameUpdateData.game.currentRound)){

              // refresh scoreboard table
              this.scoreboard = undefined
              
              // refresh reaction time
              this.reactionTime = undefined;

              // if game state is in progress, set timer to show green button
              if(gameUpdateData.state === "IN_PROGRESS"){
                el.calculateTriggerDate(gameUpdateData.game.triggerDate);
              }

            }

            // fire this on 2nd round and up (for player rank checking)
            if((this.currentGame.game.currentRound !== null && this.currentGame.game.currentRound !== gameUpdateData.game.currentRound)){
              
              // leave lobby if last place on previous round
              if(gameUpdateData.players){
                const userEmail = this.user.email;

                const previousRoundRankings = this.currentGame.game.rounds.pop().rankings;

                let slowestReaction = 1;
                let slowestReactionMail = "";
                previousRoundRankings.forEach(ranking => {
                  if(ranking.reactionTime > slowestReaction){
                    slowestReaction = ranking.reactionTime;
                    slowestReactionMail = ranking.user.email;
                  }
                });

                const isUserLast = userEmail === slowestReactionMail ? true : false;
                
                if(isUserLast){
                  this.leaveLobby();
                  alert("You were last! Keep practicing :)")
                  return;
                }
              } else {
                this.leaveLobby()
              }
            }
          }


          // save current game
          this.currentGame = gameUpdateData;

          // if game state is starting, start the timer
          if(gameUpdateData.state === "STARTING"){
            el.startTimer();
          }

          // update scoreboard
          if(this.currentGame.state === "IN_PROGRESS"){
            let lastRound = this.currentGame.game.rounds.slice(-1).pop()
            this.scoreboard = lastRound.rankings;

            /*
            There's a bug when retrieving scoreboard data on round 2 and up:
            If player 2 had reaction time 1111ms in round 1, the data will
            remain in round 2 until a new reaction time is emitted ie
            Old reaction time is displayed while new round isnt updated
            */
          }
        });

        // subscribe for game finished event
        this.$socket.client.on("game_finished", gameFinishedData => {
          this.gameFinished = gameFinishedData;
          
          // leave after set time
          const secondsToLeaveAfterFinish = 5;
          const el = this;
          setTimeout(function(){
            el.leaveLobby();
            el.gameFinished = undefined;
            el.currentGame = undefined;
          }, secondsToLeaveAfterFinish * 1000);
        });
      },

      leaveLobby(){
        // cant leave lobby if not in lobby
        if(!this.currentChannel){
          return;
        }

        // leave lobby
        this.$socket.client.emit("leaveLobby", this.currentChannel);

        // set current channel and game acccordingly
        this.currentChannel = undefined;
        this.currentGame = undefined;
        this.currentLobby = undefined,

        // unsubscribe from game updates
        this.$socket.client.off("game_update");
        this.$socket.client.off("game_finished");
      },

      atButtonPress(){
        // initialize current date
        const t1 = new Date();

        // initialize trigger date
        const t2 = new Date(this.currentGame.game.triggerDate);

        const currentRoundUuid = this.currentGame.game.currentRound;
        const currentGameUuid = this.currentGame.game.uuid;
        const playerClickDifference = t1.getTime() - t2.getTime();

        // catch error if clicked too soon
        if(playerClickDifference <= 0){
          console.log("You clicked too soon!");
          return;
        }

        this.$socket.client.emit("updateRoundResult", {roundUuid: currentRoundUuid, gameUuid: currentGameUuid, clickDifference: playerClickDifference});

        this.clickable = false;
        this.reactionTime = playerClickDifference;
      },

      startTimer(){
        // initialize current date
        const t1 = new Date();

        // initialize starting date
        const t2 = new Date(this.currentGame.startingTime);

        // seconds of difference between two dates
        const secondsDifference = Math.floor((t2.getTime() - t1.getTime()) / 1000);

        // show time until game starts
        this.secondsUntilStart = secondsDifference;

        // refresh timer every second
        const interval = setInterval(trackSeconds, 1000);
        const el = this;
        function trackSeconds() {
          if(el.secondsUntilStart <= 0){
            clearInterval(interval);
          }else{
            el.secondsUntilStart = el.secondsUntilStart - 1;
          }
        }
      },

      calculateTriggerDate(triggerDate){

        // initialize current date
        const t1 = new Date();

        // initialize trigger date
        const t2 = new Date(triggerDate);

        const triggerDateDifference = t2.getTime() - t1.getTime();

        // cancel if an error happens
        if(triggerDateDifference < 0) {
          return
        }
        
        // show clickable button when needed
        const el = this;
        setTimeout(function(){
          el.clickable = true;
        }, triggerDateDifference);
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
.waiting-button {
  width: 200px;
  height: 200px;
  background-color: red;
  border-radius: 50%;
  line-height: 200px;
  margin: 50px auto;
}

.reaction-button {
  width: 200px;
  height: 200px;
  background-color: green;
  border-radius: 50%;
  line-height: 200px;
  margin: 50px auto;
}

.clicked-button {
  width: 200px;
  height: 200px;
  background-color: gray;
  border-radius: 50%;
  line-height: 200px;
  margin: 50px auto;
}

.reaction-button:hover {
  cursor: pointer;
}
</style>