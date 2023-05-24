<template>
    <div class="order">
        <el-row :gutter="0">
            <el-col :span="2" :offset="2">
                <el-button 
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            航班号：{{this.currentFlight.flight}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            出发机场： {{this.currentFlight.departureAirport}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            到达机场： {{this.currentFlight.arrivalAirport}}
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="8" :offset="4">
            起飞时间： {{this.currentFlight.time}}
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20">
            <el-col :span="1">.</el-col>
            <el-col v-for="ruleForm in passengerList" :key="passengerList.index" :span="7">
            <el-card>
                <el-form :key="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="身份证号" prop="id">
                        <el-input v-model="ruleForm.id"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-radio-group v-model="ruleForm.level">
                        <el-radio-button label="first">
                            <el-row class="nomargin">头等舱</el-row>
                            <el-row class="nomargin">{{currentFlight.price1}}</el-row>
                        </el-radio-button>
                        <el-radio-button label="second">
                            <el-row class="nomargin">商务舱</el-row>
                            <el-row class="nomargin">{{currentFlight.price2}}</el-row>
                        </el-radio-button>
                        <el-radio-button label="third">
                            <el-row class="nomargin">经济舱</el-row>
                            <el-row class="nomargin">{{currentFlight.price3}}</el-row>
                        </el-radio-button>
                    </el-radio-group>
                    <el-form-item label="" prop="insurance">
                        <el-row>
                            <el-col :span="12">
                                {{currentFlight.insurance.label}} （{{currentFlight.insurance.price}}￥） 
                            </el-col>
                            <el-col :span="12">
                                <el-switch v-model="ruleForm.insurance"></el-switch>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>  
            </el-card>
            </el-col>
            <el-col :span="2">
            <el-row>
                <el-button @click="add">添加</el-button>
            </el-row>
            <el-row>
                <el-button @click="reduce">删除</el-button>
            </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="1" :offset="6">
                总计：
            </el-col>
            <el-col class="price" :span="4">
                {{getTotalPrice}}￥
            </el-col>
            <el-col :span="6">
                <el-button type="primary">去支付</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentFlight : {},
                passengerList: [{
                    index : 0,
                    id: '',
                    name: '',
                    level: 'third',
                    insurance :false}],
            }
        },
        mounted() { 
            this.currentFlight = this.$store.state.currentFlight;
            console.log(this.currentFlight);
        },
        computed: {
            getTotalPrice()  {
                var total = 0,ticketprice;
                for (var i = 0; i < this.passengerList.length;i++)
                {
                console.log(i);
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
                    }
                    total += ticketprice ;
                    if(this.passengerList[i].insurance) total+=this.currentFlight.insurance.price;
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
            // 重置方法
            resetForm() {
                console.log(this.passengerList);
            },
        }
    }
</script>

<style src="../assets/css/order.css" scoped>
</style>