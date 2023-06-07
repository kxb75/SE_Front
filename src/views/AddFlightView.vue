<template>
    <div class="addFlight back1" v-if="this.$store.state.identity == 2">
        <el-row class="margin2"></el-row>
        <el-card class="card-back">
        <el-row :gutter="0">
            <el-col :span="2" :offset="3">
                <el-button 
                plain
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
            <el-col :span="4" :offset="5">
            <p class="title"> 添加航班</p>
            </el-col>
        </el-row>
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
            <el-row :gutter="0">
                <el-col :span="7" :offset="3">
                <el-form-item label="出发机场" prop="departure_airport">
                    <el-cascader
                    v-model="form.departure_airport.name"
                    placeholder="北京"
                    :show-all-levels="false"
                    :options="this.$store.state.airports"
                    filterable
                    @change="handleChange1"></el-cascader>
                </el-form-item>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-image class="icon"
                    :src="require('../img/icon.png')"
                    fit="fit"></el-image>
                </el-col>
                <el-col :span="7">
                <el-form-item label="到达机场" prop="arrival_airport">
                    <el-cascader
                    v-model="form.arrival_airport.name"
                    placeholder="上海"
                    :show-all-levels="false"
                    :options="this.$store.state.airports"
                    filterable
                    @change="handleChange2"></el-cascader>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="7" :offset="3">
                <el-form-item label="时间" prop="departure_time">
                    <el-date-picker
                        class="width2"
                        v-model="form.departure_time"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="选择起飞时间"
                        @change="handleChange3">
                    </el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="5" :offset="3">
                <el-form-item label="航班号" prop="flight_number">
                    <el-input 
                    class="width2"
                    v-model="form.flight_number" 
                    placeholder="请输入航班号"
                    maxlength="10"></el-input>
                </el-form-item>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="0">
                <el-col :span="4" :offset="3">经济舱价格</el-col>
                <el-col :span="4">商务舱价格</el-col>
                <el-col :span="5">头等舱价格</el-col>
                <el-col :span="4">座位总数</el-col>
                <el-col :span="2">
                    <el-tooltip class="item" effect="dark" content="舱位价格按比例调整，座位按固定比例分配" placement="top-end">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="6" :offset="1">
                <el-form-item prop="price">
                <el-input-number 
                    v-model="form.price" 
                    class="width1"
                    controls-position="right" 
                    size="medium"
                    :step="20"
                    :min="0" :max="10000"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-input
                    class="width1"
                    :placeholder="form.price/10*13"
                    size="medium"
                    :disabled="true">
                  </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                        <el-input
                        class="width1"
                        :placeholder="form.price/10*15"
                        size="medium"
                        :disabled="true">
                      </el-input>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="capacity">
                <el-input-number 
                    v-model="form.capacity" 
                    class="width1"
                    controls-position="right" 
                    size="medium"
                    :step="1"
                    :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="margin1">
            <el-col :span="7" :offset="2">
            <el-form-item label="保险方案" prop="insurance">
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
                    :headers="this.config.headers"
                    action="http://127.0.0.1:8000/bulkupload/"
                    accept=".csv"
                    :before-upload="beforeUpload"
                    :limit="1"
                    :file-list="fileList"
                    :on-error="uploadFileError"
                    :on-success="uploadFileSuccess">
                    <el-button size="small" plain type="primary">从文件中导入...</el-button>
                </el-upload>
            </el-col>
            </el-row>
            </el-form>
            <el-row :gutter="0">
            <el-col :span="5" :offset="10"><el-button class="width2 main-button" type="primary" plain @click="submitForm('form')">提交</el-button></el-col>
            </el-row>
        </el-card>
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
                if(this.form.arrival_airport.name == '') callback(new new Error('请选择到达机场'))
                else{
                    if (this.form.departure_city[0] == this.form.arrival_city[0]) {
                        callback(new Error('请选择与出发城市不同的城市'))
                    } else {
                        callback()
                    }
                }
            }
            const validate2 = (rule, value, callback) => {
                if (this.form.departure_airport.name == '') callback(new new Error('请选择出发机场'))
                else callback()
            }
            var checkFlightNumber = (rule, value, callback) => {
                if (this.form.flight_number.length != 5) {
                        callback(new Error('航班号应为5位字符,例如CA025'))
                    } else {
                        callback()
                }
            }
            var checkNum =  (rule, value, callback) => {
                if (value <= 0) {
                    callback(new Error('    请输入一个正数'))
                } else {
                    callback()
                }
            }
            return {
                fileList : [],
                config : {
                    headers :{
                        'Authorization': 'Token ' + this.$store.state.token
                    }
                },
                form: {
                    price : 1000,
                    capacity : 200,
                    insurance : 0,
                    departure_city : '',
                    arrival_city : '',
                    departure_time : '',
                    arrival_time : '',
                    departure_airport : {name:''},
                    arrival_airport : { name: '' },
                    flight_number : '',
                    status : 1,
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() + 24*60*60*1000;
                    },
                },
                rules: {
                    departure_airport: [
                        { required: true, message: '请选择出发机场', trigger: 'change' },
                    { validator: validate2, trigger: 'blur' }

                    ],
                    arrival_airport: [
                        { required: true, message: '请选择到达机场', trigger: 'change' },
                        { validator: validate1, trigger: 'blur'}
                    ],
                    departure_time: [
                        { required: true, message: '请选择起飞时间', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请选择价格', trigger: 'change' },
                        { validator: checkNum, trigger: 'change' }
                    ],
                    capacity: [
                        { required: true, message: '请选择座位数', trigger: 'change' },
                        { validator: checkNum, trigger: 'change' }
                    ],
                    insurance: [
                        { required: true, message: '请选择保险方案', trigger: 'blur' }
                    ],
                    flight_number: [
                        { required: true, message: '请输入航班号', trigger: 'change' },
                        { validator: checkFlightNumber, trigger: 'change'}
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
                console.log(this.form);
                console.log(this.$store.state.token);
                console.log(this.config);
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('http://127.0.0.1:8000/flightadmin/', this.form, this.config
                    ).then((response) => {
                        this.success('添加成功');
                        this.$router.push({path:'flight'})
                    }).catch((error) => {
                        this.error('添加失败');
                        console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            getAirports() {
                axios.get('http://127.0.0.1:8000/getairport/'
                    ).then((response) => {
                        this.$store.state.airports = response.data.airports;
                    }).catch((error) => {
                        this.error('获取机场信息失败');
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
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            uploadFileError(response) { 
                if(response.status == 504)return;
                this.error('上传失败');
            },
            uploadFileSuccess() {
                this.success('上传成功');
            },
            handleChange1(value) {
                this.form.departure_city = value[0];
                this.form.departure_airport = value[1];
            },
            handleChange2(value) {
                this.form.arrival_city = value[0];
                this.form.arrival_airport = value[1];
            },
            handleChange3(value) {
                this.form.arrival_time = value;
            },
        }
    }
</script>

<style src="../assets/css/addFlight.css" scoped>
</style>