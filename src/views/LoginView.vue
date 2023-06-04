<template>
    <div class="login">
        <el-card class="login-content">
            <div class="login-content-title">
                <el-menu :default-active="activeIndex" class="login-menu" mode="horizontal" @select="handleSelect">
                    <el-menu-item class="login-menu-items" index="1">用户</el-menu-item>
                    <el-menu-item class="login-menu-items" index="2">管理员</el-menu-item>
                </el-menu>
            </div>
            <div class="login-form-items">
                <el-form
                class="login-el-form"
                ref="form"
                :model="form"
                :rules="rules"
                label-width="80px">
                    <el-form-item label="手机号" prop="phoneNumber">
                        <el-input placeholder="请输入手机号" v-model="form.phoneNumber" clearable></el-input>
                        <div class="login-link">
                            <router-link class="login-form-link" to="/register">去注册</router-link>
                        </div>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input placeholder="请输入密码" v-model="form.password" show-password clearable></el-input>
                        <div class="login-link">
                            <router-link class="login-form-link" to="/findPassword">找回密码</router-link>
                        </div>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verfication">
                            <el-input placeholder="请输入验证码" v-model="form.verfication" clearable></el-input>
                            <span @click="refreshCode" style="cursor: pointer;">
                                <s-identify :identifyCode="identifyCode"></s-identify>
                            </span>
                        </el-form-item>
                    <el-form-item>
                        <el-button id="login-button" type="primary" @click="onSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible1"
        width="30%">
            <span>请输入正确信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        width="30%">
            <span>登录失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import SIdentify from '@/components/identify/identify.vue'
const axios = require('axios');
export default {
    components: { SIdentify },
    data() {
        var checkPhoneNumber = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            }
            setTimeout(() => {
                if (value.length != 11) {
                    return callback(new Error('手机号应为11位'));
                }
                var numbers = value.split('');
                for (var i = 0; i < numbers.length; i++) {
                    if (numbers[i] < '0' || numbers[i] > '9') {
                        return callback(new Error('手机号应为数字'));
                    }
                }
                callback();
            }, 500);
        };
        var checkPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            setTimeout(() => {
                var chars = value.split('');
                for (var i = 0; i < chars.length; i++) {
                    var j = chars[i];
                    if ((j >= 'a' && j <= 'z') || (j >= 'A' && j <= 'Z') || (j >= '0' && j <= '9') || j === '_') {
                        callback();
                    } else {
                        return callback(new Error('密码应由a-z、A-Z、0-9、下划线组成'))
                    }
                }
            }, 500);
        };
        var checkVerfication = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'));
            }
            setTimeout(() => {
                if (this.$data.form.verfication.toLowerCase() !== this.identifyCode.toLowerCase()) {
                    callback(new Error('请输入正确的验证码'));
                } else {
                    callback();
                }
            }, 500);
        };
        return {
            dialogVisible1: false,
            dialogVisible2: false,
            activeIndex: '1',
            currentIndex: 1,
            form: {
                phoneNumber: '',
                password: '',
                verfication: ''
            },
            identifyCode: '',
            identifyCodes: '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            rules: {
                phoneNumber: [
                    { validator: checkPhoneNumber, trigger: 'blur' }
                ],
                password: [
                    { validator: checkPassword, trigger: 'blur' }
                ],
                verfication: [
                    { validator: checkVerfication, trigger: 'blur'}
                ],
            }
        }
    },
    mounted() {
        this.identifyCode = ''
        this.makeCode(4)
    },
    methods: {
        toHome() {
            this.$router.push({ path: '/' });
        },
        refreshCode() {
            this.identifyCode = ''
            this.makeCode(4)
        },
        makeCode(l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                    Math.floor(Math.random() * (this.identifyCodes.length - 0) + 0)
                ]
            }
        },
        onSubmit() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    var postUser = {
                        username: this.$data.form.phoneNumber,
                        password: this.$data.form.password
                    };
                    var user = {
                        phoneNumber: this.$data.form.phoneNumber,
                        username: '',
                        password: this.$data.form.password,
                        credit: 0,
                        email: '',
                        travelNumber: 0
                    };
                    var currentIndex = this.$data.currentIndex;
                    var toHome = this.toHome;
                    var store = this.$store;
                    var data = this.$data;
                    axios.post('http://127.0.0.1:8000/login/', postUser
                    ).then(function (response) {
                        if(currentIndex == 1) {
                            var token = response.data.token;
                            store.commit('changeIdentity', 1);
                            store.commit('changeUser', user);
                            store.commit('changeToken', token);
                        } else if(currentIndex == 2) {
                            var token = response.data.token;
                            store.commit('changeToken', token);
                            store.commit('changeIdentity', 2);
                        }
                        console.log(response);
                        var token = store.state.token
                        axios.get('http://127.0.0.1:8000/userdetail/', {
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': 'Token ' + token
                            }
                        }).then(function (response) {
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
                            console.log(store.state.currentUser);
                        }).catch(function (error) {
                            console.log(error);
                        })
                        toHome();
                    }).catch(function (error) {
                        data.dialogVisible2 = true;
                        console.log(error);
                    })
                } else {
                    this.$data.dialogVisible1 = true;
                    console.log('error submit!');
                    return false;
                }
            });
        },
        handleSelect(key, keyPath) {
            this.$data.currentIndex = key;
            console.log(key, keyPath);
        }
    }
}
</script>

<style>
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    width: 500px;
    height: 450px;
}

.login-content-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 98%;
    margin-bottom: 15px;
}

.login-el-form {
    padding-right: 55px;
}

.login-form-items {
    width: 98%;
}

.login-menu-items {
    font-weight: bold;
    font-size: 120%;
}

.login-link {
    position: relative;
    height: 15px;
}

.login-form-link {
    color: #409EFF;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: 0;
    padding: 0;
    font-weight: 500;
    position: absolute;
    right: 10px;
    top: 0;
}

.login-form-link:hover {
    color: red;
    text-decoration: underline;
}

#login-button {
    width: 80%;
}
</style>