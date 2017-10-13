<template>
    <div class="vip-card container">
        <SelectAreas :selectArea="dialogVisible" @cancel="cancelSelect" @confirm="setAreas"/>
        <el-dialog v-model="dialogImg" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    
        <el-dialog
            title="提示"
            v-model="dialogConfirm"
            size="tiny">
            <span>您确定要上线吗？？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirm = false">取 消</el-button>
                <el-button type="primary" @click="confirmClick">确 定</el-button>
            </span>
        </el-dialog>
        
        <el-dialog
            title="提示"
            v-model="dialogConfirmOff"
            size="tiny">
            <span>您确定要下线吗？？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirmOff = false">取 消</el-button>
                <el-button type="primary" @click="confirmClick">确 定</el-button>
            </span>
        </el-dialog>
        <p style="padding-bottom: 15px">活动配置/活动配置</p>
        
        <div style="display: flex;height: 36px;width: 100%;line-height: 36px;margin-bottom: 15px">
            <div style="width: 80px;">创建日期</div>
            <el-date-picker
                v-model="dataObj.dateRange"
                type="daterange"
                range-separator="—"
                @change="dateBlur"
                placeholder="选择日期范围">
            </el-date-picker>
    
            <div style="width: 80px;text-align: center">活动主题</div>
            <el-input class="el-inputs" v-model="dataObj.name" placeholder="请输入活动主题"></el-input>
            
            <div style="width: 50px;text-align: center">地区</div>
            <el-button style="width: 131px;"  @click="chooseAreaClick">请选择投放地区</el-button>
    
            <span style="width: 50px;text-align: center">状态</span>
            <el-select v-model="dataObj.status" class="select" placeholder="请选择">
                <el-option
                    v-for="item in stateOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
    
            <el-button class="btn btn-left" type="primary" @click="searchClick">查询</el-button>
            <el-button class="btn btn-right" type="primary" @click="CreateActivityClick">创建活动</el-button>
        </div>
        <el-table
            :data="activityList"
            border
        >
            <el-table-column
                prop="name"
                label="活动名称"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="activityTime"
                label="活动时间"
                align="center">
            </el-table-column>
            
            <el-table-column
                prop="picUrl"
                label="活动图片"
                align="center"
                width="80">
                <template scope="scope">
                    <img style="width:30px;height: 20px" :src= scope.row.picUrl alt="" @click="showImgClick(scope.row.picUrl)">
                </template>

            </el-table-column>
        
            <el-table-column
                prop="areaName"
                label="地区"
                align="center"
                >
            </el-table-column>
        
            <el-table-column
                prop="electricFenceId"
                align="center"
                label="电子围栏">
            </el-table-column>
    
            <el-table-column
                prop="gmtTime"
                align="center"
                label="创建时间">
            </el-table-column>
            
            <el-table-column
                prop="statusName"
                align="center"
                width="130"
                label="状态">
            </el-table-column>
        
        
            <el-table-column
                fixed="right"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" v-show="scope.row.statusName === '未上线' || scope.row.statusName === '已下线'"
                               @click="modifyClick(scope.row.activityId)">修改
                    </el-button>
                    <el-button type="text" size="small"  v-show="scope.row.statusName === '未上线' || scope.row.statusName === '已下线'"
                               @click="onlineClick(scope.row.activityId)" >上线
                    </el-button>
                    <el-button type="text" size="small" v-show="scope.row.statusName === '已上线' || scope.row.statusName === '已结束'"
                               @click="offlineClick(scope.row.activityId)">下线
                    </el-button>
                    <el-button type="text" size="small"
                               @click="detailsClick(scope.row.activityId)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import SelectAreas from '../components/SelectArea.vue'

    export default {
    components: {
        SelectAreas,
    },
    data() {
      return {
          dialogVisible: false,       // 控制是否显示 选择地址的 dialog
          dialogImg: false,           // 默认图片的 dialog 为false 不显示
          dialogConfirm: false,
          dialogConfirmOff: false,
          dialogImageUrl: '',
          cityCodeArr: [],
          timeRange: -1,
          params: {},
          page: {
              currentPage: 1,
              pageSize: 10,
          },
          // 查询时发送的对象
          dataObj: {
              dateRange: '',          // 时间范围 (传给接口的时候不能将这个字段的值传过去，(Sat Sep 16 2017 00:00:00 GMT+0800 (CST)))
              startDate: '',
              endDate: '',
              name: '',          // 活动主题
              areaCode: '',
              status: '',
              statusName: '',          // 卡状态
          },
          stateOptions: [
              {
                  value: '',
                  label: '全部',
              },
              {
                  value: 0,
                  label: '未上线',
              },
              {
                  value: 1,
                  label: '已上线',
              },
              {
                  value: 3,
                  label: '已结束',
              },
              {
                  value: 2,
                  label: '已下线',
              },
          ],
      }
    },
        computed: {
            ...mapGetters([
                'activityList',
                'recordsTotal',
            ])
        },
      created() {
        this.getActivityList(this.page);
      },
      methods: {
          ...mapActions([
              'getActivityList',
              'offlineActivity',
          ]),
    
          alertFn(title,msg,type) {
              this.$notify({
                  title: title,
                  message: msg,
                  type: type,
              });
          },
          dateBlur(val) {
              let self = this;
              // 将组件的val （年月日时分秒的时间区间）分离
              let items = val.split('—');
              // 将年月日 跟 时分秒分离
              self.dataObj.startDate = items[0];
              self.dataObj.endDate = items[1];
              self.timeRange = val;
          },
    
          chooseAreaClick() {
              this.dialogVisible = true;
          },
          cancelSelect () {
              let self = this;
              self.dialogVisible = false;
          },
          setAreas(val) {
              let self = this;
              if (!val.provinces.length) {
                  self.alertFn('提示', '请选择省份', 'info');
                  return;
              }
              // 获取cityCode
              for(let i = 0; i < val.provinces.length; i++){
                  self.cityCodeArr.push(val.provinces[i].cityCode);
              }
              self.dataObj.areaCode = self.cityCodeArr.toString();
              self.dialogVisible = false;
          },
          
          searchClick() {
              let self = this;
              self.dataObj.currentPage = 1;
              self.dataObj.pageSize = 10;
              this.getActivityList(self.dataObj);
          },
          CreateActivityClick() {
              this.$router.push('createActivity');
          },
          showImgClick(val) {
              this.dialogImageUrl = val;
              this.dialogImg = true;
          },
          handleSizeChange(val) {
              let self = this;
              self.page.pageSize = val;
              self.getAcList(self.page);
          },
          handleCurrentChange(val) {
              let self = this;
              self.page.currentPage = val;
              self.getAcList(self.page);
          },
          modifyClick(activityId) {
              
              this.$router.push({
                  path: 'editActivity',
                  query: {
                      activityId: activityId,
                      isFromWhere: 'modify'
                  }
              })
          },
          onlineClick(val) {
              this.dialogConfirm = true;
              this.params = {
                  activityId: val,
                  status: '1'
              };
              
          },
          offlineClick(val) {
              this.dialogConfirmOff = true;
              this.params = {
                  activityId: val,
                  status: 2
              };
          },
    
          confirmClick() {
              this.offlineActivity(this.params)
                  .then((res) => {
                      this.$nextTick(() => {
                          this.getActivityList(this.page);
                      });
                      this.dialogConfirm = false;
                      this.dialogConfirmOff = false;
                      this.alertFn('成功', res.msg, 'success');
                  },(err) => {
                      this.alertFn('失败', err.msg, 'error');
                  })
          },
    
          detailsClick(activityId) {
              this.$router.push({
                  path: 'editActivity',
                  query: {
                      activityId: activityId,
                      isFromWhere: 'details'
                  }
              })
          },
          // 获取活动列表
          getAcList(params) {
              this.getActivityList(params)
                  .then(() => {},(err)=> {
                      this.alertFn('登陆已失效44', err.msg, 'error');
                   })
          },
      }
    
  }
</script>

<style lang="less">

</style>
<style lang="less" scoped>
    .container {
        background: #fff;
        padding: 20px;
    }
    .grid-content {
        height:36px;
        line-height: 36px;
        display: flex;
    }
    .el-inputs {
        width: 175px !important;
    }
    .select {
        padding-left: 5px;
        width: 100px !important;
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
    .block {
        margin-bottom: 20px;
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
    .ml20 {
        margin-left: 20px;
    }
</style>
<style lang="less">
    .vip-card {
        .btn-right {
            span {
                margin-left: -6px;
            }
        }
        .el-input {
            input {
                padding-right: 0 !important;
            }
        }
    }
    
</style>
