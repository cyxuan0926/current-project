import jailsInformation from './modules/jails-information'
import lawsInformation from './modules/laws-information'
import passwordModification from './modules/password-modification'
import downloadFile from './modules/download-file'
import uploadFile from './modules/upload-file'

import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import global from './modules/global'
import superAdmin from './modules/superAdmin'
import noPage from './modules/no-page'
import repeat from './modules/repeat'

export default Object.assign(
  jailsInformation,
  lawsInformation,
  passwordModification,
  downloadFile,
  uploadFile,
  admin,
  superAdmin,
  global,
  check,
  information,
  noPage,
  repeat
)
