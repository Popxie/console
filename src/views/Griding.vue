<template>
    <div class="content">
        <div id="map"></div>
        <div class="btns">
            <el-button @click="toJudgeCityDivision">当前城市是否已划分调度网格</el-button>
            <el-button @click="toSetCurCityDivision">将当前城市划分调度网格</el-button>
            <el-button @click="toGetAreaDivisionInfo">获取区域内的网格划分情况</el-button>
            <el-button @click="toGetAreaAllBikes">获取区域内自行车流量情况，以及自行车详情</el-button>
        </div>
        <el-tabs v-model="activeTab" @tab-click="switchTab">
            <el-tab-pane label="区域调度" name="area-dispatch">
                <el-table
                    :data="areaBikeList"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        prop="blockNum"
                        label="区块编号">
                    </el-table-column>
                    <el-table-column
                        prop="riddingInfo.riddingInNum"
                        label="进入单车数量">
                    </el-table-column>
                    <el-table-column
                        prop="riddingInfo.riddingOutNum"
                        label="出行单车数量">
                    </el-table-column>
                </el-table>
                <el-button @click="loadMore">加载更多</el-button>
            </el-tab-pane>
            <el-tab-pane label="单车调度" name="bike-dispatch">
                <el-table
                    :data="areaBikeInfoList"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        prop="bike_id"
                        label="单车编号">
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="riddingInNum"-->
                    <!--label="所在区块">-->
                    <!--</el-table-column>-->
                    <el-table-column
                        prop="todayCount"
                        label="今天骑行次数">
                    </el-table-column>
                    <el-table-column
                        prop="weekCount"
                        label="最近7天骑行次数">
                    </el-table-column>
                    <el-table-column
                        prop="monthCount"
                        label="最近30天骑行次数">
                    </el-table-column>
                    <el-table-column
                        prop="lock_status"
                        label="状态">
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="lock_status"-->
                    <!--label="活动状态">-->
                    <!--</el-table-column>-->
                    <el-table-column
                        label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small">详情</el-button>
                            <el-button type="text" size="small">设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-block">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next"
                        :page-size="1"
                        :current-page.sync="currentPage"
                        :total="bikesTotalPage">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style scoped>
    .content {
        width: 100%;
    }
    .btns {
        margin: 20px 0;
    }
    #map {
        width: 100%;
        height: 600px;
    }
    .pagination-block {
        margin: 20px 0;
        text-align: right;
    }
    .el-pagination {
        display: inline-block;
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                map: {},
                typicalZoom: 15, //对应500m的百度地图显示等级
                activeTab: 'area-dispatch',
                areaBikeInfo: [],
                pageLength: 0,
                currentPage: 1,
                defaultSize: 20 // 区域调度一次请求数
            }
        },
        components: {},
        computed: {
            ...mapGetters([
                'isCityDivision',
                'coordinates',
                'areaBikeList',
                'areaBikeInfoList',
                'bikesDetailPages'
            ]),
            valueDiff() {
                let self = this;
                return (self.coordinates.length - self.pageLength) > self.defaultSize ? self.defaultSize : (self.coordinates.length - self.pageLength);
            },
            bikesTotalPage() {
                let self = this;
                return self.bikesDetailPages.totalPage
            }
        },
        methods: {
            ...mapActions([
                'getCityIsDivision',
                'setCityDivision',
                'getAreaDivisionInfo',
                'getAreaAllBikes',
                'getAreaBikeStatus'
            ]),
            ...mapMutations({
                clearAreaBikeList: 'CLEAR_AREA_BIKE_LIST'
            }),
            //初始化
            init() {
                let self = this;
                self.map = new BMap.Map("map");
                // zoom 13对应2公里
                self.map.centerAndZoom("杭州", 13);
                self.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                let scale = new BMap.ScaleControl();  //添加默认比例尺控件
                self.map.addControl(top_left_navigation);
                self.map.addControl(scale);

                self.map.addEventListener('zoomend', function (e) {
                    let curZoom = this.getZoom();
                    // 比例尺<500m
                    if (curZoom >= self.typicalZoom) {

                    }
                });

                self.map.addEventListener('moveend', function (e) {
                    // 比例尺<500m
                    self.clearMap();
                    let curZoom = this.getZoom();
                    if (curZoom >= self.typicalZoom) {
                        self.toGetAreaDivisionInfo();
                    }
                });

            },
            // 获取边界 type为0时，返回最大最小经纬度，type为1时，返回四个边界的坐标
            getBounds(type) {
                let self = this;
                var bs = self.map.getBounds();   //获取可视区域
                var bssw = bs.getSouthWest();   //可视区域左下角
                var bsne = bs.getNorthEast();   //可视区域右上角
                let boundary = {
                    maxLat: bsne.lat.toString(),
                    minLat: bssw.lat.toString(),
                    maxLon: bsne.lng.toString(),
                    minLon: bssw.lng.toString()
                };
                let coordinates = [
                    [bsne.lng, bssw.lat], [bsne.lng, bsne.lat], [bssw.lng, bsne.lat], [bssw.lng, bssw.lat], [bsne.lng, bssw.lat]
                ];
                if (!type) {
                    return boundary
                }
                return coordinates;
            },
            //清除页面覆盖物、数据
            clearMap() {
                let self = this;
                console.log('清除页面覆盖物');
                self.map.clearOverlays();
                self.clearAreaBikeList();
            },
            //将当前城市 划分调度网格
            toSetCurCityDivision() {
                let self = this;
                let boundary = self.getBounds(0);
                self.setCityDivision(boundary);
            },
            //获取当前城市是否 已经划分调度网格
            toJudgeCityDivision() {
                let self = this;
                self.getCityIsDivision().then(() => {
                    if (self.isCityDivision) {
                        this.$notify.info({
                            title: '消息',
                            message: '当前城市已划分调度网格'
                        });
                    } else {
                        this.$notify.info({
                            title: '消息',
                            message: '当前城市尚未划分调度网格'
                        });
                    }
                })
            },
            //获取区域内的网格划分情况
            toGetAreaDivisionInfo() {
                let self = this;
                let coordinates = self.getBounds(1);
                self.getAreaDivisionInfo(coordinates).then(() => {
                    self.addMarkder();
//                  self.toGetAreaAllBikes();
                });
                //加载一部分区域调度表格
                setTimeout(function () {
                    self.loadMore();
                }, 1000)
            },
            //画出 网格划分矩形
            addMarkder() {
                let self = this;
                self.coordinates.forEach((item) => {
                    console.log(item);
                    let points = item.coordinates;
                    //画矩形
                    let rectangle = new BMap.Polygon([
                        new BMap.Point(points[0][0], points[0][1]),
                        new BMap.Point(points[1][0], points[1][1]),
                        new BMap.Point(points[2][0], points[2][1]),
                        new BMap.Point(points[3][0], points[3][1])
                    ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
                    //加文字
                    let opts = {
                        position : point,    // 指定文本标注所在的地理位置
                        offset   : new BMap.Size(30, -30)    //设置文本偏移量
                    };
                    let label = new BMap.Label("eaf", opts);  // 创建文本标注对象
                    label.setStyle({
                        color : "red",
                        fontSize : "12px",
                        height : "20px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑"
                    });

                    self.map.addOverlay(rectangle);
                });
            },
            //获取区域内自行车流量情况，以及自行车详情
            toGetAreaAllBikes() {
                let self = this;
                self.clearAreaBikeList();
                self.coordinates.forEach((item) => {
                    self.getAreaAllBikes(item);
                });
            },
            //获取区域内 每辆自行车的骑行状态情况。暂时先取页面可视区域的四个坐标
            toGetAreaBikeInfo(index) {
                let self = this;
                let points = self.getBounds(1);
                let data = {
                    points: points,
                    index: index
                };
                self.getAreaBikeStatus(data);
            },
            //加载更多
            loadMore() {
                let self = this;
                if (self.valueDiff < 1) {
                    this.$notify.info({
                        title: '消息',
                        message: '数据已经加载完了哦'
                    });
                    return;
                }
                for (let i = 0; i < self.valueDiff; i++) {
                    let index = self.pageLength;
                    let item = self.coordinates[index];
                    self.getAreaAllBikes(item);
                    self.pageLength++;
                }
            },
            //换页，当前页数:val
            handleCurrentChange(val) {
                let self = this;
                self.toGetAreaBikeInfo(val);
            },
            //切换tab
            switchTab() {
                let self = this;
                if(self.activeTab === 'bike-dispatch') {
                    self.toGetAreaBikeInfo(self.currentPage);
                }
            }

        },
        mounted() {
            let self = this;
            self.init();
        }
    }
</script>
