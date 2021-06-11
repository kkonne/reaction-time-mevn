import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import vuetify from './plugins/vuetify'

require('@/store/subscriber')

// axios.defaults.baseURL = "https://sysdev.nsoft.com/";
axios.defaults.baseURL = "https://zadatak-jleko.provjeri.ga/";

Vue.config.productionTip = false

store.dispatch('auth/submitToken', localStorage.getItem('token'))
.then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
});
