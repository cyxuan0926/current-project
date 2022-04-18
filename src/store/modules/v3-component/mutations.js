export default {
  setUploadFile: (state, result) => {
    state.stepUploadResult = result
  },

  setValidateExcelResult: (state, result) => {
    state.stepValidateUploadResult = Object.assign({}, result)
  }
}