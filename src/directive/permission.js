import store from '@/store'

export const permission = {
  inserted: (el, binding) => {
    const hasPermission =
      store.state.account.accountInfo &&
      store.state.account.authorities &&
      (store.state.account.authorities.includes('all') || store.state.account.authorities.some(p => p === binding.value))

    if (!hasPermission) el.parentNode.removeChild(el)
  }
}
