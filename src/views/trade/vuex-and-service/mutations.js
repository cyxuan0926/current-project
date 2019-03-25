export default {
  getAccountList(state, params) {
    state.account.contents = params.accountLedgers
    state.account.total = params.accountLedgerSize
  },
  getRechargeList(state, params) {
    state.recharge.contents = params.chargeRecords
    state.recharge.total = params.total
  },
  getConsumptionList(state, params) {
    state.consumption.contents = params.consumeRecords
    state.consumption.total = params.total
  },
  getRefundList(state, params) {
    state.refund.contents = params.refundRecords
    state.refund.total = params.total
  }
}
