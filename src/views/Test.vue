<template>
    <div>
        <el-row>
            <el-col :span="2">
                <ExportExcel :btnType="primary" :excelData="excelData" :excelName="name"/>
            </el-col>
            <el-col :span="2">
                <el-button @click="getData">获取数据</el-button>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    import ExportExcel from '../components/ExportExcel.vue';
    export default{
        components: {
            ExportExcel
        },
        data() {
            return {
                primary: 'primary',
                excelData: [],
                name: 'console.xlsx'
            }
        },
        methods: {
            getData() {
                this.$loading({ fullscreen: true });
                this.$http.get('https://activity.mingbikes.com/api/vcp/getVirtualCarPileInfo?startTime=2017-04-12%2000:00:00&endTime=2017-04-12%2001:30:00')
                    .then((res) => {
                	    this.$loading().close();
                        let data = res.data.data;
                        this.excelData = data.bikeCarPileD
                    });
            }
        }
    }
</script>

