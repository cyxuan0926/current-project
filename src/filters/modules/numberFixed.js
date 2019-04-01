export default {
  fixedNumber(money) {
    // 其实就是补全功能补全小数点后两位数字 toFixed(2)
    // 兼容数据类型是字符串和数字的
    // 兼容格式化之后的数据
    // 兼容负数
    if (!money) return
    let result, temp = 1
    if (typeof money === 'number') money = money.toString()
    if (money.toString().includes(',')) money = money.replace(/,/g, '')
    if (typeof money === 'string') money = Number(money)
    if (money < 0) temp = 0
    if (money) {
      if (temp === 0) money = -money
      result = money.toFixed(2)
      if (temp === 0) result = `-${ result }`
    }
    else result = money
    result = result.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    return result
  }
}
