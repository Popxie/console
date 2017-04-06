<template>
    <div>
        <div class="header">
            <div class="logo">小鸣单车</div>
            <div class="admin">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img src="./../assets/img/default-avatar.png" class="avatar">&nbsp;&nbsp;{{userInfo.username}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><i class="el-icon-edit"></i> 修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout"><i class="el-icon-close"></i> 安全退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <NavBar/>
        <div class="view-container">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <!--修改密码-->
        <div class="modify" v-show="showModify">
            <div>
                <el-form :model="modifyPwd" :rules="rules2" ref="modifyPwd" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="oldPwd">
                        <el-input type="password" v-model="modifyPwd.oldPwd"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input type="password" v-model="modifyPwd.newPwd" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="password" v-model="modifyPwd.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('modifyPwd')">提交</el-button>
                        <el-button @click="resetForm('modifyPwd')">重置</el-button>
                        <el-button @click="hide('modifyPwd')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    import NavBar from '../components/NavBar.vue';
    export default{
        data() {
            var checkPass = (rule, value, callback) => {
                if (value === '') {
                        callback(new Error('请输入旧密码'));
                    }else {
                        callback();
                    }
                };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.modifyPwd.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else if (value === this.modifyPwd.oldPwd) {
                    callback(new Error('新旧密码不能一致!'));
                }
                else {
                    callback();
                }
            };
            return {
                showModify:false,
                modifyPwd: {
                    newPwd: '',
                    oldPwd: '',
                    checkPass:'',
                    username:JSON.parse(sessionStorage.getItem('userInfo')).username
                },
                rules2: {
                    newPwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldPwd: [
                        { validator: checkPass, trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                isLogin: 'isLogin'
            })
        },
        methods: {
            ...mapActions([
                'updatePwd', 'loginOut'
            ]),
            submitForm(formName) {
                const self = this
                const upForm = {
                    newPwd:self.modifyPwd.newPwd,
                    oldPwd:self.modifyPwd.oldPwd,
                    username:self.modifyPwd.username
                }
                this.$refs[formName].validate((valid) => {
                    console.log(valid);
                    if (valid) {
                        self.updatePwd(upForm).then((modifyPwd) => {
                            alert('修改成功!');
                            this.showModify = false;
                            this.$refs[formName].resetFields();
                            this.$router.push('/login');
                        },(err) => {
                            self.$notify({
                                title: '提示',
                                message: err,
                                type: 'error'
                            })
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleCommand(command) {
                if (command == 'loginout') {
                    this.loginOut();
                    this.$router.push('/login');
                }
                this.showModify = true;
            },
            checkLogin() {
                var self = this;
                var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                if (!userInfo) {
                    self.$router.push('/login');
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            hide(formName) {
                this.showModify = false;
                this.$refs[formName].resetFields();
            }
        },
        // 监听是否登录
        watch: {
            '$route': 'checkLogin'
        },
        components: {
            NavBar
        },
        created() {
            var self = this;
            self.checkLogin();

        }
    }
</script>
<style scoped>
    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    }

    .logo {
        float: left;
        width: 180px;
        text-align: center;
        background-color: #fff;
        color: #767676;
        border-right: 1px solid #e9e9e9;
        font-weight: 700;
        font-size: 24px;
    }

    .admin {
        float: right;
        margin-right: 50px;
    }

    .avatar {
        vertical-align: middle;
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .view-container {
        position: absolute;
        top: 50px;
        right: 0;
        bottom: 0;
        left: 180px;
        overflow-y: auto;
        transition: none;
        padding: 10px 10px 0px 10px;
        background-color: #f3f3f3;
    }
    .modify{
        position: absolute;
        width: 100%;
        height:100%;
        background-color: rgba(0,0,0,0.4);
    }
    .modify>div{
        position: absolute;
        padding: 30px;
        padding-left: 0;
        z-index:4;
        width: 350px;
        height:200px;
        background: #fff;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        border: 1px solid rgba(0,0,0,0.4);
    }
</style>
