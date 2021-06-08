import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {
    namespaced: true,

    state: {
        user: null,
        token: null,
    },

    getters: {
        authenticated(state){
            return state.token && state.user;
        },

        user(state){
            return state.user;
        }
    },

    mutations: {
        SET_TOKEN(state, token){
            state.token = token;
        },

        SET_USER(state, data){
            state.user = data;
        }
    },

    actions: {
        async login({ dispatch } , credentials){
            const data = JSON.stringify(credentials);

            await axios.post("auth/login/", data, {
                headers: {
                    'Content-Type': "application/json"
                },
            })
            .then(res => {
                return dispatch('submitToken', res.data.token)
            })
            .catch(error => {
                console.log(error)
            });
        },

        async submitToken({ commit, state }, token){
            if(token){
                commit('SET_TOKEN', token);
            }

            if(!state.token){
                return;
            }
            
            try {
                let response = await axios.get(`auth/me`);
                
                commit('SET_USER', response.data);
            } catch (error) {
                // console.log(error);
                commit('SET_TOKEN', null);
                commit('SET_USER', null);
            }
        }
    },
}