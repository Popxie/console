<template>
    <div class="container">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
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
                <el-button type="primary" @click="dialogConfirmClick">确 33定</el-button>
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
                        >
                            <i v-if="showBtn" class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <el-dialog v-model="showDialogImg" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    
                    <!--<el-form-item label="活动时间" prop="activityTime">-->
                        <!--<el-date-picker-->
                            <!--type="daterange"-->
                            <!--range-separator="—"-->
                            <!--placeholder="选择日期范围"-->
                            <!--v-model="form.activityTime"-->
                            <!--@change="dateBlur"-->
                            <!--style="width: 100%;"-->
                        <!--&gt;-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    
                    <el-form-item label="活动时间：" required>
                        <el-col :span="11">
                            <el-form-item prop="startDate">
                                <el-date-picker type="date" placeholder="选择开始时间"
                                                v-model="form.startDate" style="width: 100%;"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="EndDate">
                                <el-date-picker type="date" placeholder="选择结束时间"
                                                v-model="form.EndDate" style="width: 100%;"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
    
                    <el-form-item label="选择区域">
                        <el-radio-group v-model="form.type" @change="chooseAreaTypeClick">
                            <el-radio :label="0">全域</el-radio>
                            <el-radio :label="1">部分区域</el-radio>
                            <el-radio :label="-1">取消选择区域</el-radio>
                        </el-radio-group>
                    </el-form-item>
    
                    <el-form-item label="电子围栏">
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
                        <el-button type="primary" v-if="showConfirmBtn" @click="onSubmit('form')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';
    import SelectAreas from '../components/SelectArea.vue'

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
                showConfirmBtn: true,
                form: {
                    name: '',       // 活动名称
                    picUrl: '',        // 上传图片后 返回的 图片地址
                    activityTime: [],       // 活动时间
                    startDate: '',
                    endDate: '',
                    type: '',           // 选择区域的字段
                    areaCode: '',           // 区域代码
                    cityCode: '',
                    electricFenceId: [],    //电子围栏id
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
                    startDate: [
                        {required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    endDate: [
                        {required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    counts: [
                        {required: true,message: '请选择使用次数',trigger: 'change'}
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
                    this.$notify({
                        title: '失败',
                        message: err.msg,
                        type: 'error'
                    });
                });
            const where = this.$route.query.isFromWhere;
            const infoObj = {activityId: ''};
            infoObj.activityId = this.$route.query.activityId;
            if(where === 'details') {
                self.showConfirmBtn = false;
            }
            this.getActivityInfo(infoObj)
                .then((res) => {
                    this.form = res.data;
                },(err) => {
                    this.$notify({
                        title: '错误',
                        message: err ||'错误',
                        type: 'error'
                    })
                })
        },
        methods: {
            ...mapActions([
                'createdActivity',
                'getERailsList',
                'getActivityInfo'
            ]),
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
            },
            setAreas(val) {
                let self = this;
                if (!val.provinces.length) {
                    self.$notify({
                        title: '提示',
                        message: '请选择省份',
                        type: 'info'
                    });
                    return;
                }
                // 获取cityCode
                for(let i = 0; i < val.provinces.length; i++){
                    self.cityCodeArr.push(val.provinces[i].cityCode);
                }
                self.form.cityCode = self.cityCodeArr.toString();
                console.debug('cityCode',self.form.cityCode);
                self.dialogVisible = false;
            },
            handlePreview(file) {
                console.debug(file);
                this.dialogImageUrl = file.url;
                this.showDialogImg = true;
            },
            handleRemove() {
                this.form.picUrl = '';
                this.showBtn = true;
            },
            handleSuccess(res, file) {
                let self = this;
                self.showBtn = false;
                console.debug(res);
                if (res.statusCode == 200) {
                    self.form.picUrl = res.data;
                }
            },
    
//            dateBlur(val) {
//                let self = this;
//                // 将组件的val （年月日时分秒的时间区间）分离
//                let items = val.split('—');
//                console.debug('items', items);
//                // 将年月日 跟 时分秒分离
//                self.form.startDate = items[0];
//                self.form.endDate = items[1];
//                self.timeRange = val;
//            },
            chooseAreaTypeClick(index) {
                if(index === 0) {
                    this.form.cityCode = ''
                    console.debug('this.form.cityCode', this.form.cityCode);
                }
                if(index === 1) {
                    this.dialogVisible = true;
                }
            },
            dialogConfirmClick() {
              console.debug('eRailsIdList', this.eRailsIdList);
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
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        
                        self.createdActivity(self.form).then((res) => {
                            if(res.status == '1') {
                                self.$notify({
                                    title: '成功',
                                    message: res.msg,
                                    type: 'success'
                                });
//                                self.$router.push({path: '',});
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
