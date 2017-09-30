<template>
    <div class="merchant-list-cont">
        <el-dialog v-model="isShowSendCoupon" title="批量发券" size="tiny">
            <el-upload
                :action="fileUrl"
                :on-remove="handleRemoveForSendCoupon"
                :on-success="handleSuccessForSendCoupon"
            >
                <el-button  v-if="showBtn">导入</el-button>
                <div class="el-upload__tip" slot="tip">支持xls，xlsx等excel文件</div>
            </el-upload>
            <p style="color: red; padding: 10px 0">温馨提示：7:00-9:00，11:30-13:30，5:30-8:00不能发券</p>
            <el-button type="primary">确认发券</el-button>
            <el-button>取消</el-button>
        </el-dialog>
        
        <el-dialog v-model="isShowImportCoupon" title="导入新券" size="tiny">
        
        </el-dialog>
        
        <div style="display: flex;height: 36px;width: 100%;line-height: 36px;margin-bottom: 15px">
            <div style="width: 80px;padding-right: 12px">券生成时间</div>
            <el-date-picker
                v-model="dataObj.dateRange"
                type="daterange"
                range-separator="—"
                @change="dateBlur"
                placeholder="选择日期范围">
            </el-date-picker>
            
            <el-select v-model="dataObj.isNewPerson" class="is-new-user" placeholder="是否仅新用户可用">
                <el-option
                    v-for="item in isNewOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            
            <el-select v-model="dataObj.status" class="select" placeholder="券的状态">
                <el-option
                    v-for="item in stateOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            
            <el-button class="btn btn-left" type="primary" @click="searchClick">查询</el-button>
        </div>
        <div style="height: 36px;width: 100%;margin-bottom: 15px">
            <template v-for="(item, index) in buttonList">
                <el-button type="primary" @click="chooseClick(index)">{{item.name}}</el-button>
            </template>
        </div>
        
        <el-table
            :data="merchantList"
            border
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                label="全选"
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            
            <el-table-column
                prop="batchNo"
                label="券批次"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="couponNo"
                label="券码"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="couponName"
                label="券显示名称"
                align="center"
            >
            </el-table-column>
            
            <el-table-column
                prop="cityName"
                label="有效地域"
                align="center"
            >
            </el-table-column>
            
            <el-table-column
                prop="isNewUserUse"
                align="center"
                label="是否仅新用户可用">
            </el-table-column>
            
            <el-table-column
                prop="allDenomination"
                align="center"
                label="面额">
            </el-table-column>
            
            <el-table-column
                prop="expirationTimeStart"
                align="center"
                width="130"
                label="使用期限">
            </el-table-column>
            
            <el-table-column
                prop="couponCreateTime"
                align="center"
                label="券生成时间">
            </el-table-column>
            
            <el-table-column
                prop="isUse"
                align="center"
                label="领用情况">
            </el-table-column>
            
            <el-table-column
                prop="status"
                align="center"
                label="使用状态">
            </el-table-column>
            
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="delClick(scope.row.activityId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {settings} from '../config/settings';
    
    export default {
        components: {},
        data() {
            return {
                
                stateOptions: [
                    {
                        value: 1,
                        label: '可用',
                    },
                    {
                        value: 2,
                        label: '失效',
                    },
                    {
                        value: 3,
                        label: '已使用',
                    },
                ],
                isNewOptions: [
                    {
                        value: 0,
                        label: '否'
                    },
                    {
                        value: 1,
                        label: '是'
                    }
                ],
                testList: [
                    {
                        batchId: '2222',
                        couponNo: '123123',
                        couponName: '而我翁人',
                        cityName: '杭州',
                        isNewUserUse: '否',
                        allDenomination: '100',
                        expirationTimeStart: '2017.3.29-2017.04.10',
                        couponCreateTime: '2017.3.29',
                        isUse: '未领用',
                        status: '已使用'
                    },
                    {
                        batchId: '2222',
                        couponNo: '123123',
                        couponName: '而我翁人',
                        cityName: '杭州',
                        isNewUserUse: '否',
                        allDenomination: '100',
                        expirationTimeStart: '2017.3.29-2017.04.10',
                        couponCreateTime: '2017.3.29',
                        isUse: '未领用',
                        status: '已使用'
                    },
                    {
                        batchId: '2222',
                        couponNo: '123123',
                        couponName: '而我翁人',
                        cityName: '杭州',
                        isNewUserUse: '否',
                        allDenomination: '100',
                        expirationTimeStart: '2017.3.29-2017.04.10',
                        couponCreateTime: '2017.3.29',
                        isUse: '未领用',
                        status: '已使用'
                    }
                ],
                // 查询时发送的对象
                dataObj: {
                    dateRange: '',          // 时间范围 (传给接口的时候不能将这个字段的值传过去，(Sat Sep 16 2017 00:00:00 GMT+0800 (CST)))
                    expirationTimeStart: '',
                    expirationTimeEnd: '',
                    status: null,
                    isNewPerson: null,
                },
                
                
                
                fileUrl: `${settings.URL}/api/uploadFile`,
                multipleSelection: [],  // 全选后的值
                page: {
                    couponType: -1,
                    page: 2,
                    size: 10,
                },
                buttonList: [
                    {
                        name: '批量发券',
                    },
                    {
                        name: '导入新券',
                    },
                    {
                        name: '批量删除券',
                    }
                ],
                couponOperate: null,
                showBtnForSendCoupon: true,
                showBtn: true,
                isShowSendCoupon: false,
                isShowImportCoupon: false,
            }
        },
        computed: {
            ...mapGetters([
                'merchantList',
            ])
        },
        created() {
            this.getMerchantList(this.page);
        },
        methods: {
            ...mapActions([
                'getMerchantList'
            ]),
            dateBlur(val) {
                let self = this;
                // 将组件的val （年月日时分秒的时间区间）分离
                let items = val.split('—');
                // 将年月日 跟 时分秒分离
                self.dataObj.expirationTimeStart = items[0];
                self.dataObj.expirationTimeEnd = items[1];
                self.timeRange = val;
            },
            searchClick() {
                console.debug('搜索');
            },
            
            chooseClick(index) {
                console.debug(index);
                switch (index) {
                    case 0:
                        this.isShowSendCoupon = true;
                        break;
                    case 1:
                        this.isShowImportCoupon = true;
                        break;
                    case 2:
                        console.debug(222);
                        break;
                }
            },
            handleRemoveForSendCoupon(res,file) {
                this.showBtn = true;
                console.debug('res', res);
                console.debug('file', file);
            },
            handleSuccessForSendCoupon(res) {
                this.showBtn = false;
                console.debug('res', res);
            },
            // 全选 或者 单选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.debug(val);
            },
        }
        
    }
</script>

<style lang="less">
    .merchant-list-cont {
        background: #fff;
        padding: 20px;
        .el-inputs {
            width: 175px !important;
            margin-left: 15px;
        }
        .is-new-user {
            margin-left: 15px;
            width: 150px;
        }
        .select {
            margin-left: 15px;
            width: 100px;
        }
        .btn {
            width: 70px !important;
        }
        .btn-left {
            margin-left: 30px !important;
        }
        .btn-right {
            width:76px !important;
        }
        .el-input__inner {
            padding-right: 20px;
        }
        .button-cont {
            .el-radio-button {
                margin-right: 30px;
            }
            .el-radio-button .el-radio-button__inner {
                border-radius: 4px;
                border: 1px solid #bfcbd9;
                width: 102px;
                box-shadow: none;
            }
        }
    }

</style>
