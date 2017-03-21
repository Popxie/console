<template>
    <div>
        <el-dialog title="选择地区" v-model="show" size="tiny" :close-on-click-modal="false" :show-close="false"
                   :close-on-press-escape="false">
            <el-form label-position="right" label-width="150px">
                <el-form-item label="请选择省份：" prop="provinceName">
                    <el-select v-model="form.provinceName" placeholder="请选择省份" @change="selectProvince">
                        <template v-for="area in areas">
                            <el-option :label="area.name" :value="area.name"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择城市：" prop="cityName">
                    <el-select v-model="form.cityName" placeholder="请选择城市" @change="selectCity">
                        <template v-for="city in citys">
                            <el-option :label="city.name" :value="city.name"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择地区：" prop="areaName">
                    <el-select v-model="form.areaName" placeholder="请选择地区">
                        <template v-for="district in districts">
                            <el-option :label="district" :value="district"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
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
            selectProvince() {
                let self = this;
                self.districts = [];
                self.form.cityName = '';
                self.form.areaName = '';
                for (let i = 0, len = self.areas.length; i < len; i++) {
                    if (self.form.provinceName == self.areas[i].name) {
                        self.citys = self.areas[i].city;
                    }
                }
            },
            selectCity() {
                let self = this;
                self.form.areaName = '';
                for (let i = 0, len = self.citys.length; i < len; i++) {
                    if (self.form.cityName == self.citys[i].name) {
                        self.districts = self.citys[i].area;
                    }
                }
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

</style>
