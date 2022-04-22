export default {
  setLiteratures: (state, literatures) => {
    state.literatures = literatures
  },

  setLiteratureDetail: (state, literatureDetail) => {
    state.literatureDetail = literatureDetail
  },

  setCurrentOperateRows: (state, currentOperateRows) => {
    state.currentOperateRows = currentOperateRows
  },

  setSensitivewords: (state, sensitiveWords) => {
    state.sensitiveWords = sensitiveWords
  },

  setAuthors: (state, authors) => {
    state.authors = authors
  }
}
