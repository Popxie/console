<template>
    <div class="container">
        <div class="cover"></div>
        <el-row>
            <el-col :lg="{span: 10,offset:1}" :md="{span: 12, offset:1}" :sm="{span:16, offset:1}"
                    :xs="{span: 20, offset:1}">
                <el-button @click="() => $router.go(-1)">返回</el-button>
                <el-form class="mt40" ref="form" :model="form" label-position="left" label-width="150px">
                    <div v-show="showNext">
                        <el-form-item label="广告主题：">
                            <el-input v-model="form.topic"></el-input>
                        </el-form-item>
                        <el-form-item label="广告位置：" prop="viewPosition">
                            <el-select style="width: 100%;" :value="form.viewPosition" placeholder="请选择广告位置">
                                <el-option label="开屏页" :value="1">开屏页</el-option>
                                <el-option label="首页弹框" :value="2">首页弹框</el-option>
                                <el-option label="骑行结束页" :value="3">骑行结束页</el-option>
                                <el-option label="首页顶部链" :value="4">首页顶部链</el-option>
                                <el-option label="升级提示框" :value="5">升级提示框</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="投放平台：">
                            <el-select style="width: 100%;" v-model="form.putPosition" placeholder="请选择投放平台">
                                <el-option label="ios & Android" :value="1"></el-option>
                                <el-option label="仅ios" :value="2"></el-option>
                                <el-option label="仅Android" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <template>
                            <el-form-item label="投放地域：">
                                <el-radio-group v-model="form.areaType">
                                    <el-radio :label="0">全域</el-radio>
                                    <el-radio :label="1">选择地域</el-radio>
                                </el-radio-group>
                                <el-button v-show="form.areaType==1" type="text">
                                    {{form.provinceName+'-'+form.cityName+'-'+form.areaName}}
                                </el-button>
                            </el-form-item>
                            <el-form-item label="投放时间段：" v-if="form.viewPosition != 5">
                                <el-col :span="11">
                                    <el-form-item>
                                        <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.beginTime" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col class="line" :span="2" style="text-align: center"> - </el-col>
                                <el-col :span="11">
                                    <el-form-item>
                                        <el-date-picker type="datetime" placeholder="选择结束时间" v-model="form.stopTime" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </template>
                    </div>
                    <!--上传图片-->
                    <template v-if="form.viewPosition != 4 && form.viewPosition != 5 && form.viewPosition != 6">
                        <el-form-item label="广告图片：">
                            <div style="width: 290px;">
                                <img style="width: 70%;margin: 0 15%;" :src="form.adsPicUrl">
                            </div>
                        </el-form-item>
                    </template>
    
                    <template v-if="form.viewPosition == 6">
                        <el-form-item label="广告图片：">
                            <img style="width: 290px;" :src="form.adsPicUrl">
                        </el-form-item>
                    </template>
                    <!--首页弹框-->
                    <div v-if="form.viewPosition == 2">
                        <el-form-item label="展现设置：">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="关闭后当天不展现" :value="1"></el-option>
                                <el-option label="关闭后不再展现" :value="2"></el-option>
                                <el-option label="每次都展现" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="轮播顺序：">
                            <el-select style="width: 100%;" v-model="form.playOrder" placeholder="请选择">
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详情页超链接：">
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                    </div>
                    <!--骑行结束页-->
                    <div v-if="form.viewPosition == 3">
                        <el-form-item label="详情页超链接：">
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                    </div>
                    <!--首页顶部文字链-->
                    <div v-if="form.viewPosition == 4">
                        <el-form-item label="广告文案：">
                            <el-input type="textarea" v-model="form.adsContext"></el-input>
                        </el-form-item>
                        <el-form-item label="展现设置：">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="关闭后当天不展现" :value="1"></el-option>
                                <el-option label="关闭后不再展现" :value="2"></el-option>
                                <el-option label="每次都展现" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="轮播顺序：">
                            <el-select style="width: 100%;" v-model="form.playOrder" placeholder="请选择">
                                <el-option label="1" :value="1"></el-option>
                                <el-option label="2" :value="2"></el-option>
                                <el-option label="3" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详情页超链接：">
                            <el-input v-model="form.hyperlinks"></el-input>
                        </el-form-item>
                        <el-form-item label="icon：类型">
                            <el-select style="width: 100%;" v-model="form.iconType" placeholder="请选择">
                                <el-option label="消息" :value="1"></el-option>
                                <el-option label="活动" :value="2"></el-option>
                                <el-option label="提示" :value="3"></el-option>
                                <el-option label="警告" :value="4"></el-option>
                                <el-option label="强烈警告" :value="5"></el-option>
                            </el-select>
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
                        <el-form-item label="升级提示类型：">
                            <el-radio-group v-model="form.upgradeType">
                                <el-radio :label="0">非强制</el-radio>
                                <el-radio :label="1">强制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="展现设置：">
                            <el-select style="width: 100%;" v-model="form.viewSet" placeholder="请选择">
                                <el-option label="每次都展现" :value="3"></el-option>
                                <el-option label="当前升级版本不再展现" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="ios版本：">
                            <el-input type="textarea" v-model="form.iosVer"></el-input>
                        </el-form-item>
                        <el-form-item label="ios下载地址：">
                            <el-input type="textarea" v-model="form.iosDownloadUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="andriod版本：">
                            <el-input type="textarea" v-model="form.androidVer"></el-input>
                        </el-form-item>
                        <el-form-item label="andriod下载地址：">
                            <el-input type="textarea" v-model="form.androidDownloadUrl"></el-input>
                        </el-form-item>
                    </div>
                    <!--个人广告中心-->
                    <template v-if="form.viewPosition == 6">
                        <el-form-item label="广告链接：" prop="hyperlinks">
                            <el-input v-model="form.hyperlinks" placeholder="请填写广告链接"></el-input>
                        </el-form-item>
                    </template>
                </el-form>
            </el-col>
        </el-row>
        <div style="clear: both"></div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {Areas} from '../config/Areas';
    export default {
        data() {
            return {
                id: '',
                areas: Areas,
                citys: [],
                districts: [],
                dialogVisible: false,
                showNext: true,
                step: 1,
                form: {
                    topic: '',
                    putPosition: 1,
                    viewPosition: 1,
                    areaType: 0,
                    adsPicUrl: '',
                    viewSet: 1,
                    playOrder: '',
                    hyperlinks: '',
                    adsTitle: '',
                    adsContext: '',
                    beginTime: '',
                    stopTime: '',
                    upgradeType: 0,
                    provinceName: '',
                    cityName: '',
                    areaName: '',
                    iosVer: '',
                    iosDownloadUrl: '',
                    androidVer: '',
                    iconType: 1,
                    androidDownloadUrl: ''
                }
            }
        },
        computed: {},
        methods: {
            ...mapActions([
                'getAdsByid',
            ]),
        },
        created() {
            let self = this;
            self.getAdsByid(self.$route.query)
                .then((data) => {
                        self.form = data;
                    },
                    (err) => self.$notify({
                        title: '错误',
                        message: err ||'错误',
                        type: 'error'
                    })
                );
        },
    }
</script>
<style lang="less" scoped>
    .container {
        padding-top: 20px;
        background-color: #fff;
        position: relative;
        .cover {
            position: absolute;
            top: 60px;
            width: 100%;
            height: 91%;
            z-index: 99;
        }
    }

    .mt40 {
        margin-top: 40px;
    }
</style>
