<template>
    <div class="changePassword back1">
        <el-card class="changePassword-content card-back">
            <div class="changePassword-title">
                <div class="changePassword-back">
                    <el-button icon="el-icon-back" plain @click="toBack">返回</el-button>
                </div>
                <div class="changePassword-content-title">
                    <h2>修改密码</h2>
                </div>
                <div class="changePassword-blank"></div>
            </div>

            <div class="changePassword-form-items">
                <el-form 
                class="changePassword-el-form"
                ref="changePasswordForm"
                :model="changePasswordForm"
                label-width="80px"
                :rules="rules">
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input placeholder="请输入旧密码" v-model="changePasswordForm.oldPassword" autocomplete="off"
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password1">
                        <el-input placeholder="请输入新密码" v-model="changePasswordForm.password1" autocomplete="off"
                            type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input placeholder="请输入新密码" v-model="changePasswordForm.password2" autocomlete="off"
                            type="password" clearable></el-input>
                    </el-form-item>
                    <div style="text-align: center; width: 100%; margin-left: 8%;">
                        <el-button id="changePassword-button" type="primary"
                            @click="submitForm('changePasswordForm')">确定</el-button>
                    </div>
                </el-form>
            </div>
        </el-card>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible1"
        width="30%">
            <span>修改密码失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const axios = require('axios');
export default {
    data() {
        var old = this.$store.state.currentUser.password;
        var checkOldPassword = (rule, value, callback) => {
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
                        callback(new Error('密码应由a-z、A-Z、0-9、下划线组成'))
                    }
                }
            }, 500);
            if (value == old) {
                return callback();
            } else {
                callback(new Error('旧密码错误'));
            }
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
            } else if (value !== this.changePasswordForm.password1) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        return {
            dialogVisible1: false,
            changePasswordForm: {
                oldPassword: '',
                password1: '',
                password2: '',
            },
            rules: {
                oldPassword: [
                    { validator: checkOldPassword, trigger: 'blur' }
                ],
                password1: [
                    { validator: checkPassword1, trigger: 'blur' }
                ],
                password2: [
                    { validator: checkPassword2, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var postUser = {
                        password: this.$data.changePasswordForm.password1
                    }
                    var token = this.$store.state.token;
                    var store = this.$store;
                    var data = this.$data;
                    axios.post('http://127.0.0.1:8000/userchange/', postUser, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': 'Token ' + token
                        }
                    }).then(function (response) {
                        console.log(response);
                        store.state.currentUser.password = postUser.password;
                        console.log('submit!');
                    }).catch(function (error) {
                        data.dialogVisible1 = true;
                        console.log(error);
                    })
                } else {
                    console.log('error submit!');
                    return false;
                }
            });
        },
        toBack() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.changePassword {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.changePassword-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 600px;
    height: 450px;
}

.el-card {
    opacity: 90%;
    margin-top: -100px;
    margin-left:-200px;
    width: 700px;
}

.changePassword-title {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.changePassword-back {
    height: 30px;
    float: left;
    width: 150px;
}

.changePassword-blank {
    width:100px;
}

.changePassword-form-items {
    width: 98%;
}

#changePassword-button {
    width: 40%;
}
</style>