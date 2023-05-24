<template>
  <div id="app" class="line" style="position: relative;">
    <div v-if="this.$store.state.identity == 1">
      <el-menu 
      router
      :default-active="this.$router.path"
      class="el-menu-demo" 
      mode="horizontal" 
      @select="handleSelect" 
      >
        <el-menu-item> <i class="el-icon-position"></i></el-menu-item>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/flight">航班信息</el-menu-item>
        <el-menu-item index="/ticketInfo">我的订单</el-menu-item>
        <el-menu-item index="/userInfo">个人信息</el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
      </el-menu>
    </div>
    <div v-else>
      <el-menu 
      router
      :default-active="this.$router.path"
      class="el-menu-demo" 
      mode="horizontal" 
      @select="handleSelect" 
      >
      <el-menu-item> <i class="el-icon-position"></i></el-menu-item>
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/flight">航班信息</el-menu-item>
      <el-menu-item index="/about">关于我们</el-menu-item>
      </el-menu>
    </div>
    
    <div v-if="this.$store.state.identity == 0">
      <el-menu 
      style="position: absolute; right: 10px; top: 0;"
      :router="true"
      :default-active="this.$router.path"
      class="el-menu-demo" 
      mode="horizontal" 
      @select="handleSelect" 
      >
        <el-menu-item index="/login">登录</el-menu-item>
        <el-menu-item index="/register">注册</el-menu-item>
      </el-menu>
    </div>
    <div v-else-if="this.$store.state.identity == 1">
      <el-menu 
      style="position: absolute; right: 10px; top: 0;"
      router
      :default-active="this.$router.path"
      class="el-menu-demo" 
      mode="horizontal" 
      @select="handleSelect" 
      >
        <el-menu-item index="/userInfo">用户名字</el-menu-item>
        <el-menu-item index="/">注销</el-menu-item>
      </el-menu>
    </div>
    <div v-else>
      <el-menu 
        style="position: absolute; right: 10px; top: 0;"
        router
        :default-active="this.$router.path"
        class="el-menu-demo" 
        mode="horizontal" 
        @select="handleSelect" 
        >
          <el-menu-item index="/">管理员名字</el-menu-item>
          <el-menu-item index="/">注销</el-menu-item>
        </el-menu>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>