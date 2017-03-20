<template>
    <div class="nav-container">
        <el-menu theme="dark" :default-active="pathActive" class="menu" mode="vertical" unique-opened :router="true">
            <el-menu-item index="home"><i class="el-icon-message"></i>主页</el-menu-item>
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-setting"></i>广告管理</template>
                <el-menu-item index="createAdv">创建广告</el-menu-item>
                <el-menu-item index="advList">广告列表</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
    export default{
    	data() {
    		return {
    			pathActive: this.$route.path
            }
        },
        methods : {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted() {
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

</style>
