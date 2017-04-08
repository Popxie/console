<template>
    <div>
        <el-dialog title="选择地区" v-model="show" :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false">
            <el-form label-position="right">
                <el-form-item>
                    <el-checkbox-group v-model="districts" @change="selectProvince">
                        <el-checkbox v-for="area in areas" :label="area.name+'  ▼'" class="provinceSelect"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="city" v-show="isSelected" >
                <el-form >
                    <el-form-item>
                        <el-checkbox-group v-model="citys" @change="selectCity">
                            <el-checkbox v-for="city in citys" :label="city.name" ></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="info" @click="confirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {Areas} from '../config/Areas';
    export default{
        props: {
            selectArea: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                areas: Areas,
                citys: [],
                districts: [],
                regions:[],
                qu:[],
                isSelected:false,
                isChecked:false,
                form: {
                    provinceName: '',
                    cityName: '',
                    areaName: ''
                }
            }
        },
        computed: {
            show(){
                return this.selectArea;
            }
        },
        methods: {
            selectProvince(val) {
                let self = this;
                self.districts = val;
                self.isSelected=true;
                for (let i = 0, len = self.areas.length; i < len; i++) {
                    if (self.districts[val.length-1] == self.areas[i].name) {
                        self.citys = self.areas[i].city;
                    }
                }
            },
            selectCity(val) {
                let self = this;
                self.isChecked=true;
                self.isSelected=false;
                for (let i = 0, len = val.length; i < len; i++) {
                    if(val[i].name === val[val.length-1]){
                        self.regions =  val[i].area
                    }
                }

//                val.map((item)=>{
//                    if(item.name === val[val.length-1]){
//                        self.regions =  item.area
//                    }
//                })
                console.log(self.regions)
            },
            closePop(){
                self.isChecked=false;
                self.isSelected=false;
            },
            confirm() {
                let self = this;
                self.$emit('confirm', self.form);
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    }
</script>
<style>
    @media screen and (max-width: 2000px) {
        .el-dialog{
            position: relative;
            width: 750px;
        }
    }
    .provinceSelect::after{
        content: '';
    }
    .el-checkbox{
        width: 150px;
        margin-right: 10px;
        margin-bottom: 10px;
        color: #666;
    }
    .el-checkbox:first-child{
        margin-left: 15px;
    }
    .city{
        position: absolute;
        z-index:3;
        width: 100%;
        height:100%;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.2);
    }
    .city .el-form{
        position: absolute;
        padding:10px;
        left:100px;
        right:100px;
        top:50px;
        border:1px solid #999;
        background: #fff;
        z-index:2;
    }
    .region .el-form{
        position: absolute;
        left:100px;
        right:100px;
        padding:10px;
        top:50px;
        border:1px solid #999;
        background: #fff;
        z-index:2;
    }
    .region{
        position: absolute;
        z-index:3;
        width: 100%;
        height:100%;
        left:0;
        top:0;
        background-color:rgba(0,0,0,0.2);
    }
</style>
