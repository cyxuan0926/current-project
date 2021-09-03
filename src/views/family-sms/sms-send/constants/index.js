export const searItems = () => ({
    familyName: {
        type: 'input',
        label: '罪犯姓名'
    },
    familyName1: {
        type: 'input',
        label: '罪犯编号'
    },
    familyName2: {
        type: 'input',
        label: '家属姓名'
    },
    familyName3: {
        type: 'input',
        label: '家属电话号码'
    }
})

export const tableCols = () => [
    {
        label: '监区',
        prop: 'prisonArea'
    },
    {
        label: '罪犯姓名',
        prop: 'prisonArea'
    },
    {
        label: '罪犯编号',
        prop: 'prisonArea'
    },
    {
        label: '家属姓名',
        prop: 'prisonArea'
    },
    {
        label: '关系',
        prop: 'prisonArea'
    },
    {
        label: '家属电话号码',
        prop: 'prisonArea'
    },
    {
        label: '操作',
        align: 'center',
        slotName: 'operation'
    }
]
