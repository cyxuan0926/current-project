<template>
  <div class="prison-charge-config inputHeight">
      <div style="margin:2px 0">
          <div class="el-form-item__content">可视电话会见配置</div>
          <el-table
            class="el-table__has__border-bottom"
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column prop="levelName" label="管教级别">
            </el-table-column>
            <el-table-column prop="accessTime" label="通话次数(次/月)">
              <template slot-scope="scope">
                <span v-if="scope.row.isEditPropertyShow">
                  <el-input
                    type="number"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    :min="0"
                    @blur="changeTimes(scope.row)"
                    v-model="scope.row.accessTime"
                    size="mini"
                  >
                    <template slot="append">/次</template>
                  </el-input>
                </span>
                <span v-else>{{ scope.row.accessTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.isEditPropertyShow"
                  type="primary"
                  size="mini"
                  
                  @click="editProperty(scope.row, scope.$index)"
                  >编辑</el-button
                >
                <div v-else>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    style="margin-right:16px;"
                    @click="saveProperty(scope.row, scope.$index, 1)"
                    >保存</el-button
                  >
                  <el-button
                    size="mini"
                    style="margin-right:16px;"
                    @click="saveProperty(scope.row, scope.$index, 2)"
                    >取消</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      
  </div>
</template>

<script>

import http from '@/service'
import Moment from 'moment'
import { faceRecognitionValues } from "@/common/constants/const"
export default {
  data() {
    const oneTimeDay = Moment().add(1, "day").format("YYYY-MM-DD");
    return {
      tabs: "information",
      dialogVisible: false,
      params: false,
      abnormalCallDuration: 300,
      autoAuthorizeMeeting: true,
      regAutoAudit: false,
      abnormalCallDurationSwitch: true,
      multistageExamine: false,
      maxDuration: 0,
      oneTimeDay,
      tableData: [],
      configurationsFamilyPhoneList: [],
      faceRecognitionValues,
    };
  },

  mounted() {
    this.getdata();
  },

  computed: {},
  methods: {
    handleClick(row, type) {},
    changeTimes(row, type) {
      if (type == 2) {
        if (parseFloat(this.ruleForm[row]) < 0) {
          this.$set(this.ruleForm, row, 0);
        }
        if (parseFloat(this.ruleForm[row]) > parseFloat(this.maxDuration)) {
          this.$set(this.ruleForm, row, this.maxDuration);
          this.$message.error("填写通话时长分钟数不能大于管教级别分钟数！！");
        }
      } else {
        if (row.duration < 0) {
          row.duration = 0;
        }
      }
    },
    // 修改可视电话属性
    editProperty(row, index, type) {
      // isEditPropertyShow为ture展示输入框
      this.$set(this.tableData[index], "isEditPropertyShow", true);
    },
    // 保存可视电话修改参数配置
    async saveProperty(row, index, type) {
      if (type == 2){
        this.getdata();
      }else{
        if (this.tableData[index].accessTime) {
        this.$set(this.tableData[index], "isEditPropertyShow", false);
         let data = {
            jailId: JSON.parse(localStorage.getItem("user")).jailId,
            level: row.level,
            accessTime: row.accessTime,
          };
          let res = await http.setConfigurationsFamilyMeeting(data);
          if (!res) return;
          this.getdata();
          }else{
          this.$message.error("请填写通话次数！！");
          }
      }
    },
    async getdata() {
      let res = await http.getConfigurationsFamilyMeeting({
        jailId: this.$route.params.id
      });
      if (!res) return;
      res.data.forEach((item) => {
        item.isEditPropertyShow = false;
      });
      this.tableData = res.data;
    },
    async mounted() {
      this.getdata();
    },
    
    changeTimes() {
      if (this.abnormalCallDuration > 600) {
        this.abnormalCallDuration = 600;
      }
      if (this.abnormalCallDuration < 10) {
        this.abnormalCallDuration = 10;
      }
    },
    
  },
};
</script>
<style lang="stylus">
.inputHeight .el-input--mini .el-input__inner {
    height: 28px;
    line-height: inherit;
}
</style>

<style lang="scss" scoped>

.fontMargin{
  font-size: 12px;
  margin-left: 50px;
  span{
    margin-left: 20px;
  }
}

.prison-charge-config {
  &-button_box {
    text-align: right;

    padding-bottom: 10px;
    /deep/ .el-button {
      padding: 8px 24px !important;
    }
  }

  &_basic-form {
    /deep/ .el-form-item {
      &.el-form-item_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }

      &.el-form-item_charge-type {
        label {
          width: auto !important;
        }

        .el-form-item__content {
          margin-left: 0px !important;
        }
      }
    }

    /deep/ .el-table {
      margin-bottom: 22px !important;
    }
  }

  &_diplomaticConsulOfficial-form {
    /deep/ .el-form-item {
      &__message-set {
        .el-form-item__content {
          width: 36.5%;
        }   
      }

      &_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }
    }
  }
}
</style>
