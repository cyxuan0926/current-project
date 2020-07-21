import cloneDeep from 'lodash/cloneDeep'
import chartOptions from '@/common/constants/charts'
export const getRankBarChart = ({ itemColor, labelColort, formatter }) => {
    let options = cloneDeep(chartOptions)
    options.itemStyle.color = itemColor
    options.series[0].label.color = labelColort
    options.series[0].label.formatter = formatter
    return options
}