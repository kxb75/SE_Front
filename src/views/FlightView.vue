<template>
    <div class="flight back1">
        <el-row class="nomargin"></el-row>
        <el-card class="card-back">
        <p class="title"> 航班查询 </p>
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
            <el-row :gutter="0">
                <el-col :span="3" :offset="7">
                <el-form-item label="起飞城市" prop="departureCity">
                    <el-cascader
                    v-model="form.departureCity"
                    placeholder="北京"
                    :options="this.$store.state.cities"
                    filterable></el-cascader>
                </el-form-item>
                </el-col>
                <el-col :span="1" :offset="2">
                    <el-image class="icon"
                    :src="require('../img/icon.png')"
                    fit="fit"></el-image>
                </el-col>
                <el-col :span="3">
                <el-form-item label="到达城市" prop="arrivalCity">
                    <el-cascader
                    v-model="form.arrivalCity"
                    placeholder="上海"
                    :options="this.$store.state.cities"
                    filterable></el-cascader>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="6" :offset="7">
                <el-form-item label="起飞时间" prop="date">
                    <el-date-picker
                    v-model="form.date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item label="预期票价">
                    <el-input-number 
                    v-model="form.price" 
                    controls-position="right" 
                    :step="20"
                    :min="0" :max="10000"></el-input-number>
                </el-form-item>
                </el-col>
            </el-row>
            </el-form>
            <el-row :gutter="0">
            <el-col :span="7" :offset="10"><el-button class="main-button" type="primary" plain @click="submitForm('form')">查询</el-button></el-col>
            <el-col :span="6"><div id="manager" v-if="this.$store.state.identity == 2">
                <el-button v-on:click="toAddFlight" type="info">添加航班</el-button>
                <el-button type="info" @click="getExportList">导出航班</el-button>
            </div></el-col>
            </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableData"
            stripe
            class="result-list">
            <el-table-column
            prop="departure_airport"
            label="出发机场"
            width="80">
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
            width="100">
            </el-table-column>
            <el-table-column
            prop="departure_time"
            label="起飞时间"
            width="160">
            </el-table-column>
            <el-table-column
            prop="flight_number"
            label="航班号"
            width="100">
            </el-table-column>
            <el-table-column
            label="头等舱"
            width="80">
            <template slot-scope="scope">{{ Math.round(scope.row.price/10*15)}}￥</template>
            </el-table-column>
            <el-table-column
            prop="first_class_seats_available"
            label="余票"
            width="60">
            </el-table-column>
            <el-table-column
            label="商务舱"
            width="80">
            <template slot-scope="scope">{{Math.round(scope.row.price/10*13)}}￥</template>
            </el-table-column>
            <el-table-column
            prop="business_seats_available"
            label="余票"
            width="60">
            </el-table-column>
            <el-table-column
            label="经济舱"
            width="80">
            <template slot-scope="scope">{{ Math.round(scope.row.price/10*10)}}￥</template>
            </el-table-column>
            <el-table-column
            prop="economy_seats_available"
            label="余票"
            width="60">
            </el-table-column>
            <el-table-column
                align="right">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleMessage(scope.row)">查看</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-row class="nomargin"></el-row>
    </el-card>
    <el-row class="nomargin"></el-row>
    </div>
</template>

