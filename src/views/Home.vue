<template>
    <div class="container">
        <div class="bg">
        </div>
        <div class="main">
            <div class="company">小鸣单车</div>
            <div class="mask">——广告系统</div>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    export default{
        name: 'home',
        data() {
            return {
                message: ''
            }
        },
        computed: {
            ...mapGetters({
                test: 'getMessage'
            })
        },
        created() {

        }
    }
</script>
<style scoped>
    .container {
        position: absolute;
        top:0;
        bottom: 0;
        left:0;
        right:0;
        background: -webkit-linear-gradient(45deg, #020031 0%,#6d3353 100%);
        height: 100%;
    }
    .bg{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: url(../assets/img/bs-docs-masthead-pattern.png) repeat center center;
        opacity: .4;
    }
    .main {
        margin: 150px auto;
        width: 400px;
    }
    .company{
        text-shadow: -1px -1px rgba(197, 223, 248,0.8),-2px -2px rgba(197, 223, 248,0.8),-3px -3px rgba(197, 223, 248,0.8),-4px -4px rgba(197, 223, 248,0.8),-5px -5px rgba(197, 223, 248,0.8),-6px -6px rgba(197, 223, 248,0.8);
        color: #fff;
        font-size: 70px;
        font-weight: 700;
    }
    .mask {
        text-align: right;
        color: #fff;
        font-size: 40px;
    }
</style>
