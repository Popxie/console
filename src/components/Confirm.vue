<template>
    <el-dialog  title="提示" v-model="show" size="tiny" @close="cancel">
        <div :style="styles">
            <span>{{message}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import {oneOf} from '../utils/assits';
    export default{
        props: {
        	message: {
        		type: String,
                default: '确定要执行吗？'
            },
            showConfirm: {
        		type: Boolean,
                required: true
            },
            textAlign: {
                validator (value) {
                    return oneOf(value, ['left', 'center', 'right']);
                }
            }
        },
        computed: {
            show(){
            	return this.showConfirm;
            },
            styles() {
            	let style= {};
            	style.textAlign = this.textAlign;
            	return style;
            }
        },
        methods: {
        	confirm() {
        		this.$emit('confirm');
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    }
</script>
<style scoped>

</style>
