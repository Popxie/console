<template>
    <div class="container">
        <div :class="{coverTop: isFromList}"></div>
        <el-row>
            <el-col :lg="{span: 13,offset:1}" :md="{span: 14, offset:1}"
                    :sm="{span:16, offset:1}" :xs="{span: 18, offset:1}"
            >
                <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
                    <el-form-item label="会员卡名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="规则标题" prop="ruleTitle" required>
                        <el-input v-model="form.ruleTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="规则内容" prop="ruleContent" required>
                        <el-input v-model="form.ruleContent"></el-input>
                    </el-form-item>
                    <el-form-item label="原价" prop="originalPrice" required>
                        <el-input v-model="form.originalPrice" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="惊爆价" prop="price" required>
                        <el-input v-model="form.price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="使用次数" required>
                        <el-select v-model="form.canUseCounts" placeholder="请选择使用次数">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="卡片类型" required>
                        <el-radio-group v-model="form.type">
                            <el-radio label="21">月卡</el-radio>
                            <el-radio label="22">半年卡</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="backClilck()">返回</el-button>
                        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
    .mt40 {
        margin-top: 40px;
    }
    .container {
        background-color: #fff;
        position: relative;
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                isFromList: false,
                form: {
                    name: '',
                    ruleTitle: '',
                    ruleContent: '',
                    originalPrice: '',
                    price: '',
                    canUseCounts: '1000000',
                    type: '21'
                },
                rules: {
                    name: [
                        {type: 'string',required: true, message: '请输入会员卡名称', trigger: 'blur'},
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    ruleTitle: [
                        {required: true,message: '请输入规则标题', trigger: 'blur'}
                    ],
                    ruleContent: [
                        {required: true,message: '请输入规则内容', trigger: 'blur'}
                    ],
                    counts: [
                        {required: true,message: '请选择使用次数',trigger: 'change'}
                    ],
                    originalPrice: [
                        {type: 'number',message: '请输入原价', trigger: 'change'}
                    ],
                    price: [
                        {type: 'number',message: '请输入惊爆价', trigger: 'change'}
                    ],
                    type: [
                        {required: true,message: '请选择卡类型', trigger: 'change'}
                    ]
                },
                options: [{
                    value: '1000000',
                    label: '无限次'
                }]
            }
        },
        components: {},
        methods: {
            ...mapActions([
                'setVipCard'
            ]),
            backClilck() {
                this.$router.back();
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        if(self.form.originalPrice <= 0) {
                            self.$notify({
                                title: '失败',
                                message: '原价必须大于0',
                                type: 'error'
                            });
                            return;
                        }
                        if(self.form.price <= 0) {
                            self.$notify({
                                title: '失败',
                                message: '惊爆价必须大于0',
                                type: 'error'
                            });
                            return;
                        }
                        self.setVipCard(self.form).then((res) => {
                            if(res.status == '1') {
                                self.$notify({
                                    title: '成功',
                                    message: res.msg,
                                    type: 'success'
                                });
                                self.$router.push({
                                    path: 'vipCardList',
                                    query: {isFrom: 'self-support'}
                                });
                            } else {
                                self.$notify({
                                    title: '失败',
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            });
                        });
                    }
                });
            }
        }
    }
</script>
