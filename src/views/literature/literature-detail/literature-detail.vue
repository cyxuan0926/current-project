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
        <el-input v-model="articleForm.title" maxlength="18"></el-input>
        <p class="title font-num-tip">
          你还可以输入 {{ 18 - articleForm.title.length }} 个字符
        </p>
      </el-form-item>
      <el-form-item label="作品内容" prop="content">
        <el-input
          v-model="articleForm.content"
          type="textarea"
          rows="20"
          maxlength="20000"
        />
        <p class="content font-num-tip">
          你还可以输入 {{ 20000 - articleForm.content.length }} 个字符
        </p>
      </el-form-item>
      <el-form-item align="right" style="margin-top: 30px">
        <el-button type="primary" @click="onFormat">自动排版</el-button>
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
        penName: '',
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
          {
            validator: debounce(this.titleValidator, 300, {
              maxWait: 60 * 1000
            }),
            trigger: 'change'
          },
          { required: true, message: '请输入标题', trigger: 'change' },
          { min: 1, max: 18, message: '标题不能超过 18 个字', trigger: 'change' }
        ],
        content: [
          {
            validator: debounce(this.contentValidator, 300, {
              maxWait: 60 * 1000
            }),
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
          publishAt
        } = vm.literatureDetail

        vm.articleUpdateTime = publishAt
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
  // async beforeRouteLeave (to, from, next) {
  //   try {
  //     await this.$confirm('确定离开当前页面吗？', '提示', { type: 'warning' })
  //     next()
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },
  created() {
    this.getSensitivewords({ page: 1, rows: 100 * 10000, isEnabled: 1 })
    this.articleForm.penName = this.$store.state.global.user.jailName
  },
  methods: {
    ...mapActions('literature', ['getSensitivewords', 'publishLiterature']),
    onPreview() {
      this.literaturePreviewVisible = true
    },
    onFormat() {
      const indent = '    '
      let content = this.articleForm.content

      content = indent + content.trim().replace(/\n\s*/g, '\n' + indent)

      if (content.length > 20000) {
        this.$message.error('作品内容字数过多，请精简内容后再进行排版');
      } else {
        this.articleForm.content = content
      }
    },
    onSubmit() {
      if (this.articleForm.content.length < 100) {
        this.$message.error('正文内容不能少于 100 字')
        return
      }

      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          const isSuccess = await this.publishLiterature({
            id: this.$route.params.id,
            ...this.articleForm
          })
          isSuccess && this.$router.push('/literature-my/literatures')
        }
      })
    },
    titleValidator(rule, value, callback) {
      this.sensitiveWordValidator(
        rule,
        value,
        callback,
        this.articleForm.title
      )
    },
    contentValidator(rule, value, callback) {
      this.sensitiveWordValidator(
        rule,
        value,
        callback,
        this.articleForm.content
      )
    },
    sensitiveWordValidator(rule, value, callback, content) {
      const sensitiveWords = this._sensitiveWords
      const length = sensitiveWords.length
      content = content.replace(/\s/g, '')
      const st = Date.now()

      for (let i = 0; i < length; i++) {
        const word = sensitiveWords[i];

        if (content.includes(word)) {
          console.log('sensitiveWordValidator', i, word)
          const message = `不能包含敏感词 “${word}”`

          callback(new Error(message));
          this.$message.error(message)
          break
        }
      }

      const et = Date.now()
      console.log('检查共花费了：' + (et - st) / 1000 + '秒')
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 960px;
  margin: 0 auto;
}

.font-num-tip {
  font-size: 12px;
  color: #bbb;

  &.title {
    position: absolute;
    top: 0;
    right: 10px;
    line-height: 40px;
  }

  &.content {
    position: absolute;
    top: 100%;
    right: 0;
    padding-top: 5px;
    line-height: 1;
  }
}
</style>