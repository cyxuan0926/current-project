export default {
  getFeedbacks(state, params) {
    state.feedbacks.contents = params.feedbacks
    state.feedbacks.total = params.listSize
  },
  getFeedbackTypes(state, params) {
    state.feedbackTypes = (params.types && params.types.length) ? params.types : []
  }
}
