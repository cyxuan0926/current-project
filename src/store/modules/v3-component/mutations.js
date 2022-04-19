export default {
  setUploadFile: (state, result) => {
    state.stepUploadResult = result
  },

  setValidateExcelResult: (state, result) => {
    state.stepValidateUploadResult = Object.assign({}, result)
  },

  setPagedBasis: (state, paged) => {
    state.pagedBasis = Object.assign({}, paged)
  }
}