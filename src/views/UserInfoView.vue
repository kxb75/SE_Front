<template>
    <div class="userInfo back1">
        <el-card class="card-back">
        <div class="userInfo-content">
            <div class="userInfo-title">
                <div class="userInfo-content-title">
                    <h2>个人中心</h2>
                </div>
                <div class="userInfo-content-message">
                    <el-row class="userInfo-line">
                        <el-col :span="3" class="userInfo-key"><span>姓名</span></el-col>
                        <el-col :span="1" class="dot"><span>:</span></el-col>
                        <el-col :span="6" class="userInfo-value">
                            <span v-if="!isChange" class="value">{{ user.username }}</span>
                            <span v-else>
                                <el-form ref="userForm1" :model="user" :rules="rule1" style="margin-bottom: 5px;">
                                    <el-form-item prop="username">
                                        <el-input v-model="user.username"></el-input>
                                    </el-form-item>
                                </el-form>
                            </span>
                        </el-col>
                        <el-col :span="3" class="userInfo-key"><span>信用分</span></el-col>
                        <el-col :span="1" class="dot"><span>:</span></el-col>
                        <el-col :span="6" class="userInfo-value">
                            <span class="value">{{ user.credit }}</span>
                        </el-col>
                        
                    </el-row>
                    <el-row class="userInfo-line">
                        <el-col :span="3" class="userInfo-key"><span>邮箱</span></el-col>
                        <el-col :span="1" class="dot"><span>:</span></el-col>
                        <el-col :span="6" class="userInfo-value">
                            <span v-if="!isChange" class="value">{{ user.email }}</span>
                            <span v-else>
                                <el-form ref="userForm3" :model="user" :rules="rule3">
                                    <el-form-item prop="email">
                                        <el-input v-model="user.email"></el-input>
                                    </el-form-item>
                                </el-form>
                            </span>
                        </el-col>
                        <el-col :span="3" class="userInfo-key"><span>订单数</span></el-col>
                        <el-col :span="1" class="dot"><span>:</span></el-col>
                        <el-col :span="6" class="userInfo-value">
                            <span class="value">{{ user.travelNumber }}</span>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row class="userInfo-button-line">
                        <el-col :span="3" :offset="14">
                        <el-button class="userInfo-button"  type="info" plain @click="change">
                            <span v-if="!isChange">修改个人信息</span>
                            <span v-else>确定修改</span>
                        </el-button>   
                    </el-col>
                    <el-col :span="3" :offset="1">
                    <router-link to="/changePassword">
                        <el-button class="userInfo-button" type="info" plain> 修改密码 </el-button>
                    </router-link>
                    </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        width="30%">
            <span>修改成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible3"
        width="30%">
            <span>修改失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible4"
        width="30%">
            <span>请输入正确信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
    </div>
</template>

<script>
const axios = require('axios');
export default {
    data() {
        var oflush = () => {
            var token = this.$store.state.token
            var store = this.$store
            var data = this.$data
            console.log(this.$store.state);
            axios.get('/api/userdetail/', {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Token ' + token
                }
            }).then(function (response) {
                console.log(store.state);
                var user = {
                    phoneNumber: store.state.currentUser.phoneNumber,
                    username: response.data.user_nickname,
                    password: store.state.currentUser.password,
                    credit: response.data.credits,
                    email: response.data.email,
                    travelNumber: response.data.travel_num
                };
                console.log(response.data);
                store.commit('changeUser', user);
            }).catch((error) => {
                this.error('获取个人信息失败')
                console.log(error);
            })
        }
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('名字不能为空'));
            } else {
                return callback();
            }
        };
        var checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('邮箱不能为空'));
            }
            setTimeout(() => {
                var reg = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                if(reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('邮箱格式错误'));
                }
            }, 500);
        };
        return {
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            flush:oflush,
            isChange: false,
            user: {
                username: this.$store.state.currentUser.username,
                email: this.$store.state.currentUser.email,
                credit: this.$store.state.currentUser.credit,
                travelNumber: this.$store.state.currentUser.travelNumber
            },
            rule1: {
                username: [
                    { validator: checkName, trigger: 'blur' }
                ]
            },
            rule3: {
                email: [
                    { validator: checkEmail, trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.$data.flush();
    },
    methods: {
        change() {
            if(this.isChange == false) {
                this.isChange = true;
            } else {
                const formName = ['userForm1', 'userForm2', 'userForm3']
                const validates = (item) => {
                    return new Promise((resolve, reject) => {
                        if (!this.$refs[item]) {
                            resolve()
                            return false
                        }
                        this.$refs[item].validate((valid) => {
                            if (valid) {
                                resolve()
                            } else {
                                reject(new Error('验证不对'))
                            }
                        })
                    })
                }
                var data = this.$data;
                Promise.all(formName.map(item => validates(item))).then(() => {
                    var postUser = {
                        user_nickname: this.$data.user.username,
                        email: this.$data.user.email
                    };
                    var token = this.$store.state.token
                    var store = this.$store
                    axios.post('/api/userchange/', postUser, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': 'Token ' + token
                        }
                    }).then(function (response) {
                        console.log(response);
                        var user = {
                            phoneNumber: store.state.currentUser.phoneNumber,
                            username: postUser.username,
                            password: store.state.currentUser.password,
                            credit: store.state.currentUser.credit,
                            email: postUser.email,
                            travelNumber: store.state.currentUser.travelNumber
                        };
                        store.commit('changeUser', user);
                        console.log('修改成功');
                        data.dialogVisible2 = true;
                        data.isChange = false;
                        data.flush();
                    }).catch(function (error) {
                        data.dialogVisible3 = true;
                        console.log(error);
                    })
                }).catch(() => {
                    data.dialogVisible4 = true;
                    console.log('修改失败');
                })
            }
        }
    }
}
</script>

<style src='../assets/css/userInfo.css' scoped>
</style>