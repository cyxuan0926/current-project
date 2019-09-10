export default {
  props: {
    role: String,
    jailId: Number
  },
  data() {
    return {
      isGettingTableData: false,
      searchItems: {
        articleType: {
          type: 'select',
          label: '作品类型',
          options: [
            {
              articleType: '',
              articleTypeName: '全部'
            },
            {
              articleType: 1,
              articleTypeName: '互动文章'
            },
            {
              articleType: 2,
              articleTypeName: '连载小说'
            }
          ],
          belong: { value: 'articleType', label: 'articleTypeName' },
          value: ''
        },
        time: {
          type: 'datetimerange',
          start: 'publishStartDate',
          end: 'publishEndDate'
        },
        title: { type: 'input', label: '作品标题' }
      },
      /**
       * 作品状态
       * publish 已发布待审核
       * pass 已通过审核
       * reject 未通过审核
       * shelf 已下架
       */
      literatureStatus: '',
      publisher: '', // 作品发布者，1 家属发的，2 预警发的，3 审核人员发的
      totalPage: 1, // 分页数据总页数
      filter: {},
      pagination: {}
    }
  },
  watch: {
    activeTabName(val) {
      switch (val) {
        // 审核通过的作品（上架状态）
        case 'ONLINE':
          this.literatureStatus = 'pass'
          break

        // 已下架的作品
        case 'OFFLINE':
          this.literatureStatus = 'shelf'
          break

        default:
          this.literatureStatus = ''
          break
      }

      this.pagination.page = 1
      this.getTableData()
    }
  },
  created() {
    this.initSearchStatus()
    this.getTableData()
  },
  activated() {
    !this.isGettingTableData && this.getTableData()
  },
  methods: {
    initSearchStatus() {
      console.error('组件未覆盖 initSearchStatus 方法')
    },
    onSearch() {
      this.getTableData()
    },
    onPageChange() {
      this.getTableData()
    },
    getTableData() {
      console.error('组件未覆盖 getTableData 方法')
    }
  }
}
