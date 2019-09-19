<template>
  <div class="literature-preview">
    <h2>{{ literatureDetail.title }}</h2>
    <div class="literature-info">
      <span>{{ literatureDetail.penName }}/著</span>
      <span>本章共{{ literatureDetail.content.length }}字</span>
      <span>更新于：{{ literatureDetail.updatedAt }}</span>
    </div>
    <p class="literature-content">
      <el-input
        type="textarea"
        :value="literatureDetail.content"
        :autosize="{ minRows: 2 }"
        disabled
      />
    </p>
    <!-- <p class="literature-content">{{ literatureDetail.content }}</p> -->

    <template v-if="!isCheckNeeded">
      <p v-if="literatureDetail.rejectReason" class="reason">
        审核不通过原因：{{ literatureDetail.rejectReason }}
      </p>
      <p v-if="literatureDetail.shelfReason" class="reason">
        下架原因：{{ literatureDetail.shelfReason }}
      </p>
    </template>

    <el-form
      ref="rejectForm"
      v-if="isCheckNeeded"
      :model="rejectForm"
      :rules="rules"
    >
      <el-form-item prop="checkResult">
        <el-select v-model="rejectForm.checkResult">
          <el-option label="通过" value="pass"></el-option>
          <el-option label="不通过" value="reject"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="rejectForm.checkResult === 'reject'"
        prop="rejectReason"
      >
        <el-input
          v-model="rejectForm.rejectReason"
          :autosize="{ minRows: 6 }"
          type="textarea"
          placeholder="请填写不通过原因"
        />
      </el-form-item>
      <p v-if="literatureDetail.shelfReason" class="reason">
        下架原因：{{ literatureDetail.shelfReason }}
      </p>
    </el-form>

    <div class="operate">
      <el-button v-if="isCheckNeeded" type="primary" @click="onConfirm">
        确定
      </el-button>
      <el-button type="primary" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      rejectForm: { rejectReason: '', checkResult: 'pass' },
      rules: {
        rejectReason: [
          { required: true, message: '请填写不通过原因', trigger: 'change' },
          {
            max: 200,
            message: '不通过原因不能超过 200 个字符',
            trigger: 'change'
          }
        ]
      },
    }
  },
  computed: {
    ...mapState('literature', ['literatureDetail']),
    // 是否需要进行审核（只有待审核的作品需要进行审核）
    isCheckNeeded() {
      return this.$route.query.status === 'publish'
    }
  },
  async beforeRouteEnter (to, from, next) {
    await store.dispatch('literature/getLiteratureDetail', { id: to.params.id })
    next()
  },
  created() {
    this.initStatus()
  },
  methods: {
    ...mapActions('literature', ['passLiterature', 'rejectLiterature']),
    initStatus() {
      if (this.literatureDetail.rejectReason) {
        this.rejectForm.checkResult = 'reject'
        this.rejectForm.rejectReason = this.literatureDetail.rejectReason
      }
    },
    onConfirm() {
      if (this.rejectForm.checkResult === 'pass') {
        this.onConfirmPass()
      } else {
        this.onConfirmReject()
      }
    },
    async onConfirmPass() {
      try {
        await this.$confirm("确认通过审核吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        await this.passLiterature({ id: this.$route.params.id })
        this.back()
      } catch (err) {
        console.log(err);
      }
    },
    onConfirmReject() {
      this.$refs.rejectForm.validate(async valid => {
        if (valid) {
          const isSuccess = await this.rejectLiterature({
            id: this.$route.params.id,
            rejectReason: this.rejectForm.rejectReason
          })

          isSuccess && this.back()
        }
      })
    },
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
    margin-bottom: 62px;
    font-size: 13px;
    line-height: 18px;
  }

  p.reason {
    margin-bottom: 20px;
  }

  .el-form {
    width: 260px;
  }

  .operate {
    text-align: left;
  }
}

.literature-content {
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
}
</style>