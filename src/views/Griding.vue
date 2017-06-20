<template>
    <div class="content">
        <div id="map"></div>
        <div class="btns">
            <el-button @click="getBounds">获取边界</el-button>
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
</style>
<script>
    export default{
        data(){
            return {
                map: {}
            }
        },
        components: {},
        methods: {
            //初始化
            init() {
                let self = this;
                self.map = new BMap.Map("map");
                // zoom 15对应500m
                self.map.centerAndZoom("杭州", 15);
                self.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                let scale = new BMap.ScaleControl();  //添加默认比例尺控件
                self.map.addControl(top_left_navigation);
                self.map.addControl(scale);
            },
            // 获取边界
            getBounds() {
                let self = this;
                var bs = self.map.getBounds();   //获取可视区域
                var bssw = bs.getSouthWest();   //可视区域左下角
                var bsne = bs.getNorthEast();   //可视区域右上角
                console.log(bssw);
                console.log(bsne);
            }
        },
        mounted() {
            let self = this;
            self.init();
        }
    }
</script>
