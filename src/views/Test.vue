<template>
    <div>
        <ExportExcel :btnType="primary" :excelData="excelData" :excelName="name"/>
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
                excelData: [{
                    a: 1,
                    b: 2,
                    c: 3
                },{
                    a: 1,
                    b: 2,
                    c: 3
                }],
                name: 'console.xlsx'
            }
        },
        methods: {}
    }
</script>

