<template>
    <div class="container">
    <TapSelect v-if="!showNext" :taps="taps" title="优惠券管理" @setValue="setCoupon"/>
    <el-row v-if="showNext">
        <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}">
            <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="150px">
            </el-form>
        </el-col>
    </el-row>
    </div>
</template>
<script>
    import TapSelect from '../components/TapSelect.vue';
    export default{
        components: {
            TapSelect
        },
        data() {
            return {
                taps: [{
                    task: '充值卷',
                    value: 1
                }, {
                    task: '抵扣卷',
                    value: 2
                }, {
                    task: '折扣卷',
                    value: 3
                }],
                showNext: false,
                form: {

                },
                rules: {

                }
            }
        },
        methods: {
            setCoupon(val) {
                let self = this;
                self.showNext = true;
            }
        }
    }
</script>
<style scoped>
    .container{
        background-color: #fff;
    }
</style>
