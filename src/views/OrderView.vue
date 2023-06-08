<template>
    <div class="order back1">
        <el-row class="margin2" :gutter="0"></el-row>
        <el-card class="order-content card-back">
        <el-row :gutter="0">
            <el-col :span="2" :offset="4">
                <el-button 
                plain
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
            <el-col :span="2" :offset="5">
            <p class="title nomargin">订单</p>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            航班号：{{this.currentFlight.flight_number}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            出发机场： {{this.currentFlight.departure_airport}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            到达机场： {{this.currentFlight.arrival_airport}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            起飞时间： {{this.currentFlight.departure_time}}
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="1">.</el-col>
            <el-col v-for="passenger in passengerList" :key="passenger.index" :span="7">
            <el-card>
                <el-form :model="passenger" :rules="rules" :ref="passenger.index" label-width="100px">
                    <el-form-item label="身份证号" prop="id">
                        <el-input v-model="passenger.id"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="passenger.name"></el-input>
                    </el-form-item>
                    <el-radio-group v-model="passenger.level">
                        <el-radio-button label="first">
                            <el-row class="margin2">头等舱</el-row>
                            <el-row class="margin2">{{currentFlight.price1}}￥</el-row>
                        </el-radio-button>
                        <el-radio-button label="second">
                            <el-row class="margin2">商务舱</el-row>
                            <el-row class="margin2">{{currentFlight.price2}}￥</el-row>
                        </el-radio-button>
                        <el-radio-button label="third">
                            <el-row class="margin2">经济舱</el-row>
                            <el-row class="margin2">{{currentFlight.price3}}￥</el-row>
                        </el-radio-button>
                    </el-radio-group>
                        <el-row class="margin1">
                            <el-col :span="14" :offset="4">
                                {{insurance.label}} （{{insurance.price}}￥） 
                            </el-col>
                            <el-col :span="4">
                                <el-switch v-model="passenger.insurance" :disabled="currentFlight.insurance==0"></el-switch>
                            </el-col>
                        </el-row>
                </el-form>  
            </el-card>
            </el-col>
            <el-col :span="2">
            <el-row>
                <el-button plain @click="add">添加</el-button>
            </el-row>
            <el-row>
                <el-button plain @click="reduce">删除</el-button>
            </el-row>
            </el-col>
        </el-row>
        <el-row class="margin1">
            <el-col :span="1" :offset="15">
                总计：
            </el-col>
            <el-col class="price" :span="2">
                {{getTotalPrice}}￥
            </el-col>
            <el-col :span="5" :offset="1">
                <el-button type="primary" plain class="main-button" @click="submit()">去支付</el-button>
            </el-col>
        </el-row>
    </el-card>
    </div>
</template>

<script>
const axios = require('axios');
    export default {
        data() {
            var checkId = (rule, value, callback) => {
                setTimeout(() => {
                    if (value.length != 18) {
                        return callback(new Error('身份证号应为18位'));
                    }
                    var numbers = value.split('');
                    for (var i = 0; i < numbers.length; i++) {
                        if (numbers[i] < '0' || numbers[i] > '9') {
                            if(i == 17 && numbers[i] == 'X')return callback();
                            return callback(new Error('身份证号应为数字或X'));
                        }
                    }
                    callback();
                }, 500);
            };
            return {
                config : {
                    headers :{
                        'Authorization': 'Token ' + this.$store.state.token
                    }
                },
                result : false,
                currentFlight : {},
                insurance : {},
                passengerList: [{
                    index : 0,
                    id: '',
                    name: '',
                    level: 'third',
                    insurance :false}],
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'change' },
                    ],
                    id: [
                        { required: true, message: '请输入身份证号', trigger: 'change' },
                        { validator: checkId, trigger: 'change' }
                    ],
                }   
            }
        },
        mounted() { 
            this.currentFlight = this.$store.state.currentFlight;
            this.insurance = this.$store.state.optionsInsurance[this.currentFlight.insurance];
        },
        computed: {
            getTotalPrice()  {
                var total = 0,ticketprice;
                for (var i = 0; i < this.passengerList.length;i++)
                {
                    switch(this.passengerList[i].level)
                    {
                        case 'first':
                            ticketprice = this.currentFlight.price1;
                            break;
                        case 'second':
                            ticketprice = this.currentFlight.price2;
                            break;
                        case 'third':
                            ticketprice = this.currentFlight.price3;
                            break;
                        default:
                            this.error('舱位错误');
                            break;
                    }
                    total += ticketprice ;
                    if(this.passengerList[i].insurance) total+=this.insurance.price;
                }
                return total;
            },
        },
        methods :{
            toBack() {
                this.$router.back();
            },
            add() {
                if(this.passengerList.length >= 3)return;
                var arr = {
                    index : this.passengerList.length,
                    id: '',
                    name: '',
                    level: 'third',
                    insurance :false};
                this.passengerList.push(arr);
            },
            // 表单减少一行
            reduce() {
                if(this.passengerList.length <= 1)return;
                this.passengerList.pop();
            },
            submit() {
                this.result = true;
                for(var i = 0; i < this.passengerList.length; i++) {
                    this.check(this.$refs[i.toString()][0]);
                }
                if(!this.result)return;
                var req = {
                    id : this.currentFlight.id,
                    order : [],
                };
                console.log(this.passengerList);
                for (var i = 0; i < this.passengerList.length;i++) {
                    var plevel = 0;
                    switch(this.passengerList[i].level)
                    {
                        case 'first':
                            plevel = 1;
                            break;
                        case 'second':
                            plevel = 2;
                            break;
                        case 'third':
                            plevel = 3;
                            break;
                        default:
                            console.log("er");
                            return;
                    }
                    var ticket = {
                        id_card_number : this.passengerList[i].id,
                        full_name : this.passengerList[i].name,
                        seat_type : plevel,
                        insurance : this.passengerList[i].insurance,
                    }
                    req.order.push(ticket);
                }
                console.log(req);
                axios.post('/api/ticketpurchase/',req,this.config
                    ).then((response) => {
                        this.success('购买成功');
                        this.$router.push({path : '/ticketInfo'})
                    }).catch((error) => {
                        this.error('购买失败');
                        console.log(error);
                    });
            },
            check(item) {
                item.validate((valid) => {this.result &&= valid});
            }
        }
    }
</script>

<style src="../assets/css/order.css" scoped>
</style>