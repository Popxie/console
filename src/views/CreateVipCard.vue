<template>
    <div>
        <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
            <el-form-item label="会员卡名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="规则标题" prop="rule_title" required>
                <el-input v-model="form.rule_title"></el-input>
            </el-form-item>
            <el-form-item label="规则内容" prop="rule_content" required>
                <el-input v-model="form.rule_content"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="original_price" required>
                <el-input v-model="form.original_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="惊爆价" prop="price" required>
                <el-input v-model="form.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="使用次数" required>
                <el-select v-model="form.can_use_counts" placeholder="请选择使用次数">
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
                    <el-radio :label="21">月卡</el-radio>
                    <el-radio :label="22">半年卡</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="upStep()">返2回</el-button>
                <el-button type="primary" @click="onSubmit('form')">确2定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped>
    .mt40 {
        margin-top: 40px;
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                form: {
                    name: '',
                    rule_title: '',
                    rule_content: '',
                    original_price: '',
                    price: '',
                    can_use_counts: null,
                    type: 21,
                },
                rules: {
                    name: [
                        {type: 'string',required: true, message: '请输入会员卡名称', trigger: 'blur'},
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    rule_title: [
                        {required: true,message: '请输入规则标题', trigger: 'blur'}
                    ],
                    rule_content: [
                        {required: true,message: '请输入规则内容', trigger: 'blur'}
                    ],
                    counts: [
                        {required: true,message: '请选择使用次数',trigger: 'change'}
                    ],
                    original_price: [
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
                //暂时只提供无限次
//                options: [{
//                    value: '10',
//                    label: '10'
//                }, {
//                    value: '20',
//                    label: '20'
//                }, {
//                    value: '30',
//                    label: '30'
//                }, {
//                    value: '40',
//                    label: '40'
//                }, {
//                    value: '50',
//                    label: '50'
//                }, {
//                    value: '60',
//                    label: '60'
//                }, {
//                    value: '70',
//                    label: '70'
//                }, {
//                    value: '80',
//                    label: '80'
//                }, {
//                    value: '90',
//                    label: '90'
//                }, {
//                    value: '100',
//                    label: '100'
//                }, {
//                    value: '150',
//                    label: '150'
//                }, {
//                    value: '200',
//                    label: '200'
//                }, {
//                    value: '1000000',
//                    label: '无限次'
//                }],
            }
        },
        components: {},
        methods: {
            ...mapActions([
                'setActivityVipCard'
            ]),
            upStep() {
                this.$emit('back-click');
            },
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        if(self.form.original_price <= 0) {
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
                        self.setActivityVipCard(self.form).then((res) => {
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
                            }
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err.msg,
                                type: 'error'
                            });
                        });
                    }
                });
            }
        }
    }
</script>
