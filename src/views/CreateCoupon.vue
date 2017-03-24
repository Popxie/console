<template>
    <div class="container">
        <TapSelect v-if="!showNext" :taps="taps" title="优惠券管理" @setValue="setCoupon"/>
        <!--选择地区-->
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>

        <el-row v-if="showNext">
            <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}"
                    :xs="{span: 18, offset:1}">
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
                            <el-radio :label="other">其他


                                <el-input style="width: 40px;" v-model="other" @change="setLimit"
                                          placeholder="请输入内容"></el-input>
                            </el-radio>
                            <el-radio :label="-1">不限</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发券活动主题：" prop="topic">
                        <el-input v-model="form.topic"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠卷显示名称：" prop="couponName">
                        <el-input v-model="form.couponName"></el-input>
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
                    <el-form-item label="设置券的面额&数量：">
                        <div class="row-wrap">
                            <template v-for="(item, index)  in form.allDenomination">
                                <div class="wid row">
                                    <el-input v-model="item.allDenomination"></el-input>元劵<el-input v-model="item.totalDenomination"></el-input>张数
                                </div>
                            </template>
                            <div class="wid">
                                <el-button icon="plus" @click="addCoupon"></el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item  label="设置劵的过期日期：" prop="time">
                        <el-date-picker
                            v-model="form.time"
                            type="date"
                            placeholder="选择日期"
                            @change = "setEndTime"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="showNext = false">返回</el-button>
                        <el-button type="info" @click="finishCreate('form')">完成</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import TapSelect from '../components/TapSelect.vue';
    import SelectAreas from '../components/SelectSimpleArea.vue';
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
                form: {
                    type: 0,
                    isNewuserUse: 1,
                    limitSize: 1,
                    topic: '',
                    couponName: '',
                    areaType: 0,
                    allDenomination: [{}],
                    time: ''
                },
                rules: {}
            }
        },
        methods: {
            setCoupon(val) {
                let self = this;
                self.showNext = true;
                self.form.type = val;
            },
            setLimit(val) {
                let self = this;
                self.$nextTick(() => {
                    self.form.limitSize = self.other
                })
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
            	self.form.allDenomination.push({});
            },
            setEndTime(val) {
                this.form.endTime = val;
            },
            finishCreate(form) {
                console.log(this.form);
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
        white-space:nowrap;
    }
</style>
