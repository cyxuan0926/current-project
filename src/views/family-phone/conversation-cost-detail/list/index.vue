<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append>
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>

        <el-button
          v-if="!isSuperAdmin"
          type="primary"
          @click="onSettle"
        >结算</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <m-table-new
        class="table-new"
        stripe
        :cols="tableCols"
        :data="localTableData"
        :cell-class-name="tableCellClassName"
      >
        <template #time="{ row }">{{ row.startAt + '-' + row.endAt }}</template>

        <template #detail="{ row }">
          <el-button type="text" @click="onGetDetail(row)">详情</el-button>
        </template>

        <template #duration="{ row }">{{ row.duration | time }}</template>

        <template #releaseType="{ row, $index }">
          <template v-if="!isSuperAdmin && !row.settleAccounts">
            <div :class="[{ 'el-table-column__releaseType': isEdit[$index] }]">
              <template v-if="isEdit[$index]">
                <el-select  v-model="row.releaseType">
                  <template v-for="item in $store.state.isReleaseType">
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </template>
                </el-select>

                <el-button type="text" @click="onEditReleaseType(row, $index, 0)">保存</el-button>
              </template>

              <template v-else>
                <span>{{ row.releaseType | isReleaseType }}</span>

                <el-button type="text" @click="onEditReleaseType(row, $index, 1)">编辑</el-button>
              </template>
            </div>
          </template>

          <span v-else>{{ row.releaseType | isReleaseType }}</span>
        </template>

        <template #append-count>
          <p v-if="!isSuperAdmin & showExpense" class="table-footer">
            <span>实际结算通话总费用：</span>

            <span>{{ settleAccountsPaged.configs.expense }}元</span>
          </p>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="settleAccountsPaged.totalCount"
      @onPageChange="getDatas"
    />

    <el-dialog
      class="authorize-dialog settlement-dialog"
      title="结算"
      :visible.sync="settlementDialogVisible"
      width="46%"
    >
      <template v-for="item in settlementContents">
        <el-row :key="item.key">
          <el-col class="el-col__label" :span="9">{{ item.label }}：</el-col>

          <el-col :span="10" :offset="2">{{ settlementContentValues[item['key']] }}</el-col>
        </el-row>
      </template>

      <el-row>请问确定结算，并生成吗“监区收支明细表” 和 “罪犯批量支出表”？</el-row>

      <div slot="footer" class="button-box">
        <el-button @click="settlementDialogVisible = false">取消</el-button>

        <el-button
          type="primary"
          :loading="downloading"
          @click="onSettleSubmit"
        >确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="authorize-dialog detail-dialog"
      ref="detailDialog"
      :visible.sync="detailDialogVisible"
      title="详情"
      width="60%"
    >
      <m-multistage-records
        :title="''"
        :basicValues="multistageRecordsBasicValues"
        :basicContentItems="multistageRecordsBasicContentItems"
        :values="familyPhoneSettleAccountsDetail"
        :recordContentItems="multistageRecordsContentItems"
        :hasSlot="!isEmpty(familyPhoneSettleAccountsDetail)"
      >
        <template v-if="!isEmpty(familyPhoneSettleAccountsDetail)" #append>
          <div class="multistage_examine-item">
            <div class="detail-index border-bottom">{{ familyPhoneSettleAccountsDetail.length + 1 }}</div>

            <div class="detail-content">
              <p class="detail-message-family detail-audit">
                <span class="family-name audit-label label">通话时间</span>

                <span class="family-nameDetail audit-value">{{ videoTime }}</span>
              </p>
            </div>

            <div class="detail-content time-status">
              <p class="detail-message-family detail-advices detail-content">
                <span class="family-name advices-label">视频通话时长</span>

                <span class="family-nameDetail advices-value">{{ videoDuration }}分钟</span>
              </p>
            </div>
          </div>

          <div class="multistage_examine-item">
            <div class="detail-index border-bottom">{{ familyPhoneSettleAccountsDetail.length + 2 }}</div>

            <div class="detail-content">
              <p class="detail-message-family detail-audit">
                <span class="family-name audit-label label">通话时间</span>

                <span class="family-nameDetail audit-value">{{ audioTime }}</span>
              </p>
            </div>

            <div class="detail-content time-status">
              <p class="detail-message-family detail-advices detail-content">
                <span class="family-name advices-label">语音通话时长</span>

                <span class="family-nameDetail advices-value">{{ audioDuration }}分钟</span>
              </p>
            </div>
          </div>

          <div class="multistage_examine-item">
            <div class="detail-index">{{ familyPhoneSettleAccountsDetail.length + 3 }}</div>

            <div class="detail-content">
              <p class="detail-message-family item-no-bottom detail-audit">
                <span class="family-name audit-label label">结束原因</span>

                <span class="family-nameDetail audit-value">{{ detailRemark }}</span>
              </p>
            </div>

            <div class="detail-content time-status">
              <p class="detail-message-family item-no-bottom detail-advices detail-content">
                <span class="family-name advices-label">&nbsp;</span>

                <span class="family-nameDetail advices-value" />
              </p>
            </div>
          </div>
        </template>
      </m-multistage-records>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import Moment from 'moment'

