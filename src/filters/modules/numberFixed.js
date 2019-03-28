export default {
  fixedNumber(money) {
    let result, temp = 1
    if (money < 0) temp = 0
    if (typeof money === 'string') money = Number(money)
    if (money) {
      if (temp === 0) money = -money
      result = money.toFixed(2)
      if (temp === 0) result = `-${ result }`
    }
    else result = money
    return result
  }
}
