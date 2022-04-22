export default {
  setPageData: (state, pageData) => {
    const { content, totalElements } = pageData
    state.pageData.content = content
    state.pageData.totalCount = totalElements
  }
}
