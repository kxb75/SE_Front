<template>
  <div class="home">
    <el-container class="home-container">
      <h1 class="home-title" style="float: left;">欢迎来到机票预订系统</h1>
      <el-carousel class="home-carousel">
        <el-carousel-item class="home-carousel-item" v-for="item in 2" :key="item">
          <img :src="require(`../img/image${item}.png`)" alt="" style="height: 100%; width: 100%;"/>
        </el-carousel-item>
      </el-carousel>
      <el-card class="home-card">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="起飞城市" prop="departureCity">
                <el-cascader
                  v-model="form.departureCity"
                  placeholder="北京"
                  :options="this.$store.state.cities"
                  filterable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="到达城市" prop="arrivalCity">
                <el-cascader
                v-model="form.arrivalCity"
                placeholder="上海"
                :options="this.$store.state.cities"
                filterable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起飞时间" prop="date">
                <el-date-picker
                v-model="form.date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择日期"
                style="width: 90%;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-button class="main-button" type="primary" plain @click="subForm">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-container>
  </div>
</template>

<script>
const axios = require('axios');
export default {
    data() {
        const validate1 = (rule, value, callback) => {
            if (value[0] == this.form.departureCity[0]) {
                callback(new Error("请选择与出发城市不同的城市"));
            }
            else {
                callback();
            }
        };
        return {
            form: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                },
            },
            rules: {
                departureCity: [
                    { required: true, message: "请选择出发城市", trigger: "blur" }
                ],
                arrivalCity: [
                    { required: true, message: "请选择到达城市", trigger: "blur" },
                    { validator: validate1, trigger: "blur" }
                ],
                date: [
                    { required: true, message: "请选择日期", trigger: "blur" }
                ],
            }
        };
    },
    mounted() {
        if (this.$store.state.cities.length == 0)
            this.getCity();
    },
    methods: {
        subForm() {
            this.$store.state.searchCondition = this.form;
            this.$router.push({ path: "/flight", params:{ departureCity: this.$data.departureCity} });
            this.$store.commit('changeFlag', 1);
        },
        getCity() {
          axios.get('/api/getcity/'
          ).then((response) => {
            this.$store.state.cities = response.data.cities;
          }).catch((error) => {
            this.error('获取城市信息失败')
            console.log(error);
          });
        }
    }
}
</script>

<style src="../assets/css/home.css" scoped>
</style>