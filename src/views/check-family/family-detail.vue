<template>
  <div>
    <div class="detail-container">
      <template v-for="(item, index) in detailItems">
        <div class="detail-item" :key="`id-family-detail-item-${ index }`">
          <label>{{ item.label }}：</label>
          <span>{{ family[item['prop']] }}</span>
        </div>
      </template>

      <div class="button-box">
        <el-button
          type="primary"
          size="small"
          @click="goBack"
        >返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const detailItems = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '邮编',
    prop: 'postalCode'
  },
  {
    label: '家庭地址',
    prop: 'homeAddress'
  }
]

export default {
  data() {
    return {
      detailItems
    }
  },

  computed: {
    ...mapState(['family'])
  },

  mounted() {
    this.getFamilyDetail({ id: this.$route.params.id })
  },

  methods: {
    ...mapActions(['getFamilyDetail']),

    goBack() {
      this.$router.push({ path: '/family/list' })
    }
  }
}
</script>

<style lang="css" scoped>
.detail-container {
  width: 50%;
  min-width: 240px;
  margin: auto;
  padding: 20px 0;
  min-height: 400px;
}

.detail-container .detail-item {
  line-height: 24px;
  overflow: hidden;
}

.detail-container .detail-item label {
  width: 100px;
  font-weight: bold;
  float: left;
}

.detail-container .detail-item span {
  width: calc(var(--absolutely-measure) - 100px);
  float: right;
}
</style>
