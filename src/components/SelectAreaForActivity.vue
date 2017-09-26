<template>
    <div>
        <el-dialog title="选择地区" v-model="show" size="tiny" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
            <el-form label-position="right">
                <el-form-item>
                    <el-checkbox-group v-model="provinceList" @change="selectProvince">
                        <template v-for="area in areaList" class="province">
                            <el-checkbox :label="area.code" class="provinceSelect">{{area.areaName}}
                            </el-checkbox>
                                <a class="showNum1" v-show="!(provinces[area.code] && provinces[area.code].length)"></a>
                                <a class="showNum" v-show="provinces[area.code] && provinces[area.code].length">
                                    (<span>{{provinces[area.code] && provinces[area.code].length}}</span>
                                    <span>/</span>
                                    <span>{{area.cityDtos.length}}</span>)
                                </a>
                            <a @click="showCity(area.code)" class="tri">▼</a>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="city" v-show="isSelected" @click="hideCity">
                <el-form>
                    <el-form-item>
                        <el-checkbox-group v-model="citys" @change="selectCity" class="city1">
                            <template v-for="city in cityList" >
                                <el-checkbox :label="city.code">{{city.areaName}}</el-checkbox>
                            </template>
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
    import {mapGetters, mapActions} from 'vuex';
    export default{
        props: {
            selectArea: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                provinceList: [],
                checkCity:[],
                cityCode:[],
                citys: [],
                cityList: [],
                areaCode:'',
                isSelected: false,
                provinces:{},
                form:{
                    provinces:[]
                }
            }
        },
        computed: {
            show(){
                return this.selectArea;
            },
            ...mapGetters({
                areaList: 'getAreaList'
            })
        },
        methods: {
            ...mapActions([
                'getArea'
            ]),
            showCity(val){
                let self = this;
                self.isSelected = true;
                self.areaCode = val;
                for (let i = 0, len = self.areaList.length; i < len; i++) {
                    if (val == self.areaList[i].code) {
                        self.cityList = self.areaList[i].cityDtos;
                    }
                }
//                 self.citys = self.provinces[val] || [];
            },
            hideCity(){
                let self = this;
                if(event.target.className === 'city'){
                    self.isSelected = false;
                }
            },
            selectProvince(val) {
                let self = this;
                let temp;
                self.areaCode = event.target._value
                self.provinceList = val;
                for (let i = 0, len = self.areaList.length; i < len; i++) {
                    if (self.provinceList[val.length - 1] == self.areaList[i].code) {
                        self.cityList = self.areaList[i].cityDtos;
                        self.citys = self.cityList.map(({code})=>(code));
                        temp = self.cityList.map(({code})=>(code));
                    }
                }
                if(event.target.checked){
                    let index = self.provinceList[val.length -1];
                    Object.assign(self.provinces,{
                        [index]:temp
                    });
                    self.checkCity=self.cityList;
                }else{
                    delete self.provinces[event.target._value];
                    self.citys=[];
                    self.checkCity=[];
                }
            },
            selectCity(val){
                let self = this;
                self.citys = val;
                Object.assign(self.provinces,{
                    [self.areaCode]:val
                });
                if(!val.length || val.length != event.target.parentNode.parentNode.parentNode.childElementCount){
                    if(self.provinceList.indexOf(self.areaCode)>-1){
                        self.provinceList.splice(self.provinceList.indexOf(self.areaCode),1);
                    }
                }else {
                    self.provinceList.push(self.areaCode);
                }
            },
            closePop(){
                self.isSelected = false;
            },
            getAreaL(){
                let self = this;
                self.getArea({type: "city"});
            },
            confirm() {
                let self = this;
                self.form.provinces = [];
                if(JSON.stringify(self.form.provinces) == "{}"){
                    alert('请至少选择一个省！！！');
                }
                for(let key in self.areaList){

                    for(let i in self.provinces ){

                        if(i == self.areaList[key].code){

                            for(let j = 0;j<self.provinces[i].length;j++){

                                for(let k = 0; k<self.areaList[key].cityDtos.length;k++){

                                    if(self.provinces[i][j] == self.areaList[key].cityDtos[k].code){
                                        self.form.provinces.push({
                                            provinceCode:self.areaList[key].code,
                                            cityCode:self.provinces[i][j],
                                            provinceName:self.areaList[key].areaName,
                                            cityName:self.areaList[key].cityDtos[k].areaName
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
                self.$emit('confirm', self.form);
            },
            cancel() {
                let self = this;
//                self.provinces= [];
                self.$emit('cancel');
            }
        },
        mounted() {
            let self = this;
            self.getArea({type: "city"});
        }
    }
</script>

<style>
    @media screen and (max-width: 2000px) {
        .el-dialog {
            position: relative;
            width: 950px;
        }
        .el-checkbox {
            width: 100px;
        }
    }
    @media screen and (min-width: 2000px) {
        .el-dialog {
            position: relative;
            width: 1000px;
        }
        .el-checkbox {
            width: 100px;
        }
    }
    .province{
        width: 200px;
    }
    .provinceSelect::after {
        content: '';
    }
    .showNum,.showNum1{
        display: inline-block;
        width: 50px;
        margin-left: 32px;
        color: #aaa;
        font-size:10px;
    }
    .tri {
        color: #aaa;
        font-size:6px;
        margin-right: 20px;
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
    .city1 .el-checkbox{
        width: 22%;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }
    .city .el-form{
        position: absolute;
        width:60%;
        max-height:60%;
        padding:5px;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        border:1px solid #999;
        background: #fff;
        z-index:2;
    }
    .city .el-checkbox:first-child{
        margin-left: 15px;
    }
</style>
