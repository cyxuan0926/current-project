<template>
  <el-dialog :visible.sync="dialogVisible" title="作品预览" width="360px">
    <h3>{{ article.title }}</h3>
    <div class="article-info">
      <img src="/static/images/user2-160x160.jpg">
      <div>
        <h4>{{ article.penName }}</h4>
        <span>{{ updateTime }}</span>
      </div>
    </div>
    <el-input
      type="textarea"
      :value="article.content"
      :autosize="{ minRows: 2, maxRows: 18 }"
      disabled
    />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    article: Object,
    updateTime: String
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 2vh!important;

  .el-dialog__header {
    padding-left: 25px;
    padding-right: 25px;
  }
}

/deep/ .el-dialog__body {
  padding: 10px 25px 60px;

  h3, h4 {
    padding: 0;
    margin: 0;
  }
}

.article-info {
  display: flex;
  align-items: center;
  height: 45px;
  margin: 15px 0 20px;

  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
  }

  h4 {
    margin-bottom: 3px;
    font-weight: bold;
  }
}

/deep/ textarea {
  padding: 0;
  border: none;
  font-size: 13px;
  font-family: 'PingFang-SC', 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 24px;
  appearance: none;
  resize: none;
}

/deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #333;
  background-color: #fff;
  cursor: text;
}
</style>