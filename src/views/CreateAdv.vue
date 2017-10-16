<template>
    <div class="container">
        <!--选择广告类型-->
        <TapSelect v-if="showNext" title="广告管理" :taps="taps" @setValue="setViewPosition"/>
        <!--多选地区-->
        <SelectCity :selectCity="dialogVisible" @cancel="cancelSelect" @confirm="setCities"/>

        <el-row v-if="!showNext">
            <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}"
                    :xs="{span: 18, offset:1}">
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="150px">
                    <el-form-item label="广告主题：" prop="topic">
                        <el-input v-model="form.topic" placeholder="请填写广告主题"></el-input>
                    </el-form-item>
                    <el-form-item label="设置投放平台：" prop="putPosition">
                        <el-select style="width: 100%;" v-model="form.putPosition" placeholder="请选择投放平台">
                            <el-option label="ios & Android" :value="1"></el-option>
                            <el-option label="仅ios" :value="2"></el-option>
                            <el-option label="仅Android" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <template>
                        <el-form-item label="设置投放地域：" required>
                            <el-radio-group v-model="form.areaType" @change="selectArea">
                                <el-radio :label="0">全域</el-radio>
                                <el-radio :label="1">选择地域</el-radio>
                            </el-radio-group>
                            <el-button v-show="form.areaType==1" type="text" @click="selectAreaByClick">编辑</el-button>
                            <div v-if="form.areaType && selectCityInfos.length>0">
                                <span v-for="area in selectCityInfos" v-if="selectCityInfos.length>0"
                                      class="choose-area">
                                        {{area.provinceName}}-{{area.cityName}}
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item label="设置投放时间段：" prop="startTime" v-if="form.viewPosition != 5">
                            <el-date-picker type="datetimerange" range-separator="——" placeholder="选择时间范围"
                                            v-model="form.startTime" @change="timeChange"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </template>
                    <!--上传图片(1.2.3.6模块公用 viewPosition)-->
                    <template v-if="form.viewPosition != 4 && form.viewPosition != 5">
                        <el-form-item label="广告图片：" prop="adsPicUrl">
                            <el-upload
                                :action="url"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog v-model="dialogImg" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                    </template>
                    <!--开屏 图片格式要求-->
                    <template v-if="form.viewPosition == 1">
                        <div class="tip">尺寸要求：1242*2208</div>
                    </template>
                    <!--首页弹框-->
                    <template v-if="form.viewPosition == 2">
                        <div class="tip">尺寸要求：660*880</div>
                        <el-form-item label="展现设置：" prop="viewSet">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="关闭后当天不展现" :value="1"></el-option>
                                <el-option label="关闭后不再展现" :value="2"></el-option>
                                <el-option label="每次都展现" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="轮播顺序设置：" prop="playOrder">
                            <el-select style="width: 100%;" v-model="form.playOrder" placeholder="请选择">
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详情页超链接：" prop="hyperlinks" >
                            <el-input v-model="form.hyperlinks" placeholder="请填写详情页超链接"></el-input>
                        </el-form-item>
                    </template>
                    <!--骑行结束页-->
                    <template v-if="form.viewPosition == 3">
                        <div class="tip">尺寸要求：690*160</div>
                        <el-form-item label="详情页超链接：" prop="hyperlinks">
                            <el-input v-model="form.hyperlinks" placeholder="请填写详情页超链接"></el-input>
                        </el-form-item>
                    </template>
                    <!--首页顶部文字链-->
                    <template v-if="form.viewPosition == 4">
                        <el-form-item label="广告文案：" prop="adsContext">
                            <el-input type="textarea" v-model="form.adsContext" placeholder="请填写广告文案"></el-input>
                        </el-form-item>
                        <el-form-item label="展现设置：" prop="viewSet">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="关闭后当天不展现" :value="1"></el-option>
                                <el-option label="关闭后不再展现" :value="2"></el-option>
                                <el-option label="每次都展现" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="轮播顺序设置：" prop="playOrder">
                            <el-select style="width: 100%;" v-model="form.playOrder" placeholder="请选择">
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详情页超链接：" prop="hyperlinks">
                            <el-input v-model="form.hyperlinks" placeholder="请填写详情页超链接"></el-input>
                        </el-form-item>
                        <el-form-item label="icon：类型" prop="iconType">
                            <el-select style="width: 100%;" v-model="form.iconType" placeholder="请选择">
                                <el-option label="消息" :value="1"></el-option>
                                <el-option label="活动" :value="2"></el-option>
                                <el-option label="提示" :value="3"></el-option>
                                <el-option label="警告" :value="4"></el-option>
                                <el-option label="强烈警告" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <!--升级提示框-->
                    <template v-if="form.viewPosition == 5">
                        <el-form-item label="升级提示标题：" prop="adsTitle">
                            <el-input v-model="form.adsTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="升级提示正文：" prop="adsContext">
                            <el-input type="textarea" v-model="form.adsContext"></el-input>
                        </el-form-item>
                        <el-form-item label="升级提示类型：" prop="upgradeType">
                            <el-radio-group v-model="form.upgradeType">
                                <el-radio :label="0">非强制</el-radio>
                                <el-radio :label="1">强制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="展现设置：" prop="viewSet">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="每次都展现" :value="3"></el-option>
                                <el-option label="当前升级版本不再展现" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="form.putPosition == 1 || form.putPosition == 2">
                            <el-form-item label="ios版本：" prop="iosVer">
                                <el-input type="textarea" v-model="form.iosVer"></el-input>
                            </el-form-item>
                            <el-form-item label="ios下载地址：" prop="iosDownloadUrl">
                                <el-input type="textarea" v-model="form.iosDownloadUrl"></el-input>
                            </el-form-item>
                        </template>
                        <template v-if="form.putPosition == 1 || form.putPosition == 3">
                            <el-form-item label="andriod版本：" prop="androidVer">
                                <el-input type="textarea" v-model="form.androidVer"></el-input>
                            </el-form-item>
                            <el-form-item label="andriod下载地址：" prop="androidDownloadUrl">
                                <el-input type="textarea" v-model="form.androidDownloadUrl"></el-input>
                            </el-form-item>
                        </template>
                    </template>
                    
                    <template v-if="form.viewPosition == 6">
                        <div class="tip">尺寸要求：750*128</div>
                        <el-form-item label="广告链接：" prop="hyperlinks">
                            <el-input v-model="form.hyperlinks" placeholder="请填写广告链接"></el-input>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-button type="info" @click="toggleNext">返回</el-button>
                        <el-button type="info" @click="finishCreate('form')">完成</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import SelectCity from '../components/SelectCity.vue';
    import TapSelect from '../components/TapSelect.vue';
    import {settings} from '../config/settings';
    import {CityMaps} from '../config/City';
    export default {
        components: {
            TapSelect, SelectCity
        },
        data() {
            return {
                taps: [
                    {
                        task: '开屏',
                        value: 1
                    },
                    {
                        task: '首页弹框',
                        value: 2
                    },
                    {
                        task: '骑行结束',
                        value: 3
                    },
                    {
                        task: '首页顶部链',
                        value: 4
                    },
                    {
                        task: '个人中心广告',
                        value: 6
                    },
                    {
                        task: '升级提示框',
                        value: 5
                    },
                    
                ],
                dialogVisible: false,
                areaDialogVisible: false,
                url: `${settings.URL}/api/uploadImage`,
                dialogImg: false,
                dialogImageUrl: '',
                showNext: true,
                isPass: false,          // 上传完图片以后 判断是否符合规格
                form: {
                    topic: '',
                    putPosition: 1,
                    viewPosition: '',
                    areaType: 0,
                    adsPicUrl: '',
                    viewSet: '',
                    playOrder: '',
                    hyperlinks: '',
                    iconType: '',
                    adsTitle: '',
                    adsContext: '',
                    startTime: [],
                    upgradeType: '',
                    provinceName: '',
                    cityName: '',
                    areaName: '',
                    iosVer: '',
                    iosDownloadUrl: '',
                    androidVer: '',
                    androidDownloadUrl: '',
                },
                //设置投放地域所选
                selectCityInfos: [],
                rules: {
                    topic: [
                        {required: true, message: '请输入广告主题', trigger: 'blur'},
                        {max: 30, message: '广告主题不能超过30个字符', trigger: 'blur'}
                    ],
                    viewPosition: [
                        {type: 'number', required: true, message: '请选择广告位置', trigger: 'change'}
                    ],
                    putPosition: [
                        {type: 'number', required: true, message: '请选择投放平台', trigger: 'change'}
                    ],
                    adsPicUrl: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    viewSet: [
                        {type: 'number', required: true, message: '请选择展现位置', trigger: 'change'}
                    ],
                    playOrder: [
                        {type: 'number', required: true, message: '请选择轮播顺序', trigger: 'change'}
                    ],
                    hyperlinks: [
                        {max: 120, message: '最多不能超过120个字符！', trigger: 'blur'}
                    ],
                    iconType: [
                        {type: 'number',required: true, message: '请选择icon类型', trigger: 'change'}
                    ],
                    startTime: [
                        {type: 'array', required: true, message: '请选择时间范围', trigger: 'change'}
                    ],
                    adsContext: [
                        {required: true, message: '请填写正文', trigger: 'blur'},
                        {max: 255, message: '字数不能超过255个字符', trigger: 'blur'}
                    ],
                    adsTitle: [
                        {required: true, message: '请填标题', trigger: 'blur'}
                    ],
                    upgradeType: [
                        {type: 'number', required: true, message: '请选择升级类型', trigger: 'change'}
                    ],
                    iosVer: [
                        {required: true, message: '请填写ios版本号', trigger: 'blur'},
                        {max: 20, message: 'ios版本号不能超过20个字符', trigger: 'blur'}
                    ],
                    iosDownloadUrl: [
                        {required: true, message: '请填写ios下载地址', trigger: 'blur'},
                        {max: 255, message: 'ios下载地址不能超过255个字符', trigger: 'blur'}
                    ],
                    androidVer: [
                        {required: true, message: '请填写android版本号', trigger: 'blur'},
                        {max: 20, message: 'android版本号不能超过20个字符', trigger: 'blur'}
                    ],
                    androidDownloadUrl: [
                        {required: true, message: '请填写android下载地址', trigger: 'blur'},
                        {max: 255, message: 'android下载地址不能超过255字符', trigger: 'blur'}
                    ],
                }
            }
        },
       
        methods: {
            ...mapActions([
                'createNewAds',
                'getAdsByid',
            ]),
    
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
            
            /**
             *
             * @param val
             */
            setViewPosition(val) {
                let self = this;
                self.form.viewPosition = val;
                self.showNext = false;
            },
            toggleNext() {
                let self = this;
                self.showNext = true;
                self.form.startTime = [];
                self.form.hyperlinks = '';
            },
            
            selectArea() {
                let self = this;
                if (self.form.areaType === '0') {
                    return;
                }
                self.dialogVisible = true;
                self.reset();
            },
            selectAreaByClick() {
                let self = this;
                self.dialogVisible = true;
            },
            setAreas(form) {
                let self = this;
                if (!form.provinces.length) {
                    self.alertFn('提示', '请选择省份', 'info');
                    return;
                }
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
            },
            setCities(selectCityInfos) {
                let self = this;
                self.selectCityInfos = selectCityInfos;
                self.dialogVisible = false;
            },
            reset() {
                let self = this;
                self.form.provinceName = '';
                self.form.cityName = '';
                self.form.areaName = '';
            },
            timeChange(val) {
                let self = this;
                let items = val.split('——');
                self.form.beginTime = items[0];
                self.form.stopTime = items[1];
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
                self.reset();

            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImg = true;
            },
            handleRemove() {
                this.form.adsPicUrl = '';
            },
            handleSuccess(res, file) {
                let self = this;
                if (res.statusCode === '200') {
                    self.form.adsPicUrl = res.data;
                }
                let w, h;
                switch (self.form.viewPosition) {
                    case 1:
                        w = 1242;
                        h = 2208;
                        break;
                    case 2:
                        w = 660;
                        h = 880;
                        break;
                    case 3:
                        w = 690;
                        h = 160;
                        break;
                    case 6:
                        w = 750;
                        h = 128;
                        break;
                }
                self.checkImgPX(file.url, w, h);
            },
            beforeUpload() {
                let self = this;
                if (self.form.adsPicUrl) {
                    return false;
                }
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
                        self.isPass = false;
                    } else {
                        self.isPass = true;
                    }
                };
                return true;
            },
            /**
             * 点击完成
             * @param formName
             */
            finishCreate(formName) {
                let self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //若为全域
                        if(!self.form.areaType) {
                            if(self.form.viewPosition !== 4 && self.form.viewPosition !== 5) {
                                if(!self.isPass) {
                                    self.alertFn('提示', '请选择规格正确的图片', 'warning');
                                    return;
                                }
                            }
                            self.createNewAds(self.form)
                                .then((res) => {
                                    self.alertFn('成功', res.message, 'success');
                                    self.$router.push('advList');
                                }, (err) => {
                                    // Promise.reject(json.message); 返回的是 json.message
                                    self.alertFn('提示', err, 'error');
                                });
                            return;
                        }
                        // 非全域
                        let topic = JSON.parse(JSON.stringify(self.form.topic));
                        for (let i = 0; i < self.selectCityInfos.length; i++) {
                            if(self.form.viewPosition !== 4 && self.form.viewPosition !== 5) {
                                if(!self.isPass) {
                                    self.alertFn('提示', '请选择规格正确的图片', 'warning');
                                    return;
                                }
                            }
                            let cityInfo = self.selectCityInfos[i];
                            self.form.provinceName = cityInfo.provinceName;
                            self.form.cityName = cityInfo.cityName;
                            self.form.topic = topic + "__" + cityInfo.cityName;
                            self.createNewAds(self.form)
                                .then((res) => {
                                    self.alertFn('成功', res.message, 'success');
                                    self.$router.push('advList');
                                }, (err) => {
                                    self.alertFn('失败', err, 'error');
                                });
                        }
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .container {
        background-color: #fff;
        font-size: 14px;
    }

    .mt40 {
        margin-top: 40px;
    }

    .tip {
        margin-left: 150px;
        margin-bottom: 5px;
    }

    .choose-area {
        margin-right: 4px;
    }
</style>
