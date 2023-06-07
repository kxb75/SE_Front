<template>
  <div id="app">
    <el-container class="app-container">
      <el-header>
        <div v-show="this.$store.state.identity == 0">
          <el-menu 
          router
          :default-active="this.$route.path"
          class="el-menu" 
          mode="horizontal" 
          @select="handleSelect"
          >
            <el-menu-item style="border-bottom-color: white;" index="/">
              <img src="./img/plane.png" alt="load.gif" style="width: 60px; height: 60px;"/>
            </el-menu-item>
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/flight">航班信息</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>
            <el-menu-item index="/register" style="float: right;">注册</el-menu-item>
            <el-menu-item index="/login" style="float: right;">登录</el-menu-item>
          </el-menu>
        </div>
        <div v-show="this.$store.state.identity == 1">
          <el-menu 
          router
          :default-active="this.$route.path"
          class="el-menu" 
          mode="horizontal" 
          @select="handleSelect"
          >
            <el-menu-item style="border-bottom-color: white;"> <i class="el-icon-position"></i></el-menu-item>
            <el-menu-item index="/" >首页</el-menu-item>
            <el-menu-item index="/flight">航班信息</el-menu-item>
            <el-menu-item index="/ticketInfo">我的订单</el-menu-item>
            <el-menu-item index="/userInfo">个人信息</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>
            <el-menu-item index="/" @click="logout" style="float: right; border-bottom-color: transparent;">退出</el-menu-item>
            <el-menu-item index="/userInfo" style="float: right; border-bottom-color: transparent;">{{ this.$store.state.currentUser.username }}</el-menu-item>
          </el-menu>
        </div>
        <div v-show="this.$store.state.identity == 2">
          <el-menu 
          router
          :default-active="this.$route.path"
          class="el-menu" 
          mode="horizontal" 
          @select="handleSelect"
          >
            <el-menu-item style="border-bottom-color: white;"> <i class="el-icon-position"></i></el-menu-item>
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/flight">航班信息</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>
            <el-menu-item index="/" @click="logout" style="float: right; border-bottom-color:transparent;">退出</el-menu-item>
            <el-menu-item style="float: right; border-bottom-color: transparent;">管理员</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view/>
      </el-main>
      <el-footer class="app-footer">
        <h5 class="app-foot">© 2023 BUAA Software Engineering Team. All rights reserved.</h5>
      </el-footer>
    </el-container>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      width="30%">
          <span>退出成功</span>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  data() {
    return {
      dialogVisible1: false
    }
  },
  methods: {
    flush() {
      var token = this.$store.state.token
      var store = this.$store
      if(this.$store.state.identity == 1) {
        axios.get('http://127.0.0.1:8000/userdetail/', {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Token ' + token
          }
        }).then(function (response) {
          var user = {
            phoneNumber: store.state.currentUser.phoneNumber,
            username: response.data.user_nickname,
            password: store.state.currentUser.password,
            credit: response.data.credits,
            email: response.data.email,
            travelNumber: response.data.travel_num
          };
          console.log(response.data);
          store.commit('changeUser', user);
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      sessionStorage.clear()
      this.$store.commit('clear');
      this.$store.commit('changeIdentity', 0);
      this.$data.dialogVisible1 = true;
      console.log(this.$store.state.identity);
      if(this.$route.path != '/') {
        this.$router.push({path:'/'});
      }
    }
  },
  created() {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
  },
  mounted() {
    this.flush();
  }
}
</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-main {
  height: 90%;
  overflow: auto;
}

.app-footer {
  height: 40px !important;
  width: 100%;
  align-items: center;
  background-color: rgba(240, 248, 255, 0);
}

.app-foot {
  color: rgba(128, 128, 128, 0.681);
  text-align: center;
  font-size: small;
  background-color: rgba(240, 248, 255, 0);
}
</style>