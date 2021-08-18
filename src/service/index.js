import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import global from './modules/global'
import superAdmin from './modules/superAdmin'
import noPage from './modules/no-page'
import repeat from './modules/repeat'
import familyPhone from './modules/family-phone'
import bpmnApis from './modules/bpmn/bpmn-api'
import terminalApis from './modules/monitoring/terminal-api'
import yangguangApis from './modules/prison-yangguang/yangguang-api'
import heyuanApis from './modules/prison-heyuan'
import ywgkApis from './modules/ywgk-internet'
import qaUpdate from './modules/qa-update/update-api'

export default Object.assign(
  admin,
  superAdmin,
  global,
  check,
  information,
  noPage,
  repeat,
  familyPhone,
  bpmnApis,
  yangguangApis,
  heyuanApis,
  ywgkApis,
  terminalApis,
  qaUpdate
)
