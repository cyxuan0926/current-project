export default {
  ygUploadFile: (state, uploadResult) => {
    state.ygUploadResult = uploadResult
  },

  setValidateExcelResult: (state, result) => {
    state.ygPrisonValidateUploadResult = Object.assign({}, result)
  },

  setPagedYgPrisonsDataCommon: (state, data) => {
    state.pagedYgPrisonsDataCommon = Object.assign({}, data)
  }
}
