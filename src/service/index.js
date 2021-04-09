import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import global from './modules/global'
import superAdmin from './modules/superAdmin'
import noPage from './modules/no-page'
import repeat from './modules/repeat'
import yangguang from './modules/prison-yangguang/yangguang-api'
import bpmn from './modules/bpmn/bpmn-api'
import familyPhone from './modules/family-phone'
import prisonIntranet from './modules/prison-intranet'
import ywgkApis from './modules/ywgk-internet'

export default Object.assign(
  admin,
  superAdmin,
  global,
  check,
  information,
  noPage,
  repeat,
  yangguang,
  bpmn,
  familyPhone,
  prisonIntranet,
  ywgkApis
)
