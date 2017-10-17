<template>
    <div>
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
        
        <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
            <el-form-item label="会员卡名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入会员卡名称，10字以内"></el-input>
            </el-form-item>
            <el-form-item label="卡标题" prop="rule_title">
                <el-input v-model="form.rule_title" placeholder="请输入卡标题"></el-input>
            </el-form-item>
            <el-form-item label="卡规则" prop="rule_content">
                <el-input v-model="form.rule_content" placeholder="请输入卡规则"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="original_price">
                <el-input v-model="form.original_price" type="number" placeholder="请输入原价"></el-input>
            </el-form-item>
            <el-form-item label="惊爆价" prop="price" >
                <el-input v-model="form.price" type="number" placeholder="请输入惊爆价"></el-input>
            </el-form-item>
            
            <el-form-item label="有效卡样式：" class="ban-cont">
                <el-upload
                    :action="url"
                    list-type="picture-card"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-error = 'handleError'
                >
                    <i v-if="showBtn" class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">支持jpg .jpeg .gif .png .bmp，大小在1Mb以内。</div>
                </el-upload>
                <el-dialog v-model="showDialogImg" size="tiny" class="dialog-cont">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
    
            <el-form-item label="卡片类型" required>
                <el-radio-group v-model="form.type" @change="chooseCardType">
                    <el-radio :label="21">月卡</el-radio>
                    <el-radio :label="24">次卡</el-radio>
                    <el-radio :label="22">半年卡</el-radio>
                </el-radio-group>
            </el-form-item>
    
            <el-form-item v-if="showCartCounts" label="卡的次数" prop="can_use_counts" required >
                <el-input v-model="form.can_use_counts" type="number" placeholder="请输入卡的次数"></el-input>
            </el-form-item>
            
            <el-form-item v-else label="使用次数" required>
                <el-select v-model="form.can_use_counts" placeholder="请选择使用次数">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
           
            
            <template v-if="showModuls">
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
<style scoped lang="less">
    .mt40 {
        margin-top: 40px;
    }
    .choose-city {
        margin-right: 10px;
    }
    
