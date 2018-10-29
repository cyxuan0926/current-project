export default {
  getFamilyRemittance: (state, params) => {
    state.familyRemittanceRecords.contents = params.familyRemits
    state.familyRemittanceRecords.total = params.total
  }
}
