<template>
    <div class="creat-merchant-cont">
        <SelectAreas ref="info" :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        
        <el-row>
            <el-col :lg="{span: 13,offset:1}" :md="{span: 14, offset:1}"
                    :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}"
            >
                <el-form class="mt40" ref="form" :model="form"
                         :rules="rules" label-position="left" label-width="180px"
                >
                    <el-form-item label="商户券类型:" required>
                        <el-radio-group v-model="form.couponType" class="button-cont" @change="chooseMethodClick">
                            <el-radio-button :label="1" :disabled="isDisabledLeft">兑换券</el-radio-button>
                            <el-radio-button :label="2" :disabled="isDisabledMid">折扣券</el-radio-button>
                            <el-radio-button :label="3" :disabled="isDisabledRight">代金券</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="是否仅新用户可用：" required>
                        <el-radio-group v-model="form.isNewUserUse">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="单用户每日发放上限：" prop="dailyLimitSize">
                        <el-radio-group v-model="form.dailyLimitSize">
                            <el-radio :label="1">1</el-radio>
                            <el-radio :label="2">2</el-radio>
                            <el-radio :label="3">3</el-radio>
                            <el-radio :label="other">其他
                                <el-input style="width: 60px;" type="number" min="0" :value="other"
                                          @blur="setLimit($event)" placeholder="请输入"
                                >
                                </el-input>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="券发放主题：" prop="topic">
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
                    
                    <el-form-item label="商家列表图片：" prop="merchantListPic" class="dialog-cont">
                        <el-upload
                            :action="url"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error="hanleErr"
                            :default-file-list="fileList"
                        >
                            <i v-if="showBtn" class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">要求：60*60</div>
                        </el-upload>
                        <el-dialog v-model="showDialogImg" size="tiny" style="text-align: center">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    
                    <el-form-item label="商家详情页图片：" prop="merchantDetailPic" class="dialog-cont">
                        <el-upload
                            :action="url"
                            :on-preview="handlePreviewForDetails"
                            :on-success="handleSuccessForDetails"
                            :on-remove="handleRemoveForDetails"
                            :on-error="hanleErr"
                            :default-file-list="fileListForDetail"
                        >
                            <i v-if="showBtnForDetails" class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">要求：90*90</div>
                        </el-upload>
                        <el-dialog v-model="showDialogImgForDetails" size="tiny" style="text-align: center">
                            <img width="100%" :src="dialogImageUrlForDetails" alt="">
                        </el-dialog>
                    </el-form-item>
                    
                    
                    <el-form-item label="券的有效时间：" required>
                        <el-col :span="11">
                            <el-form-item prop="expirationTimeStart">
                                <el-date-picker type="date" placeholder="选择开始时间" @change="blurStartClick"
                                                v-model="form.expirationTimeStart" style="width: 100%;"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="endTiexpirationTimeEndme">
                                <el-date-picker type="date" placeholder="选择结束时间" @change="blurEndClick"
                                                v-model="form.expirationTimeEnd" style="width: 100%;"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    
                    <el-form-item label="使用条件：" prop="serviceConditions">
                        <el-input type="textarea" v-model="form.serviceConditions" placeholder="请填写使用条件，100字以内"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="使用说明：" prop="instructions">
                        <el-input type="textarea" v-model="form.instructions" placeholder="请填写使用说明，100字以内"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="info" @click="() => {$router.go(-1)}">返回</el-button>
                        <el-button type="info" @click="onSubmit('form')">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import SelectAreas from '../components/SelectAreaForActivity';
    import {settings} from '../config/settings';
    
    
    export default {
        components: {
            SelectAreas
        },
        data() {
            return {
                isDisabledLeft: true,            // 是否禁止 点击(兑换券 1)
                isDisabledMid: true,            // 是否禁止 点击(折扣券 2)
                isDisabledRight: true,           // 是否禁止 点击(代金券 3)
                dialogVisible: false,        // 是否显示城市组件
                
                url: `${settings.URL}/api/uploadImage`,   // 上传图片的地址
                fileUrl: `${settings.URL}/api/uploadFile`,
                showBtn: false,              // 是否显示 + 号按钮
                showDialogImg: false,       // 是否显示 图片的 dialog
                dialogImageUrl: '',         // img标签的src
                
                showBtnForDetails: false,    // 是否显示 + 号按钮
                showDialogImgForDetails: false,
                dialogImageUrlForDetails: '',
                
                showBtnForCoupon: true,
                showDialogImgForCoupon: false,
                dialogImageUrlForCoupon: '',
                
                other: 4,
                timeRange: '-1',         // 赋值后的时间范围
                
                fileList:[
                    {name:'商家列表图片',url:''}
                ],
                fileListForDetail: [
                    {name:'商家详情页面图片',url:''}
                ],
                citys: [],
                cityCodeArr: [],
                cityNameArr: [],
                provinceCodeArr: [],
                provinceNameArr: [],
                provinceCodeArrReapt: [],
                provinceNameArrReapt: [],
    
                isPassForList: true,     // 上传完图片以后 判断是否符合规格
                isPassForDetails: true,
                
                form: {
                    batchId: null,
                    couponType: null,      // 商户券类型
                    isNewUserUse: 0,    // 是否是新用户
                    dailyLimitSize: 1,  // 发放上限
                    topic: '',          // 券发放主题
                    couponName: '',     // 优惠券券显示名称
                    areaType: 0,        // 设置投放地域
                    merchantListPic: '',     // 商家列表图片地址
                    merchantDetailPic: '',   // 商家详情图片地址
                    expirationTimeStart: '', // 开始时间
                    expirationTimeEnd:'',    // 结束时间
                    serviceConditions: '',   // 使用条件
                    instructions: '',        // 使用说明
                    cityName: '全国',
                    allDenomination: 0,      // 该页面没有的字段 但是后端需要
                },
                setAreasValue: [],
                rules: {
                    dailyLimitSize: [
                        {type: 'number', required: true, message: '请选择可领用', trigger: 'change'},
                    ],
                    topic: [
                        {type: 'string', required: true, message: '请输入广告主题', trigger: 'blur'},
                    ],
                    couponName: [
                        {required: true, message: '请输入优惠劵显示名称', trigger: 'blur'}
                    ],
                    merchantListPic: [
                        {required: true, message: '请上传商家列表图片', trigger: 'change'}
                    ],
                    merchantDetailPic: [
                        {required: true, message: '请上商家详情页图片', trigger: 'change'}
                    ],
                    expirationTimeStart: [
                        {required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    expirationTimeEnd: [
                        {required: true, message: '请选择结束时间', trigger: 'change'}
                    ],
                    serviceConditions: [
                        {required: true, message: '请填写使用条件', trigger: 'blur'},
                        {max: 100, message: '使用条件不可以超过100个字符', trigger: 'blur'}
                    ],
                    instructions: [
                        {required: true, message: '请填写使用说明', trigger: 'blur'},
                        {max: 100, message: '使用条件不可以超过100个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            this.getMerchantInfo(this.$route.query)
                .then((res) => {
                    this.fileList[0].url = res.data.merchantListPic;
                    this.fileListForDetail[0].url = res.data.merchantDetailPic;
                    // 初始化
                    res.data.areaType = 0;
                    res.data.cityName = '全国';
                    
                    // 深拷贝  将res.data对象合并到 this.form
                    this.form = Object.assign({}, this.form, res.data);
                    console.debug('this.for333m', this.form);
                    // 控制 '商户类型' 的显示情况
                    switch (this.form.couponType) {
                        case 1:
                            this.isDisabledLeft = false;
                            this.isDisabledMid = this.isDisabledRight = true;
                            break;
                        case 2:
                            this.isDisabledMid = false;
                            this.isDisabledRight = this.isDisabledLeft = true;
                            break;
                        default:
                            this.isDisabledRight = false;
                            this.isDisabledLeft = this.isDisabledMid = true;
                    }
                },(err) =>{
                    this.alertFn('警告', err.message, 'warning');
                });
        },
        methods:{
            ...mapActions([
                'getMerchantInfo',
                'fourInOne'
            ]),
            
            // 公用提醒 函数
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            // 检查图片宽高
            checkImgPX(path, width, height, where) {
                let img = null,
                    self = this;
                img = document.createElement("img");
                document.body.insertAdjacentElement("beforeEnd", img);
                img.style.visibility = "hidden";
                img.src = path;
                img.onload = function () {
                    let imgwidth = img.width;
                    let imgheight = img.height;
                    if (imgwidth !== width || imgheight !== height) {
                        self.alertFn('警告', '图的尺寸应该是' + width + "*" + height, 'warning');
                        if(where === 'lists') {
                            self.isPassForList = false;
                        } else {
                            self.isPassForDetails = false;
                        }
                    } else {
                        if(where === 'lists') {
                            self.isPassForList = true;
                        } else {
                            self.isPassForDetails = true;
                        }
                    }
                };
                return true;
            },
            // '设置投放地域' 的状态切换状态
            selectArea() {
                let self = this;
                if (self.form.areaType === 0) {
                    self.form.cityName = '全国';
                    return;
                }
                self.dialogVisible = true;
            },
            setAreas(val) {
                let self = this;
                // 获取cityCode 前 先清空一下 cityCodeArr
                self.cityCodeArr = [];
    
                // 获取cityCode 和 cityName
                for(let i = 0; i < val.provinces.length; i++){
                    self.cityCodeArr.push(val.provinces[i].cityCode);
                    self.cityNameArr.push(val.provinces[i].cityName);
                }
                self.form.cityCode = self.cityCodeArr.toString();
                self.form.cityName = self.cityNameArr.toString();
                
                self.form = Object.assign({}, self.form, val);
                self.dialogVisible = false;
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
            },
            
            // 商户券类型
            chooseMethodClick(val) {
                this.form.couponType = val;
            },
            // 正则表达式 ＞0 的正整数
            isInt(str){
                let g = /^\+?[1-9][0-9]*$/;
                return g.test(str);
            },
            // 单用户每日发放上限的 input框的blur事件
            setLimit(e) {
                let self = this;
                let val = e.target.value;
                console.debug('e.target.value', e.target.value);
                if (val === 1) {
                    self.form.dailyLimitSize = 1;
                    e.target.value = 4;
                    return
                }
                if (val === 2) {
                    self.form.dailyLimitSize = 2;
                    e.target.value = 4;
                    return
                }
                if (val === 3) {
                    self.form.dailyLimitSize = 3;
                    e.target.value = 4;
                    return
                }
                if (val <= 0) {
                    self.alertFn('提示', '数值不能小于等于0', 'info');
                    e.target.value = 4;
                    self.form.dailyLimitSize = 1;
                    return;
                }
                if (!this.isInt(val)) {
                    self.alertFn('提示', '数值为整数', 'info');
                    e.target.value = 4;
                    self.form.dailyLimitSize = 1;
                    return;
                }
                self.other = Number(val);
                self.$nextTick(function () {
                    self.form.dailyLimitSize = self.other;
                });
                
            },
            
            // 商家券列表 的上传事件
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.showDialogImg = true;
            },
            
            handleRemove() {
                this.form.merchantListPic = '';
                this.showBtn = true;
            },
            
            handleSuccess(res, file) {
                let self = this;
                self.showBtn = false;
                if (res.statusCode === '200') {
                    self.form.merchantListPic = res.data;
                    let w = 60;
                    let h = 60;
                    let where = 'lists';
                    self.checkImgPX(file.url, w, h, where);
                }
            },
            // 列表和详情公用的 上传失败时间
            hanleErr() {
                this.alertFn('提示', '图片过大或者网络异常', 'info')
            },
            
            // 商家券详情 的上传事件
            handlePreviewForDetails(file) {
                this.dialogImageUrlForDetails = file.url;
                this.showDialogImgForDetails = true;
            },
            
            handleRemoveForDetails() {
                this.form.merchantDetailPic = '';
                this.showBtnForDetails = true;
            },
            
            handleSuccessForDetails(res,file) {
                let self = this;
                self.showBtnForDetails = false;
                if (res.statusCode === '200') {
                    self.form.merchantDetailPic = res.data;
                    let w = 90;
                    let h = 90;
                    self.checkImgPX(file.url, w, h);
                }
            },
            
            blurStartClick(val) {
                this.form.expirationTimeStart = val;
            },
            
            blurEndClick(val) {
                this.form.expirationTimeEnd = val;
            },
            
            upStep() {
                this.$emit('back-click');
            },
            
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        
                        this.form.batchId = this.$route.query.batchId;
    
                        if(!self.isPassForList || !self.isPassForDetails) {
                            self.alertFn('提示', '请上传格式正确的图片', 'warning');
                            return;
                        }
                        
                        // 提交表单
                        self.fourInOne(self.form).then((res) => {
                            self.alertFn('成功', res.message, 'success');
                            self.$router.push({path: 'merchantTicketList',});
                        }, (err) => {
                            self.alertFn('失败', err.message, 'error');
                        });
                    }
                });
            },
        }
        
    }
</script>

<style lang="less">
    .creat-merchant-cont {
        background-color: #fff;
        .el-upload__inner {
            display: block !important;
        }
        .el-upload__tip {
            margin: 0;
            height: 20px;
            line-height: 20px;
        }
        .dialog-cont {
            .el-dialog {
                width: 400px !important;
            }
        }
    }
</style>

