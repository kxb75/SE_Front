import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: 2, //0表示未登录，1表示用户，2表示管理员
    token: '',
    currentUser: {
      phoneNumber: '',
      username: '',
      password: '',
      credit: 0,
      email: '',
      travelNumber: 0
    },
    searchCondition: {
      date: undefined,
      price: undefined,
      departureCity: '',
      arrivalCity: '',
    },
    searchResult: [],
    currentFlight: {},
    airports: [],
    cities: [],
    submitFlag: 0,
    optionsInsurance: [{
      value: 0,
      label: '此航班不提供保险',
      price: 0
    }, {
      value: 1,
      label: '保险1',
      price: 3
    }, {
      value: 2,
      label: '保险2',
      price: 10
    }, {
      value: 3,
      label: '保险3',
      price: 30
    }]
  },
  getters: {
  },
  mutations: {
    changeIdentity(state, newIdentity) {
      state.identity = newIdentity;
    },
    changeToken(state, newToken) {
      state.token = newToken;
    },
    changeUser(state, user) {
      state.currentUser = user;
    },
    changeFlag(state, newFlag) {
      state.submitFlag = newFlag;
    },
    updateCurrentFlight(state, flight) {
      state.currentFlight = flight;
    },
    clear(state) {
      state.currentUser = {
        phoneNumber : '',
        username: '',
        password: '',
        credit: 0,
        email: '',
        travelNumber: 0
      };
      state.token = '';
      state.searchCondition = {
        date: undefined,
        price: undefined,
        departureCity: '',
        arrivalCity: '',
    },
      state.searchResult = []
      state.currentFlight = { }
    }
  },
  actions: {
  },
  modules: {
  }
})