</style>
<style lang="less">
    .el-upload__inner {
        display: block !important;
    }
    .is-required {
        /*margin: 15px;*/
    }
    .el-upload__tip {
        margin: 0;
        height: 20px;
        line-height: 20px;
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
    .dialog-cont {
        .el-dialog {
            width: 400px !important;
        }
    }
</style>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import SelectAreas from '../components/SelectArea.vue';
    import {settings} from '../config/settings';


    export default{
        components: {
            SelectAreas,
        },
        data(){
            return {
                dialogVisible: false,
                showErailsDialog: false,
                eRailsList: [],
                eRailsIdList: [],
                eRailsValueList: [],
    
                showValidDays: true,
                url: `${settings.URL}/api/uploadImage`,
                showBtn: true,
                dialogImageUrl: '',
                showDialogImg: false,
                showCartCounts: false,
                showModuls: false,          // 是否显示  有效期类型 有效天数
                isPassForFile: false,       // 上传完文件以后 判断是否符合规格
    
                form: {
                    test:'',
                    name: '',
                    rule_title: '',
                    rule_content: '',
                    original_price: '',
                    price: '',
                    card_image: '',             // 有效图片地址
                
                    can_use_counts: 1000000,
                    
                    validate_type: 0,    // 有效期类型
                    expire_days: '',   // 有效天数
                    expireStartTime: '',
                    expireEndTime: '',
                    validateDaysRange: [],
                    type: 21,
                    provinces: [],              // 禁用城市
                    forbiddenCityCode: '',       // 禁用城市 字符窜格式
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
                    counts: [
                        {required: true,message: '请选择使用次数',trigger: 'change'}
                    ],
                    original_price: [
                        {type: 'number',required: true,message: '请输入原价', trigger: 'change'}
                    ],
                    price: [
                        {type: 'number',required: true,message: '请输入惊爆价', trigger: 'change'}
                    ],
                    test: [
                        {type: 'number',required: true,message: '请输入惊爆价', trigger: 'change'}
                    ],
                    card_image: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    expire_days: [
                        {type: 'string', required: true, message: '请填写有效天数', trigger: 'change'}
                    ],
                    validateDaysRange: [
                        {type: 'array', required: true, message: '请选择时间范围', trigger: 'change'}
                    ],
                },
                options: [{
                    label: '无限次',
                    value: 1000000
                }]
            }
        },
        created() {
            this.getERails({type: 1})
                .then((res) => {
                    this.eRailsList = res.data;
                },(err) => {
                    this.alertFn('失败', err.msg, 'error');
                })
        },
        methods: {
            ...mapActions([
                'setActivityVipCard',
                'getERails',
                'setVipCard'
            ]),
            
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
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
            selectAreaClick() {
                let self = this;
                self.dialogVisible = true;
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
            
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.showDialogImg = true;
            },
            handleRemove() {
                this.form.card_image = '';
                this.showBtn = true;
            },
            handleError() {
                this.alertFn('警告', '图片过大或者网络异常', 'warning');
            },
            handleSuccess(res, file) {
                let self = this;
                self.showBtn = false;
                if (res.statusCode === '200') {
                    self.form.card_image = res.data;
                }
                if(file.name.indexOf('.jpg') === -1 && file.name.indexOf('.jpeg') === -1 &&
                    file.name.indexOf('.png') === -1 && file.name.indexOf('.gif') === -1 &&
                    file.name.indexOf('.bmp') === -1) {
                    this.alertFn('警告', '请上传格式正确的图片', 'warning');
                    this.isPassForFile = false;
                } else {
                    this.isPassForFile = true;
                }
            },
            // 卡片类型切换
            chooseCardType(val) {
                // val === 24 ? this.showCartCounts = true : this.showCartCounts = false;
                if (val === 24) {
                    this.showCartCounts = true;
                    this.showModuls = true;
                    this.form.can_use_counts = '';
    
                } else {
                    this.showCartCounts = false;
                    this.showModuls = false;
                    
                    this.form.can_use_counts = 1000000;
                    this.form.expire_days = '';
                    this.form.validateDaysRange = [];
                    this.form.expireStartTime = '';
                    this.form.expireEndTime = '';
                }
            },
            // 有效期类型 （固定天数、固定时间）
            validDaysClick(val) {
                this.showValidDays =!this.showValidDays;
                if(val === 1){
                    this.form.expire_days = '';
                } else {
                    this.form.validateDaysRange = [];
                    this.form.expireStartTime = '';
                    this.form.expireEndTime = '';
                }
            },
            // 固定时间情况下 确认选择时间范围的点击事件
            timeChange(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('——');
                // 将年月日 跟 时分秒分离
                self.form.expireStartTime = items[0];
                self.form.expireEndTime = items[1];
                self.timeRange = val;
            },
            upStep() {
                this.$emit('back-click');
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        if(self.form.original_price < 0) {
                            this.alertFn('失败', '原价必须大于等于0', 'error');
                            return;
                        }
                        if(self.form.price < 0) {
                            this.alertFn('失败', '惊爆价必须大于等于0', 'error');
                            return;
                        }
                        if(!self.isPassForFile && self.form.card_image) {
                            this.alertFn('失败', '请上传格式正确的文件', 'error');
                            return;
                        }
                        // 校验 '卡的次数' 用了v-if 以后表单无法验证 所以在此验证
                        if(this.form.type === 24 && !this.form.can_use_counts) {
                            this.alertFn('警告', '请填写卡的次数', 'warning');
                            return;
                        }
                        self.setActivityVipCard(self.form)
                            .then((res) => {
                                if(res.status === '1') {
                                    this.alertFn('成功', res.msg, 'success');
                                    self.$router.push({
                                        path: 'vipCardList',
                                        query: {isFrom: 'self-support'}
                                    });
                                }
                            }, (err) => {
                                this.alertFn('失败', err.msg, 'error');
                            });
                    }
                });
            }
        }
    }
</script>
