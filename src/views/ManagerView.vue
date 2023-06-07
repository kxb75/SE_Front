<template>
    <div class="manager back1" v-if="this.$store.state.identity == 2">
        <el-row class="margin1"></el-row>
        <el-card class="card-back">
        <el-row :gutter="0">
            <el-col :span="2" :offset="4">
                <el-button 
                plain
                type="primary" 
                icon="el-icon-arrow-left"
                @click="toBack">返回</el-button>
            </el-col>
            <el-col :span="4" :offset="4">
            <p class="title"> 航班信息</p>
            </el-col>
        </el-row>
        <el-row>
                <el-row>
                    <el-col :span="15" :offset="5">
                        <el-table
                            :data="tableData"
                            stripe
                            class="result-list">
                            <el-table-column
                            prop="departure_airport"
                            label="出发机场"
                            width="88">
                            </el-table-column>
                            <el-table-column
                            prop="icon"
                            label=""
                            width="35">
                                <template slot-scope="scope">
                                    <i class="el-icon-d-arrow-right"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="arrival_airport"
                            label="到达机场"
                            width="88">
                            </el-table-column>
                            <el-table-column
                            prop="flight_number"
                            label="航班号"
                            width="100">
                            </el-table-column>
                            <el-table-column
                            label="起飞时间"
                            width="250">
                                <template slot-scope="scope">
                                    <div v-if="!changing">{{scope.row.departure_time}}</div>
                                    <div v-else>
                                    <el-date-picker
                                    v-model="scope.row.departure_time"
                                    value-format="yyyy-MM-dd hh:mm"
                                    type="datetime"
                                    :clearable="false"
                                    placeholder="选择日期时间">
                                    </el-date-picker>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="4">
                    <el-row>
                        <el-button
                            v-if="!changing"
                            plain
                            :disabled="tableData[0].status == 3"
                            @click="change">修改</el-button>
                        <el-button
                            v-else
                            plain
                            type="primary"
                            :disabled="tableData[0].status == 3"
                            @click="change">保存修改</el-button>
                    </el-row>
                    <el-row>
                        <el-popconfirm 
                            title="确定取消航班吗？"
                            @confirm="cancel()">
                                <el-button
                                slot="reference"
                                type="danger"
                                plain
                                :disabled="tableData[0].status == 3">
                                    <div v-if="tableData[0].status == 3">已取消</div>
                                    <div v-else>取消航班</div>
                                </el-button>
                        </el-popconfirm>
                    </el-row>
                    </el-col>
                </el-row>
            <el-table 
                class="passenger-list"
                :data="passengerList"
                stripe>
                    <el-table-column
                    prop="full_name"
                    label="乘客姓名"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="id_card_number"
                    label="身份证号"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="seat"
                    label="座位号"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    label="餐食预定"
                    width="120">
                        <template slot-scope="scope">
                            {{scope.row.food ? '是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="right"
                        label="状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status != 1">
                                <el-button
                                v-if="scope.row.status == 2"
                                plain
                                size="medium"
                                :disabled="tableData[0].status == 3"
                                @click="pass(scope.row)">审核值机</el-button>
                                <el-button
                                v-else
                                plain
                                size="medium"
                                type="primary"
                                :disabled="tableData[0].status == 3">已值机</el-button>
                            </div>
                            <div v-else>
                                <el-button
                                plain
                                size="medium"
                                v-if="scope.row.status == 1"
                                type="warning"
                                :disabled="tableData[0].status == 3">未申请值机</el-button>
                            </div>
                        </template>
                    </el-table-column>
            </el-table>
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
            return {
                config : {
                    params : {},
                    headers :{
                        'Authorization': 'Token ' + this.$store.state.token
                    }
                },
                temp : '',
                tableData : [{status : ''}],
                passengerList : [{
                        ticketid : '',
                        name : '张三',
                        id : '100020003000400050',
                        seat : '12C',
                        statu : 1,
                        food : false,
                    },{
                        ticketid : '',
                        name : '李四',
                        id : '100020003000400051',
                        seat : '12A',
                        statu : 2,
                        food : false,
                    }],
                changing : false,
            }
        },
        methods : {
            toBack() {
                this.$router.back();
            },
            change() {
                if(this.changing) {
                    var req = {
                        departure_time : this.tableData[0].departure_time,
                        arrival_time : this.tableData[0].departure_time,
                    }
                    console.log(req);
                    this.config.params = {};
                    axios.patch('/api/flightadmin/' + this.tableData[0].id +'/',req,this.config
                    ).then((response) => {
                        console.log(response);
                    }).catch((error) => {
                        this.error('修改失败');
                        this.tableData[0].departure_time = this.temp;
                        console.log(error);
                    });
                }
                else {
                    this.temp = this.tableData[0].departure_time;
                }
                this.changing = !this.changing;
            },
            cancel() {
                var req = {
                    status : 3,
                }
                this.config.params = {};
                axios.patch('/api/flightadmin/' + this.tableData[0].id +'/',req,this.config
                    ).then((response) => {
                        console.log(response);
                        this.tableData[0].status = 3;
                    }).catch((error) => {
                        this.error('取消失败');
                        console.log(error);
                    });
            },
            pass(passenger) {
                if(passenger.status != 2) return;
                var req = {
                    id : passenger.ticketid,
                };
                console.log(req);
                this.config.params = {};
                axios.post('/api/checkin/',req,this.config
                    ).then((response) => {
                        console.log(response);
                        passenger.status = 3;
                    }).catch((error) => {
                        this.error('审核失败');
                        console.log(error);
                    });
            },
        },
        mounted() { 
            if(this.$store.state.identity != 2)return;
            this.tableData[0] = this.$store.state.currentFlight;
            console.log(this.tableData[0])
            this.config.params = {
                id : this.tableData[0].id
            }
            axios.get('/api/passenger/',this.config
            ).then((response) => {
                        this.passengerList = response.data;
                    console.log(this.passengerList);
                    }).catch((error) => {
                        this.error('获取乘客列表失败');
                        console.log(error);
                    });
        },
    }
</script>


<style src='../assets/css/manage.css' scoped>
</style>