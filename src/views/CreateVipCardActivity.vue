<template>
    <div class="cont" :class="{fromOther: showCss}" style="background: white;width: 100%;height:100%">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        
        <!--电子围栏-->
        <el-dialog title="提示" v-model="showErailsDialog" size="tiny">
            <el-checkbox-group v-model="eRailsIdList" >
                <el-row :gutter="20">
                    <template v-for="(item,index) in eRailsList">
                        <el-col :span="6">
                            <el-checkbox :label="item.id">{{item.electricName}}</el-checkbox>
                        </el-col>
                    </template>
                </el-row>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showErailsDialog = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirmClick">确 定</el-button>
            </span>
        </el-dialog>
    
        <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px" style="background: #fff">
            <el-form-item label="会员卡名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            
            <el-form-item label="规则标题" prop="rule_title" required>
                <el-input v-model="form.rule_title"></el-input>
            </el-form-item>
            
            <el-form-item label="卡规则" prop="rule_content" required>
                <el-input v-model="form.rule_content"></el-input>
            </el-form-item>
           
            <el-form-item label="卡类型" required>
                <el-radio-group v-model="form.type" @change="chooseCardType">
                    <el-radio :label="21">月卡</el-radio>
                    <el-radio :label="24">次卡</el-radio>
                    <el-radio :label="22">半年卡</el-radio>
                </el-radio-group>
            </el-form-item>
    
            <el-form-item label="卡次数" v-if="showTimesCard" prop="can_use_counts" required>
                <el-input type="number" v-model="form.can_use_counts"></el-input>
            </el-form-item>
    
            <el-form-item label="有效卡样式：" prop="card_image">
                <el-upload
                    :action="url"
                    list-type="picture-card"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <i v-if="showBtn" class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="showDialogImg" size="tiny" class="dialog-cont">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
    
            <el-form-item label="合作方" required>
                <el-select style="width: 100%;" v-model="form.third_part_type">
                    <el-option  :label="item.thirdPartName" :value="item.thirdPartType"
                                v-for="item in thirdPartnerList"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
    
            <el-form-item label="是否仅新用户可用：" required>
                <el-radio-group v-model="form.is_newuser_use">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
    
            <el-form-item label="单用户可领张数" required>
                <el-radio-group v-model="form.one_receive_count_max">
                    <el-radio :label="1">1</el-radio>
                    <el-radio :label="2">2</el-radio>
                    <el-radio :label="3">3</el-radio>
                    <el-radio :label="other">
                        其他
                        <el-input style="width: 65px;" min="0" :value="other"
                                  @blur="setLimit($event)" placeholder="请输入"
                        >
                        </el-input>
                    </el-radio>
                    <el-radio :label="-1">不限</el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="发放张数" required>
                <el-radio-group v-model="form.total_number">
                    <el-radio :label="-1">不限</el-radio>
                    <el-radio :label="countsOther">
                        总共
                        <el-input style="width: 65px;" placeholder="请输入" :value="countsOther"
                                  min="0" @blur="setCounts($event)"
                            >
                        </el-input>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="活动时间：" required>
                <el-col :span="11">
                    <el-form-item prop="activeStartDate" required>
                        <el-date-picker type="date" placeholder="选择开始时间" @change="activeStartDateBlur"
                                        v-model="form.activeStartDate" style="width: 100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center"> - </el-col>
                <el-col :span="11">
                    <el-form-item prop="activeEndDate">
                        <el-date-picker type="date" placeholder="选择结束时间" @change="activeEndDateBlurBlur"
                                        v-model="form.activeEndDate" style="width: 100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            
            <!-- 次卡的情况下显示 -->
            <template v-if="showTimesCard">
                <el-form-item label="有效期类型：" required>
                    <el-radio-group v-model="form.validate_type" @change="validDaysClick">
                        <el-radio :label="0">固定天数</el-radio>
                        <el-radio :label="1">固定时间</el-radio>
                    </el-radio-group>
                </el-form-item>
    
                <el-form-item v-if="showValidDays" label="有效天数：" prop="expire_days">
                    <div style="display: flex">
                        <el-input type="number" style="width: 193px;" v-model="form.expire_days" placeholder="请输入有效天数，6字以内"></el-input>
                        <span>天</span>
                    </div>
                </el-form-item>
                
                <el-form-item v-else label="有效时间：">
                    <el-col :span="11">
                        <el-form-item prop="expireStartTime">
                            <el-date-picker type="date" placeholder="选择开始时间" @change="StartDateBlur"
                                            v-model="form.expireStartTime" style="width: 100%;"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align: center"> - </el-col>
                    <el-col :span="11">
                        <el-form-item prop="expireEndTime">
                            <el-date-picker type="date" placeholder="选择结束时间" @change="EndDateBlur"
                                            v-model="form.expireEndTime" style="width: 100%;"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </template>
            
            <el-form-item label="禁用地区" class="ban-cont">
                <span class="choose-city" v-for="item in form.provinces">{{item.cityName}}</span>
                <el-button @click="selectAreaClick">选择禁用地区</el-button>
                <!--<el-button @click="selectAreaClick">选择禁用地区 <span style="color: #969696;font-size: 12px">(不包含运营区)</span> </el-button>-->
            </el-form-item>
    
            <el-form-item label="禁用运营区" class="ban-cont">
                <span class="choose-city" v-for="item in eRailsValueList">{{item}}</span>
                <el-button @click="eRaislIdSelect">选择禁用运营区</el-button>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="upStep()">返回</el-button>
                <el-button type="primary" @click="onSubmit('form')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped>
    .mt40 {
        margin-top: 40px;
    }
    .hide {
        display: none;
    }
    .choose-city {
        margin-right: 10px;
    }
    
