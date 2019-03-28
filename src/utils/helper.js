// import moment from 'moment'
let fillPre = (val) => {
  return `00${ val }`.slice(-2)
}

export const isEmptyObject = (options, query = []) => {
  if (!options) return false
  let result = {}
  Object.keys(options).forEach(k => {
    if (options[k] && !query.find((n) => n === k)) {
      result[k] = options[k]
    }
  })
  if (!Object.keys(result).length) return false
  return result
}

export const trimObject = (options, query = []) => {
  if (!options || !Object.keys(options).length) return false
  let result = Object.assign({}, options)
  Object.keys(options).forEach(k => {
    if (options[k] && typeof options[k] === 'string' && !query.find((n) => n === k)) {
      let reSpace = /^\s*(.*?)\s*$/
      result[k] = options[k].replace(reSpace, '$1')
    }
  })
  if (!Object.keys(result).length) return false
  return result
}

export const trimString = (str) => {
  if ([undefined, null, ''].indexOf(str) > -1) return str
  else if (typeof str === 'string') {
    let reSpace = /^\s*(.*?)\s*$/
    return str.replace(reSpace, '$1')
  }
  return str
}

export const durationFormat = (duration, { format = 'HH:mm:ss', unit = 's' }) => {
  if ([undefined, null, ''].indexOf(duration) > -1) {
    return duration
  }
  if (unit !== 's') {
    return 'unkown-unit'
  }
  duration = parseInt(duration)
  let ss, mm, hh
  ss = duration % 60
  if (unit === 's' && format === 'HH:mm:ss') {
    mm = parseInt(duration / 60) % 60
    hh = parseInt(duration / 60 / 60)
    return `${ fillPre(hh) }:${ fillPre(mm) }:${ fillPre(ss) }`
  }
  if (unit === 's' && format === 'mm:ss') {
    mm = (duration - ss) / 60
    return `${ mm >= 100 ? mm : fillPre(mm) }:${ fillPre(ss) }`
  }
}
