<template>
    <div class="merchant-list-cont">
        <!--批量发券 dialog-->
        <el-dialog v-model="isShowSendCoupon" title="批量发券" size="tiny">
            <el-upload
                :action="fileUrl"
                :on-remove="handleRemoveForSendCoupon"
                :on-success="handleSuccessForSendCoupon"
            >
                <el-button  v-if="showBtn">导入</el-button>
                <div class="el-upload__tip" slot="tip">支持xls，xlsx等excel文件</div>
            </el-upload>
            <p style="color: red; padding: 10px 0">温馨提示：7:00-9:00，11:30-13:30，17:30-20:00不能发券</p>
            <el-input v-model="batchSendData.sendNumber" type="number" placeholder="请填写每个人要发送的数量 " style="width: 60%;margin:0 75px 5px 0"></el-input>
            <el-button type="primary" @click="batchSendClick">确认发券</el-button>
            <el-button @click="isShowSendCoupon = false">取消</el-button>
        </el-dialog>
        <!--导入新券 dialog-->
        <el-dialog v-model="isShowImportCoupon" title="导入新券" size="tiny">
            <el-upload
                :action="fileUrl"
                :on-remove="handleRemoveForSendNewCoupon"
                :on-success="handleSuccessForSendNewCoupon"
            >
                <el-button  v-if="showBtnForNew">导入</el-button>
                <div class="el-upload__tip" slot="tip">支持xls，xlsx等excel文件</div>
            </el-upload>
            <el-button type="primary" @click="confirmSendForImport">确认导入</el-button>
            <el-button @click="isShowImportCoupon = false">取消</el-button>
        </el-dialog>
        <!--删除 dialog-->
        <el-dialog
            title="删除确认"
            v-model="dialogConfirm"
            size="tiny">
            <span>删除后将无法恢复，你确定要删除吗？？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirm = false">取 消</el-button>
                <el-button type="primary" @click="confirmClick">确 定</el-button>
            </span>
        </el-dialog>
        <!--第一行-->
        <div style="display: flex;height: 36px;width: 100%;line-height: 36px;margin-bottom: 15px">
            <div style="display: flex">
                <span style="padding-right: 3px">领用状态</span>
                <el-select v-model="page.received" class="select">
                    <el-option
                        v-for="item in stateOptions"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-left: 15px;display: flex">
                <span style="padding-right: 3px">使用状态</span>
                <el-select v-model="page.used" class="select">
                    <el-option
                        v-for="item in useStateOptions"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            
            <el-button class="btn btn-left" type="primary" @click="searchClick">查询</el-button>
        </div>
        <!--第二行-->
        <div style="height: 36px;width: 100%;margin-bottom: 15px">
            <template v-for="(item, index) in buttonList">
                <el-button type="primary" @click="chooseClick(index)">{{item.name}}</el-button>
            </template>
        </div>
        <!--表格-->
        <el-table
            :data="merchantDetailsList"
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
                prop="couponCode"
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
                prop="denomination"
                align="center"
                label="面额">
            </el-table-column>
            
            <el-table-column
                prop="formatEffectiveTime"
                align="center"
                width="130"
                label="使用期限">
            </el-table-column>
            
            <el-table-column
                prop="formatCreateTime"
                align="center"
                label="券生成时间">
            </el-table-column>
            
            <el-table-column
                prop="receivedValue"
                align="center"
                label="领用情况">
            </el-table-column>
            
            <el-table-column
                prop="usedValue"
                align="center"
                label="使用状态">
            </el-table-column>
            
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="delClick(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <el-row type="flex" justify="end">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.page"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="detailsTotal">
            </el-pagination>
        </el-row>
    
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
                        value: null,
                        label: '全部',
                    },
                    {
                        value: 0,
                        label: '未领用',
                    },
                    {
                        value: 1,
                        label: '已领用',
                    },
                    
                ],
                useStateOptions: [
                    {
                        value: null,
                        label: '全部',
                    },
                    {
                        value: 0,
                        label: '未使用',
                    },
                    {
                        value: 1,
                        label: '已使用',
                    },
    
                ],
                
                fileUrl: `${settings.URL}/api/uploadFile`,
                multipleSelection: [],  // 全选后的值
                page: {
                    batchId: null,
                    page: 1,
                    size: 10,
                    received: null, // 领用状态
                    used: null,     // 使用状态
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
                showBtnForNew: true,
                isShowSendCoupon: false,
                isShowImportCoupon: false,
                dialogConfirm: false,
                couponIdList: [],
                delObj: {
                    couponId: '',     // 要删除的券的id （多个的时候用逗号隔开）
                },
                isPassForFile: false,
                isPassForFileCopy: false,
                batchSendData: {
                    couponBatchCode: null,
                    sendNumber: null,
                    userFile: null,
                    type: 2,
                },
                importObjData: {
                   batchId: null,
                   couponFile: null,
                }
                
            }
        },
        computed: {
            ...mapGetters([
                'merchantDetailsList',
                'detailsTotal',
            ])
        },
        created() {
            this.importObjData.batchId = this.$route.query.batchId;
            this.batchSendData.couponBatchCode = this.$route.query.couponBatchCode;
            this.page.batchId = this.$route.query.batchId;
            // 有时候全选那一列会渲染不正常（显示三个点... 而不是 正常的选项框）
            this.$nextTick(() => {
                this.getMerchanDetailstList(this.page);
            });
        },
        methods: {
            ...mapActions([
                'getMerchanDetailstList',
                'delMerchanDetails',
                'batchSendMerchant',
                'insertNewMerchant'
            ]),
            
            alertFn(title,msg,type) {
                this.$notify({
                    title: title,
                    message: msg,
                    type: type,
                });
            },
    
            searchClick() {
                this.getMerchanDetailstList(this.page);
            },
            
            chooseClick(index) {
                switch (index) {
                    case 0:
                        this.isShowSendCoupon = true;
                        break;
                    case 1:
                        this.isShowImportCoupon = true;
                        break;
                    case 2:
                        // 批量删除
                        this.dialogConfirm = true;
                        break;
                }
            },
            handleRemoveForSendCoupon(res) {
                this.showBtn = true;
                if (res.statusCode === '200') {
                    this.batchSendData.couponFile = res.data;
                }
            },
            handleSuccessForSendCoupon(res) {
                this.showBtn = false;
                if (res.statusCode === '200') {
                    this.batchSendData.userFile = res.data;
                    if(res.data.indexOf('xls') === -1 || res.data.indexOf('xlsx') === -1) {
                        this.alertFn('警告', '请上传格式正确的文件', 'warning');
                        this.isPassForFile = false;
                    } else {
                        this.isPassForFile = true;
                    }
                }
                console.debug('this.batchSendData', this.batchSendData);
            },
            handleRemoveForSendNewCoupon() {
                this.showBtnForNew = true;
                this.importObjData.couponFile = null;
            },
            handleSuccessForSendNewCoupon(res) {
                this.showBtnForNew = false;
                console.debug('res', res);
                if (res.statusCode === '200') {
                    this.importObjData.couponFile = res.data;
                    if(res.data.indexOf('xls') === -1 || res.data.indexOf('xlsx') === -1) {
                        this.alertFn('警告', '请上传格式正确的文件', 'warning');
                        this.isPassForFileCopy = false;
                    } else {
                        this.isPassForFileCopy = true;
                    }
                }
            },
            // 全选 或者 单选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                val.forEach((item) => {
                    this.couponIdList.push(item.id);
                    this.delObj.couponId = this.couponIdList.toString();
                });
            },
            // dialog 确认删除
            confirmClick() {
                this.delMerchanDetails(this.delObj)
                    .then((res)=> {
                        if(res.statusCode === '200') {
                            this.alertFn('成功', res.message, 'success');
                            this.dialogConfirm = false;
                            // 重新请求一次本页面的 列表数据
                            this.$nextTick(() => {
                                this.getMerchanDetailstList(this.page);
                            })
                        }
                    }).catch((err) => {
                        this.alertFn('失败', err.message, 'error');
                    });
            },
            // 删除
            delClick(val) {
                this.dialogConfirm = true;
                this.delObj.couponId = val;
            },
            // 批量发券的 dialog中的 确认导入
            batchSendClick() {
                if(!this.isPassForFile) {
                    this.alertFn('警告', '请上传格式正确的文件', 'error');
                    return;
                }
                if(!this.batchSendData.sendNumber) {
                    this.alertFn('警告', '请填写要发的数量', 'warning');
                    return;
                }
                if(this.batchSendData.sendNumber > 100 || this.batchSendData.sendNumber < 1) {
                    this.alertFn('警告', '发放数量不能大于100且不能小于0', 'warning');
                    return;
                }
                this.batchSendMerchant(this.batchSendData)
                    .then((res) => {
                        this.alertFn('成功', res.message, 'success');
                        this.showBtn = false;
                        this.isShowSendCoupon = false;
                    },(err) => {
                        this.alertFn('失败', err.message, 'warning');
                    })
            },
            // 导入新券的 dialog中的 确认导入
            confirmSendForImport() {
                if(!this.isPassForFileCopy) {
                    this.alertFn('警告', '请上传格式正确的文件', 'error');
                    return;
                }
                this.insertNewMerchant(this.importObjData)
                    .then((res) => {
                        this.alertFn('成功', res.message, 'success');
                        this.isShowImportCoupon = false;
                    },(err) => {
                        this.alertFn('失败', err.message, 'error');
                    });
            },
            handleSizeChange(val) {
                let self = this;
                self.page.size = val;
                self.getMerchanDetailstList(self.page);
            },
            
            handleCurrentChange(val) {
                let self = this;
                self.page.page = val;
                self.getMerchanDetailstList(self.page);
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
        .el-dialog {
            width: 450px !important;
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
