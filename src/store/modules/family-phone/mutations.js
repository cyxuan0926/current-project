export default {
  setFamiliesPaged: (state, paged) => {
    const { content, totalCount } = paged

    state.familiesPaged.content = content

    state.familiesPaged.totalCount = totalCount
  },

  setValidateFamiliesResult: (state, result) => {
    state.validateFamiliesResult = Object.assign({}, result)
  }
}
