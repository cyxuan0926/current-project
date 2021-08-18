<template>
  <div>
    <div class="form-container">
      <el-tabs
        v-model="activeName"
        type="border-card"
        class="no-bottom-padding"
        @tab-click="handleClick">
        <template v-for="item in tabMapOptions">
          <el-tab-pane
            :label="item.label"
            :key='item.key'
            :name="item.key">
            <keep-alive>
              <component
                v-if='activeName == item.key'
                :is="activeName"/>
            </keep-alive>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>

</template>

<script>

import prisonBase from './components/prison-base'

import prisonConfig from './components/prison-config'

import prisonPhoneChargeConfig from './components/prison-charge-config'
import prisonFamilyChargeConfig from './components/prison-family-charge-config'

export default {
  components: {
    prisonBase,
    prisonConfig,
    prisonPhoneChargeConfig,
    prisonFamilyChargeConfig
  },

  data() {
    return {
      activeName: '',
      tabMapOptions: [
        {
          label: '基本信息',
          key: 'prisonBase'
        },
        {
          label: '配置信息',
          key: 'prisonConfig'
        },
        {
          label: '可视电话收费配置',
          key: 'prisonPhoneChargeConfig'
        },
        {
          label: '亲情电话收费配置',
          key: 'prisonFamilyChargeConfig'
        }
      ]
    }
  },
  watch: {
    '$route': 'render'
  },
  mounted() {
    this.render()
  },
  methods: {
    handleClick() {
      this.$router.push({ query: { tag: this.activeName } })
    },
    render() {
      if (!this.$route.query.tag) this.$router.push({ query: { tag: this.tabMapOptions[0].key } })
      if (this.$route.query.tag !== this.activeName) {
        if (this.tabMapOptions.find(item => item.key === this.$route.query.tag)) this.activeName = this.$route.query.tag
        else this.activeName = this.tabMapOptions[0].key
        this.handleClick()
      }
    }
  }
}
</script>
