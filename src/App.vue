<template>
    <div>
        <Loading :loading="loading"/>
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import Loading from './components/loading.vue';
    import router from './router';
    export default {
        name: 'app',
        components: {
            Loading
        },
        computed: mapGetters({
            loading: 'getLoadStatus',
            isLogin: 'isLogin'
        }),
        methods: {
            ...mapActions([
            	'getAreas'
            ]),
            checkLogin() {
                var self = this
                if (!self.isLogin) {
                    self.$router.push('/login');
                }
            }
        },
        mounted() {
            this.checkLogin()
        }
    }
</script>

<style>
    @import "assets/css/reset.css";
    body{
        font-family: "Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","\9ED1\4F53",Arial,sans-serif;;
    }
    .el-menu-item.is-active {
        color: #18bffd!important;
    }
</style>
