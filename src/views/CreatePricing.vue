<template>
    <div class="create-pricing">
        <div class="intro-page" v-show="!isSetRule">
            <div class="to-set-rule" @click="toSetRule">计费规则设置</div>
            <div class="intro">
                规则执行优先级： 1、优惠日（时期+时间）2、周惠（周+时间）3、阶梯计价 4、统一计价

            </div>
        </div>
        <div class="create-page" v-show="isSetRule">
            <div class="title">计费规则设置/<span class="sub-title">创建计费</span></div>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="*活动名称" placeholder="请输入活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="*地区" placeholder="请选择相同计费规则的区域">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="加盟商编号" placeholder="请填写加盟商编号、并用；分隔开">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" required>
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style scoped>
</style>
<script>
    export default{
        data(){
            return {
                isSetRule: true,
                form: {
                    name: '',
                    area: '',
                    franchiseeNum: '',
                    date1: ''
                }
            }
        },
        components: {},
        methods: {
            toSetRule() {
                let self = this;
                self.isSetRule = true;
            }
        }
    }
</script>
