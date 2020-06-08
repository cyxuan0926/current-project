export default {
  getRegistrations(state, params) {
    state.registrations.contents = params.registrations.map(registration => {
      registration.relationalProofUrls = []
      for (let index = 0; index < 4; index++) {
        if (index === 0 && registration.relationalProofUrl) registration.relationalProofUrls.push(registration.relationalProofUrl)
        else {
          const num = `relationalProofUrl${ index + 1 }`
          registration[num] && registration.relationalProofUrls.push(registration[num])
        }
      }
      return registration
    })
    state.registrations.total = params.total
  }
}
