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

                                <el-input style="width: 60px;" type="number" min="0" :value="other"
                                          @blur="setLimit($event)"
                                          placeholder="请输入"></el-input>
                            </el-radio>
                            <el-radio :label="-1">不限</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发券活动主题：" prop="topic">
                        <el-input v-model="form.topic" :maxlength="30" placeholder="请输入本次发券的主题，30字以内"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠卷显示名称：" prop="couponName">
                        <el-input v-model="form.couponName" :maxlength="15" placeholder="请输入优惠券上显示的券名，15字以内"></el-input>
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
                                              @blur="checkMoneyAndRepeat($event, index)"
                                              placeholder="输入劵面额"></el-input>
                                    元劵

                                    <el-input type="number" v-model.number="item.couponNum" @blur="checkValue($event)"
                                              placeholder="输入张数"></el-input>
                                    张数
                                    <el-button icon="minus" @click="delCoupon(index)"></el-button>
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
                                        <el-input type="number" max="10" min="0"
                                                  @blur="setAllDenomination($event,index )"
                                                  v-model.number="item.denomination" placeholder="输入折扣劵"></el-input>
                                        折券

                                        <el-input type="number" v-model.number="item.couponNum"
                                                  @blur="checkValue($event)"
                                                  placeholder="输入张数"></el-input>
                                        张
                                    <el-button icon="minus" @click="delCoupon(index)"></el-button>
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

                                    <el-input type="number" style="width: 80px;" v-model.number="form.maxDeductionMoney"
                                              @blur="checkMaxDeductionMoney($event)" placeholder="输入金额"></el-input>
                                </el-radio>
                                <br>
                                <el-radio :label="1">单独设置：

                                    <template v-for="item in form.coupon">
                                        {{item.denomination || '--' }}折劵

                                        <el-input type="number" style="width: 80px;"
                                                  :disabled="form.maxDeductionType !=1"
                                                  v-model.number="item.maxDeductionMoney"
                                                  @blur="checkMoney($event)"
                                                  placeholder="金额"></el-input>
                                        元&nbsp;&nbsp;

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
                        <el-button type="info" @click="upStep()">返回</el-button>
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
                other: 4,
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
                copyForm: {},
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
            upStep() {
                this.showNext = false;
                this.form = {
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
                };
            },
            setLimit(e) {
                let self = this;
                let val = e.target.value;
                if(val == 1) {
                    self.form.limitSize = 1;
                    e.target.value = 4;
                	return
                }
                if(val == 2) {
                    self.form.limitSize = 2;
                    e.target.value = 4;
                    return
                }
                if(val == 3) {
                    self.form.limitSize = 3;
                    e.target.value = 4;
                    return
                }
                if(val <=0) {
                    self.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 4;
                    self.form.limitSize = 1;
                    return;
                }
                if (!this.isInt(val)) {
                    this.$notify({
                        title: '提示',
                        message: '数值为整数',
                        type: 'info'
                    });
                    e.target.value = 4;
                    self.form.limitSize = 1;
                    return;
                }
                self.other = Number(val);
                self.$nextTick(function () {
                    self.form.limitSize = self.other;
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
            delCoupon(index) {
            	let items = this.form.coupon;
            	if(items.length == 1) {
                    this.$notify({
                        title: '提示',
                        message: '不能全部删除',
                        type: 'info'
                    });
            		return;
                }
                this.form.coupon.splice(index,1);
            },
            setEndTime(val) {
                this.form.endTime = val;
            },
            setAllDenomination(e, index) {
            	let self = this;
                let val = e.target.value;
                if (val > 10 || val <= 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能大于10且不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    return;
                }
                let flag = true;
                let items = JSON.parse(JSON.stringify(self.form.coupon));
                items.splice(index, 1)
                items.map((c)=> {
                    if(c.denomination == val) {
                        this.$notify({
                            title: '提示',
                            message: '劵不能重复',
                            type: 'info'
                        });
                        e.target.value = 0;
                        flag = false;
                    }
                });
                if(!flag) {
                	return
                }
                let obj = this.form.coupon[index];
                obj.denomination = val;
                this.form.coupon.splice(index, 1, obj);
            },
            checkValue(e, index) {
                let val = e.target.value;
                if (val < 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能小于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    return;
                }
                if (!this.isInt(val)) {
                    this.$notify({
                        title: '提示',
                        message: '数值为整数',
                        type: 'info'
                    });
                    e.target.value = 0;
                }
            },
            isInt(str){
                let g = /^-?\d+$/;
                return g.test(str);
            },
            checkMaxDeductionMoney (e) {
                let val = e.target.value;
                let self = this;
                if (val <= 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    return;
                }
                self.form.coupon.map((c) => {
                    c.maxDeductionMoney = val;
                });
            },
            checkMoneyAndRepeat(e,i) {
            	let self = this;
                let val = e.target.value;
                if (val <= 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    return;
                }
                let items = JSON.parse(JSON.stringify(self.form.coupon));
                items.splice(i, 1)
                items.map((c)=> {
                	if(c.denomination == val) {
                        this.$notify({
                            title: '提示',
                            message: '劵不能重复',
                            type: 'info'
                        });
                        e.target.value = 0;
                    }
                })
            },
            checkMoney(e) {
                let val = e.target.value;
                if (val < 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能小于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    return;
                }

            },
            isEmptyObject(e) {
                let t;
                for (t in e)
                    return !1;
                return !0
            },
            returnFlag(array) {
                let flag = false;
                let items = self.form.coupon;
            },
            finishCreate() {
                let self = this;
                let flag = true;
                self.form.coupon.map((c) => {
                    if (self.isEmptyObject(c)) {
                        flag = false;
                    }
                    if (!c.denomination && c.denomination != 0) {
                        flag = false;
                    }
                    if (!c.couponNum && c.couponNum != 0) {
                        flag = false;
                    }
                    if (self.form.type == 3 && !c.maxDeductionMoney && c.maxDeductionMoney !=0) {
                        flag = false;
                    }
                });
                if (!flag) {
                    let message = ''
                    self.form.type == 3 ? message = '券的面额&数量&最高抵扣金额填写不完整' : message = '券的面额&数量填写不完整';
                    self.$notify({
                        title: '警告',
                        message: message,
                        type: 'warning'
                    });
                    return;
                }
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
        },
        created() {
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
