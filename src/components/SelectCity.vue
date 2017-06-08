<template>
    <div>
        <el-dialog title="选择城市" v-model="show"  size="tiny" :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city" ></el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="info" @click="confirm">确 定</el-button>
                 </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Cities} from '../config/City';
    import {CityMaps} from '../config/City';
    export default {

        props: {
            selectCity: {
                type: Boolean,
                required: true
            }
        },
        data() {

            return {
                checkAll: false,
                checkedCities: [],
                cities: Cities,
                isIndeterminate: false
            };
        },
        computed: {
            show(){
                return this.selectCity;
            }
        },
        methods: {
            handleCheckAllChange(event) {
                this.checkedCities = event.target.checked ?Cities: [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {

                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            updateSelectCityInfos(){
                var selectCityInfos=new Array();
                for(var i=0;i<this.checkedCities.length;i++){
                    var city = this.checkedCities[i]
                    var cityInfo={
                        cityName:city,
                        provinceName:CityMaps[city]
                    }

                    selectCityInfos.push(cityInfo)
                }
                let self = this;
                self.selectCityInfos=selectCityInfos;


            },
            confirm() {
                let self = this;

                this.updateSelectCityInfos();

                self.$emit('confirm', self.selectCityInfos);
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    }
</script>