import { tokenExcel } from '@/utils/token-excel'

import { DateFormat } from '@/utils/helper'

import isEmpty from 'lodash/isEmpty'

import cloneDeep from 'lodash/cloneDeep'

import {
  $likeName,
  $likePrisonerNumber,
  $likePhone
} from '@/common/constants/const'
export default {
  name: 'FamilyPhone_ConversationCostDetail_List',

  mixins: [prisonFilterCreator],

  data() {
    return {
      searchItems: {
        familyName: {
          type: 'input',
          label: '家属姓名'
        },

        criminalName: {
          type: 'input',
          label: '罪犯姓名'
        },

        criminalNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        releaseType: {
          type: 'select',
          label: '是否出狱',
          options: this.$store.state.isReleaseType
        },

        meetingTime: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'meetingStartDate',
          end: 'meetingEndDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          pickerOptions: {
            disabledDate: time => {
              return (time.getTime() + 24 * 3600 * 1000) > Date.now()
            }
          }
        },

        settleAccounts: {
          type: 'select',
          label: '是否结算',
          options: this.$store.state.isSettleAccounts
        },

        time: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          startPlaceholder: '结算开始时间',
          endPlaceholder: '结算结束时间'
        }
      },

      downloading: false,

      settlementDialogVisible: false,

      settlementContents: [
        {
          label: '结算通话开始日期',
          key: 'startDate'
        },

        {
          label: '结算通话结束日期',
          key: 'endDate'
        },

        {
          label: '本次结算通话次数',
          key: 'number'
        },

        {
          label: '本次出狱人员的通话次数',
          key: 'releaseNumber'
        },

        {
          label: '本次结算总费用',
          key: 'expenseAll'
        },

        {
          label: '本次出狱人员通话的费用',
          key: 'releaseExpense'
        },

        {
          label: '本次实际结算的费用',
          key: 'expense'
        }
      ],

      settlementContentValues: {},

      isEdit: [],

      detailDialogVisible: false,

      multistageRecordsBasicValues: [],

      multistageRecordsBasicContentItems: [
        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '家属姓名',
                key: 'familyName'
              },

              {
                label: '终端号',
                key: 'terminalNumber'
              }
            ]
          }
        },

        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '罪犯姓名',
                key: 'criminalName'
              },

              {
                label: ' ',
                key: 'key'
              }
            ]
          }
        }
      ],

      multistageRecordsContentItems: [
        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '呼叫时间',
                key: 'startTime'
              }
            ]
          }
        },

        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '呼叫状态',
                key: 'status',
                formater: 'conversationCostDetailStatus'
              }
            ]
          }
        }
      ],

      detailRemark: '',

      videoDuration: '',

      videoTime: '',

      audioDuration: '',

      audioTime: '',

      localTableData: []
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin', 'isPrisonInternetGetUrlWay']),

    ...mapState('familyPhone', ['settleAccountsPaged', 'familyPhoneSettleAccountsDetail']),

    tableCols() {
      const cols = [
        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber',
          ...$likePrisonerNumber
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName',
          ...$likeName
        },
        {
          label: '家属姓名',
          prop: 'familyName',
          ...$likeName
        },
        {
          label: '家属电话',
          prop: 'familyPhone',
          ...$likePhone
        },
        {
          label: '总通话时间段',
          slotName: 'time',
          minWidth: 220
        },
        {
          label: '详情',
          slotName: 'detail',
          width: 60
        },
        {
          label: '通话时长',
          slotName: 'duration'
        },
        {
          label: '通话总费用(元)',
          prop: 'expense'
        },
        {
          label: '是否出狱',
          slotName: 'releaseType',
          width: 130,
          prop: 'releaseType'
        },
        {
          label: '结算时间',
          prop: 'settleTime',
          width: 120
        }
      ], onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provincesName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      else return [ ...cols, {
        isElSlots: true,
        belong: 'append',
        elSlots: [
          {
            name: 'append-count'
          }
        ]
      }]
    },

    apiUrls() {
      const urls = {
        pagedUrl: this.isSuperAdmin ? '/msg/settleAccounts/findPage' : '/msg/settleAccounts/findDetailPage',

        exportUrl: this.isSuperAdmin ? '/settleAccounts/export' : '/msg/settleAccounts/exportDetailExcel'
      }

      return urls
    },

    hasSettlements() {
      const { configs } = this.settleAccountsPaged, { settleIds } = configs

      return settleIds && Array.isArray(settleIds) && settleIds.length
    },

    showExpense() {
      return this.settleAccountsPaged.content && this.settleAccountsPaged.content.length && this.hasSettlements
    }
  },

  methods: {
    ...mapActions('familyPhone', [
      'getFamilyPhoneSettleAccounts',
      'getFamilyPhoneSettleAccountsDetail',
      'editFamilyPhoneSettleAccountsRelease',
      'settleFamilyPhoneSettleAccounts',
      'exportFamilyPhoneSettleAccounts'
    ]),

    async getDatas() {
      const inputs = {
        url: this.apiUrls['pagedUrl'],

        params: {
          ...this.filter,
          ...this.pagination
        },

        isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
      }

      await this.getFamilyPhoneSettleAccounts(inputs)

      if (!this.isSuperAdmin) {
        const { totalCount } = this.settleAccountsPaged

        this.isEdit = new Array(+totalCount).fill(false)
      }

      const { content } = this.settleAccountsPaged

      this.localTableData = cloneDeep(content)
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    tableCellClassName({row, column}) {
      const { property } = column,
      redColumns = ['expense', 'releaseType'],
      { releaseType } = row

      if (property && redColumns.includes(property) && releaseType) return 'red'
    },

    async onDownloadExcel(
      e,
      actionName = 'familyPhone/exportFamilyPhoneSettleAccounts',
      params = {
        url: this.apiUrls['exportUrl'],
        params: this.filter,
        isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
      },
      menuName = `亲情电话通话费用详情表-${ DateFormat(Date.now(),'YYYYMMDDHHmmss') }`
    ) {
      this.downloading = true

      if (this.isSuperAdmin) params['methods'] = 'get'

      const isSucess = await tokenExcel({
        params,
        actionName,
        menuName,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)

      return isSucess
    },

    async onEditReleaseType(row, index, type) {
      const { id, releaseType } = row

      if (type) this.$set(this.isEdit, index, true)

      if (!type) {
        const { content } = this.settleAccountsPaged

        const hasChanged = releaseType !== content[index]['releaseType']

        if (hasChanged) {
          const result = await this.editFamilyPhoneSettleAccountsRelease({ id, releaseType })

          if (result) this.getDatas()
        } else this.$set(this.isEdit, index, false)
      }
    },

    onSettle() {
      const { configs } = this.settleAccountsPaged,
        {
          settleIds,
          number,
          expenseAll,
          releaseNumber,
          releaseExpense,
          expense
        } = configs,
        { meetingStartDate, meetingEndDate } = this.filter

      if (!this.hasSettlements) {
        this.$message({
          message: '没有需要结算的数据！',
          type: 'warning'
        })
      } else if (this.isEdit.includes(true)) {
        this.$message({
          message: '存在是否出狱状态未编辑完的数据！',
          type: 'warning'
        })
      } else {
        this.settlementContentValues = Object.assign({} , {
          ids: settleIds,
          number,
          expenseAll,
          releaseNumber,
          releaseExpense,
          expense,
          startDate: meetingStartDate,
          endDate: meetingEndDate
        })

        this.settlementDialogVisible = true
      }
    },

    async onSettleSubmit(e) {
      const { startDate, endDate } = this.settlementContentValues

      const isSucess = await this.onDownloadExcel(
        e,
        'familyPhone/settleFamilyPhoneSettleAccounts',
        this.settlementContentValues,
        `亲情电话通话费用结算详情-${ startDate }-${ endDate }`
      )

      setTimeout(() => {
        this.settlementDialogVisible = false
      }, 500)

      if (isSucess) this.getDatas()
    },

    async onGetDetail(row) {
      const {
          id,
          familyName,
          criminalName
        } = row, inputs = {
        url: '/msg/settleAccounts/callDetail',

        params: {
          id
        },

        isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
      }

      await this.getFamilyPhoneSettleAccountsDetail(inputs)

      const terminalNumber = (this.familyPhoneSettleAccountsDetail.length && this.familyPhoneSettleAccountsDetail[0]['terminalNumber']) || ''

      this.multistageRecordsBasicValues = new Array(1).fill({
        familyName,
        criminalName,
        terminalNumber
      })

      if (this.familyPhoneSettleAccountsDetail && this.familyPhoneSettleAccountsDetail.length) {
        this.detailRemark = this.familyPhoneSettleAccountsDetail[this.familyPhoneSettleAccountsDetail.length - 1]['remarks']

        const video = this.familyPhoneSettleAccountsDetail.filter(item => item.status === 'FINISHED' && item.phoneType === '2')

        const audio = this.familyPhoneSettleAccountsDetail.filter(item => item.status === 'FINISHED' && item.phoneType === '1')

        this.audioTime = audio.length && `${audio[audio.length - 1]['startTime']} ~ ${audio[audio.length - 1]['endTime']}`

        this.videoTime = video.length && `${video[video.length - 1]['startTime']} ~ ${video[video.length - 1]['endTime']}`

        this.audioDuration = audio.length && Moment(audio[audio.length - 1]['endTime']).diff(Moment(audio[audio.length - 1]['startTime']), 'minutes')

        this.videoDuration = video.length && Moment(video[video.length - 1]['endTime']).diff(Moment(video[video.length - 1]['startTime']), 'minutes')
      }

      this.detailDialogVisible = true
    },

    isEmpty(input) {
      return isEmpty(input)
    }
  },

  async mounted() {
    this.$set(this.searchItems['meetingTime'], 'clearable', !this.isSuperAdmin)

    if (this.isSuperAdmin) {
      this.$set(this.searchItems['meetingTime'], 'value', [this.$_dateOneWeekAgo, this.$_dateNow])

      this.$refs.search.onGetFilter()
    }

    await this.getDatas()

    if (!this.isSuperAdmin) {
      const { configs } = this.settleAccountsPaged

      const { meetingEndDate = Moment().subtract(1, 'days').format('YYYY-MM-DD'), meetingStartDate } = configs

      this.$set(this.searchItems['meetingTime'], 'value', [meetingStartDate, meetingEndDate])

      this.$refs.search.onGetFilter()
    }
  }
}
</script>

<style lang="scss" scoped>
$border-style: 1px solid #E4E7ED;

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 10px 0px;
  }

  /deep/ .button-box {
    padding-bottom: 0px;
  }

  &.settlement-dialog {
    .el-row {
      padding: 10px 0px;

      .el-col__label {
        text-align: right;
      }
    }
  }
}