<script>
const axios = require('axios');
    export default {
        data() {
            const validate1 = (rule, value, callback) => {
                if (value[0] == this.form.departureCity[0]) {
                    callback(new Error('请选择与出发城市不同的城市'))
                } else {
                    callback()
                }
            }
            return {
                form: {},
                tableData: [ {
                    id : '',
                    arrival_airport: '北京大兴',
                    departure_airport: '上海浦东',
                    flight_number: 'M1234',
                    departure_time :'2023-05-21 19:30',
                    price : 1500,
                    business_seats_available :15,
                    economy_seats_available : 240,
                    first_class_seats_available : 30,
                    insurance : 2,
                    status : 1,
                }],
                // {
                //     id : '',
                //     arrival_airport: '北京大兴',
                //     departure_airport: '上海浦东',
                //     flight_number: 'M1234',
                //     departure_time :'2023-05-21 19:30',
                //     price : 1500,
                //     business_seats_available :15,
                //     economy_seats_available : 240,
                //     first_class_seats_available : 30,
                //     insurance : 2,
                //     status : 1,
                // }
                pickerOptions: {
                    disabledDate : (time) => {
                        if(this.$store.state.identity == 2) return false;
                        return time.getTime() < Date.now() - 24*60*60*1000;
                    },
                },
              
                rules: {
                    departureCity: [
                        { required: true, message: '请选择出发城市', trigger: 'blur' }
                    ],
                    arrivalCity: [
                        { required: true, message: '请选择到达城市', trigger: 'blur' },
                        { validator: validate1, trigger: 'blur'}
                    ],
                    date: [
                        { required: true, message: '请选择日期', trigger: 'blur' }
                    ],
                }   
            }
        },
        mounted() {
            // if(this.$store.state.cities.length == 0)this.getCity();
            // this.form = this.$store.state.searchCondition;
            // this.tableData = this.$store.state.searchResult;
            this.$nextTick(()=>{
                if(this.$store.state.submitFlag == 1) {
                this.submitForm('form');
                this.$store.commit('changeFlag', 0);
            }
            })
            
        },
        methods : {
            toAddFlight() {
                this.$router.push({path : "/addFlight"});
            },
            submitForm(formName) {
                console.log(this.$refs[formName])
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.form);
                    axios.get('/api/flight/', {
                        params : {
                            departure_city : this.form.departureCity[0],
                            arrival_city : this.form.arrivalCity[0],
                            price__lte : this.form.price,
                            date : this.form.date,
                        }
                    }).then((response) => {
                        this.tableData = response.data;
                        this.$store.state.searchCondition = this.form;
                        this.$store.state.searchResult = this.tableData;
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
            getCity() {
                axios.get('/api/getcity/'
                    ).then((response) => {
                            this.$store.state.cities = response.data.cities;
                    }).catch((error) => {
                        this.error('获取城市信息失败')
                        console.log(error);
                    });
            },
            getExportList() {
	            const _self=this
	            let jsonData = {
	                trade:{
	                    tHeader: ["flight_number","departure_city","departure_airport","arrival_city","arrival_airport","departure_time","price","insurance"],
	                    filterVal: ["flight_number","departure_city","departure_airport","arrival_city","arrival_airport","departure_time","price","insurance"],
	                    list: _self.tableData
	                }
	            }    
	            _self.exportPathMethod(jsonData)// 调用exportPathMethod对数据进行处理导出
	            _self.exportShow=false
	        },
	        exportPathMethod(data) {
	            /*
	            *注：csv文件：","逗号换列，\n换行，\t防止excel将长数字变科学计算法等样式
	            */
	            //要导出的json数据
	            let mainLists = data.trade   //主表
	            let _self = this
	            //## 数据处理
	            //一级表
	            let mainTitle = mainLists.tHeader;//一级标题
	            let mainTitleForKey = mainLists.filterVal;//一级过滤
	            let mainList = mainLists.list;//一级数据
	            let mainStr = [];
	            mainStr.push(mainTitle.join("\t,")+"\n");   //标题添加上换列转成字符串并存进数组
	            for(let i=0;i<mainList.length;i++){
	                let temp = [];
	                for(let j=0;j<mainTitleForKey.length;j++){
	                    temp.push(mainList[i][mainTitleForKey[j]]); //根据过滤器拿出对应的值
	                }
	                mainStr.push(temp.join("\t,")+"\n");    //取出来的值加上逗号换列转字符串存数组
	            }
	            // console.log(JSON.stringify(mainStr.join("")));//打印文本
	
	            //两个表数组转成字符串合并
	            let merged = mainStr.join("")
	            //console.log(JSON.stringify(merged));//打印结果
	            
	            //## 导出操作
	            // encodeURIComponent解决中文乱码
	            const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(merged)
	            // 通过创建a标签实现
	            let link = document.createElement('a')
	            link.href = uri
	            // 对下载的文件命名
	            link.download = `flight.csv`
	            document.body.appendChild(link)
	            link.click()
	        },
            handleMessage (row) {
                var currentFlight = {
                    id : row.id,
                    price1 : Math.round(row.price/10*15),
                    price2 : Math.round(row.price/10*13),
                    price3 : Math.round(row.price/10*10),
                    ticket1 : row.first_class_seats_available,
                    ticket2 : row.business_seats_available,
                    ticket3 : row.economy_seats_available,
                    insurance : row.insurance,
                    departure_airport: row.departure_airport,
                    arrival_airport: row.arrival_airport,
                    departure_time : row.departure_time,
                    flight_number : row.flight_number,
                    status : row.status, 
                }
                this.$store.commit('updateCurrentFlight',currentFlight)
                this.$router.push({path: "/flightInfo"});
            },
        },
    }
</script>
 
<style src='../assets/css/flight.css' scoped>
</style>