</style>
<style lang="less">
    .cont {
        .dialog-cont {
            .el-dialog {
                width: 400px !important;
            }
        }
        .ban-cont {
            margin-left: 13px;
            .el-form-item__label {
                width: 170px !important;
            }
            .el-form-item__content {
                margin-left: 170px !important;
            }
        }
    }
</style>
<script>
    import {mapState,mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';
    import SelectAreas from '../components/SelectAreaForActivity';


    export default{
        components: {
            SelectAreas,
        },
        data(){
            return {
                dialogVisible: false,
                test: '',
                showCss: false,
                url: `${settings.URL}/api/uploadImage`,
                showBtn: true,
                dialogImageUrl: '',
                showDialogImg: false,
                other: 4,
                countsOther: '',
                timeRangeForAct: '',
                timeRangeForVal: '',
                showValidDays: true,
                showTimesCard: false,
                showBackBtn: false,
                showErailsDialog: false,
                eRailsList: [],
                eRailsIdList: [],
                eRailsValueList: [],
                form: {
                    source_from: 2,
                    name: '',
                    rule_title: '',
                    rule_content: '',           // 卡规则
                    can_use_counts: '',         // 卡的使用次数
                    type: 21,                   // 卡类型
                    card_image: '',             // 有效图片地址
                    third_part_type: '',         // 合作方
                    is_newuser_use: 0,          // 是否新用户可领
                    one_receive_count_max: 1,   // 单用户领取张数
                    total_number: -1,           // 发放张数
                    activeStartDate: '',
                    activeEndDate: '',
                    validate_type: 0,
                    expire_days: '',            // 有效天数
                    expireStartTime: '',
                    expireEndTime: '',
                    provinces: [],              // 禁用城市
                    forbiddenCityCode: '',       // 禁用城市 字符窜格式
                    forbiddenControlAreaId: ''  // 禁用运营区（电子围栏）
                },
                rules: {
                    name: [
                        {type: 'string',required: true, message: '请输入会员卡名称', trigger: 'blur'},
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    rule_title: [
                        {required: true,message: '请输入规则标题', trigger: 'blur'}
                    ],
                    rule_content: [
                        {required: true,message: '请输入规则内容', trigger: 'blur'}
                    ],
                    can_use_counts: [
                        {type:'number',required: true,message: '请输入卡的次数', trigger: 'blur'}
                    ],
                    type: [
                        {required: true,message: '请选择卡类型', trigger: 'change'}
                    ],
                    card_image: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    activeStartDate: [
                        { required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    activeEndDate: [
                        {required: true, message: '请选择结束时间', trigger: 'change'}
                    ],
                    expire_days: [
                        {type:'number',required: true, message: '请填写有效天数', trigger: 'change'}
                    ],
                    expireStartTime: [
                        {required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    expireEndTime: [
                        {required: true, message: '请选择结束时间', trigger: 'change'}
                    ],
                },
            }
        },
        
        computed: {
            ...mapGetters([
                'thirdPartnerList',
            ])
        },
        created() {
            let self = this;
            self.getThirdPartnerList();
            
            self.getERails({type: 1})
                .then((res) => {
                    this.eRailsList = res.data;
                },(err) => {
                    this.alertFn('失败', err.msg, 'warning');
                })
        },
       
        methods: {
            ...mapActions([
                'setActivityVipCard',
                'getThirdPartnerList',
                'getVipCardInfo',
                'getERails'
            ]),
            
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            
            // 正则表达式 ＞0 的正整数
            isInt(str){
                let g = /^\+?[1-9][0-9]*$/;
                return g.test(str);
            },
            chooseCardType(val) {
                if(val === 24) {
                    this.showTimesCard = true;
                } else {
                    this.showTimesCard = false;
                    // 切换的时候清空数据
                    this.form.can_use_counts ='';
                    this.form.expire_days = '';
                }
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.showDialogImg = true;
            },
            handleRemove() {
                this.form.card_image = '';
                this.showBtn = true;
            },
            handleSuccess(res, file) {
                let self = this;
                self.showBtn = false;
                if (res.statusCode == 200) {
                    self.form.card_image = res.data;
                }
            },
            // 单用户可领张数 的输入框事件
            setLimit(e) {
                let self = this;
                let val = e.target.value;
                if (val == 1) {
                    self.form.one_receive_count_max = 1;
                    e.target.value = 4;
                    return
                }
                if (val == 2) {
                    self.form.one_receive_count_max = 2;
                    e.target.value = 4;
                    return
                }
                if (val == 3) {
                    self.form.one_receive_count_max = 3;
                    e.target.value = 4;
                    return
                }
                if (val <= 0) {
                    this.alertFn('提示', '数值不能小于等于0', 'info');
                    e.target.value = 4;
                    self.form.one_receive_count_max = 1;
                    return;
                }
                if (!this.isInt(val)) {
                    this.alertFn('提示', '数值为整数', 'info');
                    e.target.value = 4;
                    self.form.one_receive_count_max = 1;
                    return;
                }
                self.other = Number(val);
                self.$nextTick(function () {
                    self.form.one_receive_count_max = self.other;
                });
        
            },
            // 发放张数
            setCounts(e) {
                let self = this;
                let val = e.target.value;
                if (val <= 0) {
                    this.alertFn('提示', '数值不能小于等于0', 'info');
                    val = 1;
                    self.countsOther = Number(val);
                    self.form.total_number = self.countsOther;
                    return;
                }
                if (!this.isInt(val)) {
                    this.alertFn('提示', '数值为整数', 'info');
                    e.target.value = '';
                    return;
                }
                self.countsOther = Number(val);
                self.$nextTick(function () {
                    self.form.total_number = self.countsOther;
                });
            },
            // 活动开始时间
            activeStartDateBlur(res) {
                this.form.activeStartDate = res;
            },
            // 活动结束时间
            activeEndDateBlurBlur(res) {
                this.form.activeEndDate = res;
            },
            StartDateBlur(res) {
                this.form.expireStartTime = res;
            },
            EndDateBlur(res) {
                this.form.expireEndTime = res;
            },
            // 活动时间范围
            validDaysClick(val) {
                this.showValidDays =!this.showValidDays;
                if(val === 0){
                    this.form.expireEndTime = '';
                    this.form.expireStartTime = '';
                } else {
                    this.form.expire_days = '';
                }
            },
            
            selectAreaClick() {
                let self = this;
                self.dialogVisible = true;
            },
    
            setAreas(form) {
                let self = this;
                let cityArray = [];
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
                self.form.provinces.forEach((item) => {
                    cityArray.push(item.cityCode);
                });
                self.form.forbiddenCityCode = cityArray.toString();
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
            },
            
            eRaislIdSelect() {
                this.showErailsDialog = true;
            },
            dialogConfirmClick(){
                this.showErailsDialog = false;
                if(!this.eRailsIdList.length) {
                    this.eRailsValueList = []
                }
                this.eRailsValueList = this.eRailsIdList;
                this.form.forbiddenControlAreaId = this.eRailsIdList.toString();
            },
    
            upStep() {
                this.$emit('back-click');
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if(!self.form.third_part_type && self.form.third_part_type !== 0) {
                        this.alertFn('警告', '请选择合作方', 'warning');
                        return;
                    }
                    
                    if (valid) {
                        self.setActivityVipCard(self.form)
                            .then((res) => {
                                if(res.status === '1') {
                                    this.alertFn('成功', res.msg, 'success');
                                    self.$router.push({path: 'vipCardList'});
                                }
                            },(err) => {
                                this.alertFn('失败', err.msg, 'error');
                            });
                    }
                });
            }
        }
    }
</script>
