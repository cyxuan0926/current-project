<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="families.contents"
        :cols="tableCols"
        class="mini-td-padding">
        <template
          slot-scope="scope"
          slot="idCard">
            <m-img-viewer
              v-if="scope.row.idCardFront"
              :url="scope.row.idCardFront"
              title="身份证正面照"/>
            <m-img-viewer
              v-if="scope.row.idCardBack"
              :url="scope.row.idCardBack"
              title="身份证背面照"/>
        </template>
        <template
          slot-scope="scope"
          slot="prisoners">
            <el-button
              v-for="prisoner in scope.row.prisonerList"
              :key="prisoner.prisonerId"
              type="text"
              size="small"
              @click="showPrisonerDetail(prisoner)">
              {{ prisoner.name }}
            </el-button>
        </template>
        <template
          slot-scope="scope"
          slot="operate">
            <el-button
              type="text"
              size="small"
              @click="getFamilyDetail(scope.row.id)">
              账号信息
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.isBlacklist"
              @click="showBlackList(scope.row)">
              加入黑名单
            </el-button>
            <el-button
              type="text"
              size="small"
              v-else
              @click="removeBlackList(scope.row)">
              移出黑名单
            </el-button>
          </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="families.total"
      @onPageChange="getDatas" />
    <el-dialog
      :title="dialogContent['title']"
      class="authorize-dialog"
      :width=" operationType === dialogTypes.BLACKLIST ? '530px' : '' "
      :visible.sync="visible"
      @close="handleCloseDialog" >
      <template v-if=" operationType === dialogTypes.DETAIL ">
        <el-row
          v-for="(item, index) in prisonerDetailRows"
          :key="`id-dialog-${ index }`">
          <el-col
            :span="12"
            v-for="(children, i) in item"
            :key="`id-dialog-child-${ i }`">
            <label for="">{{ children.label }}：</label>
            <span v-if=" children['prop'] === 'gender' ">{{ prisoner.gender | gender }}</span>
            <span v-else>{{ prisoner[children['prop']] }}</span>
          </el-col>
        </el-row>
      </template>
      <m-form
        v-else
        ref="blackListForm"
        :items="dialogContent['items']"
        @submit="handleBlackListReason"
        @cancel="visible = false" />
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
import prisons from '@/common/constants/prisons'

const prisonerDetailRows = [
  [
    {
      label: '姓名',
      prop: 'name'
    },
    {
      label: '罪名',
      prop: 'crimes'
    }
  ],
  [
    {
      label: '罪犯编号',
      prop: 'prisonerNumber'
    },
    {
      label: '监区',
      prop: 'prisonArea'
    }
  ],
  [
    {
      label: '性别',
      prop: 'gender'
    },
    {
      label: '关系',
      prop: 'relationship'
    }
  ]
]

const dialogTypes = {
  // 罪犯详情
  DETAIL: 'detail',
  // 黑名单
  BLACKLIST: 'blacklist'
}

export default {
  data() {
    const { options, belong } = prisons.PRISONAREA
    const isBlacklistOptions = [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
    return {
      searchItems: {
        name: {
          type: 'input',
          label: '家属姓名'
        },
        prisonArea: {
          type: 'select',
          label: '监区',
          options,
          belong
        },
        isBlacklist: {
          type: 'select',
          label: '黑名单',
          options: isBlacklistOptions
        }
      },
      prisoner: {},
      family: {},
      // 表格列
      tableCols: [
        {
          label: '家属姓名',
          prop: 'name'
        },
        {
          label: '身份证信息',
          slotName: 'idCard'
        },
        {
          label: '黑名单原因',
          prop: 'reason',
          showOverflowtooltip: true
        },
        {
          label: '对应罪犯',
          slotName: 'prisoners'
        },
        {
          label: '操作',
          slotName: 'operate'
        }
      ],
      // 罪犯详情信息行
      prisonerDetailRows,
      operationType: '',
      visible: false,
      dialogTypes
    }
  },
  computed: {
    ...mapState(['families']),
    dialogContent() {
      let title,
        items = {},
        formButton = { buttons: [] }
      switch(this.operationType) {
        case 'detail':
          title = '囚犯信息'
          break
        case 'blacklist':
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
            blackListReason: {
              type: 'textarea',
              noLabel: true,
              placeholder: '请输入加入黑名单理由',
              autosize: { minRows: 5 },
              rules: ['required', 'lengthRange-200'],
              label: '加入黑名单的原因'
            }
          }, formButton)
          break
        default:
          break
      }
      return {
        title,
        items
      }
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getFamilies',
      'addFamilyBlacklist',
      'removeFamilyBlacklist'
    ]),
    getDatas() {
      this.getFamilies({
        ...this.filter,
        ...this.pagination
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getFamilyDetail(e) {
      this.$router.push({
        path: `/family/detail/${ e }`
      })
    },
    showPrisonerDetail(prisoner) {
      this.prisoner = prisoner
      this.visible = true
      this.operationType = this.dialogTypes.DETAIL
    },
    showBlackList(e) {
      this.family = Object.assign({}, e)
      this.visible = true
      this.operationType = this.dialogTypes.BLACKLIST
    },
    handleBlackListReason(val) {
      let params = new FormData()
      params.append('familyId', this.family.id)
      params.append('reason', val.blackListReason)
      this.addFamilyBlacklist(params).then(res => {
        if (!res) return
        this.onSearch()
        this.handleCloseDialog()
      })
    },
    removeBlackList(e) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new FormData()
        params.append('familyId', e.id)
        this.removeFamilyBlacklist(params).then(res => {
          if (!res) return
          this.onSearch()
        })
      }).catch(() => {})
    },
    handleCloseDialog() {
      this.$refs.blackListForm && this.$refs.blackListForm.onCancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.cell img{
  width: 126.8px;
  cursor: pointer;
}
.cell {
  button{
    margin-right: 6px;
    &+button{
      margin: 5px 6px 0 0;
    }
  }
}
</style>
