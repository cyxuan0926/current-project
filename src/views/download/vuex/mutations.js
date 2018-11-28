export default {
  getOperations(state, params) {
    state.operations.contents = params.docs
    state.operations.total = params.docsSize
  }
}
