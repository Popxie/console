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
                name: 'rank.xlsx'
            }
        },
        methods: {
            getData() {
                this.$loading({ fullscreen: true });
                this.$http.get('https://activity.mingbikes.com/api/activity/getAllUserInvRecodeLists?startTime=1500998400&endTime=1501171200')
                    .then((res) => {
                	    this.$loading().close();
                        this.excelData = res.data.data;
                    }).catch(()=> {
                });
            }
        }
    }
</script>

