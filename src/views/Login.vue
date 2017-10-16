<template>
    <div class="container">
        <div class="bg"></div>
        <div class="main">
            <div class="title">小鸣单车</div>
            <div class="form">
                <el-form ref="userInfo"  :model="userInfo" :rules="rules" label-width="80px" label-position="left">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="userInfo.username" placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userInfo.password" placeholder="密码" @keyup.enter.native="onSubmit('userInfo')"></el-input>
                    </el-form-item>
                    <el-button style="width: 100%" size="large" type="primary" @click="onSubmit('userInfo')">登录</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    export default{
        name: 'login',
        data() {
            return {
                userInfo: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            ...mapActions(['login']),
            onSubmit(formName) {
                const self = this;
                self.$refs[formName].validate( (valid) => {
                	if(valid) {
                        self.login(self.userInfo).then((userInfo) => {
                            self.$router.push('main/home');
                        }, (err) => {
                            self.$notify({
                                title: '提示',
                                message: err,
                                type: 'error'
                            })
                        })
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .container {
        position: fixed;
        width: 100%;
        height: 100%;
        background: -webkit-linear-gradient(45deg, #020031 0%, #6d3353 100%);
    }

    .bg {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: url(./../assets/img/bs-docs-masthead-pattern.png) repeat center center;
        opacity: .4;
    }

    .title {
        text-shadow: -1px -1px rgba(197, 223, 248, 0.8), -2px -2px rgba(197, 223, 248, 0.8), -3px -3px rgba(197, 223, 248, 0.8), -4px -4px rgba(197, 223, 248, 0.8), -5px -5px rgba(197, 223, 248, 0.8), -6px -6px rgba(197, 223, 248, 0.8);
        text-align: center;
        color: #fff;
        font-size: 70px;
        font-weight: 700;
    }

    .main {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -200px;
        margin-left: -200px;
        width: 400px;
    }

    .form {
        margin: 20px auto;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, .16), 0 2px 10px rgba(0, 0, 0, .12);
        background-color: #fff;
    }
</style>
