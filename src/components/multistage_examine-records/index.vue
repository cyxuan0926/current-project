<template>
  <div class="main">
    <div v-if="title" style="margin-bottom: 10px;">{{ title }}</div>

    <div class="multistage_examine-main">
      <template v-for="(valueItem, index) of basicValues">
        <div class="multistage_examine-item" :key="`id-basic-multistage_examine-item-${ index + Math.random() }`">
          <div :class="['detail-index', { 'border-bottom': values.length || hasSlot }]">{{ basicTitle }}</div>

          <template v-for="(item, index) of basicContentItems">
            <div
              :key="`id-detail-content-${ index + Math.random() }`"
              :class="[
                'detail-content',
                {
                  'border-bottom': values.length || hasSlot,
                  'time-status': index + 1 ===  basicContentItems.length
                },
                item['className']
              ]"
            >
              <template v-for="(pItem, iIndex) of item['pItem']['items']">
                <p
                  :key="`id-detail-message-family-${ iIndex + Math.random() }`"
                  :class="[
                    'detail-message-family',
                    {
                      'item-no-bottom': iIndex + 1 === item['pItem']['items'].length,
                      'detail-status': index + 1 ===  basicContentItems.length && iIndex + 1 === item['pItem']['items'].length
                    },
                    item['pItem']['className']
                  ]"
                >
                  <span :class="['family-name', pItem['labelClassName']]">{{ pItem['label'] }}</span>

                  <span :class="['family-nameDetail', pItem['valueClassName']]">{{
                    pItem['formater'] ?
                    (filters[pItem['formater']](valueItem[basicKeys[pItem['key']]])) :
                    valueItem[basicKeys[pItem['key']]]
                  }}</span>
                </p>
              </template>
            </div>
          </template>
        </div>
      </template>

      <template v-for="(items, indexs) in values">
        <div class="multistage_examine-item" :key="indexs">
          <div :class="['detail-index', { 'border-bottom': indexs + 1 !== values.length || hasSlot }]">{{ indexs + 1 }}</div>

          <template v-for="(item, index) of recordContentItems">
            <div
              :key="`id-detail-content-record-${ index + Math.random() }`"
              :class="[
                'detail-content',
                {
                  'border-bottom': indexs + 1 !== values.length || hasSlot,
                  'time-status': index + 1 ===  recordContentItems.length
                },
                item['className']
              ]"
            >
              <template v-for="(pItem, iIndex) of item['pItem']['items']">
                <p
                  :key="`id-detail-message-family-${ iIndex + Math.random() }`"
                  :class="[
                    'detail-message-family',
                    {
                      'item-no-bottom': iIndex + 1 === item['pItem']['items'].length,
                      'detail-status': index + 1 ===  recordContentItems.length && iIndex + 1 === item['pItem']['items'].length
                    },
                    item['pItem']['className']
                  ]"
                >
                  <span :class="['family-name', pItem['labelClassName']]">{{ pItem['label'] }}</span>

                  <span :class="['family-nameDetail', pItem['valueClassName']]">{{
                    pItem['formater'] ?
                    (filters[pItem['formater']](items[keys[pItem['key']]])) :
                    items[keys[pItem['key']]]
                  }}</span>
                </p>
              </template>
            </div>
          </template>
        </div>
      </template>

      <slot name="append" />
    </div>
  </div>
</template>
<script>
import filters from '@/filters'

export default {
  props: {
    hasSlot: {
      type: Boolean,
      default: false
    },

    values: {
      type: Array,

      default: () => []
    },

    title: {
      type: String,

      default: '审核纪录:'
    },

    keys: {
      type: Object,

      default: () => ({
        userName: 'userName',

        reamrks: 'reamrks',

        createAt: 'createAt',

        status: 'status'
      })
    },

    recordContentItems: {
      type: Array,

      default: () => ([
        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '审核员账号',
                key: 'userName'
              },

              {
                label: '审核意见',
                key: 'reamrks'
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
                label: '审核时间',
                key: 'createAt'
              },

              {
                label: '申请状态',
                key: 'status',
                formater: 'multistageExamineRegistStatus'
              }
            ]
          }
        }
      ])
    },

    basicKeys: {
      type: Object,

      default: () => ({
        familyName: 'familyName',

        remarks: 'remarks',

        relationship: 'relationship',

        criminalName: 'criminalName'
      })
    },

    basicTitle: {
      type: String,

      default: '基本信息'
    },

    basicContentItems: {
      type: Array,

      default: () => ([
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
                label: '审核内容',
                key: 'remarks'
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
                label: '关系',
                key: 'relationship'
              }
            ]
          }
        }
      ])
    },

    basicValues: {
      type: Array,

      default: () => ([])
    }
  },

  data() {
    return {
      filters
    }
  }
}
</script>

<style lang="scss" scoped>
  $border-style: 1px solid #E4E7ED;

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
