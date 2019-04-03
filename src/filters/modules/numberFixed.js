export default {
  fixedNumber(money) {
    // 其实就是补全功能补全小数点后两位数字 toFixed(2)
    // 兼容数据类型是字符串和数字的
    // 兼容格式化之后的数据
    // 兼容负数
    let result, temp = 1
    if (typeof money === 'number' || typeof money === 'string') {
      if (typeof money === 'number') money = money.toString()
      if (money.toString().includes(',')) money = money.replace(/,/g, '')
      money = Number(money)
      if (money) {
        if (money < 0) {
          money = -money
          temp = 0
        }
        result = money.toFixed(2)
        if (temp === 0) result = `-${ result }`
      }
      else result = money
    }
    else result = 0
    result = result.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    return result
  }
}
