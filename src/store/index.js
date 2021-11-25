import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import quillEditor from './modules/quill-editor'
import literature from './modules/literature'
import coopertivePartner from './modules/coopertive-partner'
import diplomaticConsulOfficial from './modules/diplomatic-consul-official'

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
// import checkPrisonerPocketMoney from '@/views/check-prisoner-pocket-money/vuex'
import download from '@/views/download/vuex'
import infoPrisonAffairsPublic from '@/views/info-prison-affairs-public/vuex'
import meeting from '@/views/meeting/vuex'
import meetingReport from '@/views/meeting-report/vuex'
import noPage from './modules/no-page'
import websocket from './modules/websocket'
import jail from '@/views/jail/vuex-and-service'
import layout from '@/views/layout/vuex-and-service'
import login from '@/views/login/vuex-and-service'
import trade from '@/views/trade/vuex-and-service'
import global from './modules/global'
// import checkPrisonerInsideJailsCosts from '@/views/check-prisoner-inside-jails-costs/vuex'
import checkDataImportDetails from '@/views/check-data-import-details/vuex'

import filter from './modules/filter'

import familyPhone from './modules/family-phone'

import files from './modules/file'

import ygPrisons from './modules/yg-prisons'

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
  quillEditor,
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
  // checkPrisonerPocketMoney,
  checkRegistration,
  checkVisit,
  noPage,
  websocket,
  // checkPrisonerInsideJailsCosts,
  checkDataImportDetails
)
export default new Vuex.Store({
  actions,
  mutations,
  getters,
  state,
  modules: {
    account,
    jail,
    layout,
    literature,
    login,
    global,
    trade,
    coopertivePartner,
    diplomaticConsulOfficial,
    familyPhone,
    files,
    ygPrisons
  }
})
