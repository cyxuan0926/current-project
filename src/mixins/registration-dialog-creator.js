// 注册页面 对话框操作 封装的组件

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

      // 授权按钮元素
      authorizeButtons: [
        {
          text: '同意',

          attrs: {
            plain: true
          },

          events: {
            click: this.onAgreeAuthorize
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

        closeButton
      ],

      // 授权对话框表单组件
      authorizeFormItems: {
        refuseRemark: {
          type: 'textarea',

          autosize: {
            minRows: 2
          },

          rules: [
            'required',
            'lengthRange-15'
          ],

          maxlength: 15,

          showWordLimit: true,

          isTrim: true,

          noLabel: true,

          label: '驳回原因'
        }
      },

      buttonLoading: false,

      remarks: '身份信息错误',

      closeButton
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
          <el-row
            :gutter="20"
            v-for="(item, index) in elItems"
            :key="'id-family-detail-information-item-' + index">
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
    onDisagreeAuthorizeGoBack() {}
  },

  computed: {
    // 授权同意情况下按钮元素
    showAgreeButtons() {
      return [
        {
          text: '确定申请通过？',

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
    }
  }
}
