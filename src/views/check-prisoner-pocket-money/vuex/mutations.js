export default {
  getPrisonersPocketMoney(state, params) {
    state.prisonersPocketMoney.total = params.total
    state.prisonersPocketMoney.contents = params.pocketMoney
  }
}
