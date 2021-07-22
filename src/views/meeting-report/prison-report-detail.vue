<template>
  <el-row :gutter="0">
    <el-col :span="24">
      <m-table-new
        stripe
        :data="prisonReportDetail.meetingDetails"
        :cols="tableCols"
      >
        <template #familyId="{ row }">
          <el-button
            type="text"
            @click="showFamilyDetail(row.familyId, row.id)">
            {{ row.name | asteriskDisplay('asterisk_name') }}
          </el-button>
        </template>

        <template #duration="{ row }">{{ row.duration | time }}</template>

        <template #operation="{ row }">
          <el-button
            v-if="row.is_interrupt !== 0"
            type="text"
            @click="showCallRecords(row.meeting_details)"
          >详细内容</el-button>
        </template>

        <template #append-count>
          <p v-if="showSummary" class="table-footer">
            <span>{{ prisonReportDetail.jailName }}</span>

            <span>总通话时长：{{ prisonReportDetail.totalDuration | time }}</span>
          </p>
        </template>
      </m-table-new>
    </el-col>
  
    <el-dialog
      title="家属信息"
      :visible.sync="familyDetailVisible"
      @close="clearFamilyData"
    >
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label>姓名：</label>
            <span>{{ family.familyName }}</span>
          </el-col>

          <el-col :span="24">
            <label>关系：</label>
            <span>{{ family.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>

      <el-row
        class="row-flex"
        :gutter="20"
        justify="space-between"
        type="flex"
      >
        <el-col :span="12" class="img-idCard">
          <label>身份证正面：</label>

          <m-img-viewer
            isRequired
            :url="family.familyIdCardFront"
            title="身份证正面"
          />
        </el-col>

        <el-col :span="12" class="img-idCard">
          <label>身份证背面：</label>

          <m-img-viewer
            isRequired
            :url="family.familyIdCardBack"
            title="身份证背面"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" class="img-idCard">
          <label>关系证明图：</label>

          <m-img-viewer
            :url="family.familyRelationalProofUrl"
            title="关系证明图"
          />
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="通话记录"
      :visible.sync="callRecordsVisible"
      @close="clearCallRecords"
    >
      <el-table :data="callRecords" stripe>
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

        <el-table-column label="通话时长">
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

import { $likeName, $likePrisonerNumber } from '@/common/constants/const'

export default {
  props: {
    hasAllPrisonQueryAuth: Boolean
  },
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
    },
    tableCols() {
      let cols = [
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          minWidth: 100
        },
        {
          label: '家属姓名',
          prop: 'name',
          ...$likeName,
          desensitizationColSlotName: 'familyId'
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          ...$likeName
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          ...$likePrisonerNumber
        },
        {
          label: '总通话时间段',
          prop: 'total_time',
          width: 236
        },
        {
          label: '通话时长',
          slotName: 'duration'
        },
        {
          label: '操作',
          slotName: 'operation'
        },
        {
          label: '家属所在省',
          prop: 'province'
        },
        {
          label: '家属所在市',
          prop: 'city'
        },
        {
          isElSlots: true,
          belong: 'append',
          elSlots: [
            {
              name: 'append-count'
            }
          ]
        }
      ]
      if (!this.hasAllPrisonQueryAuth) cols.splice(0, 2)
      return cols
    }
  },
  methods: {
    ...mapActions(['getMeetingsFamilyDetail']),
    async showFamilyDetail(...args) {
      const [ familyId, meetingId ] = args
      try {
        const res = await this.getMeetingsFamilyDetail({ familyId, meetingId })

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
  height: 46px;
  padding: 0 12px;
  border-top: 1px solid #e6e6e6;
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

