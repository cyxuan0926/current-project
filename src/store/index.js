import Vue from 'vue'
import Vuex from 'vuex'
import jailsInformation from './modules/jails-information'
import common from './modules/common'
import passwordModification from './modules/password-modification'
import quillEditor from './modules/quill-editor'
import downloadFile from './modules/download-file'
import uploadFile from './modules/upload-file'

import adminAdvertisement from '@/views/sadmin-advertisement/vuex'
import adminFeedback from '@/views/sadmin-feedback/vuex'
import adminLog from '@/views/sadmin-log/vuex'
import adminPrison from '@/views/sadmin-prison/vuex'
import adminPrisonArea from '@/views/sadmin-prison-area/vuex'
import adminPrisonUser from '@/views/sadmin-prison-user/vuex'
import adminTerminal from '@/views/sadmin-terminal/vuex'
import adminVersion from '@/views/sadmin-version/vuex'
import adminWhitemember from '@/views/sadmin-whitemember/vuex'
import adminRemittanceRecord from '@/views/sadmin-remittance-record/vuex'
import checkFamily from '@/views/check-family/vuex'
import checkMailbox from '@/views/check-mailbox/vuex'
import checkMeeting from '@/views/check-meeting/vuex'
import checkPrisoner from '@/views/check-prisoner/vuex'
import checkPrisonDataManagement from '@/views/check-prisoner-data/vuex'
import checkRegistration from '@/views/check-registration/vuex'
import checkVisit from '@/views/check-visit/vuex'
import checkPrisonerPocketMoney from '@/views/check-prisoner-pocket-money/vuex'
import download from '@/views/download/vuex'
import infoPrisonAffairsPublic from '@/views/info-prison-affairs-public/vuex'
import meeting from '@/views/meeting/vuex'
import meetingReport from '@/views/meeting-report/vuex'
import noPage from './modules/no-page'
import websocket from './modules/websocket'
import layout from '@/views/common/vuex-and-service'
import login from '@/views/login/vuex-and-service'
import global from './modules/global'

import filter from './modules/filter'

import 'babel-polyfill'
Vue.use(Vuex)

let actions = {}, mutations = {}, getters = {}, state = {}, merge = (...args) => {
  args.map(arg => {
    Object.assign(actions, arg.actions)
    Object.assign(mutations, arg.mutations)
    Object.assign(getters, arg.getters)
    Object.assign(state, arg.state)
  })
}

// 将对应的actions,mutations,getters,state 添加到声明的对象中
merge(
  jailsInformation,
  common,
  passwordModification,
  quillEditor,
  downloadFile,
  uploadFile,
  adminLog,
  adminFeedback,
  adminPrisonUser,
  download,
  infoPrisonAffairsPublic,
  meeting,
  meetingReport,
  filter,
  adminAdvertisement,
  adminPrison,
  adminPrisonArea,
  adminTerminal,
  adminVersion,
  adminWhitemember,
  adminRemittanceRecord,
  checkFamily,
  checkMailbox,
  checkMeeting,
  checkPrisonDataManagement,
  checkPrisoner,
  checkPrisonerPocketMoney,
  checkRegistration,
  checkVisit,
  noPage,
  websocket
)
export default new Vuex.Store({
  actions,
  mutations,
  getters,
  state,
  modules: {
    layout,
    login,
    global
  }
})
