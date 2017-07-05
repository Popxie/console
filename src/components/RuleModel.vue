<template>
    <div class="rule-model">
        <div class="box" :style="{height: boxHeight,width: boxWidth}">
            每{{minute}}分钟，收取{{price}}元
        </div>
    </div>
</template>
<style scoped>
    .rule-model {
        margin: 30px;
    }
    .box {
        background: #13acf8;
        box-sizing: border-box;
        text-align: center;
        color: #fff;
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        props: {
            minute: String,
            price: String
        },
        computed: {
            //模型高度：单价
            boxHeight() {
                let self = this;
                return parseFloat(self.price)/(0.5)*100 + 'px'
            },
            //模型宽度: 单位时间
            boxWidth() {
                let self = this;
                return parseFloat(self.minute)/(30)*100 + 'px'
            }
        }
    }
</script>
