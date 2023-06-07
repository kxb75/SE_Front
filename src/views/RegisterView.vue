<template>
    <div class="register back1">
        <el-card class="register-content card-back">
            <div class="register-title">
                <div class="register-back">
                    <el-button icon="el-icon-back" @click="toBack">返回</el-button>
                </div>
                <div class="register-content-title">
                    <h2>注册</h2>
                </div>
                <div class="register-blank"></div>
            </div>
            
            <div class="register-form-items">
                <el-form 
                class="register-el-form" 
                ref="ruleForm" 
                :model="ruleForm" 
                label-width="80px" 
                :rules="rules">
                    <el-form-item label="姓名" prop="name">
                        <el-input placeholder="请输入姓名" v-model="ruleForm.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input placeholder="请输入电子邮箱" v-model="ruleForm.email" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phoneNumber">
                        <el-input placeholder="请输入手机号" v-model="ruleForm.phoneNumber" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password1">
                        <el-input placeholder="请输入密码" v-model="ruleForm.password1" autocomplete="off" 
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input placeholder="请输入密码" v-model="ruleForm.password2" autocomlete="off" 
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verificationCode">
                        <el-input placeholder="请输入验证码" v-model="ruleForm.verificationCode" 
                            style="width: 40%;" clearable></el-input>
                        <el-button id="verificationCode-button" type="primary" plain @click="getVerificationCode">获得验证码</el-button>
                    </el-form-item>
                    <el-form-item size="medium">
                        <el-button id="register-button" type="primary" plain @click="submitForm('ruleForm')">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible1"
        width="30%">
            <span>注册成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        width="30%">
            <span>用户已存在</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="dialogVisible2 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible3"
        width="30%">
            <span>注册失败</span>
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
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible5"
        width="30%">
            <span>发送验证码失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible6"
        width="30%">
            <span>发送验证码成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible6 = false">确 定</el-button>
            </span>
        </el-dialog>
</div>
</template>

<script>
const axios = require('axios');
export default {
    data() {
        var verificationCodeRandom
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
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('邮箱格式错误'));
                }
            }, 500);
        };
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
        var checkPassword1 = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            setTimeout(() => {
                var chars = value.split('');
                if (chars.length < 6 || chars.length > 15) {
                    return callback(new Error('密码应该为6-15位'));
                }
                for(var i = 0; i < chars.length; i++) {
                    var j = chars[i];
                    if((j >= 'a' && j <= 'z') || (j >= 'A' && j <= 'Z') || (j >= '0' && j <= '9') || j === '_') {
                        callback();
                    } else {
                        return callback(new Error('密码应由a-z、A-Z、0-9、下划线组成'));
                    }
                }
            }, 500);
        };
        var checkPassword2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('密码不能为空'));
            } else if(value !== this.ruleForm.password1) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        var checkVerficationCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'));
            }
            setTimeout(() => {
                if(value != this.verificationCodeRandom) {
                    callback(new Error('验证码输入错误'));
                } else {
                    callback();
                }
            }, 500);
        };
        return {
            dialogVisible1: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            dialogVisible5: false,
            dialogVisible6: false,
            verificationCodeRandom,
            ruleForm: {
                name: '',
                email: '',
                // ID: '',
                phoneNumber: '',
                password1: '',
                password2: '',
                verificationCode: ''
            },
            rules: {
                name: [
                    { validator: checkName, trigger: 'blur'}
                ],
                email: [
                    { validator: checkEmail, trigger: 'blur' }
                ],
                // ID: [
                //     { validator: checkID, trigger: 'blur'}
                // ],
                phoneNumber: [
                    { validator: checkPhoneNumber, trigger: 'blur' }
                ],
                password1: [
                    { validator: checkPassword1, trigger: 'blur' }
                ],
                password2: [
                    { validator: checkPassword2, trigger: 'blur' }
                ],
                verificationCode: [
                    { validator: checkVerficationCode, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        toLogin() {
            this.$router.push({path:'/login'});
        },
        submitForm(formName) {
            console.log(this.$refs['ruleForm'])
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    var postUser = { 
                        username: this.$data.ruleForm.phoneNumber,
                        password: this.$data.ruleForm.password1,
                        email: this.$data.ruleForm.email,
                        user_nickname:this.$data.ruleForm.name,
                    };
                    var toLogin = this.toLogin;
                    var data = this.$data;
                    axios.post('http://127.0.0.1:8000/register/', postUser
                    ).then(function (response) {
                        data.dialogVisible1 = true;
                        console.log(response);
                        toLogin();
                    }).catch(function (error) {
                        console.log(error);
                        if(typeof(error.response) == 'undefined') {
                            console.log('no error');
                        } else {
                            if(error.response.data.username == 'A user with that username already exists.') {
                                data.dialogVisible2 = true;
                                console.log(error);
                            } else {
                                data.dialogVisible3 = true;
                                console.log(error);
                            }
                        }
                        
                    });
                } else {
                    this.$data.dialogVisible4 = true;
                    console.log('error submit!');
                    return false;
                }
            });
        },
        getVerificationCode() {
            var postEmail = {
                email: this.$data.ruleForm.email,
                send_type: 'register'
            }
            var data = this.$data;
            axios.post('http://127.0.0.1:8000/sendemail/', postEmail
            ).then(function (response) {
                if(response.data.message == 'error') {
                    data.dialogVisible5 = true;
                } else {
                    data.dialogVisible6 = true;
                    data.verificationCodeRandom = response.data.code;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        toBack() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.register {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.register-content {
    margin-top: 50px;
    opacity: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 600px;
    height: 550px;
}

.register-title {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.register-back {
    height: 30px;
    float: left;
    width: 180px;
}

.register-blank {
    width: 180px;
}

.register-form-items {
    width: 98%;
}

#register-button {
    width: 80%;
}

#verificationCode-button {
    margin-left: 20px;
}
</style>