import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: 2, //0表示未登录，1表示用户，2表示管理员
    token: '',
    currentUser: {
      phoneNumber : '',
      username: 'aa',
      password: '',
      credit: 0,
      id: '100200300040506000',
      creditRating: 0,
      email: '',
      travelNumber: 0,
      orderList : [{
          orderid : 'X00001',
          purchaseTime : '2023-05-21',
          departureAirport : '北京大兴',
          arrivalAirport : '上海浦东',
          flight : 'M1234',
          flightTime : '2023-05-23 19:30',
          price : 1606,
          ticketList : [{
              ticketid : '',
              name : '张三',
              seat : '12C',
              food : false,
              statu : 1
          },{
              ticketid :'',
              name : '李四',
              seat : '12A',
              food : false,
              statu : 1
          }]
      },{
          orderid : 'X00002',
          purchaseTime : '2023-05-21',
          departureAirport : '北京大兴',
          arrivalAirport : '上海浦东',
          flight : 'M1234',
          flightTime : '2023-05-23 19:30',
          price : 1203,
          ticketList : [{
              ticketid :'',
              name : '王五',
              seat : '12B',
              food : false,
              statu : 1
          }]
      }]
    },
    currentFlight: {},
    airports : [{
        value : 'Beijing',
        label : '北京',
        children : [{
            value : 'PEK',
            label : '北京首都国际机场',
        },{
            value : 'PKX',
            label : '北京大兴国际机场',
        }]
    },{
        value : 'Shanghai',
        label : '上海',
        children : [{
            value : 'PVG',
            label : '上海浦东国际机场',
        },{
            value : 'SHA',
            label : '上海虹桥国际机场',
        }]
    }],
    cities : [{
        value : 'Beijing',
        label : '北京',
    },{
        value : 'Shanghai',
        label : '上海',
    },{
        value : 'Guangdong',
        label : '广东',
        children : [{
            value : 'Guangzhou',
            label : '广州',
        },{
            value : 'Shenzhen',
            label : '深圳',
        }]
    }],
    optionsInsurance : [{
        value: 0,
        label: '此航班不提供保险',
        price : 0
        }, {
        value: 1,
        label: '保险1',
        price : 3
        }, {
        value: 2,
        label: '保险2',
        price : 10
        }, {
        value: 3,
        label: '保险3',
        price : 30
    }],
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
    changeUser(state, user) {
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
