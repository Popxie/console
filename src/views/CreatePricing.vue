<template>
    <div class="create-pricing">
        <TapSelect v-if="!isSetRule" :taps="taps" title="计费规则设置" @setValue="setRule"/>
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        <div class="intro-page" v-show="!isSetRule">
            <div class="tips">
                规则执行优先级： 1、优惠日（时期+时间）2、周惠（周+时间）3、阶梯计价 4、统一计价
            </div>
        </div>
        <div class="create-page" v-show="isSetRule">
            <div class="title">计费规则设置/<span class="sub-title">创建计费</span></div>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="活动名称" required>
                    <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item label="地区" required>
                    <span class="choose-city" v-for="item in form.provinces">{{item.cityName}}</span>
                    <el-button @click="showAreaSelect">选择相同计费规则的区域</el-button>
                </el-form-item>
                <el-form-item label="加盟商编号">
                    <el-input v-model="form.franchiseeNum" placeholder="请填写加盟商编号、并用；分隔开"></el-input>
                </el-form-item>
                <!--统一计价-->
                <template class="unified-pricing" v-if="form.type === 1">
                    <el-form-item label="有效期">
                        <el-date-picker
                            v-model="form.validPeriod"
                            type="daterange"
                            placeholder="选择开始时间-结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="计费单价" required>
                        <el-col :span="6">
                            <el-input v-model="form.unitPrice" placeholder='请输入计费单价，单位"元"'></el-input>
                        </el-col>
                        <el-col :span="1">
                            <span class="intro">元，每</span>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="form.unitTime" placeholder='请输入计费单价，单位"分钟"'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <span class="intro">不输入则默认为0.5元/30分钟</span>
                        </el-col>
                    </el-form-item>
                </template>
                <!--阶梯计价-->
                <section class="ladder-pricing" v-if="form.type === 2">
                    <el-form-item label="有效期：">
                        <el-date-picker
                            v-model="form.validPeriod"
                            type="daterange"
                            placeholder="选择开始时间-结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="阶段计费：" required>
                        <span class="intro">计费单位时间为30分钟；</span>
                        <div class="ladder-pricing-unit" v-for="(item,index) in ladderPricingList">
                            <el-col :span="4">
                                <el-input v-model="item.minute"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <span class="intro">分钟，按</span>
                            </el-col>
                            <el-col :span="4">
                                <el-input v-model="item.value"></el-input>
                            </el-col>
                            <el-col :span="1">
                                <span class="intro">元</span>
                            </el-col>
                            <el-col :span="2" v-if="index !== 0">
                                <el-button type="danger" @click="deleteLadderPricing(index)">删除</el-button>
                            </el-col>
                        </div>
                    </el-form-item>
                    <el-button type="primary" @click="addLadderPricing">新增</el-button>
                </section>
                <!--周惠计价-->
                <section class="week-pricing" v-if="form.type === 3">
                    <el-form-item label="有效期：">
                        <el-date-picker
                            v-model="form.validPeriod"
                            type="daterange"
                            placeholder="选择开始时间-结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="阶段计费">
                        <span class="intro">可单选和多选时间（天），计费单位时间默认30分钟，超出之后按照相应的收费规则收取；</span>
                        <el-checkbox-group v-model="weekdayList">
                            <el-checkbox label="周日"></el-checkbox>
                            <el-checkbox label="周一"></el-checkbox>
                            <el-checkbox label="周二"></el-checkbox>
                            <el-checkbox label="周三"></el-checkbox>
                            <el-checkbox label="周四"></el-checkbox>
                            <el-checkbox label="周五"></el-checkbox>
                            <el-checkbox label="周六"></el-checkbox>
                        </el-checkbox-group>
                        <span class="intro">累积骑行时间，累加各阶段的金额</span>
                        <el-row v-for="(item,index) in weekPricingList" class="mb20">
                            <el-col :span="6">
                                <el-time-picker
                                    is-range
                                    v-model="item.time"
                                    :picker-options="{
                                                format: 'HH:mm'
                                            }"
                                    placeholder="选择时间范围">
                                </el-time-picker>
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="item.value" placeholder='请输入计费单价，单位"元"'></el-input>
                            </el-col>
                            <el-col :span="2">
                                <span class="intro">元，每</span>
                            </el-col>
                            <el-col :span="5">
                                <el-input v-model="item.minute" placeholder='请输入计费单价，单位"分钟"'></el-input>
                            </el-col>
                            <el-col :span="2">
                                <span class="intro">分钟</span>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="addWeekPricingTime">+新增</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </section>
                <!--优惠日计价-->
                <section class="day-pricing" v-if="form.type === 4">
                    <el-form-item label="计费单价" required>
                        <el-col :span="6">
                            <el-input v-model="form.unitPrice" placeholder='请输入计费单价，单位"元"'></el-input>
                        </el-col>
                        <el-col :span="1">
                            <span class="intro">元，每</span>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="form.unitTime" placeholder='请输入计费单价，单位"分钟"'></el-input>
                        </el-col>
                        <el-col :span="6">
                            <span class="intro">不输入则默认为0.5元/30分钟</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="阶段计费" required>
                        <div class="intro">可单选和多选时间（天），计费单位时间默认30分钟</div>
                        <div v-for="(item,index) in dayPricingList" class="mb20">
                            <el-date-picker
                                v-model="item.time"
                                type="datetimerange"
                                placeholder="选择时间范围">
                            </el-date-picker>
                            <el-col :span="2">
                                <el-input v-model="item.price" placeholder="单价"></el-input>
                            </el-col>
                            <span class="intro">元，每30分钟</span>
                            <el-button @click="deleteDayPricing" v-if="index > 0 " type="danger">删除</el-button>
                            <el-button @click="addDayPricing(index)" v-if="index === 0">新增</el-button>
                        </div>
                    </el-form-item>
                </section>
                <el-button type="primary" class="mt20">保存</el-button>
            </el-form>
        </div>
    </div>
