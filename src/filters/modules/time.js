export default {
  time(seconds) {
    const hours = ~~(seconds / 3600)
    const minutes = ~~(seconds % 3600 / 60)
    const second = seconds % 3600 % 60
    let result = ''
    result += hours ? `${ hours }小时` : ''
    result += minutes ? `${ minutes }分钟` : ''
    result += second ? `${ second }秒` : ''
    return result
  },
  timeNew(seconds) {
    const hours = ~~(seconds / 3600)
    const minutes = ~~(seconds % 3600 / 60)
    const second = seconds % 3600 % 60
    let result = ''
    result += hours ? `${ hours }:` : ''
    result += minutes ? `${ minutes }:` : '0:'
    result += second ? second < 10 ? `0${ second }` : `${ second }` : '00'
    return result
  },
  handleGetIndex(index, rows, page) {
    return rows * (page - 1) + index + 1
  }
}
