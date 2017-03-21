<template>
    <div>
        <el-dialog title="选择地区" v-model="show" size="small" :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false">
            <el-checkbox-group v-model="provinceList">
                <div style="display: flex;flex-direction: row; flex-wrap: wrap;width: 100%">
                    <template v-for="(area, index) in areas">
                        <div class="area-col">
                            <el-checkbox :label="area.name">
                                {{area.name}}{{returnSelectProvince()}}({{area.city.length}})
                            </el-checkbox>
                            <i class="el-icon-edit" @click="selectCity(area.city,area.name)"></i>
                        </div>
                    </template>
                </div>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="info" @click="Confirm">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="选择城市" v-model="showCity" size="tiny">
            <el-checkbox-group v-model="cityList">
                <div style="display: flex;flex-direction: row; flex-wrap: wrap;width: 100%">
                    <template v-for="(city, index) in citys">
                        <div class="area-col">
                            <el-checkbox :label="city.name">{{returnSubStr(city.name,3)}}({{city.area.length}})
                            </el-checkbox>
                            <i class="el-icon-edit" @click="selectDistricts(city.area,city.name)"></i>
                        </div>
                    </template>
                </div>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showCity = false">取 消</el-button>
                <el-button type="primary" @click="showCity = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择地区" v-model="showDistricts" size="tiny">
            <el-checkbox-group v-model="districtsList">
                <div style="display: flex;flex-direction: row; flex-wrap: wrap;width: 100%">
                    <template v-for="(district, index) in districts">
                        <div class="area-col">
                            <el-checkbox :label="district.name">{{district}}
                            </el-checkbox>
                        </div>
                    </template>
                </div>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDistricts = false">取 消</el-button>
                <el-button type="primary" @click="showDistricts = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {Areas} from '../config/Areas';
    export default{
        data() {
            return {
                // 所有城市数据
                areas: Areas,
                citys: [],
                districts: [],
                showCity: false,
                showDistricts: false,
                provinceList: [],
                cityList: [],
                districtsList: [],
                selectAreas: [],
                aList: [],
                provinces: [],
                cityName: ''
            }
        },
        props: {
            selectArea: {
                type: Boolean,
                required: true
            },
            areaList: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        watch: {
            'provinceList': function (val) {
                let self = this;
                self.provinces = [];
                for (let i = 0, len = val.length; i < len; i++) {
                    let obj = {
                        name: val[i],
                        city: []
                    }
                    self.provinces.push(obj);
                }
                self.areas.map(function (a) {
                });
                console.log(self.provinces);
            },
            'cityList': function (val) {
//                let self = this,
//                    items = [];
//                self.areas.map((s)=> {
//                    if(s.name == self.provinceName) {
//                        items = s.city.filter((c)=> {
//                            return val.indexOf(c.name) >=0
//                        });
//                    }
//                });
//                self.selectAreas.map((s)=> {
//                	if(s.name == self.provinceName) {
//                        s.city = items;
//                    }
//                });
//                console.log(items);
//                console.log(self.cityList);
//                console.log(self.selectAreas);
            }
        },
        computed: {
            show(){
                return this.selectArea;
            }
        },
        methods: {
            returnSubStr(val, len) {
                if (val.length < len) {
                    return val;
                }
                return val.substring(0, len) + '...';
            },
            confirm() {
                this.$emit('Confirm');
            },
            cancel() {
                this.$emit('cancel');
            },
            cancelSelect() {

            },
            selectCity(citys, name) {
                let self = this;
                if (self.provinceList.indexOf(name) < 0) {
                    return;
                }
                self.citys = citys;
                self.provinceName = name;
                self.showCity = true;
            },
            selectDistricts (districts, name) {
                let self = this;
                if (self.cityList.indexOf(name) < 0) {
                    return;
                }
                self.districts = districts;
                self.showDistricts = true;
            },
            returnSelectProvince() {

            }
        }
    }
</script>
<style scoped>
</style>
