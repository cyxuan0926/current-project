import { asteriskDisplayConst } from '@/common/constants/const'

// /(.{3}).{4}(.{4})/g
// 需要从第几位开始 需要隐藏的位数 结束的位数
// 现在关注的就是从第几位开始 不规范的数据/或者不是统一的数据
// 如果小于初始位置 则不做处理
// 如果大于初始位置 再考虑需要处理的*的个数
// 如果*数目小于剩下的规定的 那么就剩下的全部*
// 如果*数目正常 则剩下来的正常显示
export const asteriskDisplay = (value, common = 'asterisk_idCard', own = {}) => {
  // 强制字符串
  const stringValue = value.toString()

  const stringLength = stringValue.length

  const params = {
    ...asteriskDisplayConst[common],
    ...own
  }

  const { start, asteriskCount } = params

  // 如果小于初始位置 则不做处理
  if (stringLength <= start) return value

  let actualAsteriskCount = asteriskCount || stringLength - start, asterisks = '*', end = stringLength - actualAsteriskCount - start < 0 ? 0 : stringLength - actualAsteriskCount - start

  const regString = `(.{${ start }}).{${ actualAsteriskCount }}(.{${ end }})`

  const dynamicReg = new RegExp(regString, 'g')

  Array.apply(null, { length: actualAsteriskCount - 1 }).forEach(() => {
    asterisks += '*'
  })

  const result = value.replace(dynamicReg, `$1${ asterisks }$2`)

  return result
}
