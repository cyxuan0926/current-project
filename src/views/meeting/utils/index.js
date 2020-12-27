import { weeks } from '@/common/constants/const'

export const daysTransformWeeksParams = (days, config) => {
  return weeks.reduce((accumulator, currentDay) => {
    let _temp = {}

    if (days.includes(currentDay['value'])) {
      const { key } = currentDay

      _temp = {
        [key]: config[key]
      }
    }

    accumulator = {
      ...accumulator,
      ..._temp
    }

    return accumulator
  }, {})
}

export const dayTransformProp = (day) => {
  return weeks.reduce((accumulator, currentDay) => {
    let _temp = {}

    if (+day === +currentDay['value']) {
      const { key } = currentDay

      _temp = { 'key': key }
    }

    accumulator = {
      ...accumulator,
      ..._temp
    }

    return accumulator
  }, {})
}
