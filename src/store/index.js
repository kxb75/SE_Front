import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: 1, //0表示未登录，1表示用户，2表示管理员
    token: '',
    currentUser: {
      username: '小明',
      password: '',
      credit: 0,
      ID: '123456200201031234',
      creditRating: 0,
      email: '',
      travelNumber: 0
    },
    currentFlight: {},
  },
  getters: {
  },
  mutations: {
    changeIdentity(state, newIdentity) {
      state.identity = newIdentity;
    },
    getToken(state, newToken) {
      state.token = newToken;
    },
    changeUsername(state, user) {
      state.currentUser = user;
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
