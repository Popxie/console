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
            :data="priceList">
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
                prop="startTime"
                :formatter="timeFilter"
                label="活动时间">
            </el-table-column>
            <el-table-column
                prop="cityName"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="operateWay"
                :formatter="operateFilter"
                label="运营方式">
            </el-table-column>
            <el-table-column
                prop="type"
                :formatter="typeFilter"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="status"
                :formatter="statusFilter"
                label="状态">
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small">详情</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" v-show="scope.row.status == 1" @click="offlineRule(scope.row.id)">停止</el-button>
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
    import {mapGetters,mapActions} from 'vuex'
    export default{
        data(){
            return {
                value: '',
                cities: Cities,
                value6: '',
                statusName: ['已上线','未上线','已过期'],
                operateWayName: ['自营','加盟商'],
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
        created() {
            let self = this;
            self.getPriceList();
        },
        computed: {
          ...mapGetters([
              'priceList'
            ])
        },
        methods: {
            ...mapActions([
                'getPriceList',
                'offlineRule'
            ]),
            toCreatePrice() {
                let self = this;
                self.$router.push({path: 'createPrice'})
            },
            //检索计费规则
            searchPriceRule() {
                let self = this;
                self.getPriceList();
            },
            //状态
            statusFilter(row, column) {
                let status = ['未上线', '已上线', '已过期'];
                if (!row.status) return '';
                return status[row.status];
            },
            //运营方式
            operateFilter(row, column) {
                let status = ['加盟商', '自营'];
                if (!row.operateWay) return '';
                return status[row.operateWay];
            },
            //计费type
            typeFilter(row, column) {
                let status = ['统一计价', '周惠','优惠日'];
                if (!row.type) return '';
                return status[row.type];
            },
            //
            timeFilter(row, column) {
                let timeList = [row.startTime,row.endTime];
                return row.startTime
                return new Date(parseInt(row.startTime)*1000);
                let formatTime = '';
                timeList.forEach((item) => {
                    let time = new Date(item);
                    formatTime +=  time.getFullYear() + '-' + time.getMonth() + 1 + '-' +  time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()+ '';
                });
                return formatTime;
            },
            //下线
            offlinePrice(id) {
                let self = this;
                self.offlineRule(id);
            }
        }
    }
</script>
