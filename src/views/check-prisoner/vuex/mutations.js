export default {
  getPrisoners(state, params) {
    state.prisoners.contents = params.prisoners
    state.prisoners.total = params.prisonersSize
  },
  getNotification(state, params) {
    state.notification = params.notify
  },
  getNotificationFamilies(state, params) {
    state.notificationFamilies = params.families
  }
}
