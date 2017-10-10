<template>
    <div class="container container-cont">
        <TapSelect v-if="!showNext" :taps="taps" title="优惠券管理" @setValue="setCoupon"/>
        <!--选择地区-->
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>

        <el-row v-if="showNext">
            <el-col :lg="{span: 16}" :md="{span: 14}" :sm="{span:12}" :xs="{span: 10}">
                <el-form v-if="form.type <= 3" class="mt40" ref="form" :model="form"
                         :rules="rules" label-position="left" label-width="180px"
                >
                    <el-form-item label="方式:" required>
                        <el-radio-group v-model="form.addType" class="button-cont" @change="chooseMethodClick">
                            <el-radio-button :label="0">接口方式</el-radio-button>
                            <el-radio-button :label="1">直接生成券</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否仅新用户可用：" required>
                        <el-radio-group v-model="form.isNewuserUse">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="单用户可领张数：" prop="limitSize">
                        <el-form-item>
                            <el-radio-group v-model="form.limitType" @change="batchClick()">
                                <el-radio :label="0">按批次</el-radio>
                                <el-radio :label="1">按单次</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-radio-group v-model="form.limitSize" v-if="showBatch">
                            <el-radio :label="1">1</el-radio>
                            <el-radio :label="2">2</el-radio>
                            <el-radio :label="3">3</el-radio>
                            <el-radio :label="other">其他
                                <el-input style="width: 60px;" type="number" min="0" :value="other"
                                          @blur="setLimit($event)" placeholder="请输入"
                                >
                                </el-input>
                            </el-radio>
                            <el-radio :label="-1">不限</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="发券活动主题：" prop="topic">
                        <el-input v-model.trim="form.topic" :maxlength="30" placeholder="请输入本次发券的主题，30字以内"></el-input>
                    </el-form-item>

                    <el-form-item label="优惠卷显示名称：" prop="couponName">
                        <el-input v-model.trim="form.couponName" :maxlength="15" placeholder="请输入优惠券上显示的券名，15字以内"></el-input>
                    </el-form-item>

                    <el-form-item label="设置投放地域：" required>
                        <el-radio-group v-model="form.areaType" @change="selectArea">
                            <el-radio :label="0">全域</el-radio>
                            <el-radio :label="1">选择地域</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <template v-if="form.type <= 2">
                        <!-- 接口方式的情况下 start -->
                        <template v-if="form.addType == 0">
                            <el-form-item label="是否限制张数:" required>
                                <el-radio-group v-model="form.isLimitSize" @change="isLimitSizeClick">
                                    <el-radio :label="0">不限</el-radio>
                                    <el-radio :label="1">限定张数</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item v-if="showAddTypeZero" label="券面额:"  required>
                                <div class="row-wrap">
                                    <template v-for="(item, index)  in form.coupon">
                                        <div class="wid row">
                                            <el-input v-model.number="item.denomination"
                                                      placeholder="输入劵面额"
                                                      @blur="checkMoneyAndRepeat($event, index)"
                                            >
                                            </el-input>
                                            元券
                                            <el-button icon="minus" @click="delCoupon(index)"></el-button>
                                        </div>
                                    </template>
                                    <div class="wid">
                                        <el-button icon="plus" @click="addCoupon"></el-button>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item v-else label="设置券的面额&数量:" required class="setcoupon">
                                <div class="row-wrap">
                                    <template v-for="(item, index)  in form.coupon">
                                        <div class="wid row">
                                            <el-input v-model.number="item.denomination"
                                                      placeholder="输入劵面额"
                                                      @blur="checkMoneyAndRepeat($event, index)"
                                            >
                                            </el-input>
                                            元劵
                                            <el-input v-model.number="item.couponNum"
                                                      placeholder="输入张数"
                                                      @blur="checkValue($event, index)"
                                            >
                                            </el-input>
                                            张数
                                            <el-button icon="minus" @click="delCoupon(index)"></el-button>
                                        </div>
                                    </template>
                                    <div class="wid">
                                        <el-button icon="plus" @click="addCoupon"></el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </template>

                        <!-- 直接生成的情况下 -->
                        <template v-else>
                            <el-form-item label="设置券的面额&数量：" required class="setcoupon">
                                <div class="row-wrap">
                                    <template v-for="(item, index)  in form.coupon">
                                        <div class="wid row">
                                            <el-input v-model.number="item.denomination"
                                                      @blur="checkMoneyAndRepeat($event, index)"
                                                      placeholder="输入劵面额"
                                            >
                                            </el-input>
                                            元劵
                                            <el-input  v-model.number="item.couponNum"
                                                       placeholder="输入张数"
                                                       @blur="checkValue($event, index)"
                                            >
                                            </el-input>
                                            张数
                                            <el-button icon="minus" @click="delCoupon(index)"></el-button>
                                        </div>
                                    </template>
                                    <div class="wid">
                                        <el-button icon="plus" @click="addCoupon"></el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </template>
                    </template>

                    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                    <template v-if="form.type == 3">
                        <el-form-item v-if="showCounts" label="是否限制张数:" required>
                            <el-radio-group v-model="form.isLimitSize" @change="isLimitSizeClick">
                                <el-radio :label="0">不限</el-radio>
                                <el-radio :label="1">限定张数</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="showDiscount" label="设置券的折扣：" required class="setcoupon">
                            <div class="row-wrap">
                                <template v-for="(item, index)  in form.coupon">
                                    <div class="wid row">
                                        <el-input max="10" min="0" @blur="setAllDenomination($event,index )"
                                                  v-model.number="item.denomination" placeholder="输入折扣"
                                        >
                                        </el-input>
                                        折券
                                        <el-button icon="minus" @click="delCoupon(index)"></el-button>
                                    </div>
                                </template>
                                <div class="wid">
                                    <el-button icon="plus" @click="addCoupon"></el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item v-else label="设置券的折扣&数量:" required class="setcoupon">
                            <div class="row-wrap">
                                <template v-for="(item, index)  in form.coupon">
                                    <div class="wid row">
                                        <el-input max="10" min="0" @blur="setAllDenomination($event,index )"
                                                  v-model.number="item.denomination" placeholder="输入折扣"
                                        >
                                        </el-input>
                                        折券
                                        <el-input v-model.number="item.couponNum"
                                                  @blur="checkValue($event, index)" placeholder="输入张数"
                                        >
                                        </el-input>
                                        张
                                        <el-button icon="minus" @click="delCoupon(index)"></el-button>
                                    </div>
                                </template>
                                <div class="wid">
                                    <el-button icon="plus" @click="addCoupon"></el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="设置券的最高抵扣金额：" required>
                            <el-radio-group v-model="form.maxDeductionType" @change="bestHeighestMoney()">
                                <el-radio :label="0">
                                    统一上限
                                    <el-input style="width: 80px;" v-model.number="form.maxDeductionMoney"
                                              @blur="checkMaxDeductionMoney($event)" placeholder="输入金额"
                                    >
                                    </el-input>
                                </el-radio>
                                <br>
                                <el-radio :label="1" style="margin-top: 10px;">
                                    单独设置：
                                    <template v-for="item in form.coupon">
                                        {{item.denomination || '--' }}折劵
                                        <el-input style="width: 80px;" :disabled="form.maxDeductionType !=1"
                                                  v-model.number="item.maxDeductionMoney" placeholder="金额"
                                                  @blur="checkMoney($event)"
                                        >
                                        </el-input>
                                        元
                                    </template>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
                    <el-form-item label="有效期类型：" required>
                        <el-radio-group v-model="form.validateType" @change="validDaysClick()">
                            <el-radio :label="0">固定天数</el-radio>
                            <el-radio :label="1">固定时间</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item v-if="showValidDays" label="有效天数：" prop="validateDays">
                        <div style="display: flex">
                            <el-input style="width: 193px;" v-model="form.validateDays" placeholder="请输入有效天数，6字以内"></el-input>
                            <span>天</span>
                        </div>
                    </el-form-item>

                    <el-form-item v-else label="设置投放时间段:" prop="validateDaysRange">
                        <el-date-picker
                            type="daterange"
                            range-separator="——"
                            placeholder="选择时间范围"
                            v-model="form.validateDaysRange"
                            @change="timeChange"
                            style="width: 100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                    
    
                    <el-form-item>
                        <el-button type="info" @click="upStep()">返222回</el-button>
                        <el-button type="info" @click="finishCreate('form')">生222成劵</el-button>
                    </el-form-item>
                </el-form>
                
                <create-vip-card v-if="form.type === 4" @back-click="upStep()"></create-vip-card>
                <create-vip-card-activity v-if="form.type === 5" @back-click="upStep()"></create-vip-card-activity>
                <creat-merchant-ticket  v-if="form.type === 6" @back-click="upStep()"></creat-merchant-ticket>

            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import TapSelect from '../components/TapSelect.vue';
    import SelectAreas from '../components/SelectArea.vue';
    import CreateVipCard from './CreateVipCard.vue';
    import CreatMerchantTicket from './CreatMerchantTicket.vue';
    import CreateVipCardActivity from './CreateVipCardActivity.vue'
    import {settings} from '../config/settings';
    export default{
        components: {
            TapSelect,
            SelectAreas,
            CreateVipCard,
            CreateVipCardActivity,
            CreatMerchantTicket
        },
        data() {
            return {
                taps: [
                    {
                        task: '充值券',
                        value: 1
                    },
                    {
                        task: '抵扣券',
                        value: 2
                    },
                    {
                        task: '折扣券',
                        value: 3
                    },
                    {
                        task: '商家券6',
                        value: 6
                    },
                    {
                        task: '会员卡活动5',
                        value: 5
                    },
                    {
                        task: '自营会员卡4',
                        value: 4
                    },
                    
                    
                ],
                radio: '1',
                pickerOptions: {
                    disabledDate(time)
                    {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                showBatch: true,
                showLimit: true,
                showValidDays: true,
                showAddTypeZero: true, // 接口方式情况下 显示只有券面额输入框
                showNext: false,
                dialogVisible: false,
                showCounts: true,      // type=3时，显示 是否限制张数
                showDiscount: true,    // 显示 设置券的折扣
                other: 4,
                maxMoney: 0,
                timeRange: '-1',         // 赋值后的时间范围
                form: {
                    type: 0,            // 控制显示哪一个版块
                    addType: 0,         // 添加类型   接口 or 直接生成
                    isNewuserUse: 0,
                    limitType: 0,       // 领取限制类型   按批次 or 按单次
                    limitSize: 1,       // 限制领取几张
                    isLimitSize: 0,     // 是否限定张数
                    topic: '',
                    couponName: '',
                    areaType: 0,        // 设置投放地域
                    coupon: [{}],       // 券面额那一块的 字段
                    maxDeductionType: 0,
                    maxDeductionMoney: '',
                    validateType: 0,    // 有效期类型
                    validateDays: '',   // 有效天数
                    validateDaysRange: [] // 有效时间范围
                },
                rules: {
                    limitSize: [
                        {type: 'number', required: true, message: '请选择可领用', trigger: 'change'},
                    ],
                    topic: [
                        {type: 'string', required: true, message: '请输入广告主题', trigger: 'blur'},
                    ],
                    couponName: [
                        {required: true, message: '请输入优惠劵显示名称', trigger: 'blur'}
                    ],
                    validateDays: [
                        {type: 'string', required: true, message: '请填写有效天数', trigger: 'change'}
                    ],
                    validateDaysRange: [
                        {type: 'array', required: true, message: '请选择时间范围', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            ...mapActions([
                'createConpon'
            ]),

            // 选择模块事件 （充值券、抵扣券、折扣券、会员卡）
            setCoupon(val) {
                let self = this;
                self.showNext = true;
                self.form.type = val;
            },
            // 选择 方式 （接口方式、直接生成券）
            chooseMethodClick(val) {
                let self = this;
                this.form.addType = val;
                self.form.coupon = [{}];
                if(this.form.addType === 0){
                    self.form.isLimitSize = 0;
                    // form.type = 3 的情况下
                    this.showCounts = true;
                    this.showDiscount = true;
                } else {
                    // 当点击 直接生成的时候 将 isLimitSize 设置成1
                    self.form.isLimitSize = 1;
                    // form.type = 3 的情况下
                    this.showCounts = false;
                    this.showDiscount = false;
                }
                // 切换状态的时候不能清空 设置投放时间段，否则会在选完时间段以后不提交直接切换导致 自动校验表单
                // self.form.validateDaysRange = [];
            },
            // 选择 （按批次 or 按单次）
            batchClick(){
                this.showBatch = !this.showBatch;
                this.form.limitSize = 1;
            },
            // 是否限制张数 （不限、限定张数）
            isLimitSizeClick() {
                // form.type <=2
                this.showAddTypeZero = !this.showAddTypeZero;
                // form.type =3
                this.showDiscount = !this.showDiscount;

                this.form.coupon = [{}];
            },

            // 有效期类型 （固定天数、固定时间）
            validDaysClick() {
                this.showValidDays =!this.showValidDays;
                const index = this.form.validateType;
                if(index === 1){
                    this.form.validateDays = '';
                } else {
                    this.form.validateDaysRange = [];
                }
            },
            // 最高抵扣金额
            bestHeighestMoney() {
                const index = this.form.maxDeductionType;
                if (index === 0) {
                    for( let i = 0; i < this.form.coupon.length; i++) {
                        this.form.coupon[i].maxDeductionMoney = ''
                    }
                } else {
                    this.form.maxDeductionMoney = '';
                }
            },
            // 固定时间情况下 确认选择时间范围的点击事件
            timeChange(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('——');
                // 将年月日 跟 时分秒分离
                self.form.startTime = items[0];
                self.form.endTime = items[1];
                self.timeRange = val;
                console.log('self.timeRange', self.timeRange);
            },
            
            setLimit(e) {
                let self = this;
                let val = e.target.value;
                if (val == 1) {
                    self.form.limitSize = 1;
                    e.target.value = 4;
                    return
                }
                if (val == 2) {
                    self.form.limitSize = 2;
                    e.target.value = 4;
                    return
                }
                if (val == 3) {
                    self.form.limitSize = 3;
                    e.target.value = 4;
                    return
                }
                if (val <= 0) {
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

            selectArea() {
                let self = this;
                if (self.form.areaType == '0') {
                    return;
                }
                self.dialogVisible = true;
            },
            selectAreaByClick() {
                let self = this;
                self.dialogVisible = true;
            },
            setAreas(form) {
                let self = this;
                if (!form.provinces.length) {
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
            },
            addCoupon() {
                let self = this;
                /**
                 * 防止点击以后 前面几个对象的值去掉 0
                 */
                for(let i = 0; i < self.form.coupon.length; i++){
                    self.form.coupon[i].denomination = Number(self.form.coupon[i].denomination).toFixed(2)
                }
                self.form.coupon.push({});
            },
            delCoupon(index) {
                let items = this.form.coupon;
                if (items.length == 1) {
                    this.$notify({
                        title: '提示',
                        message: '不能全部删除',
                        type: 'info'
                    });
                    return;
                }
                this.form.coupon.splice(index, 1);
            },
            checkMaxDeductionMoney (e) {
                let val = e.target.value;
                let self = this;
                if (val <= 0) {
                    self.$notify({
                        title: '提示',
                        message: '统一上限值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    self.form.maxDeductionMoney = 0;
                    return;
                }
            },
            checkMoneyAndRepeat(e, i) {
                let self = this;
                let val = e.target.value;
                if (val <= 0) {
                    this.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 0;
                    self.form.coupon[i].denomination = 0;
                    return;
                }
                
                let obj = self.form.coupon[i];
                this.form.coupon.splice(i, 1, obj);
                self.form.coupon[i].denomination = Number(val).toFixed(2);

                let items = JSON.parse(JSON.stringify(self.form.coupon));
                items.splice(i, 1);
                items.map((c) => {
                    if (c.denomination === Number(val).toFixed(2)) {
                        this.$notify({
                            title: '提示',
                            message: '劵不能重复',
                            type: 'info'
                        });
                        obj.denomination = 0;
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
                    self.form.coupon[index].denomination = 0;
                    return;
                }
                
                let obj = self.form.coupon[index];
                this.form.coupon.splice(index, 1, obj);
                self.form.coupon[index].denomination = Number(val).toFixed(2);
                
                let items = JSON.parse(JSON.stringify(self.form.coupon));
                items.splice(index, 1);
                items.map((c) => {
                    if (c.denomination === Number(val).toFixed(2)) {
                        this.$notify({
                            title: '提示',
                            message: '折扣劵不能重复',
                            type: 'info'
                        });
                        obj.denomination = 0;
                    }
                });
            },
            // 正则表达式 ＞0 的正整数
            isInt(str){
                let g = /^\+?[1-9][0-9]*$/;
                return g.test(str);
            },
            // 正则表达式 >0 的数
            checkNumber(str) {
                let g = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
                return g.test(str);
            },
            checkValue(e, index) {
                let self = this;
                let val = e.target.value;
                if (!this.isInt(val)) {
                    this.$notify({
                        title: '提示',
                        message: '数值只能为大于0的整数',
                        type: 'info'
                    });
                    e.target.value = 0;
                    self.form.coupon[index].couponNum = 0;
                }
                /**
                 * 防止点击以后 前面几个对象的值去掉 0
                 */
                for(let i = 0; i < self.form.coupon.length; i++){
                    self.form.coupon[i].denomination = Number(self.form.coupon[i].denomination).toFixed(2)
                }
            },
            
            // 返回时将恢复默认 字段的值
            upStep() {
                this.timeRange = '-1';
                this.showNext = false;
                this.showBatch = true;
                this.showValidDays = true;
                this.showAddTypeZero = true;
                this.showCounts = true;
                this.showDiscount = true;
                this.form = {
                    type: 0,
                    addType: 0,
                    isNewuserUse: 0,
                    limitType: 0,
                    limitSize: 1,
                    topic: '',
                    couponName: '',
                    areaType: 0,
                    isLimitSize: 0,
                    coupon: [{}],
                    maxDeductionType: 0,
                    maxDeductionMoney: 0,
                    denomination: 0,
                    validateType: 0,
                    validateDaysRange: [],
                };
            },

            finishCreate(formName) {
                let self = this;
                self.$refs[formName].validate((valid) => {
                    // 接口方式
                    let showAddTypeOne = true;
                    let showAddTypeOne_One = true;
                    // 直接生成方式
                    let showAddTypeTwo = true;
                    let showAddTypeTwo_Two = true;
                    // 当为 接口方式的情况  `````````````````````````````````````````
                    if (self.form.addType === 0) {
                        self.form.coupon.map((obj) => {
                            if((self.form.isLimitSize === 0 || self.form.isLimitSize === 1) && !obj.denomination && obj.denomination !== 0) {
                                showAddTypeOne = false;
                            }
                            if(self.form.isLimitSize === 1 && !obj.couponNum && obj.couponNum !== 0){
                                showAddTypeOne_One = false;
                            }
                        });
                    }
                    //  当为直接生成券的情况````````````````````````````````````````
                    if (self.form.addType === 1) {
                        self.form.coupon.map((obj) => {
                            if(!obj.denomination && obj.denomination !== 0) {
                                showAddTypeTwo = false;
                            }
                            if(!obj.couponNum && obj.couponNum !== 0) {
                                showAddTypeTwo_Two = false;
                            }
                        });
                    }
                    // 公用部分 （券面额 or 券面额和数量）
                    if(self.form.type <= 2) {
                        // 当为 不限张数的情况
                        if (!showAddTypeOne) {
                            self.$notify({
                                title: '警告',
                                message: '请输入券面额',
                                type: 'warning'
                            });
                            return;
                        }
                        // 校验券面额 是否＞0
                        for (let i = 0; i < this.form.coupon.length; i++) {
                            if (!this.checkNumber(this.form.coupon[i].denomination)) {
                                self.$notify({
                                    title: '警告',
                                    message: '券面额不能小于等于0',
                                    type: 'warning'
                                });
                                return;
                            }
                        }
                        // 当为 限定张数的情况
                        if(self.form.isLimitSize === 1) {
                            if(!showAddTypeOne_One) {
                                self.$notify({
                                    title: '警告',
                                    message: '请输入券张数',
                                    type: 'warning'
                                });
                                return;
                            }
                            // 校验 券张数 是否是正整数
                            for(let i = 0; i < this.form.coupon.length; i++) {
                                if (!this.isInt(this.form.coupon[i].couponNum)) {
                                    self.$notify({
                                        title: '警告',
                                        message: '请输入大于0的整数',
                                        type: 'warning'
                                    });
                                    return;
                                }
                            }
                        }
                    }

                    // 公用部分 （券折扣 or 券的折扣和数量）
                    if(self.form.type === 3) {
                        // 当为  不限张数的情况
                        if (!showAddTypeOne) {
                            self.$notify({
                                title: '警告',
                                message: '请输入折扣',
                                type: 'warning'
                            });
                            return;
                        }
                            // 校验折扣券 是否＞0
                        for (let i = 0; i < this.form.coupon.length; i++) {
                            const numbers = this.form.coupon[i].denomination;
                            if (!this.checkNumber(numbers) || numbers > 10) {
                                self.$notify({
                                    title: '警告',
                                    message: '折扣只能是大于0且小于等于10',
                                    type: 'warning'
                                });
                                return;
                            }
                        }
                        // 当为 限制张数的情况
                        if(self.form.isLimitSize === 1){
                            if(!showAddTypeOne_One) {
                                self.$notify({
                                    title: '警告',
                                    message: '请输入券张数',
                                    type: 'warning'
                                });
                                return;
                            }
                            // 校验 券张数 是否是正整数
                            for(let i = 0; i < this.form.coupon.length; i++) {
                                const counts = this.form.coupon[i].couponNum;
                                if (!this.isInt(counts)) {
                                    self.$notify({
                                        title: '警告',
                                        message: '券张数只能为正整数',
                                        type: 'warning'
                                    });
                                    return;
                                }
                            }
                        }

                        // 校验 统一上限是否填写 (等于0的情况下 布尔值会默认为false，所以会一直让填写金额)
                        if(!self.form.maxDeductionMoney && self.form.maxDeductionMoney !==0){
                            self.$notify({
                                title: '警告',
                                message: '请填写统一上限金额',
                                type: 'warning'
                            });
                            return;
                        }
                        // 正则表达式 >0
                        if(!this.checkNumber(this.form.maxDeductionMoney)) {
                            self.$notify({
                                title: '警告',
                                message: '统一上限金额不能小于等于0',
                                type: 'warning'
                            });
                            return;
                        }
                    }

                    // 校验 有效天数的值  是否为整数
                    if (this.form.validateDays) {
                        // 正则表达式 正整数
                        const res = this.form.validateDays;
                        if (!this.isInt(res)) {
                            self.$notify({
                                title: '警告',
                                message: '有效天数只能为正整数',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                    
                    // 校验投放时间段是否填写 (当选过以后再删除 表单自带验证会失效 无法判断是否填写,所以创建了timeRange)
                    if(self.form.validateType === 1 && !self.timeRange) {
                        self.$notify({
                            title: '警告',
                            message: '请选择时间范围',
                            type: 'warning'
                        });
                        return;
                    }
                    // 请求接口
                    if (valid) {
                        self.createConpon(self.form)
                            .then((res) => {
                                self.$router.push('couponList');
                            }, (err) => {
                            console.log(err);
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
    }
</script>
<style scoped>
    @media screen and (max-width: 2000px) {
        .setcoupon {
            width: 850px;
        }
    }

    .container {
        background-color: #fff;
    }
    .button {
        background: lightcyan;
    }
    .mt40 {
        margin-top: 40px;
    }

    .wid {
        width: 47%;
        margin-bottom: 2px;
    }
    .width {
        width: 193px;
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
<style lang="less">
    .container-cont{
        .button-cont {
            .el-radio-button {
                margin-right: 30px;
            }
            .el-radio-button .el-radio-button__inner {
                border-radius: 4px;
                border: 1px solid #bfcbd9;
                width: 102px;
                box-shadow: none;
            }
        }
        .flex-cont {
            .el-form-item__content {
                display: flex;
            }
        }
        .row {
            .el-input {
                width: 150px;
            }
        }
        .setcoupon {
            width: 100% !important;
        }
    }
    
</style>
