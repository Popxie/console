<template>
	<div class="creat-merchant-cont">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        
        <el-form class="mt40" ref="form" :model="form"
                 :rules="rules" label-position="left" label-width="180px"
        >
            <el-form-item label="商户券类型:" required>
                <el-radio-group v-model="form.couponType" class="button-cont" @change="chooseMethodClick">
                    <el-radio-button :label="1">兑换券</el-radio-button>
                    <el-radio-button :label="2">折扣券</el-radio-button>
                    <el-radio-button :label="3">代金券</el-radio-button>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否仅新用户可用：" required>
                <el-radio-group v-model="form.isNewUserUse">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="-1">不限</el-radio>
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
    
            <el-form-item label="商家列表图片：" prop="merchantListPic" required>
                <el-upload
                    :action="url"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <i v-if="showBtn" class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">要求：690*292，且不超过1MB</div>
                </el-upload>
                <el-dialog v-model="showDialogImg" size="tiny" style="text-align: center">
                    <img width="60%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
    
            <el-form-item label="商家详情页图片：" prop="merchantDetailPic" required>
                <el-upload
                    :action="url"
                    :on-preview="handlePreviewForDetails"
                    :on-success="handleSuccessForDetails"
                >
                    <i v-if="showBtnForDetails" class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">要求：690*292，且不超过1MB</div>
                </el-upload>
                <el-dialog v-model="showDialogImgForDetails" size="tiny" style="text-align: center">
                    <img width="60%" :src="dialogImageUrlForDetails" alt="">
                </el-dialog>
            </el-form-item>
    
            <el-form-item label="导入券码：" prop="couponFile" required>
                <el-upload
                    :action="fileUrl"
                    :on-success="handleSuccessForCoupon"
                >
                    <i v-if="showBtnForCoupon" class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">支持xls，xlsx等excel文件</div>
                </el-upload>
               
            </el-form-item>
            
            <el-form-item label="活动时间" prop="validateDaysRange">
                <el-date-picker
                    type="daterange"
                    range-separator="—"
                    placeholder="选择日期范围"
                    v-model="form.validateDaysRange"
                    @change="dateBlur"
                    style="width: 100%;"
                >
                </el-date-picker>
            </el-form-item>
    
            <el-form-item label="使用条件：" prop="serviceConditions">
                <el-input type="textarea" v-model="form.serviceConditions" placeholder="请填写使用条件，100字以内"></el-input>
            </el-form-item>
    
            <el-form-item label="使用说明：" prop="instructions">
                <el-input type="textarea" v-model="form.instructions" placeholder="请填写使用说明，100字以内"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="info" @click="upStep()">返回</el-button>
                <el-button type="info" @click="onSubmit('form')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import SelectAreas from '../components/SelectArea.vue';
    import {settings} from '../config/settings';


    export default {
    components: {
        SelectAreas
    },
    data() {
      return {
          isDisabled: false,            // 是否禁止 点击
          dialogVisible: false,        // 是否显示城市组件
    
          url: `${settings.URL}/api/uploadImage`,   // 上传图片的地址
          fileUrl: `${settings.URL}/api/uploadFile`,
          showBtn: true,              // 是否显示 + 号按钮
          showDialogImg: false,       // 是否显示 图片的 dialog
          dialogImageUrl: '',         // img标签的src
          
          showBtnForDetails: true,
          showDialogImgForDetails: false,
          dialogImageUrlForDetails: '',
    
          showBtnForCoupon: true,
          showDialogImgForCoupon: false,
          dialogImageUrlForCoupon: '',
          
          other: 4,
          timeRange: '-1',         // 赋值后的时间范围
          
          form: {
              couponType: 1,      // 商户券类型
              isNewUserUse: 0,    // 是否是新用户
              dailyLimitSize: 1,  // 发放上限
              topic: '',          // 券发放主题
              couponName: '',     // 商户券显示名称
              areaType: 0,        // 设置投放地域
              merchantListPic: '',     // 商家列表图片地址
              merchantDetailPic: '',   // 商家详情图片地址
              couponFile: '',          // excel文件地址
              validateDaysRange: [],   // 有效天数范围     （该字段必不可少但是请求时 不用）
              expirationTimeStart: '', // 开始时间
              expirationTimeEnd:'',    // 结束时间
              serviceConditions: '',   // 使用条件
              instructions: '',        // 使用说明
              allDenomination: 0,      // 该页面没有的字段 但是后端需要
          },
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
              couponFile: [
                  {required: true, message: '请上传导入券', trigger: 'change'}
              ],
              validateDaysRange: [
                  {type: 'array', required: true, message: '请选择时间范围', trigger: 'change'}
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
    methods:{
        ...mapActions([
            'createMerchant'
        ]),
        
        selectArea() {
            let self = this;
            if (self.form.areaType == '0') {
                return;
            }
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
            if (val == 1) {
                self.form.dailyLimitSize = 1;
                e.target.value = 4;
                return
            }
            if (val == 2) {
                self.form.dailyLimitSize = 2;
                e.target.value = 4;
                return
            }
            if (val == 3) {
                self.form.dailyLimitSize = 3;
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
                self.form.dailyLimitSize = 1;
                return;
            }
            if (!this.isInt(val)) {
                this.$notify({
                    title: '提示',
                    message: '数值为整数',
                    type: 'info'
                });
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
        handleSuccess(res) {
            let self = this;
            self.showBtn = false;
            if (res.statusCode === '200') {
                self.form.merchantListPic = res.data;
            }
        },
        // 商家券详情 的上传事件
        handlePreviewForDetails(file) {
            this.dialogImageUrlForDetails = file.url;
            this.showDialogImgForDetails = true;
        },
     
        handleSuccessForDetails(res,file) {
            let self = this;
            console.debug('res', res);
            self.showBtnForDetails = false;
            if (res.statusCode === '200') {
                self.form.merchantDetailPic = res.data;
            }
        },
        handleSuccessForCoupon(res) {
            let self = this;
            self.showBtnForCoupon = false;
            console.debug('res', res);
            if (res.statusCode === '200') {
                self.form.couponFile = res.data;
            }
        },
        // 分解时间范围
        dateBlur(val) {
            let self = this;
            // 将组件的val （年月日时分秒的时间区间）分离
            let items = val.split('—');
            // 将年月日 跟 时分秒分离
            self.form.expirationTimeStart = items[0];
            self.form.expirationTimeEnd = items[1];
            self.timeRange = val;
        },
    
        upStep() {
            this.$emit('back-click');
        },
        onSubmit(formname) {
            let self = this;
            self.$refs[formname].validate((valid) => {
                if (valid) {
                    self.createMerchant(self.form).then((res) => {
                        self.$notify({
                            title: '成功',
                            message: res.message,
                            type: 'success'
                        });
                        self.$router.push({path: 'merchantTicketList',});
                    }, (err) => {
                        self.$notify({
                            title: '失败',
                            message: err.message,
                            type: 'error'
                        });
                    });
                }
            });
        },
    }
    
  }
</script>

<style lang="less">
    .creat-merchant-cont {
        .el-upload__inner {
            display: block !important;
        }
        .is-required {
            margin: 15px;
        }
        .el-upload__tip {
            margin: 0;
            height: 20px;
            line-height: 20px;
        }
    }
</style>

