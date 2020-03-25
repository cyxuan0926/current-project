// 现在需求就是加请求路由白名单 最简单的实现就是死板的把每个页面的主请求筛选出来加入到白名单
// 稍微优化点的 写好正则匹配
// 组件销毁(或路由切换)时候 要手动关闭提示？ 这里是个繁琐的事情？没有全局的方法？
const PATHS_UN_SHOW_SUCCESS_TIP = ['/prison_config/getPrisonConfigs']

export function showSuccessTip(url) {
  return PATHS_UN_SHOW_SUCCESS_TIP.every(path => {
    return !new RegExp(path, 'i').test(url)
  })
}
