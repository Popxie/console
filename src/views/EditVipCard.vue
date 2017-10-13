<template>
    <div class="container">
        <div :class="{coverTop: isFromList}"></div>
        <el-row>
            <el-col :lg="{span: 13,offset:1}" :md="{span: 14, offset:1}"
                    :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}"
            >
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
                    <el-form-item label="会员卡名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="规则标题" prop="rule_title" required>
                        <el-input v-model="form.rule_title"></el-input>
                    </el-form-item>
                    <el-form-item label="规则内容" prop="rule_content" required>
                        <el-input v-model="form.rule_content"></el-input>
                    </el-form-item>
                    <el-form-item label="原价" prop="original_price" required>
                        <el-input v-model="form.original_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="惊爆价" prop="price" required>
                        <el-input v-model="form.price" type="number"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="有效卡样式：" class="ban-cont" v-if="$route.query.isFromWhere !== 'self_support_details'">
                        <el-upload
                            :action="url"
                            list-type="picture-card"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error = 'handleError'
                            :default-file-list="fileList"
                        >
                            <i v-if="showBtn" class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">支持jpg .jpeg .gif .png .bmp，大小在1Mb以内。</div>
                        </el-upload>
                        <el-dialog v-model="showDialogImg" size="tiny" class="dialog-cont">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
    
                    <el-form-item label="有效卡样式：" class="ban-cont" v-else>
                        <img style="width: 290px;" :src="showCardImage">
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
                    
                    <el-form-item v-else  label="使用次数" required>
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
        
                        <el-form-item v-else label="设置投放时间段:" prop="validateDaysRange" class="ban-cont">
                            <el-col :span="11">
                                <el-form-item prop="expireStartTime">
                                    <el-date-picker type="date" placeholder="选择开始时间" @change="blurStartClick"
                                                    v-model="form.expireStartTime" style="width: 100%;"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2" style="text-align: center"> - </el-col>
                            <el-col :span="11">
                                <el-form-item prop="expireEndTime">
                                    <el-date-picker type="date" placeholder="选择结束时间" @change="blurEndClick"
                                                    v-model="form.expireEndTime" style="width: 100%;"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </template>
    
                    <el-form-item label="禁用地区" v-if="$route.query.isFromWhere === 'self_support_details'"  class="ban-cont">
                        <span class="choose-city" v-for="item in provinces">{{item}}</span>
                    </el-form-item>
    
                    <el-form-item label="禁用运营区"  class="ban-cont">
                        <span class="choose-city" v-for="item in eRailsValueList">{{item}}</span>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="backClilck()">返回</el-button>
                        <el-button type="primary" @click="onSubmit('form')" v-if="showConfirmBtn">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped lang="less">
    .mt40 {
        margin-top: 40px;
    }
    .container {
        background-color: #fff;
        position: relative;
        // 遮罩
        .coverTop {
            position: absolute;
            top: 0;
            width: 100%;
            height: 90%;
            z-index: 999;
            /*background: red;*/
            /*opacity: .3;*/
        }
        .choose-city {
            margin-right: 10px;
        }
    }
</style>
<style lang="less">
    .el-upload__inner {
        display: block !important;
    }
    .el-upload__tip {
        margin: 0;
        height: 20px;
        line-height: 20px;
    }
    // 用来控制每个el-form-item的label的位置（没有*号的label）
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
    import {settings} from '../config/settings';
    export default{
        data(){
            return {
                isFromList: false,
                showConfirmBtn: true,
                
                showValidDays: null,
                url: `${settings.URL}/api/uploadImage`,
                showBtn: false,
                showDialogImg: false,
                dialogImageUrl: '',
                showCardImage: '',          // 通过点击详情进来的时候用的
                showCartCounts: false,
                showModuls: false,          // 是否显示  有效期类型 有效天数
                
                fileList: [
                    {name:'有效图片',url:''}
                ],
                provinces: ['无'],
                eRailsValueList: ['无'],
                form: {
                    name: '',
                    rule_title: '',
                    rule_content: '',
                    original_price: '',
                    price: '',
                    can_use_counts: 1000000,
                    type: 21,
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
                    counts: [
                        {required: true,message: '请选择使用次数',trigger: 'change'}
                    ],
                    original_price: [
                        {type: 'number',message: '请输入原价', trigger: 'change'}
                    ],
                    price: [
                        {type: 'number',message: '请输入惊爆价', trigger: 'change'}
                    ],
                    expire_days: [
                        {type: 'string', required: true, message: '请填写有效天数', trigger: 'change'}
                    ],
                    expireStartTime: [
                        {required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    expireEndTime: [
                        {required: true, message: '请选择结束时间', trigger: 'change'}
                    ],
                },
                options: [
                    {
                        label: '无限次',
                        value: 1000000,
                    }
                ]
            }
        },
        components: {},
        created() {
            let self = this;
            const where = self.$route.query.isFromWhere;
            console.debug('where', where);
            if(where === 'self_support_details') {
                self.isFromList = true;
                self.showConfirmBtn = false;
            }
            const obj = self.$route.query;
            self.getVipCardInfo(self.parseParams(obj))
                .then((res) => {
                    self.fileList[0].url = res.data.show_card_image;
                    self.showCardImage = res.data.show_card_image;
                    if(res.data.forbiddenCityName) {
                        self.provinces = res.data.forbiddenCityName.split(',');
                    }
                    if(res.data.forbiddenControlAreaName) {
                        self.eRailsValueList = res.data.forbiddenControlAreaName.split(',');
                    }
                    
                    res.data.validate_type === 0 ? self.showValidDays = true : self.showValidDays = false;
                    
                    self.form = Object.assign({}, self.form, res.data);
                    self.form.id = self.$route.query.id;
    
                },(err) => {
                    self.alertFn('失败', err.msg, 'error');
                });
        },
        methods: {
            ...mapActions([
                'setActivityVipCard',
                'getVipCardInfo',
                'modifyActivityVipCard'
            ]),
            
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            
            /**
             * 格式化参数
             * @param obj
             * @returns {string}
             */
            parseParams: function (obj) {
                var str = '';
                Object.keys(obj).map(function (key) {
                    if (obj[key]) {
                        str += '&' + key + '=' + obj[key];
                    }
                });
                return str.substring(1);
                // str              ==> &id=139&isFromWhere=self_support_details
                // str.substring(1) ==>  id=139&isFromWhere=self_support_details
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
                this.alertFn('警告', '请上传1Mb以内的图片', 'warning');
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
                if (val === 24) {
                    this.showCartCounts = true;
                    this.showModuls = true;
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
            blurStartClick(val) {
                this.form.expireStartTime = val;
            },
            blurEndClick(val) {
                this.form.expireEndTime = val;
            },
            
            backClilck() {
                this.$router.back();
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        if(self.form.original_price < 0) {
                            self.alertFn('失败', '原价必须大于等于0', 'error');
                            return;
                        }
                        if(self.form.price < 0) {
                            self.alertFn('失败', '惊爆价必须大于等于0', 'error');
                            return;
                        }
                        self.modifyActivityVipCard(self.form)
                            .then((res) => {
                                if(res.status === '1') {
                                    self.alertFn('成功', res.msg, 'success');
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
