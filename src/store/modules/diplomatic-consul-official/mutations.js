export default {
  setPageData: (state, pageData) => {
    const { registrations, total } = pageData

    state.pageData.content = registrations

    state.pageData.totalCount = total
  },

  setIsSuccessDiplomaticFirstLevelAuthorize: (state, isSuccessDiplomaticFirstLevelAuthorize) => {
    state.isSuccessDiplomaticFirstLevelAuthorize = isSuccessDiplomaticFirstLevelAuthorize
  }
}
