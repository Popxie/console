<template>
    <div class="container">
        <TapSelect v-if="!showNext" :taps="taps" title="优惠券管理" @setValue="setCoupon"/>
        <!--选择地区-->
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>

        <el-row v-if="showNext">
            <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}"
                    :xs="{span: 18, offset:1}">
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
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
                            <el-radio :label="other">其他


                                <el-input style="width: 60px;" type="number" min="0" v-model.number="other"
                                          @change="setLimit"
                                          placeholder="请输入内容"></el-input>
                            </el-radio>
                            <el-radio :label="-1">不限</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发券活动主题：" prop="topic">
                        <el-input v-model="form.topic" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠卷显示名称：" prop="couponName">
                        <el-input v-model="form.couponName" :maxlength="15"></el-input>
                    </el-form-item>
                    <el-form-item label="设置投放地域：" prop="areaType">
                        <el-radio-group v-model="form.areaType" @change="selectArea">
                            <el-radio :label="0">全域</el-radio>
                            <el-radio :label="1">选择地域</el-radio>
                        </el-radio-group>
                        <el-button v-show="form.areaType==1" type="text" @click="selectAreaByClick">
                            {{form.provinceName + '-' + form.cityName + '-' + form.areaName}}



                        </el-button>
                    </el-form-item>
                    <el-form-item v-if="form.type != 3" label="设置券的面额&数量：" required>
                        <div class="row-wrap">
                            <template v-for="(item, index)  in form.coupon">
                                <div class="wid row">
                                    <el-input type="number" v-model.number="item.denomination"
                                              placeholder="输入劵面额"></el-input>
                                    元劵


                                    <el-input type="number" v-model.number="item.couponNum"
                                              placeholder="输入张数"></el-input>
                                    张数



                                </div>
                            </template>
                            <div class="wid">
                                <el-button icon="plus" @click="addCoupon"></el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <template v-if="form.type == 3">
                        <el-form-item label="设置券的面额&数量：" required>
                            <div class="row-wrap">
                                <template v-for="(item, index)  in form.coupon">
                                    <div class="wid row">
                                        <el-input type="number" @blur="setAllDenomination($event,index )"
                                                  v-model.number="item.denomination" placeholder="输入折扣劵"></el-input>
                                        元劵


                                        <el-input type="number" v-model.number="item.couponNum"
                                                  placeholder="输入张数"></el-input>
                                        张数


                                    </div>
                                </template>
                                <div class="wid">
                                    <el-button icon="plus" @click="addCoupon"></el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="设置券的最高抵扣金额：" prop="maxDeductionType">

                            <el-radio-group v-model="form.maxDeductionType">
                                <el-radio :label="0">统一上限


                                    <el-input type="number" style="width: 60px;" v-model.number="form.maxDeductionMoney"
                                              placeholder="输入金额"></el-input>
                                </el-radio>
                                <br>
                                <el-radio :label="1">单独设置：


                                    <template v-for="item in form.coupon">
                                        {{item.denomination || '--' }}元卷

                                        <el-input type="number" style="width: 60px;"
                                                  v-model.number="item.maxDeductionMoney"
                                                  placeholder="金额"></el-input>
                                        元


                                    </template>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <el-form-item label="设置劵的过期日期：" prop="time">
                        <el-date-picker
                            v-model="form.time"
                            type="date"
                            placeholder="过期时间"
                            @change="setEndTime"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="showNext = false">返回</el-button>
                        <el-button type="info" @click="finishCreate('form')">生成劵</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import TapSelect from '../components/TapSelect.vue';
    import SelectAreas from '../components/SelectSimpleArea.vue';
    import {settings} from '../config/settings';
    export default{
        components: {
            TapSelect, SelectAreas
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
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                showNext: false,
                dialogVisible: false,
                other: 0,
                maxMoney: 0,
                form: {
                    type: 0,
                    isNewuserUse: 1,
                    limitSize: 1,
                    topic: '',
                    couponName: '',
                    areaType: 0,
                    coupon: [{}],
                    time: '',
                    maxDeductionType: 0,
                    maxDeductionMoney: 0,
                    denomination: 0
                },
                rules: {
                    isNewuserUse: [
                        {type: 'number', required: true, message: '请选择是否是新用户', trigger: 'change'}
                    ],
                    limitSize: [
                        {type: 'number', required: true, message: '请选择可领用/兑换上限', trigger: 'change'},
                    ],
                    topic: [
                        {type: 'string', required: true, message: '请输入广告主题', trigger: 'blur'},
                    ],
                    couponName: [
                        {required: true, message: '请输入优惠劵显示名称', trigger: 'blur'}
                    ],
                    maxDeductionType: [
                        {type: 'number', required: true, message: ' 设置券的最高抵扣金额', trigger: 'change'}
                    ],
                    areaType: [
                        {type: 'number', required: true, message: '请选择投放地域', trigger: 'change'}
                    ],
                    time: [
                        {type: 'date', required: true, message: '请选择结束时间', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            ...mapActions([
                'createConpon'
            ]),
            setCoupon(val) {
                let self = this;
                self.showNext = true;
                self.form.type = val;
            },
            setLimit(val) {
                let self = this;
                self.$nextTick(() => {
                    self.form.limitSize = self.other
                });
            },
            setMaxMoney() {
                this.$nextTick(() => {

                });
            },
            selectArea() {
                let self = this;
                if (self.form.areaType == '0') {
                    return;
                }
                self.dialogVisible = true;
                self.reset();
            },
            selectAreaByClick() {
                let self = this;
                self.dialogVisible = true;
            },
            setAreas(form) {
                let self = this;
                if (!form.provinceName) {
                    self.$notify({
                        title: '提示',
                        message: '请选择省份',
                        type: 'info'
                    });
                    return;
                }
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
                self.reset();
            },
            reset() {
                let self = this;
                self.form.provinceName = '';
                self.form.cityName = '';
                self.form.areaName = '';
            },
            addCoupon() {
                let self = this;
                self.form.coupon.push({});
            },
            setEndTime(val) {
                this.form.endTime = val;
            },
            setAllDenomination(e, index) {
                let obj = this.form.coupon[index];
                obj.denomination = e.target.value;
                this.form.coupon.splice(index, 1, obj);
            },
            finishCreate() {
                let self = this;
                self.$refs['form'].validate((valid) => {
                    if (valid) {
                        self.createConpon(self.form)
                            .then((res) => {
                                self.$router.push('couponList');
                            }, (err) => {
                                self.$notify({
                                    title: '失败',
                                    message: err,
                                    type: 'error'
                                });
                            });
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .container {
        background-color: #fff;
    }

    .mt40 {
        margin-top: 40px;
    }

    .wid {
        width: 47%;
        margin-bottom: 2px;
    }

    .row-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap
    }

    .row {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        white-space: nowrap;
    }
</style>
