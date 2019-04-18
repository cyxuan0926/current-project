import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import global from './modules/global'
import superAdmin from './modules/superAdmin'
import noPage from './modules/no-page'
import repeat from './modules/repeat'

export default Object.assign(
  admin,
  superAdmin,
  global,
  check,
  information,
  noPage,
  repeat
)
