<template>
  <div class="main">
    <div style="margin-bottom: 10px;">审核纪录:</div>

    <div class="multistage_examine-main">
      <template v-for="(items, index) in values">
        <div class="multistage_examine-item" :key="index">
            <div :class="['detail-index', { 'border-bottom': index + 1 !== values.length }]">{{ index + 1 }}</div>

            <div :class="[ 'detail-content', { 'border-bottom': index + 1 !== values.length } ]">
              <p class="detail-message-family detail-audit">
                <span class="family-name audit-label label">审核员账号</span>

                <span class="family-nameDetail audit-value">{{ items[keys['userName']] }}</span>
              </p>

              <p class="detail-message-family item-no-bottom detail-advices">
                <span class="family-name advices-label">审核意见</span>

                <span class="family-nameDetail advices-value" >{{ items[keys['reamrks']] }}</span>
              </p>
            </div>

            <div :class="['detail-content', 'time-status', { 'border-bottom': index + 1 !== values.length } ] ">
              <p class="detail-message-family detail-audit-time">
                <span class="family-name audit-time-label">审核时间</span>

                <span class="family-nameDetail audit-time-value">{{ items[keys['createAt']] }}</span>
              </p>

              <p class="detail-message-family item-no-bottom detail-status">
                <span class="family-name status-label">申请状态</span>

                <span class="family-nameDetail status-value">{{ items[keys['status']] | multistageExamineRegistStatus }}</span>
              </p>
            </div>
          </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    values: {
      type: Array,

      default: () => []
    },

    keys: {
      type: Object,

      default: () => ({
        userName: 'userName',

        reamrks: 'reamrks',

        createAt: 'createAt',

        status: 'status'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .detail-index {
    display: flex;
    width: 12%;
    align-items:center;
    justify-content: center;
    border-right: 1px solid #E4E7ED
  }

  .detail-message {
    width: 52%;
  }

  .detail-message-family{
    display: flex;
    font-size: 12px;
    border-bottom: 1px solid #E4E7ED;
    .family-name{
      width: 83px;
      background: #F5F7FA;
      text-align: right;
      padding-right: 10px;
      border-right: 1px solid #E4E7ED;
    }
    .family-nameDetail{
      flex: 1;
      padding-left: 10px;
      border-right: 1px solid #E4E7ED
    }

  }
  .detail-content{
    flex: 1;
    font-size: 12px;
    .family-name{
      background: #F5F7FA;
      padding-right: 10px;
      text-align: right;
      border-right: 1px solid #E4E7ED;
    }
  }
.multistage_examine-main {
  display: flex;
  flex-direction: column;
  border: 1px solid #E4E7ED;
  margin-bottom: 10px;

  .multistage_examine-item {
    display: flex;
    width: 100%;
    border-left: 1px solid #E4E7ED;
  }

  .detail-content {
    flex: 1;
  }

  .label {
    background: #F5F7FA;

    border-right: 1px solid #E4E7ED;
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
    border-bottom: 1px solid #E4E7ED;
  }
}
</style>
