export default {
  // 获取狱务通版本信息
  getVersions(state, versionList) {
    // let versions = {}
    // versionList.versions.forEach(version => {
    //   versions[version.typeId] = versions[version.typeId] ? versions[version.typeId] : []
    //   versions[version.typeId].push({ ...version, isCheck: true })
    // })
    state.versions = versionList.versions
    // let prisonVersions = [],
    //   familyVersions = []
    // for (let version of versionList.versions) {
    //   // version.version_number = version.version_number.toString()
    //   Object.assign(version, { 'isCheck': true })
    //   if (version.typeId === 2) {
    //     prisonVersions.push(version)
    //   }
    //   else if (version.typeId === 1) {
    //     familyVersions.push(version)
    //   }
    // }
    // state.prisonVersions = prisonVersions
    // state.familyVersions = familyVersions
    // // state.versionsTotal = versionList.total[0]['COUNT(*)']
    state.versionsTotal = versionList.versionsSize
  }
}