</template>
<style scoped>
    .tips {
        margin: 20px 0;
        color: #555;
    }

    .create-page {
        background: #fff;
        padding: 20px;
    }

    .title {
        margin-bottom: 20px;
    }

    .create-page .title {
        font-size: 14px;
    }
    .ladder-pricing-unit {
        display: block;
        clear: both;
        margin-bottom: 10px;
        overflow: hidden;
    }
    .day-pricing .el-date-editor--datetimerange {
        float: left;
        margin-right: 10px;
    }
    .intro {
        color: #999;
    }
    .mb20 {
        margin-bottom: 20px;
    }
    .mt20 {
        margin-top: 20px;
    }
    .choose-city {
        margin-right: 10px;
    }
</style>
<script>
    import TapSelect from '../components/TapSelect.vue'
    import SelectCity from '../components/SelectCity.vue'
    import SelectAreas from '../components/SelectArea.vue'
    import {settings} from '../config/settings'
    export default{
        data(){
            return {
                taps: [{
                    task: '统一计价',
                    value: 1
                }, {
                    task: '阶梯计价',
                    value: 2
                }, {
                    task: '周惠（周+时间）',
                    value: 3
                },{
                    task: '优惠日（时期+时间）',
                    value: 4
                }],
                dialogVisible: false,
                isSetRule: false,
                value3: [],
                ladderPricingList: [{}],//阶梯计价规则列表
                dayPricingList: [{}],
                form: {
                    name: '',
                    area: '',
                    franchiseeNum: '',//加盟商
                    date1: '',
                    validPeriod: '',
                    type: ''
                },
                weekPricingList: [{}],
                weekdayList: ['周日']
            }
        },
        components: {
            TapSelect,
            SelectCity,
            SelectAreas
        },
        methods: {
            showAreaSelect() {
                let self = this;
                self.dialogVisible = true;
            },
            setRule(val) {
                let self = this;
                self.isSetRule = true;
                self.form.type = val;
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
                self.reset();
            },
            setAreas(form) {
                let self = this;
                if (!form) {
                    self.$notify({
                        title: '提示',
                        message: '请选择省份',
                        type: 'info'
                    });
                    return;
                }
                console.log(form);
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
            },
            //新增阶梯计价 规则
            addLadderPricing() {
                let self = this;
                self.ladderPricingList.push({});
            },
            //删除阶梯计价 规则
            deleteLadderPricing(index) {
                let self = this;
                self.ladderPricingList.splice(index,1);
            },
            //新增周惠计价 选定日期下时间 规则
            addWeekPricingTime() {
                let self = this;
                self.weekPricingList.push({});
            },
            //新增优惠日计价 选定日期+时间 规则
            addDayPricing() {
                let self = this;
                self.dayPricingList.push({});
            },
            //删除优惠日计价 选定日期+时间 规则
            deleteDayPricing(index) {
                let self = this;
                self.dayPricingList.splice(index,1);
            }
        }
    }
</script>
