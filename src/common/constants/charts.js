export default {
    RANK_BAR_CHART: {
        grid: {
            top: 0,
            left: 30,
            right: 100,
            bottom: 0,
            containLabel: true
        },

        xAxis: {
            type: 'value',
            axisLabel: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            }
        },

        yAxis: {
            type: 'category',
            axisLabel: {
                color: '#E7E7EA',
                margin: 20
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },

        series: [
            {
                type: 'bar',
                barWidth: 10,
                itemStyle: {},
                label: {
                    show: true,
                    position: 'right',
                    fontSize: 14,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                }
            }
        ]
    },

    SOLID_CIRCLE_LINE_CHART: {
        type: 'line',
        symbol: 'circle',
        lineStyle: {},
        itemStyle: {
          borderWidth: 3
        }
    }
}
