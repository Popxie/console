<template>
    <div class="container">
        <SelectAreas ref="info" :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        <el-dialog title="提示" v-model="showDialog" size="tiny">
            <el-checkbox-group v-model="eRailsIdList" >
                <el-row :gutter="20">
                    <template v-for="(item, index) in eRailsList">
                        <el-col :span="6">
                            <el-checkbox :label="item.id">{{item.electricName}}</el-checkbox>
                        </el-col>
                    </template>
                </el-row>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirmClick">确定</el-button>
            </span>
        </el-dialog>
        <el-row>
            <el-col :lg="{span: 13,offset:1}" :md="{span: 14, offset:1}"
                    :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}"
            >
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
                    
                    <el-form-item label="活动名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="活动图片：" prop="picUrl" required>
                        <el-upload
                            :action="url"
                            list-type="picture-card"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error="hanleErr"
                        >
                            <i v-if="showBtn" class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">要求：690*292，且不超过1MB</div>
                        </el-upload>
                        <el-dialog v-model="showDialogImg" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    
                    <el-form-item label="活动时间" prop="activityTime">
                        <el-date-picker
                            type="daterange"
                            range-separator="—"
                            placeholder="选择日期范围"
                            v-model="form.activityTime"
                            @change="dateBlur"
                            style="width: 100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                    
                    <el-form-item label="设置" prop="checkedList">
                        <el-checkbox-group v-model="form.checkedList" @change="checkedChange">
                            <el-checkbox :label="1">设置区域</el-checkbox>
                            <el-checkbox :label="2">设置电子围栏</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="选择区域"  v-if="showArea">
                        <el-radio-group v-model="areaType" @change="chooseAreaTypeClick">
                            <el-radio :label="0">全域</el-radio>
                            <el-radio :label="1">部分区域</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="电子围栏"  v-if="showErail">
                        <div class="row-wrap">
                            <span class="choose-city" v-for="item in eRailsValueList">{{item}}</span>
                        </div>
                        <el-button @click="showDialog = true">选择电子围栏</el-button>
                    </el-form-item>
                    
                    <el-form-item label="活动链接" prop="contentLinkUrl">
                        <el-input v-model="form.contentLinkUrl" placeholder="请输入http，https开头的链接"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="backClilck()">返回</el-button>
                        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';
    import SelectAreas from '../components/SelectAreaForActivity'
    
    export default{
        data(){
            return {
                url: `${settings.URL}/api/uploadImage`,
                showBtn: true,              // 是否显示 + 号按钮
                dialogVisible: false,       // 控制是否显示 选择地址的 dialog
                showDialogImg: false,       // 是否显示 图片的 dialog
                dialogImageUrl: '',         // img标签的src
                showDialog: false,
                cityCodeArr: [],
                timeRange: -1,
                cityName: '',
                showArea: false,
                showErail: false,
                areaType: '',           // 选择区域的字段(自己写的字段)
                
                
                form: {
                    name: '',       // 活动名称
                    picUrl: '',        // 上传图片后 返回的 图片地址
                    activityTime: [],       // 活动时间
                    startDate: '',
                    endDate: '',
                    checkedList: [],        // 这个字段必须放在form里面 因为是表单验证（所有的表单验证字段也要放在form里面）
                    areaCode: '',           // 区域代码
                    electricFenceId: '',    //电子围栏id
                    contentLinkUrl: '',       // 活动链接
                },
                eRailsList: [],                          // 电子围栏列表（dialog中的）
                eRailsIdList:[],            // 电子围栏id列表(dialog确认以后)
                eRailsValueList: [],        // 用来显示的 值
                rules: {
                    name: [
                        {type: 'string',required: true, message: '请输入活动名称', trigger: 'blur'},
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    picUrl: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    
                    activityTime: [
                        {type: 'array', required: true, message: '请选择时间范围', trigger: 'change'}
                    ],
                    checkedList: [
                        { type: 'array', required: true, message: '请至少选择一个设置', trigger: 'change' }
                    ],
                    contentLinkUrl: [
                        {type: 'string',required: true, message: '请输入活动链接', trigger: 'blur'},
                        { min: 1, max: 100, message: '长度不能超过100', trigger: 'blur' }
                    ],
                },
            }
        },
        components: {
            SelectAreas,
        },
        created() {
            this.getERailsList(this.cityName)
                .then((res) => {
                    this.eRailsList = res.data;
                }, (err) => {
                    this.alertFn('失败', err.msg, 'error')
                });
        },
        methods: {
            ...mapActions([
                'createdActivity',
                'getERailsList',
            ]),
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.areaType = 0;
            },
            setAreas(val) {
                let self = this;
                
                // 获取cityCode 前 先清空一下 cityCodeArr
                self.cityCodeArr = [];
                
                // 获取cityCode
                for(let i = 0; i < val.provinces.length; i++){
                    self.cityCodeArr.push(val.provinces[i].cityCode);
                }
                self.form.areaCode = self.cityCodeArr.toString();
                self.dialogVisible = false;
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.showDialogImg = true;
            },
            handleRemove() {
                this.form.picUrl = '';
                this.showBtn = true;
            },
            
            hanleErr() {
                this.alertFn('提示', '图片过大，请上传1mb以内', 'info')
            },
            
            handleSuccess(res, file) {
                let self = this;
                self.showBtn = false;
                if (res.statusCode === '200') {
                    self.form.picUrl = res.data;
                }
                let w = 690;
                let h = 292;
                self.checkImgPX(file.url, w, h);
            },
            
            dateBlur(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('—');
                // 将年月日 跟 时分秒分离
                self.form.startDate = items[0];
                self.form.endDate = items[1];
                self.timeRange = val;
            },
            checkedChange(val) {
                // 当有一个选中的时候 且 选中的为全域 => 则显示全域 隐藏电子围栏
                if(val[0] && val[0] === 1) {
                    this.showArea = true;
                    this.showErail = false;
                    // 若 用户一开始让两个都显示 且都选值了 最后又取消电子围栏的显示 => 清空所有电子围栏相关的数据
                    this.eRailsIdList = [];
                    this.eRailsValueList = [];
                    this.form.electricFenceId = '';
                }
                if(val[0] && val[0] === 2){
                    this.showErail = true;
                    this.showArea = false;
                    this.areaType = '';
                    this.form.areaCode = '';
                    // 清空 地址组件 选中的值
                    this.$refs.info.citys = [];
                    this.$refs.info.provinceList = [];
                    this.$refs.info.provinces = {};
                }
                if(val.length === 0) {
                    this.showArea = this.showErail = false;
                    // 若用户一开始都选中 最后又都取消 => 清空所有电子围栏和全域的值
                    this.eRailsIdList = [];
                    this.eRailsValueList = [];
                    this.form.electricFenceId = '';
                    this.areaType = '';
                    this.form.areaCode = '';
                    this.$refs.info.citys = [];
                    this.$refs.info.provinceList = [];
                    this.$refs.info.provinces = {};
                    
                }
                if(val.length === 2) {
                    this.showArea = this.showErail = true;
                }
                
            },
            chooseAreaTypeClick(index) {
                if(index === 0) {
                    this.form.areaCode = 1;
                }
                if(index === 1) {
                    this.dialogVisible = true;
                }
            },
            dialogConfirmClick() {
                this.showDialog = false;
                // 每次点击确认以后 都要先清空一下 原先的数组 不然会 出现叠加现象
                this.eRailsValueList = [];
                for(let i = 0; i < this.eRailsIdList.length; i++) {
                    this.eRailsValueList.push(this.eRailsIdList[i]);
                }
                this.form.electricFenceId = this.eRailsValueList.toString();
            },
            backClilck() {
                this.$router.back();
            },
            checkImgPX(path, width, height) {
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
                        return self.isSubmmit = false;
                    }
                };
                return self.isSubmmit = true;
            },
            
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        if(!self.isSubmmit) {
                            this.alertFn('警告', '图的尺寸应该是690 * 292', 'warning');
                            return;
                        }
                        // 当 '设置'选项 只选中一个的时候 判断对应的 值是否选择
                        if(!self.form.areaCode && self.form.checkedList[0] === 1) {
                            this.alertFn('警告', '请选择区域', 'warning');
                            return;
                        }
                        if(!self.form.electricFenceId && self.form.checkedList[0] === 2) {
                            self.alertFn('警告', '请选择电子围栏', 'warning');
                            return;
                        }
                        // 当 '设置' 选项 两个同时选的时候 判断对应的 值是否选择
                        if(self.form.checkedList.length === 2) {
                            if(!self.form.areaCode) {
                                this.alertFn('警告', '请选择区域', 'warning');
                                return;
                            }
                            if(!self.form.electricFenceId) {
                                self.alertFn('警告', '请选择电子围栏', 'warning');
                                return;
                            }
                        }
                        // 提交表单
                        self.createdActivity(self.form).then((res) => {
                            if(res.status === '1') {
                                self.alertFn('成功',res.msg, 'success');
                                self.$router.push({path: 'bgActivityCenter',});
                            }
                        }, (err) => {
                            self.alertFn('失败',err.msg, 'warning');
                        });
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .mt40 {
        margin-top: 40px;
    }
    .container {
        background-color: #fff;
        position: relative;
    }
    .choose-city {
        margin-right: 10px;
    }
    .row-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap
    }

</style>
<style>
    .el-upload__inner {
        display: block !important;
    }

</style>
