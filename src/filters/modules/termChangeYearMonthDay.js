export default {
  termChangeYearMonthDay(...args) {
    let year, month, day

    year = +args[0] ? `${ +args[0] }年` : ''
    month = +args[1] ? `${ +args[1] }月` : ''
    day = +args[2] ? `${ +args[2] }日` : ''

    return year + month + day
  }
}
