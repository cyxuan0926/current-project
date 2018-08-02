<template>
  <div>
    <div class="detail-container">
      <div class="detail-item">
        <label>姓名：</label>
        <span>{{ family.name }}</span>
      </div>
      <div class="detail-item">
        <label>邮编：</label>
        <span>{{ family.postalCode }}</span>
      </div>
      <div class="detail-item">
        <label>家庭地址：</label>
        <span>{{ family.homeAddress }}</span>
      </div>
      <div class="button-box">
        <el-button
          type="primary"
          size="small"
          @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['family'])
  },
  mounted() {
    this.getFamilyDetail({ id: this.$route.params.id })
  },
  methods: {
    ...mapActions(['getFamilyDetail']),
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="css" scoped>
.detail-container{
  width: 50%;
  min-width: 240px;
  margin: auto;
  padding: 20px 0;
  min-height: 400px;
}
.detail-container .detail-item{
  line-height: 24px;
  overflow: hidden;

}
.detail-container .detail-item label{
  width: 100px;
  font-weight: bold;
  float: left;
}
.detail-container .detail-item span{
  width: calc(100% - 100px);
  float: right;
}
</style>
