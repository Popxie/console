<template>
    <div class="container">
        <div class="txt_info">
            {{message}}
        </div>
        <div class="title">
            {{title}}
        </div>
        <div class="tap-select">
            <div class="tap-type">
                <template v-for="tap in taps">
                    <div class="tap" @click="setValue(tap.value)">
                        <i class="icon-tap"></i>
                        <span>{{tap.task}}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        props: {
            title: {
                type: String,
                require: true
            },
            message: {
                type: String,
                default: ''
            },
            taps: {
                type: Array,
                require: true
            }
        },
        methods: {
            setValue(val) {
                this.$emit('setValue', val);
            }
        }
    }
</script>
<style scoped>
    .container {
        border: 1px solid #e9e9e9;
        min-height: 500px;
        background: #fff;
        position: relative;
    }

    .txt_info {
        color: #333;
        font-family: å¾®è½¯é›…é»‘;
        font-size: 14px;
        margin-left: 10%;
        margin-top: 5%;
        width: 41%;
    }

    .title {
        background: url(../assets/img/titile_bg.png) no-repeat;
        font-size: 30px;
        height: 134px;
        line-height: 134px;
        position: absolute;
        right: 10%;
        text-align: center;
        top: 0;
        width: 271px;
    }

    .tap-select {
        width: 100%;
        height: 400px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .tap-type {
        width: 60%;
        height: 400px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .tap {
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
        background-color: #18bffd;
        border-radius: 10px;
        color: #fff;
        float: left;
        text-align: center;
        cursor: pointer;
    }

    .icon-tap {
        margin: 10px auto 0;
        width: 49px;
        background: url(./../assets/img/step_icon.png) 0 0/640px 900px no-repeat;
        background-position: 0 -363px !important;
        display: block;
        height: 59px;
    }
</style>
