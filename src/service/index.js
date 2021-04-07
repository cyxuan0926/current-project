import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import global from './modules/global'
import superAdmin from './modules/superAdmin'
import noPage from './modules/no-page'
import repeat from './modules/repeat'
import yangguang from './modules/yangguang-api'
import bpmn from './modules/bpmn-api'
import familyPhone from './modules/family-phone'
import prisonIntranet from './modules/prison-intranet'
import mettingMessage from './modules/mettingMessage'

export default Object.assign(
  admin,
  superAdmin,
  global,
  check,
  information,
  noPage,
  repeat,
  mettingMessage,
  yangguang,
  bpmn,
  familyPhone,
  prisonIntranet
)
