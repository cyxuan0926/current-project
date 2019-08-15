<template>
  <el-row :gutter="0">
    <el-col :span="24">
      <el-table 
        :data="prisonReportDetail.meetingDetails"
        border
        class="mini-td-padding td"
      >
        <el-table-column label="家属姓名">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showFamilyDetail(scope.row.familyId)"
            >
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="prisonerName" label="罪犯姓名" />
        <el-table-column prop="prisonerNumber" label="罪犯编号" />
        <el-table-column prop="total_time" label="总会见时间段" width="236px" />
        <el-table-column label="会见时长">
          <template slot-scope="scope">
            {{ scope.row.duration | time }}
          </template>
        </el-table-column> 
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_interrupt !== 0"
              type="text"
              @click="showCallRecords(scope.row.meeting_details)"
            >
              详细内容
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="家属所在省" />
        <el-table-column prop="city" label="家属所在市" />
        <p v-if="showSummary" slot="append" class="table-footer">
          <span>{{ prisonReportDetail.jailName }}</span>
          <span>
            总会见时长：{{ prisonReportDetail.totalDuration | time }}
          </span>
        </p>
      </el-table>
    </el-col>
  
    <el-dialog
      title="家属信息"
      :visible.sync="familyDetailVisible"
      @close="clearFamilyData"
    >
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label for="">姓名：</label>
            <span>{{ family.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label for="">关系：</label>
            <span>{{ family.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="row-flex" :gutter="20" justify="space-between" type="flex">
        <el-col :span="12" class="img-idCard">
          <label for="">身份证正面：</label>
          <m-img-viewer
            v-if="family.familyIdCardFront"
            :url="family.familyIdCardFront"
            title="身份证正面"/>
        </el-col>
        <el-col :span="12" class="img-idCard">
          <label for="">身份证背面：</label>
          <m-img-viewer
            v-if="family.familyIdCardBack"
            :url="family.familyIdCardBack"
            title="身份证背面"/>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" class="img-idCard">
          <label for="">关系证明图：</label>
          <m-img-viewer
            v-if="family.familyRelationalProofUrl"
            :url="family.familyRelationalProofUrl"
            title="关系证明图"/>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="通话记录"
      :visible.sync="callRecordsVisible"
      @close="clearCallRecords"
    >
      <el-table :data="callRecords" border>
        <el-table-column label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.start_time }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="会见时长">
          <template slot-scope="scope">
            {{ scope.row.duration | time }}
          </template>
        </el-table-column> 
        <el-table-column prop="remarks" label="备注" />
      </el-table>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data(){
    return {
      family: {},
      callRecords: [],
      familyDetailVisible: false,
      callRecordsVisible: false
    }
  },
  computed: {
    ...mapState({
      prisonReportDetail: state => state.prisonReportDetail,
      jailName: state => state.global.user.jailName
    }),
    showSummary() {
      const rows = this.prisonReportDetail.meetingDetails
      return rows && rows.length
    }
  },
  methods: {
    ...mapActions(['getMeetingsFamilyDetail']),
    async showFamilyDetail(familyId) {
      try {
        const res = await this.getMeetingsFamilyDetail({ id: familyId })

        if (res.family) {
          this.family = res.family
          this.familyDetailVisible = true
        } else {
          this.$message({ message: '无该家属信息', type: 'warning' })
        }
      }
      catch (err) {}
    },
    showCallRecords(records) {
      this.callRecordsVisible = true
      this.callRecords = records
    },
    clearFamilyData() {
      this.family = {}
    },
    clearCallRecords() {
      this.callRecords = []
    }
  }
}
</script>

<style lang="scss" scoped>
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 12px;
}

/deep/ .el-table td {
  padding: 4px 0;
}

/deep/ .el-dialog__body {
  padding-top: 10px;

  .el-table td{
    padding: 12px 0;
  }
}
</style>

