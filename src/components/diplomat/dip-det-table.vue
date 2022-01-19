<template>
    <div>
        <m-table-new
            :data="tableDatas.contents"
            :cols="tableCols"
            stripe
            class="mini-td-padding"
            style="width: 100%">
            <template #diplomatsName="{ row }">
              <template v-for="(n, i) in row.diplomatsName">
                <el-popover
                  :key="n.id"
                  popper-class="is-asterisk_display"
                  placement="top-start"
                  trigger="hover"
                  :content="n.name">
                  <span slot="reference">
                    <label v-if="isAdmin">{{n.name | asteriskDisplay('asterisk_name')}}</label>
                    <el-button
                      v-else
                      type="text"
                      size="small"
                      @click="handleShowInfo(n.id, row.meetingId)">{{n.name | asteriskDisplay('asterisk_name')}}</el-button>
                    <em v-if="i != row.diplomatsName.length - 1">，</em>
                  </span>
                </el-popover>
              </template>
            </template>
            <template #duration="{ row }">
                <span>{{ row.duration | time }}</span>
            </template>
            <template #operation="{ row }">
                <el-button
                    size="mini"
                    @click="handleShowRecords(row.meeting_details)">详情内容
                </el-button>
            </template>
        </m-table-new>
        <m-pagination
            ref="pagination"
            :total="tableDatas.total"
            @onPageChange="handlePageChange" />
        <el-dialog
            title="通话记录"
            :visible.sync="recordsVisible"
            @close="clearRecords"
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
                <el-table-column
                    prop="remarks"
                    label="备注" />
            </el-table>
        </el-dialog>
      <el-dialog
        title="查看信息"
        class="authorize-dialog"
        :visible.sync="show.familiesDetialInform"
        @close="closeFamilyDetail">
        <div v-if="family">
          <p>姓名:{{family.familyName}}</p>
          <p>所属机构/馆名:{{family.orgName}}</p>
          <p>身份信息:</p>
          <div class="images-box__information" style="margin-left:80px">
            <m-img-viewer
              isRequired
              :url="family.familyIdCardFront"
              label=true
              title="身份证正面"
            />
            <m-img-viewer
              isRequired
              :url="family.familyIdCardBack"
              label=true
              title="身份证背面"
            />
            <m-img-viewer
              isRequired
              :url="family.familyAvatarUrl"
              label=true
              title="人脸照片"
            />
          </div>
          <p>审批单:</p>
          <div class="images-box__information" style="margin-left:80px">
            <m-img-viewer
              :url="family.approvalImageUrl"
              title="审批单"
              :isLazy="false"
            />
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import http from '@/service'
    export default {
        props: {
            isAdmin: {
                type: Boolean,
                default: true
            },
            hasAuth: Boolean,
            tableDatas: Object
        },
        data() {
            return {
                callRecords: [],
                recordsVisible: false,
                family:null,
                show:{
                  familiesDetialInform:false
                }
            }
        },
        computed: {
            tableCols() {
                let cols = [
                    {
                        label: '省份',
                        prop: 'provinceName'
                    },
                    {
                        label: '监狱名称',
                        prop: 'jailName'
                    },
                    {
                        label: '姓名',
                        prop: 'diplomatsName',
                        slotName: 'diplomatsName'
                    },
                    {
                        label: '所在机构/馆名',
                        prop: 'orgName'
                    },
                    {
                        label: '可视电话时间段',
                        prop: 'meetingTimetimeQuantum',
                        minWidth: 160
                    },
                    {
                        label: '通话时长',
                        prop: 'duration',
                        slotName: 'duration'
                    },
                    {
                        label: '操作',
                        slotName: 'operation'
                    }
                ]
                if (!this.hasAuth) {
                    cols.splice(0, 2)
                }
                return cols
            }
        },
        methods: {
            handleShowRecords(records) {
                this.recordsVisible = true
                this.callRecords = records
            },
            handleShowInfo(...args) {
                const [ familyId, meetingId ] = args
                this.show.familiesDetialInform = true
                http.getMeetingsDiplomatsDetail({ meetingId, familyId }).then(res => {
                  if (!res.family) return
                  this.family = Object.assign({}, res.family)
                })
              },
          closeFamilyDetail() {
            this.family = {}
            this.show.familiesDetialInform = false
            if (this.meetingRefresh) this.getDatas('closeFamilyDetail')
          },
            clearRecords() {
                this.callRecords = []
            },

            handlePageChange(page, rows) {
                this.$emit('on-page', page, rows)
            }
        }
    }
</script>

<style lang="scss" scoped>
.images-box__information {
    /deep/ .el-image {
        width: 32%;
        &.img-viewer__overflow-unset {
            img {
                width: $absolutely-measure;
            }
            
        }
    }
}
</style>
