export default {
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
        title: { type: 'input', label: '作品标题' },
        penName: { type: 'input', label: '笔名' }
      },
      filter: {},
      total: 0, // 分页数据总条数
      pagination: { page: 1, rows: 10 }
    }
  },
  computed: {
    isFamilyLiteratureChecker() {
      return this.role === 6
    },
    isPoliceLiteratureChecker() {
      return [-1, 5].includes(this.role)
    },
    isMyLiteratureChecker() {
      return this.$route.path === '/literature-my/literatures'
    },
    role() {
      return parseInt(this.$store.state.global.user.role)
    },
    /**
     * 作品状态
     * publish 已发布待审核
     * pass 已通过审核
     * reject 未通过审核
     * shelf 已下架
     */
    literatureStatus() {
      return this.activeTabName
    }
  },
  watch: {
    activeTabName() {
      this.pagination.page = 1
      this.$refs.pagination.updateCurrentPage(1)
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
  },
  activated() {
    !this.isGettingTableData && this.getTableData()
  },
  methods: {
    onSearch() {
      this.getTableData()
    },
    onPageChange() {
      this.getTableData()
    },
    async getTableData() {
      const currentOperateRows = this.$store.state.literature.currentOperateRows
      const currentTableRows = this.$store.getters['literature/currentTableRows']

      const { page, rows } = this.pagination
      const hasNextPage = this.total - page * rows > 0

      if (currentOperateRows === currentTableRows && !hasNextPage) {
        this.pagination.page = page > 1 ? page - 1 : 1
      }

      let res = {}
      const params = {
        status: this.literatureStatus,
        ...this.filter,
        ...this.pagination
      }

      this.isGettingTableData = true

      if (this.isFamilyLiteratureChecker) {
        res = await this.getFamilyLiteratures(params)
      }

      if (this.isPoliceLiteratureChecker && !this.isMyLiteratureChecker) {
        params.jailId = this.$store.state.global.user.jailId
        res = await this.getPoliceLiteratures(params)
      }

      if (this.isMyLiteratureChecker) {
        res = await this.getMyLiteratures(params)
      }

      this.total = res.data && res.data.total
      this.isGettingTableData = false
    }
  }
}
