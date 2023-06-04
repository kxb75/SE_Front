<template>
  <div class="home">
    <el-container class="home-container">
      <el-aside class="home-aside" width="65%">
        <h1 class="home-title">欢迎使用机票预订系统</h1>
        <div class="home-else">
          <p>您可以：</p>
        </div>
        <div class="home-buttons">
          <router-link class="home-link" to="/flight">
            <el-button class="home-button" plain size="mini">查询航班信息</el-button>
          </router-link>
          <router-link class="home-link" to="/login">
            <el-button class="home-button" plain size="mini">去登录</el-button>
          </router-link>
        </div>
      </el-aside>
      <el-main class="home-main">
            <template>
              <el-carousel class="home-carousel" indicator-position="outside">
                <el-carousel-item v-for="item in notice" :key="item">
                  <h3>{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
            </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notice: [
        '北京到上海的航班有部分由于天气原因已推迟，请各位旅客注意查询',
        'CP1206航班正在登机，请乘坐此次航班的旅客前往登记口开始登机',
        'CR1044航班已开始办理值机，请乘坐此次航班的旅客在c1-c12窗口办理值机',
        'CI2046航班的行李已位于48号行李转盘处，请各位旅客及时取走行李'
      ]
    }
  }
}
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 86%;
}

.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 100%;
}

.home-title {
  text-align: center;
  font-size: 300%;
  margin-top: 100px;
  margin-bottom: 100px;
}

.home-else {
  font-size: 300%;
  margin-left: 250px;
}

.home-buttons {
  margin-left: 200px;
  margin-bottom: 100px;
}

.home-link {
  margin-left: 150px;
}

.home-button {
  width: 200px;
  height: 60px;
  font-size: large;
  margin-bottom: 20px;
}

.home-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.home-carousel {
  width: 85%;
  height: 60%;
}

.el-carousel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  margin-left: 40px;
  margin-right: 40px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>