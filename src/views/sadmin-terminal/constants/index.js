import { getMonthTime } from '@/utils/helper'
export const tabcols = (flag) => flag ? [
    {
        label: '省份',
        prop: 'provinceName',
        width: '150px'
    },
    {
        label: '监狱名称',
        prop: 'jailName',
        width: '200px',
        showOverflowTooltip: true
    },
    {
        label: '监区',
        prop: 'prisonConfigName',
        width: '200px',
        showOverflowTooltip: true
    },
    {
        label: '终端唯一标识',
        prop: 'terminalSn',
        width: '200px'
    },
    {
        label: '版本号',
        prop: 'versionCode',
        width: '100px'
    },
    {
        label: '升级状态',
        slotName: 'status'
    },
    {
        label: '升级时间',
        prop: 'updateTime'
    }
] : [
    {
        label: '省份',
        prop: 'provinceName',
        width: '150px'
    },
    {
        label: '监狱名称',
        prop: 'jailName',
        width: '200px',
        showOverflowTooltip: true
    },
    {
        label: '设备总量（台）',
        prop: 'jailTotalEquipment'
    },
    {
        label: '已升级设备数量（台）',
        prop: 'jailUpgradeTotal'
    },
    {
        label: '未升级设备数量（台）',
        prop: 'jailNotUpgradeTotal'
    },
    {
        label: '升级比例',
        prop: 'jailUpgradePercentage'
    }
]

export const searchItems = () => ({
    terminalSn: {
        type: 'input',
        label: '唯一标识'
    },
    versionCode: {
        type: 'input',
        label: '版本号'
    },
    status: {
        type: 'select',
        label: '升级状态',
        options: [
            {
                label: '已升级',
                value: '1'
            },
            {
                label: '未升级',
                value: '0'
            }
        ]
    },
    applicationDate: {
        type: 'dateRange',
        unlinkPanels: true,
        start: 'startDate',
        end: 'endDate',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        // miss: true,
        value: getMonthTime(1)
    }
})
