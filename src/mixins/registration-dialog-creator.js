// 注册页面 对话框操作 封装的组件

import { mapGetters } from 'vuex'

import { arrayRemove } from '@/utils/helper'

export default {
  data() {
    // 授权对话框的关闭按钮
    const closeButton = {
      text: '关闭',

      attrs: {
        plain: true,

        type: 'danger'
      },
      events: {
        click: this.onCloseAuthorize
      }
    }

    // 授权对话框的返回按钮
    const goBackButton = {
      text: '返回',

      attrs: {
        plain: true
      }
    }

    return {
      goBackButton,

      // 授权对话框表单组件
      authorizeFormItems: {
        refuseRemark: {
          type: 'textarea',

          autosize: {
            minRows: 2
          },

          rules: [
            'required',
            'lengthRange-200'
          ],

          maxlength: 200,

          showWordLimit: true,

          noLabel: true,

          label: '驳回原因'
        }
      },

      buttonLoading: false,

      remarks: '身份信息错误',

      closeButton,

      // 初级审批时候初审意见表单组件
      firstLevelExamineFormItems: {
        remarks: {
          type: 'textarea',

          autosize: {
            minRows: 2
          },

          rules: [
            'required',
            'lengthRange-50'
          ],

          maxlength: 50,

          showWordLimit: true,

          noLabel: true,

          label: '初审意见'
        }
      },

      agreeText: '确定申请通过？'
    }
  },

  components: {
    // 操作列-详情组件
    'family-to-show': {
      methods: {
        renderItems(h) {
          return this.elItems.map(elItem => {
            const contents = elItem['slotName'] && this.$scopedSlots[elItem['slotName']]
              ? this.$scopedSlots[elItem['slotName']]({
                toShow: this.showData }) : this.showData[elItem['prop']]
            return h('div', {
              style: elItem.style || { width: '50%' },
              key: elItem.label + this.showData.id
            }, [h('label', `${ elItem.label }：`), h('span', contents)])
          })
        }
      },

      render(h) {
        return h('div', {
          attrs: {
            class: 'flex-dialog'
          }
        }, this.renderItems(h))
      },

      props: {
        elItems: {
          type: Array,
          default: () => []
        },

        showData: {
          type: Object,
          default: () => ({})
        }
      }
    },
    // 家属详细信息组件
    'family-detail-information': {
      template:
        `<div>
          <div v-for="(item, index) in elItems"
          :key="'id-family-detail-information-item-' + index">
            <el-row
              v-if="item.prop != 'familyRelationalInformation' && item.prop != 'familyMeetNoticeInformation' ||
              item.prop == 'familyRelationalInformation' && detailData.relationalProofUrls.length ||
              item.prop == 'familyMeetNoticeInformation' && detailData.meetNoticeUrl"
              :gutter="20"
              style="margin-bottom: 10px"
              >
              <el-col
                :class="item.definedClass"
                :style="item.definedStyles"
              >
                <label>{{ item.label }}：</label>
                <template>
                  <slot
                    :name="item.prop"
                    :scope="detailData">
                    <span>{{ detailData[item['prop']] }}</span>
                  </slot>
                </template>
              </el-col>
            </el-row>
          </div>
        </div>`,

      props: {
        elItems: {
          type: Array,
          default: () => []
        },

        detailData: {
          type: Object,
          default: () => ({})
        }
      }
    },
    // 多次复用的el-button组件
    'repetition-el-buttons': {
      template:
        `<el-row>
          <el-button
            v-for="(button, index) in buttonItems"
            v-bind="button.attrs"
            v-on="button.events"
            :key="'id-repetition-el-button-' + index">
            {{ button.text }}
          </el-button>
        </el-row>`,

      props: {
        buttonItems: {
          type: Array,
          default: () => []
        }
      }
    }
  },

  methods: {
    // 关闭对话框
    onCloseAuthorize() {},

    // 授权情况下的不同意
    onDisagreeAuthorize() {},

    // 授权情况下的同意
    onAgreeAuthorize() {},

    // 授权对话框同意情况下的确认操作
    onPassedAuthorize() {},

    // 授权对话框同意情况下的返回操作
    onAgreeAuthorizeGoBack() {},

    // 授权不同意情况下的提交操作
    onDeniedSubmit() {},

    // 授权对话框不同意情况下的返回操作
    onDisagreeAuthorizeGoBack() {},

    // 高级审批提交情况下的返回操作
    onMultistageExamineGoBack() {},

    // 高级审批提交情况下的确认操作
    onMultistageExamineSubmit() {},

    // 高级审批提交情况下的提交操作
    onMultistageExamineGoSubmit() {},

    // 批量审批 含有不同审批流的数据 同意并结束的操作
    onBatchAuthHaveDifferentProcessPassedEnd() {}
  },

  computed: {
    ...mapGetters(['isAdvancedAuditor', 'haveMultistageExamine']),

    // 授权同意情况下按钮元素
    showAgreeButtons() {
      return [
        {
          text: this.agreeText,

          attrs: {
            plain: true,
            loading: this.buttonLoading
          },

          events: {
            click: this.onPassedAuthorize
          }
        },

        { ...this.goBackButton,
          events: {
            click: this.onAgreeAuthorizeGoBack
          }
        },

        this.closeButton
      ]
    },

    // 授权不同意情况下的按钮元素
    showDisagreebuttons() {
      return [
        {
          text: '提交',

          attrs: {
            plain: true,
            loading: this.buttonLoading
          },

          events: {
            click: this.onDeniedSubmit
          }
        },

        {
          ...this.goBackButton,
          events: {
            click: this.onDisagreeAuthorizeGoBack
          }
        },

        this.closeButton
      ]
    },

    // 高级审批提交情况下的按钮元素
    showMultistageExamineButtons() {
      return [
        {
          text: '确认提交二级审批吗？',

          attrs: {
            plain: true,

            loading: this.buttonLoading
          },

          events: {
            click: this.onMultistageExamineSubmit
          }
        },

        {
          ...this.goBackButton,
          events: {
            click: this.onMultistageExamineGoBack
          }
        },

        this.closeButton
      ]
    },

     // 授权按钮元素
     authorizeButtons() {
       let items = [
        {
          text: '同意',

          attrs: {
            plain: true
          },

          events: {
            click: this.onAgreeAuthorize
          }
        },

        // 亲情家属批量审核 / 数据含有不同审批流的交互
        {
          text: '同意并结束流程',

          attrs: {
            plain: true,
            loading: this.buttonLoading
          },

          events: {
            click: this.onBatchAuthHaveDifferentProcessPassedEnd
          }
        },

        {
          text: '不同意',

          attrs: {
            plain: true
          },

          events: {
            click: this.onDisagreeAuthorize
          }
        },

        {
          text: '提交',

          attrs: {
            plain: true
          },

          events: {
            click: this.onMultistageExamineGoSubmit
          }
        },

        this.closeButton
      ]
      // 高级审核人员 or 多级审批开关关闭 or 现场探视 or 有审批流 则无需提交按钮
      if (this.isAdvancedAuditor || !this.haveMultistageExamine || this.visitsFlag || (this.toShow && this.toShow.processInstanceId)) arrayRemove(items, '提交', 'text')

      // 有流程审批的情况
      if (this.toShow && this.toShow.processInstanceId) items[0].text = `${ this.show && this.show.subTask && this.nextCheckCode ? '提交审核' : '同意' }`

      return items
     }
  }
}