.table-new {
  /deep/ .el-table-column__releaseType {
    display: flex;
  }
}

.table-footer {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 12px;
  border-top: 1px solid #e6e6e6;
}

.detail-index {
  display: flex;
  width: 12%;
  align-items:center;
  justify-content: center;
  font-size: 13px;
}

.detail-message {
  width: 52%;
}

.detail-message-family {
  display: flex;
  font-size: 12px;
  border-bottom: $border-style;
  .family-name {
    width: 35%;
    background: #F5F7FA;
    text-align: right;
    padding-right: 10px;
    border-right: $border-style;
    border-left: $border-style;
  }
  .family-nameDetail {
    flex: 1;
    padding-left: 10px;
  }

}

.detail-content {
  flex: 1;
  font-size: 12px;
  .family-name {
    background: #F5F7FA;
    padding-right: 10px;
    text-align: right;
    border-right: $border-style;
  }
}

.multistage_examine-main {
  display: flex;
  flex-direction: column;
  border: $border-style;
  margin-bottom: 10px;

  .multistage_examine-item {
    display: flex;
    width: 100%;
  }

  .detail-content {
    flex: 1;
  }

  .item-no-bottom {
    border-bottom: none;
  }

  span {
    font-size: 12px;

    padding: 10px;

    display: flex;

    align-items: center;

    justify-content: center;
  }

  .time-status {
    display: flex;

    flex-direction: column;
    .detail-status {
      flex: 1;
    }
  }

  .border-bottom {
    border-bottom: $border-style;
  }
}
</style>
