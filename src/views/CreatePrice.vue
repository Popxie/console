<template>
    <div class="create-price">
        <TapSelect v-if="!isSetRule" :taps="taps" title="计费规则设置" @setValue="setRule"/>
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        <div class="intro-page" v-show="!isSetRule">
            <div class="tips">
                规则执行优先级： 1、优惠日（时期+时间）2、周惠（周+时间）3、统一计价
            </div>
        </div>
        <div class="create-page" v-show="isSetRule">
            <div class="title">计费规则设置/<span class="sub-title">{{taps[form.type - 1].task}}</span></div>
            <div v-if="form.type < 4">
                <el-form :model="form" :rules="formRules" ref="form" label-width="120px">
                    <el-form-item label="活动名称" prop="name" style="width: 50%">
                        <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="地区" required>
                        <span class="choose-city" v-for="item in form.provinces">{{item.cityName}}</span>
                        <el-button @click="showAreaSelect">选择相同计费规则的区域</el-button>
                    </el-form-item>
                    <el-form-item label="计费方式" required>
                        <el-radio-group v-model="form.chargingMode" @change="chargingModeClick()">
                            <el-radio :label="0">按统一计价</el-radio>
                            <el-radio :label="1">按加盟商</el-radio>
                            <el-radio :label="2">按电子围栏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.chargingMode === 1" label="加盟商编号" required>
                        <div class="partner-block" v-for="(item,index) in partnerArray">
                            <el-input v-model="item.partnerCode" placeholder="请填写加盟商编号" style="width: 120px"></el-input>
                            <el-button v-show="partnerArray.length !== 1" @click="deletePartner(index)">删除</el-button>
                            <el-button @click="addPartner(index)" v-show="index === 0">增加</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="form.chargingMode === 2" label="电子围栏ID" required>
                        <div class="partner-block" v-for="(item,index) in eRailArray">
                            <el-input v-model="item.eRailId" placeholder="请填写电子围栏ID" style="width: 120px"></el-input>
                            <el-button v-show="eRailArray.length !== 1" @click="deleteERails(index)">删除</el-button>
                            <el-button @click="addERailsId(index)" v-show="index === 0">增加</el-button>
                        </div>
                    </el-form-item>
                    <!--统一计价-->
                    <template class="unified-pricing" v-if="form.type === 1">
                        <el-form-item label="有效期" required>
                            <el-date-picker
                                v-model="validPeriod"
                                type="daterange"
                                placeholder="选择开始时间-结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="规则选择" required>
                            <el-select v-model="priceModelId" placeholder="规则选择">
                                <el-option :label="item.name" :value="item.id"
                                           v-for="item in priceModelList" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <!--周惠计价-->
                    <section class="week-pricing" v-if="form.type === 2">
                        <el-form-item label="有效期：" required>
                            <el-date-picker
                                v-model="validPeriod"
                                type="daterange"
                                placeholder="选择开始时间-结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="阶段计费" required>
                            <span class="intro">单选时间（天），计费单位时间默认30分钟，超出之后按照相应的收费规则收取；</span>
                            <el-form-item>
                                <el-radio class="radio" v-model="weekday" label="1">周一</el-radio>
                                <el-radio class="radio" v-model="weekday" label="2">周二</el-radio>
                                <el-radio class="radio" v-model="weekday" label="3">周三</el-radio>
                                <el-radio class="radio" v-model="weekday" label="4">周四</el-radio>
                                <el-radio class="radio" v-model="weekday" label="5">周五</el-radio>
                                <el-radio class="radio" v-model="weekday" label="6">周六</el-radio>
                                <el-radio class="radio" v-model="weekday" label="7">周日</el-radio>
                            </el-form-item>
                            <span class="intro">累积骑行时间，累加各阶段的金额</span>
                            <div v-for="(item,index) in weekPricingList" class="mb20 weekday-list">
                                <div>
                                    <el-time-select
                                        placeholder="起始时间"
                                        v-model="item.startTime"
                                        :picker-options="{
                                          start: '00:00',
                                          step: '00:30',
                                          end: '23:30'
                                        }"
                                    >
                                    </el-time-select>
                                    <el-time-select
                                        placeholder="结束时间"
                                        v-model="item.endTime"
                                        :picker-options="{
                                    start: '00:30',
                                    step: '00:30',
                                    end: '24:00',
                                    minTime: startTime
                                    }">
                                    </el-time-select>
                                </div>
                                <el-form-item>
                                    <el-select v-model="item.priceModelId" placeholder="规则选择">
                                        <el-option :label="item.name" :value="item.id"
                                                   v-for="item in priceModelList" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-button @click="addWeekPricingTime" v-show="index === 0">新增</el-button>
                            </div>
                        </el-form-item>
                    </section>
                    <!--优惠日计价-->
                    <section class="day-pricing" v-if="form.type === 3">
                        <el-form-item label="阶段计费" required>
                            <div class="intro">可单选时间（天），计费单位时间默认30分钟</div>
                            <div v-for="(item,index) in dayPricingList" class="mb20">
                                <el-date-picker
                                    v-model="item.time"
                                    type="datetimerange"
                                    placeholder="选择时间范围">
                                </el-date-picker>
                                <el-select v-model="item.priceModelId" placeholder="规则选择">
                                    <el-option :label="model.name" :value="model.id"
                                               v-for="model in priceModelList" :key="item.id"></el-option>
                                </el-select>
                                <el-button @click="deleteDayPricing" v-if="index > 0 " type="danger">删除</el-button>
                                <el-button @click="addDayPricing(index)" v-if="index === 0">新增</el-button>
                            </div>
                        </el-form-item>
                    </section>
                    <el-button type="primary" class="mt20" @click="submitRule('form')">保存</el-button>
                    <el-button class="mt20" @click="returnCreate">返回</el-button>
                </el-form>
            </div>
            <!--阶梯计价规则-->
            <div v-if="form.type === 4">
                <el-form :model="ruleForm" :rules="ruleFormRules" ref="ruleForm" label-width="120px">
                    <el-form-item label="规则名称：" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item label="阶段规则：" required>
                        <span class="intro">计费单位时间为30分钟；</span>
                        <div class="rule-list" v-for="(item,index) in ruleForm.value">
                            <span>
                                <el-input v-model="item.time" type="number"></el-input>
                            </span>
                            <span class="intro">分钟，按</span>
                            <span>
                                <el-input v-model="item.price" type="number"></el-input>
                            </span>
                            <span class="intro">元</span>
                            <el-button @click="addPrice" v-if="index === 0">新增</el-button>
                            <el-button type="danger" @click="deletePrice(index)" v-if="index > 0">删除</el-button>
                        </div>
                    </el-form-item>
                    <el-button type="primary" @click="submitModel('ruleForm')">保存</el-button>
                    <el-button class="mt20" @click="returnCreate">返回</el-button>
                </el-form>
            </div>
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

    .rule-list {
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

    .rule-list span {
        float: left;
        display: inline-block;
        margin: 0 10px;
    }

    .weekday-list .el-date-editor.el-input {
        width: 120px;
    }

    .weekday-list {
        margin-bottom: 10px;
    }

    .weekday-list > div {
        display: inline-block;
    }
</style>
<script>
    import TapSelect from '../components/TapSelect.vue'
    import SelectCity from '../components/SelectCity.vue'
    import SelectAreas from '../components/SelectArea.vue'
    import {settings} from '../config/settings'
    import {mapGetters, mapActions} from 'vuex'
    import RuleModel from '../components/RuleModel'
    export default{
        data(){
            return {
                taps: [
                    {
                        task: '统一计费',
                        value: 1
                    },
                    {
                        task: '周惠',
                        value: 2
                    },
                    {
                        task: '优惠日',
                        value: 3
                    },
                    {
                        task: '阶梯计价规则设置',
                        value: 4
                    }
                ],
                validPeriod: [], //有效时间，针对统一计价、周惠
                priceModelId: '',//模型id，针对统一计价
                dialogVisible: false,
                isSetRule: false,
                dayPricingList: [{
                    time: [new Date(), new Date()],
                    priceModelId: ''
                }],
                eRailsList: [],      // 电子围栏Id列表
                city: {},
                form: {
                    name: '',
                    cityList: '',
                    chargingMode: 0,    // 计费方式
                    provincesList: [],  // 盛放城市名
                    partnerCode: '',    // 加盟商编号
                    eRailId: '',        // 电子围栏编号
                    type: 2,
                    billingModule: {}
                    
                },
                weekday: 1, //周惠 选中的某天
                weekPricingList: [{
                    priceModelId: '',
                    startTime: '00:00',
                    endTime: '12:00',
                }],
                startTime: '',
                endTime: '',
                ruleForm: {
                    name: '',
                    value: [{}],//阶梯计价规则列表
                },
                partnerArray: [{partnerCode: ''}],
                eRailArray: [{eRailId: ''}],
                ruleFormRules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 1, max: 24, message: '长度在 1 到 24 个字符', trigger: 'blur'}
                    ]
                },
                formRules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 1, max: 24, message: '长度在 1 到 24 个字符', trigger: 'blur'}
                    ],
                    model: [
                        {required: true, message: '请选择规则模型', trigger: 'change'}
                    ],
                    time: [
                        {required: true, message: '请选择有效期', trigger: 'change'}
                    ]
                }
            }
        },
        created() {
            let self = this;
            self.getModelList();
        },
        computed: {
            ...mapGetters([
                'priceModelList',
            ])
        },
        components: {
            TapSelect,
            SelectCity,
            SelectAreas,
            RuleModel
        },
        methods: {
            ...mapActions([
                'getERailsList',
                'setNewRuleModel',
                'setNewRule',
                'getModelList'
            ]),
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
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
            },
            //新增阶梯计价 规则
            addPrice() {
                let self = this;
                self.ruleForm.value.push({});
            },
            //删除阶梯计价 规则
            deletePrice(index) {
                let self = this;
                self.ruleForm.value.splice(index, 1);
            },
            //新增周惠计价 选定日期下时间 规则
            addWeekPricingTime() {
                let self = this;
                self.weekPricingList.push({
                    startTime: '00:00',
                    endTime: '12:30',
                    priceModelId: ''
                });
            },
            //新增优惠日计价 选定日期+时间 规则
            addDayPricing() {
                let self = this;
                self.dayPricingList.push({
                    time: [new Date(), new Date()],
                    priceModelId: ''
                });
            },
            //删除优惠日计价 选定日期+时间 规则
            deleteDayPricing(index) {
                let self = this;
                self.dayPricingList.splice(index, 1);
            },
            //提交模型
            submitModel(formName) {
                let self = this;
                //表单验证
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let isRuleValid = true;
                        self.ruleForm.value.forEach((item) => {
                            if(item.time < 1 || item.price < 0) {
                                self.$notify({
                                    title: '失败',
                                    message: '阶梯规则值不能为负数',
                                    type: 'error'
                                });
                                isRuleValid = false;
                                return false;
                            }
                        });
                       if(!isRuleValid) {
                           return false;
                       }
                        self.setNewRuleModel(self.ruleForm).then((res) => {
                            if (res.status == '1') {
                                self.$notify({
                                    title: '成功',
                                    message: res.msg,
                                    type: 'success'
                                });
                                self.isSetRule = false;
                            } else {
                                self.$notify({
                                    title: '失败',
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //提交规则
            submitRule(formName) {
                let self = this;
                let type = self.form.type;
                let startTime, endTime;
                let cityArray = [];
                //表单验证
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!self.form.provinces) {
                            self.$notify({
                                title: '请选择城市',
                                message: '选择城市为空',
                                type: 'error'
                            });
                            return;
                        }
                        self.form.provinces.forEach((item) => {
                            cityArray.push(item.cityName);
                        });
                        self.form.cityList = cityArray.toString();
                        self.formatPartner();
                        self.formatERails();
                        if (type !== 3) {
                            let timeArray = self.validPeriod;
                            startTime = timeArray[0].getTime() / 1000;
                            endTime = timeArray[1].getTime() / 1000;
                        }
                        //统一计价
                        if (type === 1) {
                            self.form.billingModule.unitePricing = {
                                startTime: startTime.toString(),
                                endTime: endTime.toString(),
                                priceModelId: self.priceModelId
                            };
                        }
                        //周惠
                        if (type === 2) {
                            let ruleValue = [];
                            self.weekPricingList.forEach((item) => {
                                let startTimeArray = item.startTime.split(':');
                                let endTimeArray = item.endTime.split(':');
                                let startTime = parseInt(startTimeArray[0]) * 60 * 60 + parseInt(startTimeArray[1]) * 60;
                                let endTime = parseInt(endTimeArray[0]) * 60 * 60 + parseInt(endTimeArray[1]) * 60;
                                ruleValue.push({
                                    periodStartTime: startTime.toString(),
                                    periodEndTime: endTime.toString(),
                                    priceModelId: item.priceModelId
                                })
                            });
                            self.form.billingModule.weekPricing = {
                                startTime: startTime.toString(),
                                endTime: endTime.toString(),
                                weekday: self.weekday,
                                ruleValue: ruleValue
                            }
                        }
                        //优惠日
                        if (type === 3) {
                            let dayPriceList = [];
                            let isTimeEqual = false;
                            self.dayPricingList.forEach((item) => {
                                let startTime = parseInt(item.time[0].getTime() / 1000);
                                let endTime = parseInt(item.time[1].getTime() / 1000);
                                if(startTime === endTime) {
                                    self.$notify({
                                        title: '优惠日时间',
                                        message: '结束时间应大于开始时间',
                                        type: 'error'
                                    });
                                    isTimeEqual = true;
                                    return;
                                }
                                dayPriceList.push({
                                    startTime: startTime.toString(),
                                    endTime: endTime.toString(),
                                    priceModelId: item.priceModelId
                                })
                            });
                            self.form.billingModule.dayPricing = dayPriceList;
                            if(isTimeEqual) {
                                return;
                            }
                        }
                        // 请求接口
                        self.setNewRule(self.form).then((res) => {
                            self.$notify({
                                title: '成功',
                                message: res,
                                type: 'success'
                            });
                            // self.$router.push({path: 'priceList'});
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            });
                        });
                    } else {
                        self.$notify({
                            title: '失败',
                            message: '请填写完表单',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },
            // 计费方式
            chargingModeClick() {
                let self = this;
                const index = this.form.chargingMode;
                if(index === 0){
                    console.log(0);
                }
                if(index === 1) {
                    console.log(1);
                }
                if(index === 2) {
                    if(!self.form.provinces) {
                        self.$notify({
                            title: '警告',
                            message: '请先选择城市',
                            type: 'warning'
                        });
                        return;
                    }
                    for(let i = 0; i < this.form.provinces.length; i++) {
                        self.form.provincesList.push(self.form.provinces[i].cityName);
                    }
                    self.city.cityName = self.form.provincesList.toString();
                    // 请求接口
                    self.getERailsList(self.city).then((res) => {
                        self.eRailsList = res.data;
                        console.debug('self.eRailsList', self.eRailsList);
                        self.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success'
                        });
                    }, (err) => {
                        self.$notify({
                            title: '失败',
                            message: err,
                            type: 'error'
                        });
                    });
                }
            },
            //删除加盟商
            deletePartner(index) {
                let self = this;
                self.partnerArray.splice(index, 1);
            },
            //添加加盟商
            addPartner(index) {
                let self = this;
                self.partnerArray.push({partnerCode: ''});
            },
            // 删除电子围栏
            deleteERails(index) {
                let self = this;
                self.eRailArray.splice(index, 1);
            },
            // 添加电子围栏Id
            addERailsId() {
                let self = this;
                self.eRailArray.push({eRailId: ''});
            },
            // 格式化加盟商格式
            formatPartner() {
                let self = this;
                let partners = [];
                if (!self.partnerArray) {
                    return;
                }
                self.partnerArray.forEach((item) => {
                    partners.push(item.partnerCode);
                });
                self.form.partnerCode = partners.toString();
            },
            // 格式化电子围栏
            formatERails() {
                let self = this;
                let rails = [];
                if (!self.eRailArray) {
                    return;
                }
                self.eRailArray.forEach((item) => {
                    rails.push(item.eRailId);
                });
                self.form.eRailId = rails.toString();
            },
            //返回创建计费
            returnCreate() {
                let self = this;
                self.isSetRule = false;
            }
        }
    }
</script>
