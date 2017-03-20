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
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    import NavBar from '../components/navBar.vue';
    export default{
        data() {
            return {}
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                isLogin: 'isLogin'
            })
        },
        methods: {
            ...mapActions([
                'loginOut'
            ]),
            handleCommand(command) {
                if (command == 'loginout') {
                    this.loginOut();
                    this.$router.push('/login');
                }
            },
            checkLogin() {
                var self = this;
                if (!self.isLogin) {
                    self.$router.push('/login');
                }
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
</style>
