<template>
    <div class="create-pricing container">
        <div class="intro-page" v-show="!isSetRule">
            <div class="title" @click="toSetRule">计费规则设置</div>
            <div class="intro">
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
                    <el-input v-model="form.name" placeholder="请选择相同计费规则的区域"></el-input>
                </el-form-item>
                <el-form-item label="加盟商编号">
                    <el-input v-model="form.name" placeholder="请填写加盟商编号、并用；分隔开"></el-input>
                </el-form-item>
                <el-tabs type="border-card">
                    <el-tab-pane label="统一计价">
                        <section class="unified-pricing">
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
                                    元，每
                                </el-col>
                                <el-col :span="6">
                                    <el-input v-model="form.unitTime" placeholder='请输入计费单价，单位"分钟"'></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <span>不输入则默认为0.5元/30分钟</span>
                                </el-col>
                            </el-form-item>
                        </section>
                    </el-tab-pane>
                    <el-tab-pane label="阶梯计价">
                        <section class="ladder-pricing">
                            <el-form-item label="有效期：">
                                <el-date-picker
                                    v-model="form.validPeriod"
                                    type="daterange"
                                    placeholder="选择开始时间-结束时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="阶段计费：" required>
                                <span>计费单位时间为30分钟；</span>
                                <div class="ladder-pricing-unit" v-for="(item,index) in ladderPricingList">
                                    <el-col :span="4">
                                        <el-input v-model="item.minute"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        分钟，按
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input v-model="item.value"></el-input>
                                    </el-col>
                                    <el-col :span="1">
                                        元
                                    </el-col>
                                    <el-col :span="2" v-if="index !== 0">
                                        <el-button type="danger" @click="deleteLadderPricing(index)">删除</el-button>
                                    </el-col>
                                </div>
                            </el-form-item>
                            <el-button type="primary" @click="addLadderPricing">新增</el-button>
                        </section>
                    </el-tab-pane>
                    <el-tab-pane label="周惠（周+时间）">
                        <section class="week-pricing">
                            <el-form-item label="有效期：">
                                <el-date-picker
                                    v-model="form.validPeriod"
                                    type="daterange"
                                    placeholder="选择开始时间-结束时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="阶段计费">
                                <span>可单选和多选时间（天），计费单位时间默认30分钟，超出之后按照相应的收费规则收取；</span>
                                <el-checkbox-group v-model="weekdayList">
                                    <el-checkbox label="周日"></el-checkbox>
                                    <el-checkbox label="周一"></el-checkbox>
                                    <el-checkbox label="周二"></el-checkbox>
                                    <el-checkbox label="周三"></el-checkbox>
                                    <el-checkbox label="周四"></el-checkbox>
                                    <el-checkbox label="周五"></el-checkbox>
                                    <el-checkbox label="周六"></el-checkbox>
                                </el-checkbox-group>
                                <span>累积骑行时间，累加各阶段的金额</span>
                                <div>
                                    <el-col :span="6">
                                        <el-time-picker
                                            is-range
                                            v-model="value3"
                                            :picker-options="{
                                                format: 'HH:mm'
                                            }"
                                            placeholder="选择时间范围">
                                        </el-time-picker>
                                    </el-col>
                                    <!--<el-col :span="3">-->
                                        <!--<el-input v-model="weekPricing.startTime" placeholder="起始时间"></el-input>-->
                                    <!--</el-col>-->
                                    <!--<el-col :span="1">-</el-col>-->
                                    <!--<el-col :span="3">-->
                                        <!--<el-input v-model="weekPricing.endTime" placeholder="结束时间"></el-input>-->
                                    <!--</el-col>-->
                                    <el-col :span="1">-</el-col>
                                    <el-col :span="6">
                                        <el-input v-model="weekPricing.value" placeholder='请输入计费单价，单位"元"'></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        元，每
                                    </el-col>
                                    <el-col :span="5">
                                        <el-input v-model="weekPricing.minute" placeholder='请输入计费单价，单位"分钟"'></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        分钟
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click="addweekPricingTime">+新增</el-button>
                                    </el-col>
                                </div>
                            </el-form-item>
                        </section>
                    </el-tab-pane>
                    <el-tab-pane label="优惠日（日期+时间）">
                        <section class="day-pricing">
                            <el-form-item label="计费单价" required>
                                <el-col :span="6">
                                    <el-input v-model="form.unitPrice" placeholder='请输入计费单价，单位"元"'></el-input>
                                </el-col>
                                <el-col :span="1">
                                    元，每
                                </el-col>
                                <el-col :span="6">
                                    <el-input v-model="form.unitTime" placeholder='请输入计费单价，单位"分钟"'></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <span>不输入则默认为0.5元/30分钟</span>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="阶段计费" required>
                                <div>可单选和多选时间（天），计费单位时间默认30分钟</div>
                                <div>
                                    <el-date-picker
                                        v-model="value3"
                                        type="datetimerange"
                                        placeholder="选择时间范围">
                                    </el-date-picker>
                                    <el-col :span="2">
                                        <el-input v-model="value3" placeholder="单价"></el-input>
                                    </el-col>
                                    <span>元，每30分钟</span>
                                </div>
                            </el-form-item>
                        </section>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
    </div>
</template>
<style scoped>
    .container {
        background: #fff;
    }

    .create-page {
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
</style>
<script>
    export default{
        data(){
            return {
                isSetRule: true,
                value3: [],
                ladderPricingList: [{}],//阶梯计价规则列表
                weekPricingList: [[{}]],
                weekPricing: {},
                form: {
                    name: '',
                    area: '',
                    franchiseeNum: '',
                    date1: '',
                    validPeriod: '',
                },
                weekdayList: [
                    '周日'
                ]
            }
        },
        components: {},
        methods: {
            toSetRule() {
                let self = this;
                self.isSetRule = true;
            },
            //新增阶梯计价 规则
            addLadderPricing() {
                let self = this;
                self.ladderPricingList.push({});
            },
            //删除阶梯计价 规则
            deleteLadderPricing(item) {
                let self = this;
                self.ladderPricingList.splice(item,1);
            },
            //新增周惠计价 选定日期下时间 规则
            addweekPricingTime() {
                let self = this;
                console.log(self.weekPricingList);
//                self.weekPricingList[self.weekPricingList.length - 1].push({});
            }
        }
    }
</script>
