import cloneDeep from 'lodash/cloneDeep'
import chartOptions from '@/common/constants/charts'
export const getRankBarChart = ({ itemColor, labelColor, formatter }) => {
    let options = cloneDeep(chartOptions.RANK_BAR_CHART)
    console.log(options)
    options.series[0].itemStyle.color = itemColor
    options.series[0].label.color = labelColor
    options.series[0].label.formatter = formatter
    return options
}

export const getSolidCircleLineChart = ({ name, color }) => {
    let options = cloneDeep(chartOptions.SOLID_CIRCLE_LINE_CHART)
    options.name = name
    options.lineStyle.color = color
    options.itemStyle.color = color
    options.itemStyle.borderColor = color
    return options
}
