import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        identity: 2, //0表示未登录，1表示用户，2表示管理员
        currentFlight : {},
    },
    getters: {
    },
    mutations: {
        changeIdentity(state, newIdentity) {
          state.identity = newIdentity;
        },
        updateCurrentFlight(state, flight) {
            state.currentFlight = flight;
        }
    },
    actions: {
    },
    modules: {
    }
})
