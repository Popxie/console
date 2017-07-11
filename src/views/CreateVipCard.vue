<template>
    <div>
        <el-form class="mt40" ref="form" :model="form" :rules="rules" label-position="left" label-width="180px">
            <el-form-item label="会员卡名称" prop="name" required>
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="originalPrice" required>
                <el-input v-model="form.originalPrice"></el-input>
            </el-form-item>
            <el-form-item label="惊爆价" prop="price" required>
                <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="使用次数" prop="counts" required>
                <el-select v-model="form.canUseCounts" placeholder="请选择使用次数">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="卡片类型" prop="type" required>
                <el-radio-group v-model="form.type">
                    <el-radio label="21">月卡</el-radio>
                    <el-radio label="22">半年卡</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">确定</el-button>
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
    export default{
        data(){
            return {
                form: {
                    name: '',
                    canUseCounts: '',
                    originalPrice: '',
                    price: '',
                    type: '',
                    amount: ''
                },
                rules: {
                    name: [
                        {required: true,message: '请输入会员卡名称', trigger: 'blur'}
                    ],
                    counts: [
                        {required: true,message: '请选择使用次数', type: 'number',trigger: 'change'}
                    ],
                    originalPrice: [
                        {required: true,message: '请输入原价',type: 'number', trigger: 'blur'}
                    ],
                    price: [
                        {required: true,message: '请输入惊爆价', trigger: 'blur'}
                    ],
                    type: [
                        {required: true,message: '请选择卡类型', trigger: 'change'}
                    ]
                },
                options: [{
                    value: '10',
                    label: '10'
                }, {
                    value: '20',
                    label: '20'
                }, {
                    value: '30',
                    label: '30'
                }, {
                    value: '40',
                    label: '40'
                }, {
                    value: '50',
                    label: '50'
                }, {
                    value: '60',
                    label: '60'
                }, {
                    value: '70',
                    label: '70'
                }, {
                    value: '80',
                    label: '80'
                }, {
                    value: '90',
                    label: '90'
                }, {
                    value: '100',
                    label: '100'
                }, {
                    value: '150',
                    label: '150'
                }, {
                    value: '200',
                    label: '200'
                }, {
                    value: 'unlimit',
                    label: '无限次'
                }],
            }
        },
        components: {},
        methods: {
            onSubmit(formname) {
                let self = this;
                self.$refs[formname].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>
