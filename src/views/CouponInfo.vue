<template>
    <div class="container">
        <el-row class="btn-m" :gutter="20">
            <el-col :span="2">
                <el-button  @click="()=> $router.go(-1)">返回</el-button>
            </el-col>
            <el-col :span="2">
                <el-input v-model="execlInfo.start" type="number" placeholder="请输入开始值"></el-input>
            </el-col>
            <el-col :span="2">
                <el-input v-model="execlInfo.length" type="number" placeholder="请输入长度"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button  type="info" @click="outToExcel">导出excel</el-button>
            </el-col>
            <el-col :span="5" >
                <div style="line-height: 36px; height: 36px"> 总生成张数： {{recordsTotal}}张</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table
                    :data="couponList"
                    border
                    style="width: 100%;max-height:1000px;text-align: center">
                    <el-table-column
                        fixed
                        label="劵批次"
                        prop="batchNo"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="劵码"
                        prop="couponCode"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="劵显示名称"
                        prop="couponName"
                        width="150"
                    >
                    </el-table-column>
                    <el-table-column
                        label="有效地域"
                        width="150">
                        <template scope="scope">
                            {{scope.row.areaType == 0 ? '全域' : scope.row.provinceName + '-' + scope.row.cityName + '-' + scope.row.areaName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否仅新用户可用"
                        prop="isNewuserUse"
                        width="150"
                        :formatter="isNewuserUseFilter"
                    >
                    </el-table-column>
                    <el-table-column
                        label="面额"
                        prop="denomination"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="劵的过期时间"
                        prop="endDate"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="劵的生成时间"
                        prop="createDate"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="领用情况(线上)"
                        prop="isReceived"
                        width="150"
                        :formatter="isReceivedFilter">
                    </el-table-column>
                    <el-table-column
                        label="兑换情况"
                        prop="isExchanged"
                        width="150"
                        :formatter="isExchangedFilter">
                    </el-table-column>
                    <el-table-column
                        label="充值情况"
                        prop="isUsed"
                        width="150"
                        :formatter="isUsedFilter">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row type="flex" justify="end">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="recordsTotal">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>
    import {settings} from '../config/settings';
    import  {parseParams} from '../utils/fetch';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        data() {
            return {
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    batchId: this.$route.query.id
                },
                execlInfo: {
                	start: '',
                    length: '',
                    batchId: this.$route.query.id
                }
            }
        },
        computed: {
            ...mapGetters({
                couponList: 'getCouInfo',
                recordsTotal: 'getConInfoRecordsTotal'
            })
        },
        methods: {
            ...mapActions([
                'getConponInfo'
            ]),
            outToExcel() {
            	let self = this;
            	if(!self.execlInfo.start) {
            		self.$notify({
                        title: '提示',
                        message: '请输入开始值',
                        type: 'info'
                    })
                    return;
                }
                if(!self.execlInfo.length) {
                    self.$notify({
                        title: '提示',
                        message: '请输入长度',
                        type: 'info'
                    })
                    return;
                }
                if(self.execlInfo.length > 20000) {
                    self.$notify({
                        title: '提示',
                        message: '长度不能大于20000',
                        type: 'info'
                    })
                    return;
                }
                let url = `${settings.URL}/api/excel/exportCoupons?${parseParams(this.execlInfo)}`;
                window.open(url, '_blank');
            },
            handleSizeChange(val) {
                let self = this;
                self.page.pageSize = val;
                self.getConponInfo(self.page);
            },
            handleCurrentChange(val) {
                let self = this;
                self.page.currentPage = val;
                self.getConponInfo(self.page);
            },
            isNewuserUseFilter(row, column) {
                let isNewuserUse = ['否', '是'];
                return isNewuserUse[row.isNewuserUse];
            },
            isReceivedFilter(row, column) {
            	let isRs = ['未领用', '已领用'];
                return isRs[Number(row.isReceived)];
            },
            isExchangedFilter(row, column) {
                let isEs = ['未兑换', '已兑换'];
                return isEs[Number(row.isExchanged)];
            },
            isUsedFilter(row, column) {
            	let isUses = ['未使用', '已使用'];
                return isUses[Number(row.isUsed)];
            }
        },
        created() {
            this.getConponInfo(this.page);
        },
    }
</script>
<style>
    .container {
        padding-top: 10px;
        background-color: #fff;
        height: 100%;
    }

    .btn-m {
        margin-bottom: 10px;
        margin-left: 10px !important;
    }
</style>
