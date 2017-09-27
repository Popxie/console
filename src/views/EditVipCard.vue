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
                        <el-button type="primary" @click="backClilck()">返回</el-button>
                        <el-button type="primary" @click="onSubmit('form')" v-if="showConfirmBtn">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped lang="less">
    .mt40 {
        margin-top: 40px;
    }
    .container {
        background-color: #fff;
        position: relative;
        // 遮罩
        .coverTop {
            position: absolute;
            top: 0;
            width: 100%;
            height: 86%;
            z-index: 999;
        }
    }
</style>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    export default{
        data(){
            return {
                isFromList: false,
                showConfirmBtn: true,
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
                options: [
                    {
                        label: '无限次',
                        value: 1000000,
                    }
                ]
            }
        },
        components: {},
        created() {
            let self = this;
            const where = self.$route.query.isFromWhere;
            console.debug('where', where);
            if(where === 'self_support_details') {
                self.isFromList = true;
                self.showConfirmBtn = false;
            }
            const obj = self.$route.query;
            self.getVipCardInfo(self.parseParams(obj))
                .then((res) => {
                    self.form = res.data;
                    self.form.id = self.$route.query.id;
                },(err) => self.$notify({
                    title: '错误',
                    message: err ||'错误',
                    type: 'error'
                }))
        },
        methods: {
            ...mapActions([
                'setActivityVipCard',
                'getVipCardInfo',
                'modifyActivityVipCard'
            ]),
            /**
             * 格式化参数
             * @param obj
             * @returns {string}
             */
            parseParams: function (obj) {
                var str = '';
                Object.keys(obj).map(function (key) {
                    if (obj[key]) {
                        str += '&' + key + '=' + obj[key];
                    }
                });
                return str.substring(1);
                // str              ==> &id=139&isFromWhere=self_support_details
                // str.substring(1) ==>  id=139&isFromWhere=self_support_details
            },
            backClilck() {
                this.$router.back();
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
                        self.modifyActivityVipCard(self.form).then((res) => {
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
