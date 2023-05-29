<template>
    <div class="addFlight" v-if="this.$store.state.identity == 2">
        <el-row :gutter="0">
            <el-col :span="2" :offset="5">
                <el-button 
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
            <el-col :span="2" :offset="4">
            <p class="title"> 添加航班</p>
            </el-col>
        </el-row>
        <el-card>
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
            <el-row :gutter="0">
                <el-col :span="7" :offset="3">
                <el-form-item label="出发机场" prop="departureAirport">
                    <el-cascader
                    v-model="form.departureAirport"
                    placeholder="北京"
                    :show-all-levels="false"
                    :options="this.$store.state.airports"
                    filterable></el-cascader>
                </el-form-item>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-image class="icon"
                    :src="require('../img/icon.png')"
                    fit="fit"></el-image>
                </el-col>
                <el-col :span="7">
                <el-form-item label="到达机场" prop="arrivalAirport">
                    <el-cascader
                    v-model="form.arrivalAirport"
                    placeholder="上海"
                    :show-all-levels="false"
                    :options="this.$store.state.airports"
                    filterable></el-cascader>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="5" :offset="3">
                <el-form-item label="时间" prop="time">
                    <el-date-picker
                        v-model="form.time"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="选择起飞时间">
                    </el-date-picker>
                </el-form-item>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="0">
                <el-col :span="4" :offset="7">头等舱</el-col>
                <el-col :span="4">商务舱</el-col>
                <el-col :span="4">经济舱</el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="2" :offset="5">票价</el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.price1" 
                    controls-position="right" 
                    size="medium"
                    :step="20"
                    :min="0" :max="10000"></el-input-number>
                </el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.price2" 
                    controls-position="right" 
                    size="medium"
                    :step="20"
                    :min="0" :max="10000"></el-input-number>
                </el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.price3" 
                    controls-position="right" 
                    size="medium"
                    :step="10"
                    :min="0" :max="10000"></el-input-number>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="2" :offset="5">票量</el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.ticket1" 
                    controls-position="right" 
                    size="medium"
                    :step="1"
                    :min="0" :max="1000"></el-input-number>
                </el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.ticket2" 
                    controls-position="right" 
                    size="medium"
                    :step="1"
                    :min="0" :max="1000"></el-input-number>
                </el-col>
                <el-col :span="4">
                <el-input-number 
                    v-model="form.ticket3" 
                    controls-position="right" 
                    size="medium"
                    :step="1"
                    :min="0" :max="1000"></el-input-number>
                </el-col>
            </el-row>
            <el-row :gutter="0">
            <el-col :span="7" :offset="3">
            <el-form-item label="保险方案">
            <el-select v-model="form.insurance" placeholder="请选择">
                <el-option
                v-for="item in this.$store.state.optionsInsurance"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select></el-form-item></el-col>
            <el-col :span="3" :offset="9">
                <el-upload
                    class="upload-demo"
                    action="http://127.0.0.1:8000/addFlight2/"
                    accept=".csv"
                    :before-upload="beforeUpload"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="primary">从文件中导入...</el-button>
                </el-upload>
            </el-col>
            </el-row>
            </el-form>
        </el-card>
            <el-row :gutter="0">
            <el-col :span="5" :offset="10"><el-button class="main-button" type="primary" plain @click="submitForm('form')">提交</el-button></el-col>
            </el-row>
    </div>
    <div v-else>
        <el-result icon="error" title="permission denied" subTitle="您没有权限访问此页面">
        </el-result>
    </div>
</template>

<script>
const axios = require('axios');
    export default {
        data() {
            const validate1 = (rule, value, callback) => {
                if (value[0] == this.form.departureAirport[0]) {
                    callback(new Error('请选择与出发城市不同的机场'))
                } else {
                    callback()
                }
            }
            return {
                fileList : [],
                form: {
                    time  : '',
                    price1 : 0,
                    price2 : 0,
                    price3 : 0,
                    ticket1 : 0,
                    ticket2 : 0,
                    ticket3 : 0,
                    insurance : 0,
                    departureAirport : '',
                    arrivalAirport : '',
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() + 24*60*60*1000;
                    },
                },
                rules: {
                    departureAirport: [
                        { required: true, message: '请选择出发机场', trigger: 'change' }
                    ],
                    arrivalAirport: [
                        { required: true, message: '请选择到达机场', trigger: 'change' },
                        { validator: validate1, trigger: 'blur'}
                    ],
                    time: [
                        { type: 'date', required: true, message: '请选择起飞时间', trigger: 'change' }
                    ],
                }   
            }
        },
        mounted() { 
            if(this.$store.state.airports.length == 0) this.getAirports();
        },
        methods : {
            toBack() {
                this.$router.back();
            },
            submitForm(formName) {
                console.log(this.$refs[formName])
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('http://127.0.0.1:8000/addFlight1/', this.form
                    ).then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        alert("something wrong!");
                        console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            getAirports() {
                axios.post('http://127.0.0.1:8000/getAirport/'
                    ).then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        alert("something wrong!");
                        console.log(error);
                    });
            },   
            beforeUpload(file) {
                console.log(file.type);
                const isCSV = file.type === 'text/csv';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isCSV) {
                    this.$message.error('上传文件只能是 CSV 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传文件大小不能超过 2MB!');
                }
                return isCSV && isLt2M;
            }
        }
    }
</script>

<style src="../assets/css/addFlight.css" scoped>
</style>