<template>
  <el-row class="row-container page literature-detail">
    <el-form
      ref="articleForm"
      :model="articleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="作品类型" prop="articleType">
        <el-select
          v-model="articleForm.articleType"
          :disabled="isLiteratureCreated"
        >
          <el-option label="互动文章" :value="1"></el-option>
          <el-option label="连载小说" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者笔名" prop="penName">
        <el-input v-model="articleForm.penName" disabled></el-input>
      </el-form-item>
      <el-form-item label="作品标题" prop="title">
        <el-input v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="作品内容" prop="content">
        <el-input type="textarea" v-model="articleForm.content" rows="20"></el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button
          v-if="this.articleForm.articleType === 1"
          type="primary"
          @click="onPreview"
        >
          预览
        </el-button>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>

    <literature-preview
      :visible.sync="literaturePreviewVisible"
      :article="articleForm"
      :updateTime="articleUpdateTime"
    />
  </el-row>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapActions, mapState } from 'vuex'
import { deepCopy } from '@/utils/helper'
import store from '@/store'
import literaturePreview from './literature-preview'

export default {
  components: { literaturePreview },
  data() {
    return {
      literaturePreviewVisible: false,
      articleForm: {
        articleType: 1,
        penName: '演示监狱（临时方案）', // TODO: 临时方案
        title: '',
        content: ''
      },
      articleUpdateTime: '',
      rules: {
        articleType: [
          { required: true, message: '请选择作品类型', trigger: 'change' }
        ],
        penName: [
          { required: true, message: '请输入笔名', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
          { min: 1, max: 18, message: '标题不能超过 18 个字', trigger: 'change' }
        ],
        content: [
          {
            validator: debounce(this.sensitiveWordValidator, 62),
            trigger: 'change'
          },
          { required: true, message: '请输入作品内容', trigger: 'blur' },
          { min: 100, max: 20000, message: '作品内容为 100-20000 字', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    ...mapState('literature', ['sensitiveWords', 'literatureDetail']),
    isLiteratureCreated() {
      return Boolean(this.$route.params.id)
    },
    _sensitiveWords() {
      return this.sensitiveWords.map(item => item.keyWord)
    }
  },
  async beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      await store.dispatch('literature/getLiteratureDetail', {
        id: to.params.id
      })

      next(vm => {
        const {
          articleType,
          penName,
          title,
          content,
          updatedAt
        } = vm.literatureDetail

        vm.articleUpdateTime = updatedAt
        vm.articleForm = {
          articleType: parseInt(articleType),
          penName,
          title,
          content
        }
      })
    } else {
      next()
    }
  },
  created() {
    this.getSensitivewords({ page: 1, rows: 100 * 10000, isEnabled: 1 })
  },
  methods: {
    ...mapActions('literature', ['getSensitivewords', 'publishLiterature']),
    onPreview() {
      this.literaturePreviewVisible = true
    },
    onSubmit() {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          await this.publishLiterature({
            id: this.$route.params.id,
            ...this.articleForm
          })
          this.$router.push('/prison/literature-my/literatures')
        }
      })
    },
    sensitiveWordValidator(rule, value, callback) {
      const st = Date.now()
      console.log('start at', st)
      for (let i = 0; i < this._sensitiveWords.length; i++) {
        const word = this._sensitiveWords[i];

        if (this.articleForm.content.includes(word)) {
          console.log('sensitiveWordValidator', i, word)
          const message = `内容不能包含敏感词 “${word}”`

          callback(new Error(message));
          this.$message.error(message)
          return
        }
      }
      const et = Date.now()
      console.log('end at', et)
      console.log('检查共花费了：' + (et - st) / 1000 + '秒')
      callback()
    },

  }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 960px;
  margin: 0 auto;
}
</style>