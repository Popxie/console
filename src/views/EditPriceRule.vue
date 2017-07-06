<template>
    <div class="edit-page">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        <div class="title">编辑 / {{typeName[form.type - 1]}}</div>
        <el-form :model="form" label-width="120px">
            <el-form-item label="活动名称" required>
                <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
            </el-form-item>
            <el-form-item label="地区" required>
                <span class="choose-city">{{selectedCity}}</span>
                <el-button @click="showAreaSelect">选择相同计费规则的区域</el-button>
            </el-form-item>
            <!--统一计价,周惠-->
            <template class="unified-pricing" v-if="form.type === '1' || form.type === '2'">
                <el-form-item label="有效期" required>
                    <el-date-picker
                        v-model="validPeriod"
                        type="daterange"
                        placeholder="选择开始时间-结束时间">
                    </el-date-picker>
                </el-form-item>
            </template>
            <el-button type="primary" class="mt20" @click="saveEdit()">保存</el-button>
        </el-form>
    </div>
</template>
<style scoped>
    .edit-page {
        background: #fff;
        padding: 20px;
    }

    .title {
        margin-bottom: 20px;
    }

</style>
<script>
    import SelectCity from '../components/SelectCity.vue'
    import SelectAreas from '../components/SelectArea.vue'
    import {mapGetters, mapActions} from 'vuex'
    export default{
        data(){
            return {
                typeName: ['统一计费', '周惠', '优惠日'],
                dialogVisible: false,
                form: {
                    name: '',
                    cityName: '',
                    type: 1,
                    startTime: '',
                    endTime: ''
                },
                validPeriod: []
            }
        },
        methods: {
            ...mapActions([
                'editRule'
            ]),
            //保存修改
            saveEdit(){
                let self = this;
                self.formatCityName();
                self.formatTime();
                self.editRule(self.form).then((res) => {
                    self.$notify({
                        title: '成功',
                        message: res,
                        type: 'success'
                    });
                    self.$router.push({path: 'priceList'});
                }, (err) => {
                    self.$notify({
                        title: '失败',
                        message: err,
                        type: 'error'
                    });
                });
            },
            cancelSelect () {
                let self = this;
                self.dialogVisible = false;
                self.form.areaType = 0;
                self.reset();
            },
            showAreaSelect() {
                let self = this;
                self.dialogVisible = true;
            },
            setAreas(form) {
                let self = this;
                if (!form) {
                    self.$notify({
                        title: '提示',
                        message: '请选择省份',
                        type: 'info'
                    });
                    return;
                }
                self.form = Object.assign({}, self.form, form);
                self.dialogVisible = false;
            },
            //格式化所选城市格式
            formatCityName() {
                let self = this;
                let cityArray = [];
                if(!self.form.provinces) {
                    return;
                }
                self.form.provinces.forEach((item) => {
                    cityArray.push(item.cityName);
                });
                self.form.cityName = cityArray.toString();
            },
            //
            formatTime() {
                let self = this;
                console.log(self.form.startTime);
                self.form.startTime = new Date(self.validPeriod[0]).getTime()/1000;
                self.form.endTime = new Date(self.validPeriod[1]).getTime()/1000;
            }
        },
        computed: {
            ...mapGetters([
                'curPriceModel'
            ]),
            //选中城市
            selectedCity() {
                let self = this;
                if(self.form.hasOwnProperty('provinces')) {
                    let cityArray = [];
                    self.form.provinces.forEach((item) => {
                        cityArray.push(item.cityName);
                    });
                    return cityArray.toString()
                }
                return self.form.cityName
            }
        },
        components: {
            SelectCity,
            SelectAreas
        },
        created() {
            let self = this;
            self.form = self.curPriceModel;
            self.validPeriod = [new Date(self.form.startTime * 1000), new Date(self.form.endTime * 1000)];
        }
    }
</script>
