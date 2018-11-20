<template>
  <el-row id="jail-information-management" :gutter="0">
    <el-row :gutter="0">
      <el-col :span="12">
        <img :src="jailInformation.imageUrl + '?token=' + $urls.token" alt="">
        <!--<img src="../../assets/images/default.jpg" alt="">-->
      </el-col>
      <el-col :span="12">
        <el-col :span="24">
          <h3>{{jailInformation.title}}</h3>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在省</p>
          </el-col>
          <el-col :span="12">
            <p>{{jailInformation.provincesName}}</p>
          </el-col>
        </el-col>
        <el-col :span="24" class="line"></el-col>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在市</p>
          </el-col>
          <el-col :span="12">
            <p>{{jailInformation.citysName}}</p>
          </el-col>
        </el-col>
        <el-col :span="24" class="line"></el-col>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在行政区</p>
          </el-col>
          <el-col :span="12">
            <p>{{jailInformation.district}}</p>
          </el-col>
        </el-col>
        <el-col :span="24" class="line"></el-col>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在街道</p>
          </el-col>
          <el-col :span="12">
            <p>{{jailInformation.street}}</p>
          </el-col>
        </el-col>
        <el-col :span="24" class="line"></el-col>
        <el-col :span="24" class="description">
          <p>监狱简介</p>
        </el-col>
        <div style="height: 10px; width: 100%; clear: both;"></div>
        <el-col :span="24">
          <p v-html="jailInformation.description"></p>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" size="mini" @click="editJails(jailInformation.id)">编辑</el-button>
        </el-col>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    data() {
      return {
        // isJailEdit: false // 是否是监狱基本信息编辑页面
      }
    },
    computed: {
      ...mapState(['jailInformation'])
    },
    methods: {
      ...mapActions(['getJailInformation']),
      // 编辑监狱基本信息
      editJails(id) {
        this.$router.push({
          path: `/jails/edit/${ id }`
        })
      },
      // 新增监狱基本信息
      addJails() {
        this.$router.push({
          path: '/jails/add'
        })
      }
    },
    mounted() {
      this.getJailInformation()
    }
  }
</script>

<style type="text/stylus" lang="stylus">
  #jail-information-management
    > .el-row
      > .el-col-12
        &:first-child
          padding: 3% 2% 20px 2%
          img
            max-width: 100%
            float: left
        &:nth-child(2)
          padding: 18px 2% 0 0
          .el-col-24
            &:first-child
              margin-bottom: 10px
              h3
                text-align: center
                font-weight: bold
            &:last-child
              .el-button
                float: right
                margin-right: 3%
                margin-bottom: 20px
      .el-col.line
        border-bottom: 1px solid #F3F3F3
        margin-bottom: 10px
      .el-col-24
        &.description
          img
            max-width: 100%
        .el-col-12
          &:nth-child(2)
            p
              color: #A6A6A6
              text-align: right
</style>
