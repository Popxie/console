<template>
    <div class="container">
    <TapSelect v-if="!showNext" :taps="taps" title="优惠券管理" @setValue="setCoupon"/>
    <el-row  v-if="showNext">
        <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}">
            <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="150px">
                <el-form-item label="是否仅新用户可用：" prop="isNewuserUse">
                    <el-radio-group v-model="form.isNewuserUse">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="本批次劵单用户可领用/兑换上限张数：" prop="limitSize">
                    <el-radio-group v-model="form.limitSize">
                        <el-radio :label="1">1</el-radio>
                        <el-radio :label="2">2</el-radio>
                        <el-radio :label="3">3</el-radio>
                        <el-radio :label="other">其他<el-input style="width: 20px;" v-model="other" placeholder="请输入内容"></el-input></el-radio>
                        <el-radio :label="-1">不限</el-radio>
                    </el-radio-group>
                </el-form-item>
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
                other: 0,
                form: {
                    type: 0,
                    isNewuserUse: 1,
                    limitSize: 1
                },
                rules: {

                }
            }
        },
        methods: {
            setCoupon(val) {
                let self = this;
                self.showNext = true;
                self.form.type = val;
            }
        }
    }
</script>
<style scoped>
    .container{
        background-color: #fff;
    }
    .mt40{
        margin-top: 40px;
    }
</style>
