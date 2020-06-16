export default {
  getRegistrations(state, params) {
    state.registrations.contents = params.registrations.map(registration => {
      registration.relationalProofUrls = []
      for (let index = 0; index < 4; index++) {
        if (index === 0 && registration.relationalProofUrl) registration.relationalProofUrls.push({ url: registration.relationalProofUrl })
        else {
          const num = `relationalProofUrl${ index + 1 }`
          registration[num] && registration.relationalProofUrls.push({ url: registration[num] })
        }
      }

      if (!registration.relationalProofUrls.length) {
        registration.relationalProofUrls = [
          {
            url: '',
            className: ['el-image__no-box_shadow']
          }
        ]
      }

      return registration
    })
    state.registrations.total = params.total
  }
}
