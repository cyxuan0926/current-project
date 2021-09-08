export const _searchItems = () => ({
    prisonerName: {
        type: 'input',
        label: '罪犯姓名',
        value: ''
    },
    criminalNumber: {
        type: 'input',
        label: '罪犯编号',
        value: ''
    },
    familyName: {
        type: 'input',
        label: '家属姓名',
        value: ''
    },
    familyPhone: {
        type: 'input',
        label: '家属电话号码',
        value: ''
    }
})

export const _tableCols = () => [
    {
        label: '监区',
        prop: 'prisonConfigName'
    },
    {
        label: '罪犯姓名',
        prop: 'prisonerName'
    },
    {
        label: '罪犯编号',
        prop: 'criminalNumber'
    },
    {
        label: '家属姓名',
        prop: 'familyName'
    },
    {
        label: '关系',
        prop: 'relationship'
    },
    {
        label: '家属电话号码',
        prop: 'familyPhone'
    },
    {
        label: '操作',
        align: 'center',
        slotName: 'operation'
    }
]
