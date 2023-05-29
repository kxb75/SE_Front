<template>
    <div class="ticketInfo">
        <el-row>
            <el-col :span="2" :offset="11">
            <p class="title">历史订单</p>
            </el-col>
        </el-row>
        <el-collapse class="result-list" v-model="activeNames">
            <el-collapse-item v-for="order in this.$store.state.currentUser.orderList" :name="order.id" :key="order.id">
                <template slot="title">
                    <el-row>
                        <el-col :span="4">
                            订单号：{{order.orderid}}
                        </el-col>
                        <el-col :span="6">
                            购买时间：{{order.purchaseTime}}
                        </el-col>
                        <el-col :span="6">
                            {{order.departureAirport}} -> {{order.arrivalAirport}}
                        </el-col>
                        <el-col :span="6">
                            <el-button 
                            type="info" 
                            size="small"
                            plain 
                            @click.stop.prevent=openCollapse()
                            @click="exportData(order)">开具发票</el-button>
                        </el-col>
                    </el-row>
                </template>
                <el-table
                    :data="order.ticketList"
                    stripe>
                    <el-table-column
                    prop="departureAirport"
                    label="出发机场"
                    width="80">
                        <template slot-scope="scope">
                            {{order.departureAirport}}
                        </template>
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
                    prop="arrivalAirport"
                    label="到达机场"
                    width="100">
                        <template slot-scope="scope">
                            {{order.arrivalAirport}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="flight"
                    label="航班号"
                    width="100">
                        <template slot-scope="scope">
                            {{order.flight}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="time"
                    label="起飞时间"
                    width="160">
                        <template slot-scope="scope">
                            {{order.flightTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="乘客姓名"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="seat"
                    label="座位号"
                    width="100">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="right">
                        <template slot-scope="scope">
                            <el-button 
                                v-if="scope.row.statu == 1"
                                size="mini"
                                @click="apply(scope.row)">申请值机</el-button>
                            <el-button 
                                v-if="scope.row.statu == 2"
                                size="mini">审核值机中</el-button>
                            <el-button 
                                v-if="scope.row.statu == 3"
                                size="mini">已值机</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="right">
                        <template slot-scope="scope">
                            <el-button
                            v-if="!scope.row.food"
                            size="mini"
                            :disabled="scope.row.canceled"
                            @click="changeFood(scope.row)">预定餐食</el-button>
                            <el-button
                            v-else
                            size="mini"
                            type="primary"
                            :disabled="scope.row.canceled"
                            @click="changeFood(scope.row)">取消预定</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="right">
                        <template slot-scope="scope">
                            <el-popconfirm 
                            title="确定退票吗？"
                            @confirm="cancel(scope.row)">
                                <el-button
                                slot="reference"
                                size="mini"
                                type="danger"
                                plain
                                :disabled="scope.row.statu >= 2">
                                    <div v-if="scope.row.statu == 4">已退票</div>
                                    <div v-else>退票</div>
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
const axios = require('axios');
    export default {
        data() {
            return {
                activeNames: [],
            }
        },
        methods : {
            cancel(row) {
                row.statu = 4;
                this.updatePassenger(row);
            },
            changeFood(row) {
                row.food = !row.food; 
                this.updatePassenger(row);
            },
            updatePassenger(passenger) {
                var req = {
                    ticketid : passenger.ticketid,
                    statu : passenger.statu,
                    food : passenger.food,
                };
                axios.post('http://127.0.0.1:8000/updateTicketInfo/',req
                    ).then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        alert("something wrong!");
                        console.log(error);
                    });
            },
            apply(row) {
                if(row.statu != 1)return;
                row.statu = 2;
                this.updatePassenger(row);
            },
            exportData(order){
                var filecontent = "发 票\n------------------------------------\n";
                filecontent += "订单号：" + order.orderid + "\n";
                filecontent += "价格：" + order.price + "\n";
                filecontent += "购买时间：" + order.purchaseTime + "\n";
                filecontent += "开具发票时间：" + Date()+ "\n";
                filecontent += "\n------------------------------------\n";
                filecontent += "备注：" + order.departureAirport + " >> " + order.arrivalAirport + "\n";
                var filename = order.orderid;
			  	//定义文件内容，类型必须为Blob 否则createObjectURL会报错
			  	let content = new Blob([filecontent])	 
			  	//生成url对象
			  	let  urlObject = window.URL || window.webkitURL || window	
			  	let url = urlObject.createObjectURL(content)	
			  	//生成<a></a>DOM元素
			  	let el = document.createElement('a')
			  	//链接赋值
			  	el.href = url
			  	el.download =filename
			  	//必须点击否则不会下载
			  	el.click()		
			  	//移除链接释放资源		
			    urlObject.revokeObjectURL(url)
            }
        },
        mounted() {
            var req = {
                phoneNumber : this.$store.state.currentUser.phoneNumber,
            };
            axios.get('http://127.0.0.1:8000/getOrderInfo/',req
                ).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    this.error('获取历史订单失败')
                    console.log(error);
                });
        }
    }
</script>


<style src='../assets/css/ticketInfo.css' scoped>
</style>
