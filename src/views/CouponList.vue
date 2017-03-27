<template>
    <div class="container">
        <Confirm :show-confirm="showConfirm" :message="message" text-align="center" @confirm="updateStatus"
                 @cancel="cancel"/>
        <el-row class="btn-m" :gutter="20">
            <el-col :span="2">
                <el-button type="primary" @click="()=> $router.push('createCoupon')">创建优惠券</el-button>
            </el-col>
            <el-col :span="3">
                <el-input placeholder="输入发券活动主题搜索" v-model="page.topic" @keyup.enter.native="searchByTopic">
                    <el-button slot="append" icon="search" @click="searchByTopic"></el-button>
                </el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model="page.isNewuserUse" placeholder="是否仅新用户可用">
                    <el-option label="全部" :value="''"></el-option>
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="page.status" placeholder="劵的状态">
                    <el-option label="全部" :value="''"></el-option>
                    <el-option label="已生成" :value="1"></el-option>
                    <el-option label="已过期" :value="3"></el-option>
                    <el-option label="已下线" :value="2"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-tabs v-model="page.type" @tab-click="changeType">
                    <template v-for="tap in taps">
                        <el-tab-pane :label="tap.task" :name="tap.value">
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
                                    label="广告主题"
                                    prop="topic"
                                    width="150">
                                    <template scope="scope">
                                        <el-button
                                            size="small"
                                            type="text"
                                            @click="routeToEdit(scope.$index, scope.row)">{{scope.row.topic}}



                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="劵类型"
                                    prop="type"
                                    width="150"
                                    :formatter="typeFilter"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="劵批次"
                                    prop="address"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="是否仅新用户可用"
                                    prop="isNewuserUse"
                                    width="150"
                                    :formatter="isNewuserUseFilter"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="单用户可领用/兑换上限张数"
                                    prop="limitSize"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券过期时间"
                                    prop="endDate"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券的面额（元)"
                                    prop="allDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券总张数"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="领用张数（线上)"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="兑换张数"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="充值张数"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="券生成时间"
                                    prop="totalDenomination"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="状态"
                                    prop="status"
                                    :formatter="statusFilter"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    label="查看劵码"
                                    prop="status"
                                    :formatter="statusFilter"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200"
                                >
                                    <template scope="scope">
                                        <el-button v-if="scope.row.status == 1"
                                                   size="small"
                                                   @click="handleEdit(scope.$index, scope.row, 'edit')">执行下线


                                        </el-button>
                                        <el-button v-if="scope.row.status == 2"
                                                   size="small"
                                                   @click="handleEdit(scope.$index, scope.row, 'edit')">执行上线


                                        </el-button>
                                        <el-button v-if="scope.row.status == 3"
                                                   size="small"
                                                   @click="handleEdit(scope.$index, scope.row, 'edit')">执行再次上线


                                        </el-button>
                                        <el-button
                                            v-if="scope.row.status != 1"
                                            size="small"
                                            type="danger"
                                            @click="handleEdit(scope.$index, scope.row, 'delete')">删除


                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </template>
                </el-tabs>
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
    import {mapGetters, mapActions} from 'vuex';
    import Confirm from '../components/Confirm.vue';
    export default{
        components: {
            Confirm
        },
        data() {
            return {
                taps: [{
                    task: '全部',
                    value: ''
                }, {
                    task: '充值卷',
                    value: '1'
                }, {
                    task: '抵扣卷',
                    value: '2'
                }, {
                    task: '折扣卷',
                    value: '3'
                }],
                showConfirm: false,
                message: '',
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    topic: '',
                    isNewuserUse: '',
                    status: '',
                    type: '',
                },
                couponList: []
            }
        },
        computed: {
            ...mapGetters({
                adsList: 'getCouponInfo',
                recordsTotal: 'getConRecordsTotal'
            })
        },
        methods: {
            ...mapActions([
                'getConponList',
                'deleteConponById'
            ]),
            cancel() {
                this.showConfirm = true;
            },
            searchByTopic() {

            },
            changeType(tab, event) {
                console.log(this.page.type);
            },
            routeToEdit() {

            },
            typeFilter(row, column) {
                let type = ['充值卷', '抵扣卷', '折扣卷'];
                if (!row.type) return '';
                return type[row.viewPosition - 1];
            },
            isNewuserUseFilter(row, column) {
                let isNewuserUse = ['否', '是'];
                if (!row.isNewuserUse) return '';
                return type[row.isNewuserUse];
            },
            statusFilter(row, column) {
                let status = ['已生成', '已下线', '已过期', '已删除'];
                if (!row.status) return '';
                return status[row.status - 1];
            },
            //执行上下线
            handleEdit(index, row, type) {
                let self = this,
                    query = {
                        id: row.id,
                        viewPosition: row.viewPosition,
                        status: row.status
                    };
                self.operationType = type;
                self.query = query;
                self.showConfirm = true;
                type == 'edit' ? self.message = '是否确定执行此操作吗？' : self.message = '是否确定删除该广告？';
            },
            updateStatus() {

            },
            handleSizeChange(val) {
                let self = this;
                self.page.pageSize = val;
                self.getConponList(self.page);
            },
            handleCurrentChange(val) {
                let self = this;
                self.page.currentPage = val;
                self.getConponList(self.page);
            },
        },
        created() {
            let self = this;
            self.getConponList(self.page);
        }
    }
</script>
<style scoped>
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
