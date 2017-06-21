<template>
    <div class="content">
        <div id="map"></div>
        <div class="btns">
            <el-button @click="toJudgeCityDivision">当前城市是否已划分调度网格</el-button>
            <el-button @click="toSetCurCityDivision">将当前城市划分调度网格</el-button>
            <el-button @click="toGetAreaDivisionInfo">获取区域内的网格划分情况</el-button>
            <el-button @click="clearMap">清除地图上覆盖物</el-button>
            <el-button @click="toGetAreaAllBikes">获取区域内自行车流量情况，以及自行车详情</el-button>
            <el-button @click="toGetAreaBikeInfo">获取区域内 每辆自行车的骑行状态情况</el-button>
        </div>
        <div class="bikes-table">
            <el-table
                :data="areaBikeList"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="blockNum"
                    label="区块编号">
                </el-table-column>
                <el-table-column
                    prop="riddingInNum"
                    label="进入单车数量">
                </el-table-column>
                <el-table-column
                    prop="riddingOutNum"
                    label="出行单车数量">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<style scoped>
    .content {
        width: 100%;
    }

    #map {
        width: 100%;
        height: 600px;
    }

    .bikes-table {
        margin: 30px 0;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
                map: {},
                typicalZoom: 15 //对应500m的百度地图显示等级
            }
        },
        components: {},
        computed: {
            ...mapGetters(['isCityDivision', 'coordinates','areaBikeList','areaBikeInfoList'])
        },
        methods: {
            ...mapActions([
                'getCityIsDivision',
                'setCityDivision',
                'getAreaDivisionInfo',
                'getAreaAllBikes',
                'getAreaBikeStatus'
            ]),
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
            //clear
            clearMap() {
                let self = this;
                self.map.clearOverlays();
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
                });
            },
            //画出 网格划分矩形
            addMarkder() {
                let self = this;
                self.coordinates.forEach((item) => {
                    let points = item.coordinates;
                    let rectangle = new BMap.Polygon([
                        new BMap.Point(points[0][0], points[0][1]),
                        new BMap.Point(points[1][0], points[1][1]),
                        new BMap.Point(points[2][0], points[2][1]),
                        new BMap.Point(points[3][0], points[3][1])
                    ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
                    self.map.addOverlay(rectangle);
                });
            },
            //获取区域内自行车流量情况，以及自行车详情
            toGetAreaAllBikes() {
                let self = this;
                self.coordinates.forEach((item) => {
                    let points = item.coordinates;
                    self.getAreaAllBikes(points);
                });
            },
            //获取区域内 每辆自行车的骑行状态情况。
            toGetAreaBikeInfo() {
                let self = this;
//                self.coordinates.forEach((item) => {
//                    let points = item.coordinates;
//                    self.getAreaBikeStatus(points);
//                });
                    let points = self.coordinates[0].coordinates;
                    self.getAreaBikeStatus(points);
            }

        },
        mounted() {
            let self = this;
            self.init();
        }
    }
</script>
