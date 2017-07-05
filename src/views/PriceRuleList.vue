<template>
    <div class="pricing-rule container">
        <div class="block">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-button type="primary" @click="toCreatePrice">创建计费规则</el-button>
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="请输入内容" v-model="searchForm.nameContent">
                        <el-button icon="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="value" placeholder="请选择城市">
                        <el-option
                            v-for="item in cities"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="value6"
                        type="daterange"
                        placeholder="选择日期范围">
                    </el-date-picker>
                </el-col>
                <el-col :span="4">
                    <el-button @click="searchPriceRule">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="status-type-block">
            <span class="title">状态:</span>
            <el-checkbox-group v-model="statusList" class="status-checkbox">
                <el-checkbox label="已上线"></el-checkbox>
                <el-checkbox label="已过期"></el-checkbox>
                <el-checkbox label="未上线"></el-checkbox>
            </el-checkbox-group>
            <span class="title">运营方式:</span>
            <el-checkbox-group v-model="operationList" class="operation-checkbox">
                <el-checkbox label="自营"></el-checkbox>
                <el-checkbox label="加盟商"></el-checkbox>
            </el-checkbox-group>
        </div>
        <el-table
            :data="tableData">
            <el-table-column
                prop="id"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="规则名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="time"
                label="优惠时间">
            </el-table-column>
            <el-table-column
                prop="cityName"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="operateWay"
                label="运营方式">
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small">详情</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">停止</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
    .container {
        background: #fff;
        padding: 20px;
    }

    .status-type-block {
        margin: 20px 0;
    }

    .status-type-block .title {
        font-size: 14px;
    }

    .status-checkbox, .operation-checkbox {
        display: inline-block;
        margin: 0 20px;
    }
</style>
<script>
    import {Cities} from '../config/City'
    import {mapActions} from 'vuex'
    export default{
        data(){
            return {
                value: '',
                cities: Cities,
                value6: '',
                statusList: ['已上线'],
                operationList: ['自营'],
                tableData: [{
                    time: '2016-444-44',
                    "id":"5",
                    "name":"七夕活动计价规则",
                    "startTime":"1498809228",
                    "endTime":"1498809228",
                    "cityName":"杭州市",
                    "operateWay":"1",
                    "status":"1",
                    "type":"3"
                }],
                searchForm: {
                    nameContent: '',
                    cityName: '',
                    startTime: '',
                    endTime: '',
                    status: '',
                    operateWay: '',
                    count: '10'
                }
            }
        },
        methods: {
            ...mapActions([
                'getPriceList'
            ]),
            toCreatePrice() {
                let self = this;
                self.$router.push({path: 'createPrice'})
            },
            //检索计费规则
            searchPriceRule() {
                let self = this;
                self.getPriceList();
            }
        }
    }
</script>
