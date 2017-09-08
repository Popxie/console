<template>
    <div>
        <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
            <el-form-item label="会员卡名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            
            <el-form-item label="卡标题" prop="rule_title" required>
                <el-input v-model="form.rule_title"></el-input>
            </el-form-item>
            
            <el-form-item label="卡规则" prop="rule_content" required>
                <el-input v-model="form.rule_content"></el-input>
            </el-form-item>
    
            <el-form-item label="卡次数" v-if="showTimesCard" prop="can_use_counts" required>
                <el-input v-model="form.can_use_counts"></el-input>
            </el-form-item>
           
            <el-form-item label="卡类型" required>
                <el-radio-group v-model="form.type"  @change="chooseCardType">
                    <el-radio :label="21">月卡</el-radio>
                    <el-radio :label="24">次卡</el-radio>
                    <el-radio :label="22">半年卡</el-radio>
                </el-radio-group>
            </el-form-item>
    
            <el-form-item label="广告图片：" prop="card_image">
                <el-upload
                    :action="url"
                    list-type="picture-card"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <i v-if="showBtn" class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogImg" size="tiny">
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
    
            <el-form-item label="活动时间:" prop="validateDaysRange">
                <el-date-picker type="daterange" range-separator="——" placeholder="选择活动时间范围"
                                v-model="form.validateDaysRange" @change="timeChangeForAct" style="width: 100%;"
                >
                </el-date-picker>
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
                        <el-input style="width: 193px;" v-model="form.expire_days" placeholder="请输入有效天数，6字以内"></el-input>
                        <span>天</span>
                    </div>
                </el-form-item>
    
                <el-form-item v-else label="有效时间" prop="validateDaysRangeArr">
                    <el-date-picker type="daterange" range-separator="——" placeholder="选择有效时间范围"
                                    v-model="form.validateDaysRangeArr" @change="timeChangeForVal" style="width: 100%;"
                    >
                    </el-date-picker>
                </el-form-item>
            </template>
            
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
</style>
<script>
    import {mapState,mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';

    export default{
        data(){
            return {
                url: `${settings.URL}/api/uploadImage`,
                showBtn: true,
                dialogImageUrl: '',
                dialogImg: false,
                other: 4,
                countsOther: '',
                timeRangeForAct: '',
                timeRangeForVal: '',
                showValidDays: true,
                showTimesCard: false,
                form: {
                    name: '',
                    rule_title: '',
                    rule_content: '',           // 卡规则
                    can_use_counts: '',         // 卡的使用次数
                    type: 21,                   // 卡类型
                    card_image: '',             // 上传图片地址
                    third_part_type: '',         // 合作方
                    is_newuser_use: 0,          // 是否新用户可领
                    one_receive_count_max: 1,   // 单用户领取张数
                    total_number: -1,           // 发放张数
                    validateDaysRange: [],      // 时间范围
                    activeStartDate: '',
                    activeEndDate: '',
                    validate_type: 0,
                    expire_days: '',            // 有效天数
                    validateDaysRangeArr: [],   // 有效时间
                    expireStartTime: '',
                    expireEndTime: '',
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
                        {required: true,message: '请输入规则内容', trigger: 'blur'}
                    ],
                    type: [
                        {required: true,message: '请选择卡类型', trigger: 'change'}
                    ],
                    card_image: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    validateDaysRange: [
                        {type: 'array', required: true, message: '请选择活动时间范围', trigger: 'change'}
                    ],
                    expire_days: [
                        {type: 'string', required: true, message: '请填写有效天数', trigger: 'change'}
                    ],
                    validateDaysRangeArr: [
                        {type: 'array', required: true, message: '请选择有效时间范围', trigger: 'change'}
                    ],
                },
                options: [{
                    value: '1000000',
                    label: '无限次'
                }]
                
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
        },
       
        methods: {
            ...mapActions([
                'setActivityVipCard',
                'getThirdPartnerList'
            ]),
            upStep() {
                this.$emit('back-click');
            },
            // 正则表达式 ＞0 的正整数
            isInt(str){
                let g = /^\+?[1-9][0-9]*$/;
                return g.test(str);
            },
            chooseCardType() {
                const index = this.form.type;
                if(index === 24) {
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
                this.dialogImg = true;
            },
            handleRemove(file, fileList) {
                this.form.card_image = '';
                this.showBtn = true;
            },
            handleSuccess(res, file) {
                let self = this;
                this.showBtn = false;
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
                    self.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    e.target.value = 4;
                    self.form.one_receive_count_max = 1;
                    return;
                }
                if (!this.isInt(val)) {
                    this.$notify({
                        title: '提示',
                        message: '数值为整数',
                        type: 'info'
                    });
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
                    self.$notify({
                        title: '提示',
                        message: '数值不能小于等于0',
                        type: 'info'
                    });
                    val = 1;
                    self.countsOther = Number(val);
                    self.form.total_number = self.countsOther;
                    return;
                }
                if (!this.isInt(val)) {
                    this.$notify({
                        title: '提示',
                        message: '数值为整数',
                        type: 'info'
                    });
                    e.target.value = '';
                    return;
                }
                self.countsOther = Number(val);
                self.$nextTick(function () {
                    self.form.total_number = self.countsOther;
                });
            },
            // 活动时间范围
            timeChangeForAct(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('——');
                // 将年月日 跟 时分秒分离
                self.form.activeStartDate = items[0];
                self.form.activeEndDate = items[1];
                self.timeRangeForAct = val;
            },
            timeChangeForVal(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('——');
                // 将年月日 跟 时分秒分离
                self.form.expireStartTime = items[0];
                self.form.expireEndTime = items[1];
                self.timeRangeForVal = val;
            },
            validDaysClick() {
                this.showValidDays =!this.showValidDays;
                const index = this.form.validate_type;
                console.debug('index', index);
                if(index === 0){
                    this.form.validateDaysRangeArr = []
                } else {
                    this.form.expire_days = '';
                }
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if(!self.form.third_part_type) {
                        self.$notify({
                            title: '警告',
                            message: '请选择合作方',
                            type: 'warning'
                        });
                        return;
                    }
                    if(!self.timeRangeForAct) {
                        self.$notify({
                            title: '警告',
                            message: '请选择活动时间范围',
                            type: 'warning'
                        });
                        return;
                    }
                    if(!self.timeRangeForVal && self.form.type === 24) {
                        self.$notify({
                            title: '警告',
                            message: '请选择有效天数',
                            type: 'warning'
                        });
                        return;
                    }
                    
                    if (valid) {
                        self.setActivityVipCard(self.form)
                            .then((res) => {
                                if(res.status == '1') {
                                    self.$notify({
                                        title: '成功',
                                        message: res.msg,
                                        type: 'success'
                                    });
//                                    self.$router.push({path: 'vipCardList'});
                                } else {
                                    self.$notify({
                                        title: '失败',
                                        message: res.msg,
                                        type: 'error'
                                    });
                                }
                            }, (err) => {
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>
