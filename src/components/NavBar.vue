<template>
    <div class="nav-container">
        <el-menu theme="dark" :default-active="pathActive" class="menu" mode="vertical" unique-opened :router="true">
            <el-menu-item index="home"><i class="icon fa fa-tachometer"></i>主页</el-menu-item>
            <el-submenu index="1">
                <template slot="title"><i class="icon fa fa-adn"></i>广告管理</template>
                <el-menu-item index="createAdv">创建广告</el-menu-item>
                <el-menu-item index="advList">广告列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title"><i class="icon fa fa-jpy"></i>优惠券管理</template>
                <el-menu-item index="createCoupon">创建优惠券</el-menu-item>
                <el-menu-item index="couponList">优惠券列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title"><i class="icon fa fa-jpy"></i>智能调度</template>
                <el-menu-item index="gridding">城市调度运营</el-menu-item>
            </el-submenu>
            <!--<el-menu-item index="test"><i class="icon fa fa-tachometer"></i>测试</el-menu-item>-->
        </el-menu>
    </div>
</template>
<script>
    export default{
    	data() {
    		return {
    			pathActive: this.$route.path
            }
        }
    }
</script>
<style scoped>
    .nav-container {
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 180px;
        background-color: #324157;
    }
    .icon {
        display: inline-block;
        margin-right: 10px;
        width: 20px;
        line-height: 1;
        text-align: center;
        -webkit-transition: all .2s ease-in-out;
        -moz-transition: all .2s ease-in-out;
        -o-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
    }
</style>
