import { _oneMonthAgo, _dateNow } from '@/common/constants/const'

export const _searchItems = () => ({
    content: {
        type: 'input',
        label: '短信内容',
        value: ''
    },
    applicationDate: {
        type: "dateRange",
        unlinkPanels: true,
        canNotClear: false,
        start: "startDate",
        end: "endDate",
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        value: [ _oneMonthAgo, _dateNow ],
    }
})

export const _tableCols = () => [
    {
        label: '序号',
        type: 'index'
    },
    {
        label: '短信内容',
        prop: 'content',
        minWidth: '200'
    },
    {
        label: '短信发送时间',
        prop: 'createTime',
        align: 'center'
    },
    {
        label: '短信发送状态',
        prop: 'status',
        align: 'center'
    },
    {
        label: '短信发送人',
        prop: 'sender',
        align: 'center'
    }
]
