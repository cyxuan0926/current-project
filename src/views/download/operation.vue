<template>
  <main>
    <el-card
      class="operation-card"
      shadow="hover">
      <div slot="header">
        <span>狱务通用户操作手册</span>
      </div>
      <el-table
        :data="list.contents"
        border
        width="80%">
        <el-table-column
          label="文件名称"
          prop="name" />
        <el-table-column
          label="文件大小">
          <template slot-scope="scope">
            {{ scope.row.size | storage }}
          </template>
        </el-table-column>
        <el-table-column
          label="文件日期">
          <template slot-scope="scope">
            {{ scope.row.date | Date }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <a
              class="el-button el-button--primary el-button--mini"
              :href="$urls.apiHost + $urls.apiPath + '/download/downloadfile?filepath=' + scope.row.name">下载</a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <footer class="main-footer">
      <p><strong>Copyright © 2014-2018 <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a></strong> 版权所有.</p>
      <div>
        <b>版本</b> 1.0.0
      </div>
    </footer>
  </main>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      list: state => state.operations
    })
  },
  methods: {
    ...mapActions(['getOperations'])
  },
  mounted() {
    this.getOperations()
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
@import '../../assets/css/new.css';
.operation-card
  width: 80%;
  margin: 40px auto;
</style>
