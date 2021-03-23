<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-export
      v-if="hasAllPrisonQueryAuth && selectPrisoners.length > 0"
      :filename="prisonerExcelConfig.filename"
      :jsonData="selectPrisoners"
      :header="prisonerExcelConfig.header"
      :filterFields="prisonerExcelConfig.filterFields"
      />

    <m-excel-download
      v-if="hasAllPrisonQueryAuth && selectPrisoners.length === 0 && filter.jailId"
      path="/download/exportPrisoners"
      :params="filter"
    />

    <m-search
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append>
        <el-button
          v-if="hasAllPrisonQueryAuth"
          type="primary"
          @click="onPreChangePrisonConfigs(7)"
        >转监</el-button>
      </template>
    </m-search>

    <el-row type="flex" style="margin-bottom: 10px">
      <template v-if="!hasAllPrisonQueryAuth">
        <el-button type="primary" @click="showAddPrisoner">新增</el-button>

        <el-button type="primary" @click="showDelPrionser">删除</el-button>

        <el-button type="primary" @click="onPreChangePrisonConfigs(5)">更换监区</el-button>
      </template>
    </el-row>

    <el-col :span="24" class="el-col__no-tabs__margin">
        <!-- 自己手写的 不要删了-->
        <!-- <el-table-column>
          <template
            slot="header"
            slot-scope="scope">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="allSelectionvalue"
              :key="scope.$index"
              @change="handleCheckAllChange"/>
          </template>
          <template slot-scope="scope">
              <el-checkbox 
                v-model="multipleSelection[scope.$index]"
                @change="handleCheckedChange($event, scope)"/>
          </template>
        </el-table-column> -->
      <m-table-new
        stripe
        :data="prisoners.contents"
        @selection-change="handleSelectionChange"
        :cols="tableCols"
      >
        <template #accessTime="{ row }">
          <div>
            {{ row.accessTime }}
            <el-button
              v-if="!hasAllPrisonQueryAuth"
              :disabled="!row.sysFlag"
              size="small"
              type="text"
              style="margin-left: 5px;"
              @click="onTimeEdit(row, 'accessTime')"
            >修改</el-button>
          </div>
        </template>

        <template #smsNum="{ row }">
          <div>
            <span>{{ row.smsNum }}</span>

            <el-button
              v-if="!hasAllPrisonQueryAuth"
              :disabled="!row.sysFlag"
              size="small"
              type="text"
              style="margin-left: 5px;"
              @click="onTimeEdit(row, 'smsNum')"
            >修改</el-button>
          </div>
        </template>

        <template #prisonTerm="{ row }">
          <span class="separate">{{ row.prisonTermStartedAt | dateFormate }}</span>

          <span class="separate">{{ row.prisonTermEndedAt | dateFormate }}</span>
        </template>

        <template #prisonerStatus="{ row }">
          <span v-if="!row.sysFlag">删除原因：{{ row.deleteReason }}</span>

          <span v-else-if="row.isBlacklist">黑名单原因：{{ row.reason }}</span>
        </template>

        <template #families="{ row }">
          <el-button
            type="text"
            size="small"
            v-for="family in row.families"
            :key="family.id"
            style="margin-left: 0px; margin-right: 8px;"
            @click="showFamilyDetail(family)"
          >{{ family.familyName }}</el-button>
        </template>

        <template #notifyId="{ row }">
          <span :class="[
            'bold',
            { 'red' : !row.notifyId },
            { 'green' : row.notifyId }]"
          >{{ row.notifyId ? '已签订' : '未签订' }}</span>

          <el-button
            type="text"
            size="small"
            :disabled="!row.sysFlag"
            @click="handleSign(row.notifyId, row)"
          >{{ row.notifyId ? '点击查看' : '点击签约' }}</el-button>
        </template>

        <template #operations="{ row }">
          <template v-if="!hasAllPrisonQueryAuth">
            <el-button
              type="text"
              size="small"
              :disabled="!row.sysFlag"
              v-if="!row.isBlacklist"
              @click="showBlackList(row)"
            >加入黑名单</el-button>

            <el-button
              type="text"
              size="small"
              :disabled="!row.sysFlag"
              v-else
              @click="removeBlackList(row)"
            >移出黑名单</el-button>

            <el-button
              type="text"
              size="small"
              :disabled="!row.sysFlag"
              @click="onShowPrisonConfig(row, 2)"
            >更换监区</el-button>
          </template>

          <template v-else>
            <el-button
              type="text"
              size="small"
              :disabled="!row.sysFlag"
              @click="onShowPrisonConfig(row, 6)"
            >更换监狱</el-button>
          </template>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="prisoners.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :title="timesDialogTitle"
      :visible.sync="isEditTime"
      :close-on-click-modal="false"
      class="authorize-dialog"
      @open="onTimeOpen"
    >
      <el-form
        ref="form"
        :model="prisoner"
        label-width="100px"
      >
        <el-form-item label="罪犯">{{ prisoner.name }}</el-form-item>

        <el-form-item
          v-if="timesDialogType === 'accessTime'"
          label="通话次数"
          :rules="[{ required: true, message: '请输入通话次数' }]"
          prop="accessTime"
        >
          <el-input-number
            :min="0"
            v-model="prisoner.accessTime"
            controls-position="right"
            @change="onTimesChange"
          />
        </el-form-item>

        <el-form-item
          v-if="timesDialogType === 'smsNum'"
          label="短信次数"
          :rules="[{ required: true, message: '请输入短信次数' }]"
          prop="smsNum"
        >
          <el-input-number
            :min="0"
            v-model="prisoner.smsNum"
            controls-position="right"
            @change="onTimesChange"
          />
        </el-form-item>
      </el-form>

      <template slot="footer">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="onTimeClose"
        >取消</el-button>

        <el-button
          class="button-add"
          size="mini"
          @click="onTime"
        >确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="家属信息"
      class="authorize-dialog"
      :visible.sync="dialogTableVisible"
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

      <div style="margin-bottom: 10px;">家属信息:</div>

      <div class="img-box">
        <m-img-viewer
          isRequired
          :url="family.familyIdCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />

        <m-img-viewer
          isRequired
          :url="family.familyIdCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />

        <m-img-viewer
          isRequired
          :url="family.familyAvatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>

      <template v-if="family.familyRelationalProofUrl || family.familyRelationalProofUrl2 || family.familyRelationalProofUrl3 || family.familyRelationalProofUrl4">
        <div style="margin-bottom: 10px;">关系证明:</div>

        <div class="img-box">
          <m-img-viewer
            v-if="family.familyRelationalProofUrl"
            class="relation_img"
            :url="family.familyRelationalProofUrl"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl2"
            class="relation_img"
            :url="family.familyRelationalProofUrl2"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl3"
            class="relation_img"
            :url="family.familyRelationalProofUrl3"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl4"
            class="relation_img"
            :url="family.familyRelationalProofUrl4"
            title="关系证明图"
          />
        </div>
      </template>

      <template v-if="family.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box"><m-img-viewer :url="family.meetNoticeUrl" title="可视电话通知单" /></div>
      </template>
      <!-- <el-row
        class="row-flex"
        :gutter="20"
        justify="space-between"
        type="flex">
        <el-col
          :span="12"
          class="img-idCard">
          <label for="">身份证正面：</label>
          <m-img-viewer
            v-if="family.familyIdCardFront"
            :url="family.familyIdCardFront"
            title="身份证正面"/>
        </el-col>
        <el-col
          :span="12"
          class="img-idCard">
          <label for="">身份证背面：</label>
          <m-img-viewer
            v-if="family.familyIdCardBack"
            :url="family.familyIdCardBack"
            title="身份证背面" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <label for="">照片：</label>
          <m-img-viewer
            v-if="family.familyAvatarUrl"
            :url="family.familyAvatarUrl"
            title="照片"
            class="avatar" />
        </el-col>
      </el-row> -->
    </el-dialog>

    <el-dialog
      :visible.sync="notificationShow"
      class="authorize-dialog notification-dialog"
      :title="'可视电话告知书-' + notificationPrisoner.name"
      width="530px"
      @close="onCloseNotificationDialog"
    >
      <div class="el-form el-form--inline">
        <div class="el-form-item">
          <label class="el-fotm-item__label">可选家属</label>
          <div
            class="el-form-item__content"
            style="width: 100%;">
            <el-select
              placeholder="可选家属"
              v-model="notificationFamily"
              filterable
              clearable
              value-key="familyId"
              :loading="selectLoading"
              @change="onSelectChange"
            >
              <el-option
                v-for="item in notificationFamilies"
                :key="item.familyId"
                :label="item.familyName"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>

      <m-form
        ref="notification"
        :items="formItems"
        @submit="onSubmit"
        :values="notificationForm"
      />

      <!-- 有告知书图片的才显示 -->
      <div v-show="notificationForm.meetingNotificationUrl" class="notification__content">
        <label>告知书：</label>

        <m-img-viewer
          :url="notificationForm.meetingNotificationUrl"
          :isLazy="false"
          title="告知书"
        />
      </div>

      <template v-if="!notificationForm.protoNum">
        <el-row :gutter="0">
          <el-button
            class="button-add"
            size="mini"
            type="danger"
            @click="onCloseNotificationDialog"
          >取消</el-button>

          <el-button
            class="button-add"
            :loading="submitting"
            size="mini"
            @click="handleSureSign"
          >确定</el-button>
        </el-row>
      </template>

      <template v-else>
        <el-row :gutter="0">
          <el-button
            class="button-add"
            size="mini"
            @click="onCloseNotificationDialog"
          >返回</el-button>
        </el-row>
      </template>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      @close="handleCloseDialog"
      :visible.sync="visible"
      :title="dialogContent['title']"
      :class="['authorize-dialog', 'all-dialog__style', isJailOperationType ? 'change-jail__dialog' : '']"
      @open="onOpenDialog"
      width="530px"
    >
      <m-form
        v-if="!(isPrisonAreaIdType && prisonConfigs.length < 1)"
        :items="dialogContent['items']"
        @submit="handleSubmit"
        :values="dialogFormValues"
        ref="dialogForm"
        @response="onDialogFormResponse"
        @cancel="visible = false"
      />

      <div v-else style="text-align: center;color: red;font-size: 16px">没有可更换的监区</div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import validator from '@/utils'

