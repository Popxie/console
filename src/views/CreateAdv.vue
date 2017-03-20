<template>
    <div class="container">
        <!--<SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>-->
        <el-dialog title="选择地区" v-model="dialogVisible" size="tiny" :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false">
            <el-form ref="form" label-position="right" label-width="150px">
                <el-form-item label="请选择省份：" prop="provinceName">
                    <el-select  v-model="form.provinceName" placeholder="请选择省份" @change="selectProvince">
                        <template v-for="area in areas">
                            <el-option :label="area.name" :value="area.name"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择城市：" prop="cityName">
                    <el-select  v-model="form.cityName" placeholder="请选择城市" @change="selectCity">
                        <template v-for="city in citys">
                            <el-option :label="city.name" :value="city.name"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择地区：" prop="areaName">
                    <el-select  v-model="form.areaName" placeholder="请选择地区">
                        <template v-for="district in districts">
                            <el-option :label="district" :value="district"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSelect">取 消</el-button>
            <el-button type="info" @click="setAreas">确 定</el-button>
        </span>
        </el-dialog>
        <!--弹出框-->
        <div v-if="showNext" class="box_td">
            <div class="txt_info">

            </div>
            <div class="title_txt">
                广告管理
            </div>
            <div class="ads-select">
                <div class="ads-type">
                    <div class="ads" @click="setViewPosition(1)">
                        <i class="icon icon-ads-add"></i>
                        <span>开屏</span>
                    </div>
                    <div class="ads" @click="setViewPosition(2)">
                        <i class="icon icon-ads-add"></i>
                        <span>首页弹框</span>
                    </div>
                    <div class="ads" @click="setViewPosition(3)">
                        <i class="icon icon-ads-add"></i>
                        <span>骑行结束</span>
                    </div>
                    <div class="ads" @click="setViewPosition(4)">
                        <i class="icon icon-ads-add"></i>
                        <span>首页顶部链</span>
                    </div>
                    <div class="ads" @click="setViewPosition(5)">
                        <i class="icon icon-ads-add"></i>
                        <span>升级提示框</span>
                    </div>
                </div>
            </div>

        </div>
        <el-row v-if="!showNext">
            <el-col :lg="{span: 11,offset:1}" :md="{span: 14, offset:1}" :sm="{span:16, offset:1}"
                    :xs="{span: 18, offset:1}">
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="150px">
                    <el-form-item label="广告主题：" prop="topic">
                        <el-input v-model="form.topic"></el-input>
                    </el-form-item>
                    <el-form-item label="设置投放平台：" prop="putPosition">
                        <el-select style="width: 100%;" v-model="form.putPosition" placeholder="请选择投放平台">
                            <el-option label="ios & Android" :value="1"></el-option>
                            <el-option label="仅ios" :value="2"></el-option>
                            <el-option label="仅Android" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="form.viewPosition != 5">
                        <el-form-item label="设置投放地域：" prop="areaType">
                            <el-radio-group v-model="form.areaType" @change="selectArea">
                                <el-radio :label="0">全域</el-radio>
                                <el-radio :label="1">选择地域</el-radio>
                            </el-radio-group>
                            <el-button v-show="form.areaType==1" type="text" @click="selectAreaByClick">
                                {{form.provinceName+'-'+form.cityName+'-'+form.areaName}}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="设置投放时间段：" prop="startTime">
                            <el-date-picker type="datetimerange" range-separator="——" placeholder="选择时间范围"
                                            v-model="form.startTime" @change="timeChange"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </template>
                    <!--上传图片-->
                    <template v-if="form.viewPosition != 4 && form.viewPosition != 5">
                        <el-form-item label="广告图片：" prop="adsPicUrl">
                            <!--<el-upload-->
                                <!--:action="url"-->
                                <!--:on-preview="handlePreview"-->
                                <!--:on-remove="handleRemove"-->
                                <!--:on-success="handleSuccess"-->
                                <!--:before-upload="beforeUpload">-->
                                <!--<el-button size="large" icon="plus" type="info">点击上传</el-button>-->
                                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>-->
                            <!--</el-upload>-->
                            <el-upload
                                :action="url"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog v-model="dialogVisible" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                    </template>
                    <!--首页弹框-->
                    <div v-if="form.viewPosition == 2">
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
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                    </div>
                    <!--骑行结束页-->
                    <div v-if="form.viewPosition == 3">
                        <el-form-item label="详情页超链接：" prop="hyperlinks">
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                    </div>
                    <!--首页顶部文字链-->
                    <div v-if="form.viewPosition == 4">
                        <el-form-item label="广告文案：" prop="adsContext">
                            <el-input type="textarea" v-model="form.adsContext"></el-input>
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
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                    </div>
                    <!--升级提示框-->
                    <div v-if="form.viewPosition == 5">
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
                    </div>
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
    import SelectAreas from '../components/selectArea.vue';
    import {Areas} from '../config/Areas';
    import {settings} from '../config/settings';
    export default {
        components: {
            SelectAreas
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                id: '',
                url: `${settings.URL}/advert/api/uploadImage.html`,
                areas: Areas,
                citys: [],
                districts: [],
                dialogVisible: false,
                showNext: true,
                provinceList: [],
                cityList: [],
                form: {
                    topic: '',
                    putPosition: 1,
                    viewPosition: '',
                    areaType: 0,
                    adsPicUrl: '',
                    viewSet: '',
                    playOrder: '',
                    hyperlinks: '',
                    adsTitle: '',
                    adsContext: '',
                    startTime: '',
                    upgradeType: '',
                    provinceName: '',
                    cityName: '',
                    areaName: '',
                    iosVer: '',
                    iosDownloadUrl: '',
                    androidVer: '',
                    androidDownloadUrl: ''
                },
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
                    areaType: [
                        {type: 'number', required: true, message: '请选择投放地域', trigger: 'change'}
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
                        {max: 255, message: '字数不能超过255个', trigger: 'blur'}
                    ],
                    startTime: [
                        {type:'array', required: true, message: '请选择时间范围', trigger: 'change'}
                    ],
                    adsContext: [
                        {required: true, message: '请填写正文', trigger: 'blur'},
                        {max: 40, message: '字数不能超过40个字符', trigger: 'blur'}
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
                    ]
                }
            }
        },
        computed: {},
        methods: {
            ...mapActions([
                'createNewAds',
                'getAdsByid',
                'updateAdsById',
                'checkAdsByType'
            ]),
            setViewPosition(val) {
                var self = this;
                self.form.viewPosition = val;
                self.showNext = false;
            },
            toggleNext() {
                var self = this;
                self.showNext = true;
            },
            finishCreate(formName) {
                let self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (self.form.viewPosition != 5 && !self.form.startTime[0] ) {
                            self.$notify({
                                title: '提示',
                                message: '时间未选择！',
                                type: 'info'
                            });
                            return;
                        }
                        self.createNewAds(self.form)
                            .then((data) => {
                                self.$notify({
                                    title: '成功',
                                    message: '广告创建成功',
                                    type: 'success'
                                });
                                self.$router.push('advList');
                            }, (err) => {
                                self.$notify({
                                    title: '提示',
                                    message: err,
                                    type: 'info'
                                })
                            });
                    } else {
                        return false
                    }
                })
            },
            selectArea() {
                let self = this;
                if (self.form.areaType == '0') {
                    return;
                }
                self.dialogVisible = true;
                self.reset();
            },
            selectAreaByClick() {
                let self = this;
                self.dialogVisible = true;
            },
            setAreas() {
                let self = this;
                if(!self.form.provinceName) {
                    self.$notify({
                        title: '提示',
                        message: '请选择省份',
                        type: 'info'
                    })
                    return;
                }
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
            stopTimeChange(val) {
                let self = this;
                self.form.stopTime = val;
            },
            selectProvince() {
                let self = this;
                self.districts = [];
                self.form.cityName = '';
                self.form.areaName = '';
                for (let i = 0, len = self.areas.length; i < len; i++) {
                    if (self.form.provinceName == self.areas[i].name) {
                        self.citys = self.areas[i].city;
                    }
                }
            },
            selectCity() {
                let self = this;
                self.form.areaName = '';
                for (let i = 0, len = self.citys.length; i < len; i++) {
                    if (self.form.cityName == self.citys[i].name) {
                        self.districts = self.citys[i].area;
                    }
                }
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
                self.reset();

            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                console.log(file);
                this.dialogVisible = true;
            },
            handleRemove(file, fileList) {
            	this.form.adsPicUrl = '';
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSuccess(res) {
                let self = this;
                if (res.statusCode == 200) {
                    self.form.adsPicUrl = res.data;
                }
            },
            beforeUpload(file) {
                let self = this;
                if(self.form.adsPicUrl) {
                	return false;
                }
                //img = require(`../assets/img/${file.name}`);
                //self.checkImgPX(img, 512, 512);
            },
            checkImgPX(path, width, height) {
                let img = null,
                    self = this;
                img = document.createElement("img");
                document.body.insertAdjacentElement("beforeEnd", img);
                img.style.visibility = "hidden";
                img.src = path;
                let imgwidth = img.offsetWidth;
                let imgheight = img.offsetHeight;
                if (imgwidth != width || imgheight != height) {
                    self.$notify({
                        title: '警告',
                        message: '图的尺寸应该是' + width + "x" + height,
                        type: 'warning'
                    })
                    return false;
                }
                return true;
            }
        },
        created() {

        },
        mounted() {
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

    .box_td {
        border: 1px solid #e9e9e9;
        min-height: 500px;
        background: #fff;
        position: relative;
    }

    .txt_info {
        color: #333;
        font-family: å¾®è½¯é›…é»‘;
        font-size: 14px;
        margin-left: 10%;
        margin-top: 5%;
        width: 41%;
    }

    .title_txt {
        background: url(../assets/img/titile_bg.png) no-repeat;
        font-size: 30px;
        height: 134px;
        line-height: 134px;
        position: absolute;
        right: 10%;
        text-align: center;
        top: 0;
        width: 271px;
    }

    .ads-select {
        width: 100%;
        height: 400px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .ads-type {
        width: 60%;
        height: 400px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .ads {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
        background-color: #18bffd;
        border-radius: 10px;
        color: #fff;
        float: left;
        text-align: center;
        cursor: pointer;
    }

    .icon-ads-add {
        margin: 10px auto 0;
        width: 49px;
        background: url(./../assets/img/step_icon.png) 0 0/640px 900px no-repeat;
        background-position: 0 -363px !important;
        display: block;
        height: 59px;
    }
    .icon-add {
        margin: 10px auto 0;
        font-size: 50px;
        margin-bottom: 15px;
    }
</style>
