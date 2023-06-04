<template>
    <div class="findPassword">
        <el-card class="findPassword-content">
            <div class="findPassword-title">
                <div class="findPassword-back">
                    <el-button icon="el-icon-back" @click="toBack">返回</el-button>
                </div>
                <div class="findPassword-content-title">
                    <h2>找回密码</h2>
                </div>
                <div class="findPassword-blank"></div>
            </div>

            <div class="findPassword-form-items">
                <el-form 
                class="findPassword-el-form"
                ref="findPasswordForm"
                :model="findPasswordForm"
                label-width="80px"
                :rules="rules">
                    <el-form-item label="手机号" prop="phoneNumber">
                        <el-input placeholder="请输入手机号" v-model="findPasswordForm.phoneNumber" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                            <el-input placeholder="请输入邮箱" v-model="findPasswordForm.email" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verificationCode">
                        <el-input placeholder="请输入验证码" v-model="findPasswordForm.verificationCode" 
                            style="width: 50%;" clearable></el-input>
                        <el-button id="verificationCode-button" type="primary"
                            @click="getVerificationCode">获得验证码</el-button>
                    </el-form-item>
                    <el-form-item label="密码" prop="password1">
                        <el-input placeholder="请输入密码" v-model="findPasswordForm.password1" autocomplete="off"
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input placeholder="请输入密码" v-model="findPasswordForm.password2" autocomlete="off"
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button id="findPassword-button" type="primary" @click="submitForm('findPasswordForm')">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible1"
        width="30%">
            <span>找回密码成功</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        width="30%">
            <span>找回密码失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible3"
        width="30%">
            <span>输入错误</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible4"
        width="30%">
            <span>用户未找到</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible5"
        width="30%">
            <span>用户邮箱不正确</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible6"
        width="30%">
            <span>发送验证码失败</span>
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
        var checkPassword1 = (rule, value, callback) => {
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
        var checkPassword2 = (rule, value, callback) => {
            if (!value) {
                callback(new Error('密码不能为空'));
            } else if (value !== this.findPasswordForm.password1) {
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
                if (value != this.verificationCodeRandom) {
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
            findPasswordForm: {
                phoneNumber: '',
                email: '',
                password1: '',
                password2: '',
                verificationCode: ''
            },
            rules: {
                phoneNumber: [
                    { validator: checkPhoneNumber, trigger: 'blur' }
                ],
                email: [
                    { validator: checkEmail, trigger: 'blur' }
                ],
                password1: [
                    { validator: checkPassword1, trigger: 'blur' }
                ],
                password2: [
                    { validator: checkPassword2, trigger: 'blur' }
                ],
                verificationCode: [
                    { validator: checkVerficationCode, trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        submitForm(formName) {
            var router = this.$router
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var postUser= {
                        username: this.$data.findPasswordForm.phoneNumber,
                        password: this.$data.findPasswordForm.password1
                    }
                    var data = this.$data;
                    axios.post('http://127.0.0.1:8000/retrieve/', postUser
                    ).then(function (response) {
                        console.log(response);
                        console.log('找回密码成功');
                        data.dialogVisible1 = true;
                        router.back();
                    }).catch(function (error) {
                        data.dialogVisible2 = true;
                        console.log(error);
                    })
                } else {
                    console.log('error submit!');
                    return false;
                }
            });
        },
        getVerificationCode() {
            var postCheck = {
                username: this.$data.findPasswordForm.phoneNumber,
                email: this.$data.findPasswordForm.email
            }
            var postEmail = {
                email: this.$data.findPasswordForm.email,
                send_type: 'retrieve'
            }
            var data = this.$data;
            axios.post('http://127.0.0.1:8000/checkemail/', postCheck
            ).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                if(typeof (error.response) == 'undefined') {
                    data.dialogVisible3 = true;
                } else if (error.response.data.message == 'not found user') {
                    data.dialogVisible4 = true;
                } else if(error.response.data.message == 'email not equal') {
                    data.dialogVisible5 = true;
                } else {
                    data.dialogVisible3 = true;
                }
                console.log(error);
                return;
            });
            axios.post('http://127.0.0.1:8000/sendemail/', postEmail
            ).then(function (response) {
                if (response.data.message == 'error') {
                    data.dialogVisible6 = true;
                } else {
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

<style>
.findPassword {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.findPassword-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    width: 400px;
    height: 450px;
}

.findPassword-title {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.findPassword-back {
    height: 30px;
    float: left;
    width: 90px;
}

.findPassword-blank {
    width: 90px;
}

.findPassword-form-items {
    width: 98%;
}

#verificationCode-button {
    margin-left: 10px;
}

#findPassword-button {
    width: 80%;
}
</style>