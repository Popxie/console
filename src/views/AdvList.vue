<template>
    <div class="container">
        <Confirm :show-confirm="showConfirm" :message="message" text-align="center" @confirm="updateStatus" @cancel="cancel" />
        <el-row class="btn-m">
            <el-col :span="2">
                <el-button type="primary" @click="()=> $router.push('createAdv')">创建广告</el-button>
            </el-col>
            <el-col :span="5">
                <el-input placeholder="请输入内容" v-model="page.topic" @keyup.enter.native="searchByTopic">
                    <el-button slot="append" icon="search" @click="searchByTopic" ></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                :data="adsList"
                border
                style="width: 100%;max-height:1000px;text-align: center">
                <el-table-column
                    label="广告主题"
                    prop="topic"
                    width="150">
                    <template scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            @click="routeToEdit(scope.$index, scope.row)">{{returnTopic(scope.row.topic)}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cityName"
                    label="城市"
                    width="100"
                >
                    <template scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            >{{returnCityNameByTopic(scope.row.topic)}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="viewPosition"
                    label="广告位置"
                    width="130"
                    :formatter="viewPositionFilter"
                    :filters="[
                        {text: '开屏页',value:1},{text:'首页弹框',value:2},
                        {text:'骑行结束页',value:3},{text:'首页顶部链',value:4},{text:'升级提示框',value:5}
                    ]"
                    filter-placement="bottom-end"
                    :filter-method="filterPosition"
                >
                    <!--<template scope="scope">-->
                        <!--<el-tag :type="scope.row.viewPosition === '1' ? 'primary' : 'success'" close-transition>{{scope.row.viewPosition}}</el-tag>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column
                    prop="beginTime"
                    label="广告发布时间段"
                    :formatter="beginTimeFilter"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    prop="putPosition"
                    label="投放平台"
                    width="180"
                    :formatter="putPositionFilter"
                    :filters="[{text: 'iOS & Android',value:1},{text:'iOS',value:2},{text:'Android',value:3}]"
                    filter-placement="bottom-end"
                    :filter-method="filterPutPosition"
                >
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="putPosition"-->
                <!--label="展现量"-->
                <!--width="180">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--prop="putPosition"-->
                <!--label="点击量"-->
                <!--width="180">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--prop="putPosition"-->
                <!--label="点击率"-->
                <!--width="180">-->
                <!--</el-table-column>-->
                <el-table-column
                    prop="status"
                    label="状态"
                    width="160"
                    :formatter="statusFilter"
                    :filters="[{text: '已上线',value:1},{text:'未上线',value:2},{text:'已下线',value:3}]"
                    filter-placement="bottom-end"
                    :filter-method="filterStatus"
                >
                </el-table-column>
                <el-table-column
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
    export default {
        components: {
            Confirm
        },
        data() {
            return {
                query: {},
                operationType: '',
                showConfirm: false,
                message:'',
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    topic: '',
                }
            }
        },
        computed: {
            ...mapGetters({
                adsList: 'getAdsListInfo',
                recordsTotal: 'getRecordsTotal'
            })
        },
        methods: {
            ...mapActions([
                'getAdsList',
                'updateAdvertStatusById',
                'deleteAdvertById'
            ]),
            /**
             *
             */
            returnTopic(val) {
                let items = val.split("__") ;
                return items[0]
            },
            returnCityNameByTopic(val) {
                let items = val.split("__");
                if (!items[1]) {
                	return "全域"
                }
                return items[1]
            },
            filterStatus(value, row) {
                console.debug("value", value);
                console.debug('row', row);
                return row.status === value;
            },
            filterPutPosition(value, row) {
                console.debug("value", value);
                console.debug('row', row);
                return row.putPosition === value;
            },
            filterPosition(value, row) {
                console.debug("value", value);
                console.debug('row', row);
                return row.viewPosition === value;
            },
            getAds(params) {
                this.getAdsList(params).then(() => {},((err)=> {
                    this.$notify({
                        title: '登陆已失效',
                        message: err,
                        type: 'error'
                    })
                }))
            },
            handleSizeChange(val) {
                let self = this;
                self.page.pageSize = val;
                self.getAds(self.page);
            },
            handleCurrentChange(val) {
                let self = this;
                self.page.currentPage = val;
                self.getAds(self.page);
            },
            searchByTopic() {
                let self = this;
                self.page.currentPage = 1;
                self.page.pageSize = 10;
                self.getAds(self.page);
            },
            routeToEdit(index, row) {
                let self = this;
                self.$router.push({path: 'editAdv', query: {id: row.id, viewPosition: row.viewPosition}})
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
                type =='edit'? self.message = '是否确定执行此操作吗？': self.message = '是否确定删除该广告？' ;
            },
            updateStatus() {
                let self = this;
                self.showConfirm = false;
                if(self.operationType == 'edit') {
                    self.updateAdvertStatusById(self.query)
                        .then((data) => {
                            self.$notify({
                                title: '成功',
                                message: data,
                                type: 'success'
                            })
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            })
                        });
                } else {
                    self.deleteAdvertById(self.query)
                        .then((data) => {
                            self.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            })
                        }, (err) => {
                            self.$notify({
                                title: '失败',
                                message: err,
                                type: 'error'
                            })
                        });
                }
            },
            cancel() {
                this.showConfirm = false;
            },
            statusFilter(row, column) {
                let status = ['已上线', '未上线', '已下线', '已过期'];
                if (!row.status) return '';
                return status[row.status - 1];
            },
            viewPositionFilter(row, column) {
                let viewPositions = ['开屏页', '首页弹框', '骑行结束页', '首页顶部链', '升级提示框'];
                if (!row.viewPosition) return '';
                return viewPositions[row.viewPosition - 1];
            },
            putPositionFilter(row) {
                let putPositions = ['ios & Android', '仅ios', '仅Android'];
                if (!row.putPosition) return '';
                return putPositions[row.putPosition - 1];
            },
            beginTimeFilter(row) {
                if(row.viewPosition === 5) {
                    return '——';
                }
                return row.beginTime;
            },
        },
        created() {
            let self = this;
            self.getAds(self.page);
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
        margin-left: 10px;
    }
</style>
