<template>
  <div class="literature-preview">
    <h2>{{ literatureDetail.title }}</h2>
    <div class="literature-info">
      <span>{{ literatureDetail.penName }}/著</span>
      <span>本章共{{ literatureDetail.content.length }}字</span>
      <span>更新于：{{ literatureDetail.updatedAt }}</span>
    </div>
    <p class="literature-content">{{ literatureDetail.content }}</p>
    <p v-if="literatureDetail.shelfReason">
      下架原因：{{ literatureDetail.shelfReason }}
    </p>
    <div class="operate">
      <el-button type="primary" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapState('literature', ['literatureDetail'])
  },
  created() {
    this.getLiteratureDetail({ id: this.$route.params.id })
  },
  methods: {
    ...mapActions('literature', ['getLiteratureDetail']),
    back() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.literature-preview {
  padding: 30px 62px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: normal;
    text-align: center;
  }

  .literature-info {
    margin-bottom: 30px;
    text-align: center;

    span + span {
      margin-left: 5px;
    }
  }

  .literature-content {
    margin-bottom: 30px;
    font-size: 13px;
    line-height: 18px;
  }

  .operate {
    text-align: right;
  }
}
</style>