import { prisonerExcelConfig } from '@/common/excel-config'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import prisons from '@/common/constants/prisons'

import { provinceJailLevelConfigsParamsName } from '@/common/constants/const'

import moment from 'moment'

import cloneDeep from 'lodash/cloneDeep'
// import roleAuthCreator from '@/mixins/role-auth-creator'

export default {
  mixins: [prisonFilterCreator],

  data() {
    const prisonerStatus = [
      {
        label: '正常状态',
        value: 1
      },
      {
        label: '黑名单',
        value: 2
      },
      {
        label: '已删除',
        value: 3
      }
    ]
    const notifyOptions = [
      {
        label: '已签订',
        value: 1
      },
      {
        label: '未签订',
        value: 0
      }
    ]
    const { belong } = prisons.PRISONAREA
    return {
      searchItems: {
        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        name: {
          type: 'input',
          label: '罪犯姓名'
        },
        status: {
          type: 'select',
          label: '服刑人员状态',
          options: prisonerStatus,
          value: 1
        },
        isNotify: {
          type: 'select',
          label: '可视电话告知书',
          noPlaceholder: true,
          options: notifyOptions
        },
        familyName: {
          type: 'input',
          label: '家属姓名'
        }
      },

      formItems: {
        formConfigs: {
          inline: true,
          labelPosition: 'top'
        },
        familyName: {
          type: 'input',
          label: '家属姓名',
          disabled: false,
          rules: ['required']
        },
        familyUuid: {
          type: 'input',
          label: '身份证号',
          disabled: false
        },
        familyRelationship: {
          type: 'input',
          label: '与服刑人员关系',
          disabled: false,
          rules: ['required']
        },
        protoNum: {
          type: 'input',
          label: '协议编号',
          rules: ['required']
        },
        signDate: {
          type: 'date',
          label: '签署日期',
          rules: ['required'],
          pickerOptions: {
            disabledDate: time => time.getTime() > Date.now()
          }
        }
      },
      dialogTableVisible: false,
      family: {},
      isEditTime: false,
      prisoner: {},
      thePrisoner: {},
      notificationShow: false,
      notificationPrisoner: {},
      notificationForm: {},
      notificationFamily: {},
      selectLoading: true,
      submitting: false,
      prisonConfigData: [], // 可更换的监区数据
      visible: false, // 对话框的显示
      showReasonValue: '刑满释放', // 删除框的value
      // allSelectionvalue: false, 删除罪犯全选的控制 不要删掉
      selectPrisoners: [], // 删除的罪犯数据
      // isIndeterminate: false, // 单选框的样式控制 不要删掉
      // multipleSelection: [], // 多选数据 不要删掉
      operationType: 0, // 默认是0就是不操作 1为加入黑名单 2为更换监区 3 为新增服刑人员 4为删除服刑人员 5批量更换监区 6为转监 7为批量转监

      prisonerExcelConfig,

      dialogFormResponseValues: {},

      prisonConfigIdKey: '',

      prisonJailConfigData: [],

      dialogFormValues: {},

      changeJailButtonLoading: false,

      timesDialogType: '' // accessTime: 通话次数 smsNum; 短信次数
    }
  },
  computed: {
    ...mapState([
      'prisoners',
      'notification',
      'notificationFamilies',
      'prisonConfigs',
      'prisonConfigsMaxLevel'
    ]),

    ...mapState({
      user: state => state.global.user
    }),

    dialogContent() {
      const genderOptions = [
        {
          label: '男',
          value: 'm'
        },
        {
          label: '女',
          value: 'f'
        }
      ]

      const genderProps = {
        label: 'label',
        value: 'value'
      }

      const delReason = [
        {
          label: '刑满释放',
          value: '刑满释放'
        },
        {
          label: '已被执行',
          value: '已被执行'
        },
        {
          label: '其他',
          value: '其他'
        }
      ]

      const otherDelReasonDetail = {
        contents: {
          type: 'input',
          label: '删除原因',
          noLabel: true,
          placeholder: '请输入删除原因',
          rules: ['required']
        }
      }

      const changePrisonConfigsProps = {
        label: 'name',
        value: 'id'
      }

      const dissMissConfigs = provinceJailLevelConfigsParamsName.slice(3)

      const changePrisonDissMissConfigs = provinceJailLevelConfigsParamsName.slice(2)

      const filterable = true

      let title,
        items = {},
        formButton = { buttons: [] }
      switch(this.operationType) {
        case 1:
          title = '加入黑名单'
          formButton.buttons = [
            {
              add: 'add',
              text: '确认'
            },
            {
              cancel: 'cancel',
              type: 'danger'
            }
          ]
          items = Object.assign({},{
            reason: {
              type: 'textarea',
              maxlength: 200,
              showWordLimit: true,
              noLabel: true,
              placeholder: '请输入加入黑名单理由',
              autosize: { minRows: 5 },
              rules: [
                'required',
                'lengthRange-200'
              ],
              label: '加入黑名单的原因'
            }
          }, formButton)
          break
        case 5:
        case 2:
          title = '更换监区'

          formButton.buttons = []

          items = Object.assign({}, {
            prisonAreaId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择监区',
              filterable,
              options: this.prisonConfigData,
              label: '监区',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData
            },

            prisonBranchId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择分监区',
              filterable,
              label: '分监区',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData
            },

            prisonBuildingId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择楼栋',
              label: '楼栋',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择楼层',
              label: '楼层',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs }, formButton)
          break
        case 3:
          title = '新增服刑人员'
          formButton.buttons = [
            'add',
            'cancel'
          ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '120px' },

            name: {
              type: 'input',
              label: '服刑人员姓名',
              rules: ['required'],
              clearable: true
            },

            prisonerNumber: {
              type: 'input',
              label: '服刑人员编号',
              rules: ['required'],
              clearable: true
            },

            prisonAreaId: {
              type: 'select',
              label: '监区',
              rules: !JSON.parse(localStorage.getItem('user')).branch_prison ? [] : ['required'],
              disabled: !JSON.parse(localStorage.getItem('user')).branch_prison,
              customClass: !JSON.parse(localStorage.getItem('user')).branch_prison ? 'input_required__show' : '',
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBranchId: {
              type: 'select',
              label: '分监区',
              rule: [{
                message: '请选择分监区',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBuildingId: {
              type: 'select',
              label: '楼栋',
              rule: [{
                message: '请选择楼栋',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              label: '楼层',
              rule: [{
                message: '请选择楼层',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            gender: {
              type: 'select',
              label: '性别',
              rules: ['required'],
              options: genderOptions,
              props: genderProps,
              value:'m'
            },

            crimes: {
              type: 'input',
              label: '犯罪事实',
              clearable: true
            },

            additionalPunishment: {
              type: 'input',
              label: '附加刑',
              clearable: true
            },

            prisonTermStartedAt: {
              type: 'date',
              label: '刑期起日',
              clearable: true,
              pickerOptions: {
                disabledDate: {
                  prop: 'prisonTermEndedAt',
                  name: 'start'
                }
              }
            },

            prisonTermEndedAt: {
              type: 'date',
              label: '刑期止日',
              clearable: true,
              pickerOptions: {
               disabledDate: {
                 prop: 'prisonTermStartedAt',
                 name: 'end'
                }
              }
            },

            originalSentence: {
              type: 'input',
              label: '原判刑期',
              clearable: true
            }
          }, { dissMissConfigs }, formButton)
          break
        case 4:
          title = '请选择删除原因'
          formButton.buttons = [
            {
              add: 'add',
              text: '确认'
            },
            'cancel'
          ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '110px' },
            deleteReason: {
              type: 'select',
              options: delReason,
              label: '原因',
              props:
              {
                label: 'label',
                value: 'label'
              },
              value: this.showReasonValue,
              func: this.handleChangeDelReason
            }
          }, formButton)
          if(this.showReasonValue === '其他') items = Object.assign({}, items, otherDelReasonDetail)
          else Reflect.deleteProperty(items, 'content')
          break
        case 6:
        case 7:
          title = '转监'

          formButton.buttons = [
            {
              cancel: true,

              className: ['prisoner-list__change-jail_button']
            },

            {
              attrs: {
                size: 'small',
                type: 'primary',
                disabled: false,
                loading: this.changeJailButtonLoading
              },

              events: {
                click: this.onChangePrisonJailOrBatch
              },

              text: '转监',

              className: ['prisoner-list__change-jail_button']
            }
          ]

          items = Object.assign({}, {
            formConfigs: {
              inline: true,
              labelPosition: 'right',
              labelWidth: 'auto'
            },

            provincesId: {
              type: 'select',
              label: '省份',
              options: this.$store.state.provincesAll,
              props: { label: 'name', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            jailId: {
              type: 'select',
              label: '监狱',
              props: { label: 'title', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonAreaId: {
              type: 'select',
              label: '监区',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBranchId: {
              type: 'select',
              label: '分监区',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBuildingId: {
              type: 'select',
              label: '楼栋',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              label: '楼层',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs: changePrisonDissMissConfigs }, formButton)
          break
        default:
          break
      }
      return { title, items }
    },

    tableCols() {
      let allCols = [
        {
          type: 'selection',
          selectable: this.handleControlSelect
        },
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        },
        {
          label: '罪犯姓名',
          prop: 'name',
          minWidth: 75,
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          showOverflowTooltip: true
        },
        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },

        {
          label: '通话次数/月',
          minWidth: 85,
          slotName: 'accessTime'
        },
        {
          label: '短信次数/月',
          minWidth: 85,
          slotName: 'smsNum'
        },
        // {
        //   label: '刑期起止',
        //   minWidth: 140,
        //   slotName: 'prisonTerm'
        // },
        {
          label: '服刑人员状态',
          minWidth: 90,
          showOverflowTooltip: true,
          slotName: 'prisonerStatus'
        },
        {
          label: '对应家属',
          slotName: 'families'
        },
        {
          label: '家属可视电话告知书',
          minWidth: 125,
          slotName: 'notifyId'
        },
        {
          label: '操作',
          slotName: 'operations'
        }
      ]
      if (this.hasAllPrisonQueryAuth) allCols.splice(11, 2)
      else allCols.splice(1, 2)
      return allCols
    },

    // 需要排除的监狱的值
    // 单个更换监狱/带有监狱搜索条件
    currentJailId() {
      return this.prisoner.jailId || this.filter.jailId || ''
    },

    currentProvincesId() {
      return (this.prisoner.provincesId) || this.filter.provincesId || this.$store.state.provincesAll[0].id
    },

    isJailOperationType() {
      const jailIdTypes = [6, 7]

      return jailIdTypes.includes(this.operationType)
    },

    isPrisonAreaIdType() {
      const prisonAreaIdType = [2, 5]

      return prisonAreaIdType.includes(this.operationType)
    },

    timesDialogTitle() {
      const titles = {
        accessTime: '修改通话次数',
        smsNum: '修改短信次数'
      }

      return titles[this.timesDialogType]
    }
  },

  watch: {
    notificationFamily: {
      handler: function(val) {
        const disabled = !!(val && val.familyId)

        const otherDisabled = !!(val && val.protoNum)

        this.formItems.familyName.disabled = disabled

        this.formItems.familyRelationship.disabled = disabled

        this.formItems.familyUuid.disabled = disabled

        this.formItems.protoNum.disabled = otherDisabled

        this.formItems.signDate.disabled = otherDisabled
      },

      deep: true,

      immediate: true
    }
  },

  async mounted() {
    // await this.handleRolePrisonArea(this.searchItems, 'prisonArea', 'belong')
    this.filter = Object.assign({}, this.filter, {
      status: 1
    })

    await this.getDatas()
  },

  methods: {
    ...mapActions([
      'getPrisoners',
      'getPrisonersAll',
      'updatePrisonerTime',
      'addPrisonerBlacklist',
      'getNotification',
      'updateNotification',
      'addNotification',
      'getNotificationFamilies',
      'getPrisonConfigs',
      'changePrisonArea',
      'removePrisonerBlacklist',
      'deletePrisonerData',
      'addPrionser',
      'changePrisonAreaBatch',
      'getPrisonAreaMaxLevel',
      'changePrisonJailOrBatch'
    ]),

    async getDatas() {
      // this.allSelectionvalue = false // 不要删除
      // await this.getPrisoners({ ...this.filter, ...this.pagination })
      // this.multipleSelection = new Array(this.prisoners.contents.length).fill(false) // 不要删除
      // this.isIndeterminate = false 不要删除
      const params = {
        ...this.filter,
        ...this.pagination
      }

      if (this.hasAllPrisonQueryAuth) this.getPrisonersAll(params)

      else this.getPrisoners(params)
    },

    onSearch(isCurrent) {
      this.$refs.pagination.handleCurrentChange(!!isCurrent ? this.pagination.page : 1)
      // this.$refs.pagination.handleCurrentChange(1)
    },

    onTimeEdit(e, type) {
      this.prisoner = Object.assign({}, e)

      this.thePrisoner = e

      this.timesDialogType = type

      this.isEditTime = true
    },

    onTimesChange(e) {
      if (!e) this.prisoner[this.timesDialogType] = 0
    },

    onTimeClose() {
      this.isEditTime = false
    },

    onTimeOpen() {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    onTime() {
      if (this.prisoner[this.timesDialogType] === this.thePrisoner[this.timesDialogType]) {
        this.isEditTime = false
        return
      }

      this.$refs.form.validate(async valid => {
        if (!valid) return

        const { id } = this.prisoner

        const params = { id, [this.timesDialogType]: this.prisoner[this.timesDialogType] }

        const urls = {
          accessTime: '/prisoners/updateAccessTime',
          smsNum: '/prisoners/updateSmsNum'
        }

        const res = await this.updatePrisonerTime({ params, url: urls[this.timesDialogType] })

        if (!res) return

        await this.onSearch(true)

        this.isEditTime = false
      })
    },

    showFamilyDetail(family) {
      this.family = family
      this.dialogTableVisible = true
    },

    // 展示黑名单对话框
    showBlackList(e) {
      this.prisoner = Object.assign({}, e)
      this.operationType = 1
      this.visible = true
    },

    removeBlackList(e) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('prisonerId', e.id)
        this.removePrisonerBlacklist(params).then(res => {
          if (!res) return
          this.onSearch(true)
        })
      }).catch(() => {})
    },

    onSelectChange(e) {
      if (e && e.familyId) {
        const { protoNum, signDate } = e

        const initSignDate = protoNum ? signDate : moment(Date.now()).format('YYYY-MM-DD')

        this.notificationForm = Object.assign({}, e, { signDate: initSignDate})
      } else {
        this.notificationForm.familyId = ''

        this.notificationForm.familyName = ''

        this.notificationForm.familyRelationship = ''

        this.notificationForm.familyUuid = ''

        this.notificationForm.meetingNotificationUrl = ''

        this.notificationForm.protoNum = ''

        this.notificationForm.signDate = ''
      }

      this.$refs.notification && this.$refs.notification.onClearValidate()
    },

    // 家属可视电话告知书 查看/签订
    handleSign(e, prisoner) {
      // e: 告知书id prisoner: 当前行信息
      // 告知书罪犯信息
      this.notificationPrisoner = prisoner

      this.selectLoading = true
      // 获取对应罪犯家属列表
      this.getNotificationFamilies({ prisonerId: prisoner.id }).then(res => {
        this.selectLoading = false
      })
      // 查看告知书
      if (e) {
        // 告知书详情
        this.getNotification({ id: e }).then(res => {
          if (!res) return
          // 表单组件初始化的数值
          this.notificationForm = this.notification

          this.notificationFamily = Object.assign({}, this.notification)

          this.notificationShow = true
        })
      } else {
        this.notificationForm = {}

        this.notificationShow = true

        this.$refs.notification && this.$refs.notification.onClearValidate()
      }
    },

    handleSureSign() {
      this.$refs.notification.onSubmit()
    },

    onSubmit(e) {
      this.submitting = true
      if (e.id) {
        this.updateNotification(e).then(res => {
          this.submitting = false
          if (!res) return
          this.notificationShow = false
        })
      } else {
        let params = Object.assign({}, {
          prisonerId: this.notificationPrisoner.id
        }, e)
        this.addNotification(params).then(res => {
          this.submitting = false
          if (!res) return
          this.notificationPrisoner.notifyId = res.id
          this.notificationShow = false
        })
      }
    },

    // 获取监狱/监区数据
    async onInitPrisonConfigs(filterParams, operationType) {
      this.operationType = operationType

      // 更换监区
      if (this.isPrisonAreaIdType) {
        await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.prisonConfigData = this.prisonConfigs.filter(val => val.name !== filterParams)
      } else {
        // 转监
        // 省份的默认初始值
        this.dialogFormValues = {
          provincesId: this.currentProvincesId
        }
      }

      this.visible = true
    },

    // dialog组件 获取ref
    onOpenDialog() {
      this.$nextTick(function() {
        const provincesIdItem = cloneDeep(this.dialogContent['items']['provincesId'])

        if (provincesIdItem) this.onGetNextLevelPrisonConfigsData(this.currentProvincesId, 'provincesId', provincesIdItem)
      })
    },

    // 展示更换监区对话框
    async onShowPrisonConfig(e, operationType) {
      let filterParams

      this.prisoner = Object.assign({}, e)

      if (this.isPrisonAreaIdType) {
        await this.getPrisonAreaMaxLevel()

        filterParams = this.prisonConfigsMaxLevel === 1 ? e.prisonArea : undefined
      }

      await this.onInitPrisonConfigs(filterParams, operationType)
    },

    // 展示删除罪犯对话框
    showDelPrionser() {
      if(!this.selectPrisoners.length) {
        this.$message({
          showClose: true,
          message: '请选择需要删除的数据！',
          type: 'warning'
        })
      } else {
        this.operationType = 4
        this.visible = true
      }
    },

    // 展示新增罪犯对话框
    async showAddPrisoner() {
      this.operationType = 3

      await this.handleRolePrisonArea(this.dialogContent['items'], 'prisonAreaId', 'props', 'add')

      this.visible = true
    },

    // 关闭对话框
    handleCloseDialog() {
     let props, configs

     if (this.isJailOperationType) {
       props = 'jailId'

       configs = {
         prisonAreaId: ''
       }
     }

     if(this.showReasonValue !== '刑满释放') this.showReasonValue = '刑满释放'

     this.onResetMulitpPrisonConfigsForm(props, configs)

     this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    },

    // 加入黑名单 新增罪犯 删除罪犯的确认操作
    handleSubmit(val) {
      // 加入黑名单
      if(this.operationType === 1) {
          let params = new FormData()
          params.append('prisonerId', this.prisoner.id)
          params.append('reason', val.reason)
          this.addPrisonerBlacklist(params).then(res => {
            if (!res) return
            this.onCloseDialogAndRefreshen()
          })
      }

      // 删除罪犯
      if(this.operationType === 4) {
        let deleteReason = val.contents || val.deleteReason, prisonerId = (this.selectPrisoners.map(val => val.id)).join(',')

        this.deletePrisonerData({deleteReason, prisonerId}).then(res => {
          if(!res) return
          this.onCloseDialogAndRefreshen()
        })
      }

      // 新增罪犯
      if(this.operationType === 3) {
        const { jailId } = JSON.parse(localStorage.getItem('user'))

        let prisonArea, temp = { jailId }

        if(JSON.parse(localStorage.getItem('user')).branch_prison) {
          // 暂时默认租户管理员
          if (this.user.role === '-1') prisonArea = (this.prisonConfigs.filter(prisonArea => prisonArea.id === val.prisonAreaId))[0].name

          // 其他角色就是本身
          else prisonArea = (JSON.parse(localStorage.getItem('user')).prisonConfigList.filter(value => value.prisonConfigId === val.prisonAreaId))[0].prisonConfigName

          temp = { jailId, prisonArea }
        }

        val = Object.assign({}, val, temp, {
          prisonConfigId: val[this.prisonConfigIdKey]
        })

        let prisonConfigs = provinceJailLevelConfigsParamsName.slice(2)

        prisonConfigs.forEach(item => {
          delete val[item]
        })

        this.addPrionser(val).then(res => {
          if(!res) return
          this.onCloseDialogAndRefreshen()
        })
      }
    },

    // 清空下面的数据并且获取下一层的数据
    async onGetNextLevelPrisonConfigsData(parentId, prop, item) {
      const otherStoresParams = {
        actionName: 'getChildPrisonConfigs',

        paramsName: {
          parentId
        }
      }

      const storesParams = {
        provincesId: {
          actionName: 'getPrisonAll',

          paramsName: {
            provincesId: parentId
          }
        },

        jailId: {
          actionName: 'getPrisonConfigs',

          paramsName: {
            jailId: parentId
          }
        },

        prisonAreaId: otherStoresParams,

        prisonBranchId: otherStoresParams,

        prisonBuildingId: otherStoresParams
      }

      this.prisonConfigIdKey = prop

      if (prop !== 'prisonLayerId') {
        let itemConfigs = {}

        const _list = provinceJailLevelConfigsParamsName.slice(provinceJailLevelConfigsParamsName.findIndex(l => l === prop) + 1)

        let setValueConfigs = []

        // 清空数据
        _list.forEach(t => {
          this.$set(this.dialogContent['items'], t, {
            ...this.dialogContent['items'][t],
            options: []
          })

          setValueConfigs.push({
            props: t,
            setValue: ''
          })
        })

        // 隐藏的选项
        _list.slice(1).forEach(t =>{
          itemConfigs = {
            ...itemConfigs,
            [t]: ''
          }
        })

        // 隐藏选项的配置
        let configs = [
          {
            value: parentId,
            itemConfigs
          }
        ]

        // 获取数据
        await this.$store.dispatch(storesParams[prop]['actionName'], storesParams[prop]['paramsName'])

        // 数据默认值
        let data = cloneDeep(this.$store.state.multiPrisonConfigs)

        // 筛选监狱数据
        if (prop === 'provincesId') data = cloneDeep(this.$store.state.prisonAll).filter(val => val.id !== this.currentJailId)

        // 监区数据
        if (prop === 'jailId') data = cloneDeep(this.prisonConfigs)

        // 如果没有数据 则隐藏该选项
        if (!data || (Array.isArray(data) && !data.length)) {
          // 没有下一层了
          // 如果只有省份 那么就禁止转监
          // 如果不是省份 那么当前自动不选择数据也是空
          if (this.isJailOperationType) {
            if (prop === 'provincesId') {
              this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
                ...this.dialogContent['items']['buttons'][1]['attrs'],
                disabled: true
              })
            } else {
              this.dialogFormResponseValues = Object.assign({}, this.dialogFormResponseValues, {
                ...itemConfigs,
                [_list[0]]: ''
              })

              this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
                ...this.dialogContent['items']['buttons'][1]['attrs'],
                disabled: !this.dialogFormResponseValues[prop]
              })
            }
          }
          const nextProp = _list[0]

          configs[0].itemConfigs = {
            ...(configs[0].itemConfigs),
            [nextProp]: ''
          }
        } else {
          if (this.isJailOperationType) {
            this.dialogFormResponseValues = Object.assign({}, this.dialogFormResponseValues, {
              ...itemConfigs,
              [_list[0]]: ''
            })

            this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
              ...this.dialogContent['items']['buttons'][1]['attrs'],
              disabled: !this.dialogFormResponseValues[_list[0]]
            })
          }
        }

        this.$set(this.dialogContent['items'], _list[0], {
          ...this.dialogContent['items'][_list[0]],
          options: data || []
        })

        // 当前元素的配置
        this.$set(this.dialogContent['items'][prop], 'configs', configs)

        this.$set(this.dialogContent['items'][prop], 'setValueConfigs', setValueConfigs)

        this.$refs['dialogForm'].radioChangeEvent(parentId, prop, item)

        this.$refs['dialogForm'].setFieldValue(parentId, prop, item)

        if (!data || (Array.isArray(data) && !data.length)) {
          if (this.isPrisonAreaIdType) {
            const prisonAreaId = this.dialogFormResponseValues[prop]

            this.handleChangePrisonConfig(prisonAreaId)
          }
        }
      } else {
        if (this.isJailOperationType) {
          this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
            ...this.dialogContent['items']['buttons'][1]['attrs'],
            disabled: !parentId
          })

          this.$refs['dialogForm'].radioChangeEvent(parentId, prop, item)

          this.$refs['dialogForm'].setFieldValue(parentId, prop, item)
        }

        if (this.isPrisonAreaIdType) this.handleChangePrisonConfig(parentId)
      }
    },

    onDialogFormResponse(values) {
      this.$nextTick(function() {
        this.dialogFormResponseValues = Object.assign({}, values)
      })
    },

    // 更换监区
    handleChangePrisonConfig(prisonAreaId) {
      if (prisonAreaId) {
        this.$confirm('若预约日期无法在新监区当日分配时间段，系统将自动取消通话申请，并以短信形式通知相关家属，请确认是否继续操作？', '提示：修改服刑人员监区后，将重新分配通话时间段，调整后会以短信形式通知相关家属', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'prisonConfigMessage'
        }).then(async () => {
          let params = {
            prisonAreaId
          }, result
          // 更换监区
          if (this.operationType === 2) {
            params = {
              ...params,
              prisonerId: this.prisoner.id,
              jailId: this.prisoner.jailId,
            }

            const { code } = await this.changePrisonArea(params)

            result = code === 200
          }

          if (this.operationType === 5) {
            const temp = this.selectPrisoners.map(prisoner => prisoner.id)

            const prisonerIds = temp.join(',')

            params = {
              ...params,
              prisonerIds
            }

            result = await this.changePrisonAreaBatch(params)
          }

          if (result) {
            setTimeout(() => {
              this.onCloseDialogAndRefreshen()
            }, 500)
          }
        }).catch(() => {
          this.onResetMulitpPrisonConfigsForm()

          this.$refs.dialogForm && this.$refs.dialogForm.handleResetField()
        })
      }
    },

    // 弹性化
    onResetMulitpPrisonConfigsForm(prop = 'prisonAreaId', configs = {}) {
      if (this.dialogContent['items'] && this.dialogContent['items'][prop]) {
        this.$set(this.dialogContent['items'][prop], 'configs', [
          {
            value: undefined,

            itemConfigs: {
              ...configs,
              prisonBranchId: '',
              prisonBuildingId: '',
              prisonLayerId: ''
            }
          }
        ])

        this.$refs['dialogForm'] && this.$refs['dialogForm'].radioChangeEvent('', prop, this.dialogContent['items'][prop])
      }
    },

    // 更换删除原因
    handleChangeDelReason(e) {
      this.showReasonValue = e
    },

    // 筛选已经删除的罪犯不可选择
    handleControlSelect(row, index) {
      return this.hasAllPrisonQueryAuth ? true : row.sysFlag
    },

    // 选择删除的罪犯
    handleSelectionChange(val) {
      this.selectPrisoners = val
    },

    // 根据角色来区分监区数据
    // 其实现在数据都是从user里面读取 暂时不修改了
    async handleRolePrisonArea(element, prop, type = 'props',operation = 'search', role = this.user.role) {
      if (role === '-1') {
        // 租户管理员
        const options = operation === 'search' ? { value: 'name', label: 'name' } : { value: 'id', label: 'name' }

        await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.$set(element[prop], 'options', this.prisonConfigs)

        this.$set(element[prop], type, options)
      } else {
        // 其他角色
        const options = operation === 'search' ? { label: 'prisonConfigName', value: 'prisonConfigName' } : { value: 'prisonConfigId', label: 'prisonConfigName' }

        this.$set(element[prop], 'options', (JSON.parse(localStorage.getItem('user')).prisonConfigList || []))

        this.$set(element[prop], type, options)
      }
    },

    // 关闭可视电话告知对话框
    onCloseNotificationDialog() {
      // 告知书家属信息
      this.notificationFamily = {}

      if (this.$refs.notification) {
        const item = {
          controlProps: [
            'familyName',
            'familyRelationship',
            'familyUuid',
            'protoNum',
            'signDate'
          ]
        }
        this.$refs.notification.selectChangeEvent('', '', item)

        this.$refs.notification.onClearValidate()
      }

      this.notificationShow = false

      this.notificationForm = {}
    },

    // 批量更换 监狱/监区
    onPreChangePrisonConfigs(operationType) {
      const word = this.hasAllPrisonQueryAuth ? '监狱' : '监区'

      if(!this.selectPrisoners.length) {
        this.$message({
          showClose: true,
          message: `请选择要更换${ word }的数据！`,
          type: 'warning'
        })
      } else {
        // 初始化数据
        // 省份/监狱是必定显示的 其余根据当前的情况来显示
        // 单个转监：初始化参数就是它本身的参数
        // 批量转监：1.搜索条件没有的 那就默认第一个的省份的第一个监狱的 2.有省份监狱等搜索条件的时候 初始化就是用这个数据 如果有监区数据那就用
        (async () => {
          this.prisoner = {}

          await this.onInitPrisonConfigs(undefined, operationType)
        })()
      }
    },

    onChangePrisonJailOrBatch() {
      this.changeJailButtonLoading = true

      const currentDialogFormResponseValues = cloneDeep(this.dialogFormResponseValues)

      this.$confirm('更换监狱后，可视电话申请都将取消，您确认更换吗？').then(async () => {
        const { jailId } = currentDialogFormResponseValues

        const { id } = this.prisoner

        const temp = this.selectPrisoners.map(prisoner => prisoner.id)

        const prisonerIds = temp.join(',')

        const requestArgs = {
          // 转监
          6: {
            url: '/prisoners/changePrisonJails',
            params: {
              jailId,
              prisonerId: id
            }
          },

          // 批量转监
          7: {
            url: '/prisoners/changePrisonJailBatch',
            params: {
              jailId,
              prisonerIds
            }
          }
        }

        const { params } = requestArgs[this.operationType]

        if (!['jailId'].includes(this.prisonConfigIdKey)) {
          requestArgs[this.operationType]['params'] = {
            ...params,
            prisonAreaId: currentDialogFormResponseValues[this.prisonConfigIdKey]
          }
        }

        const args = requestArgs[this.operationType]

        const result = await this.changePrisonJailOrBatch(args)

        this.changeJailButtonLoading = false

        if (result) {
          setTimeout(() => {
            this.onCloseDialogAndRefreshen()
          }, 500)
        }

      }).catch(() => {
        this.changeJailButtonLoading = false

        this.handleCloseDialog()
      })
    },

    onCloseDialogAndRefreshen() {
      this.handleCloseDialog()

      this.onSearch(true)
    }

    // 自定义的全选操作 不要删除
    // handleCheckAllChange(val) {
    //   if(!val) {
    //     this.deletePrisoners = []
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(false)
    //   }
    //   else {
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(true)
    //     this.deletePrisoners = this.prisoners.contents
    //   }
    //   this.isIndeterminate = false
    // },
    // 自定义的单选操作 不要删除
    // handleCheckedChange(value, scope) {
    //   const { $index, row } = scope
    //   this.$set(this.multipleSelection, $index, value)
    //   if(value) this.deletePrisoners.push(row)
    //   else this.deletePrisoners.splice(this.deletePrisoners.indexOf(row), 1)
    //   if([...new Set(this.multipleSelection)].length === 1 && [...new Set(this.multipleSelection)][0]) this.allSelectionvalue = true
    //   else this.allSelectionvalue = false
    //   this.isIndeterminate = this.deletePrisoners.length > 0 && this.deletePrisoners.length < this.prisoners.contents.length
    // }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container
  .el-dialog__body
    img
      display: block;
    img.avatar
      width: 200px
      height: 200px
.img-idCard
  min-width: 350px;
.row-flex
  flex-wrap: wrap;
// .el-button
//   &+.el-button
//     margin-left 0px !important
.only-select
  width 100%
.el-dialog__body
  padding-bottom: 20px !important
.img-box
  .el-image
    width: 32%;
    height: 110px;
    margin-bottom: 5px;
    >>> img
      width: 100%;
      height: 100%;
      cursor: pointer;
.el-image.relation_img
  width: 24% !important;
.notification__content
  display: flex;
  >>> .el-image
    height: auto;
.change-jail__dialog
  >>> .el-form
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item
      margin-right: 0px;
  >>> .button-box
    button
      width: 15% !important;
</style>
