import date from './modules/date'
import switches from './modules/switches'
import time from './modules/time'
import storage from './modules/storage'

let filterObj = Object.assign({}, switches), filters = {}

Object.keys(filterObj).forEach(k => {
  filters[k] = (val) => {
    val = isNaN(Number(val)) ? val : Number(val)
    if (!val && (val !== 0 && val !== '0')) return
    let res = filterObj[k].find(item => {
      return item.value === val
    })
    if (!res) return `未知(${ val })`
    return res.label
  }
})

export default {
  ...filters,
  ...date,
  ...time,
  ...storage
}
