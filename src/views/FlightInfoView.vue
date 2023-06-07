<template>
    <div class="flight-info back1">
        <el-row class="margin1" :gutter="0"></el-row>
        <el-card class="box-card card-back">
        <el-row :gutter="0">
            <el-col :span="2" :offset="3">
                <el-button 
                plain
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
            <el-col :span="4" :offset="5">
            <p class="title"> 航班信息 </p>
            </el-col>
        </el-row>
            <el-row :gutter="0">
                <el-col :span="8" :offset="3">
                航班号：{{this.form.flight_number}}<span v-if="this.form.status == 3" class="canceled">[已取消]</span>
            </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="8" :offset="3">
                出发机场： {{this.form.departure_airport}}
            </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="8" :offset="3">
                到达机场： {{this.form.arrival_airport}}
            </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="8" :offset="3">
                起飞时间： {{this.form.departure_time}}
            </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-table
                :data="tableData"
                stripe>    
                <el-table-column
                prop="title"
                label="">
                </el-table-column>
                <el-table-column
                prop="first"
                label="头等舱"
                width="120">
                </el-table-column>
                <el-table-column
                prop="second"
                label="商务舱"
                width="120">
                </el-table-column>
                <el-table-column
                prop="third"
                label="经济舱"
                width="120">
                </el-table-column>
            </el-table>
        <el-button v-if="this.$store.state.identity == 1" class="main-button" type="primary" plain @click="toOrder">去订票</el-button>
        <el-button v-if="this.$store.state.identity == 2" class="main-button" type="info" plain @click="toManager">管理航班</el-button>
    </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form : {},
                tableData:[{
                    title:'',
                    first:'',
                    second:'',
                    third:'',
                },{
                    title:'',
                    first:'',
                    second:'',
                    third:'',
                }]
            }
        },
        mounted() { 
            this.form = this.$store.state.currentFlight;
            this.tableData[0].title="票价￥";
            this.tableData[0].first=this.form.price1;
            this.tableData[0].second=this.form.price2;
            this.tableData[0].third=this.form.price3;
            this.tableData[1].title="余票--";
            this.tableData[1].first=this.form.ticket1;
            this.tableData[1].second=this.form.ticket2;
            this.tableData[1].third=this.form.ticket3;
        },
        methods :{
            toBack() {
                this.$router.back();
            },
            toOrder() {
                this.$router.push({path : "/order"});
            },
            toManager() {
                this.$router.push({path : "/manager"});
            }
        }
    }
</script>

<style src="../assets/css/flightInfo.css" scoped>
</style>