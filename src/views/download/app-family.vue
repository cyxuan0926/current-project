<template>
  <main>
    <section class="blue-block">
      <div class="blue-container">
        <div class="img-box">
          <img
            class="img-user"
            src="../../assets/images/phone.png"
            alt="">
        </div>
        <div class="download-box">
          <h3>国科服务</h3>
          <div class="download android">
            <a href="https://www.yuwugongkai.com/app/yuwutong_f.apk?from=wechat">
              <el-button><i class="iconfont icon-android" />Android下载</el-button>
            </a>
            <img
              src="../../assets/images/yuwutong_download.png"
              alt="">
          </div>
          <div class="download ios">
            <a href="https://itunes.apple.com/cn/app/%E7%8B%B1%E5%8A%A1%E9%80%9A/id1102307635?mt=8">
              <el-button><i class="iconfont icon-ios" />iPhone下载</el-button>
            </a>
            <img
              src="../../assets/images/yuwutong_download.png"
              alt="">
          </div>
        </div>
      </div>
      <div
        class="tips"
        v-if="isMobile">
        <p>请点击右上角选择“浏览器中打开”</p>
        <i class="iconfont icon-aaa" />
      </div>
    </section>
    <!-- <footer class="main-footer">
      <p><strong>Copyright © 2014-2018 <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a></strong> 版权所有.</p>
      <div>
        <b>版本</b> 1.0.0
      </div>
    </footer> -->
  </main>
</template>
<script>
export default {
  data() {
    return {
      isMobile: false
    }
  },
  methods: {
    init() {
      let u = navigator.userAgent,
        browser = {
          versions: { // 移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webkit: u.indexOf('Webkit') > -1, // 苹果，谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            ios: !!u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/), // ios终端
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // 安卓终端或者UC浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否为iPad
            webApp: u.indexOf('Safari') === -1 // 是否为web应用程序，没有头部和底部
          },
          language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }

      if (browser.versions.mobile) {
        let ua = navigator.userAgent.toLowerCase()
        let result = ua.match(/MicroMessenger/i)
        if (result && (result[0] === 'micromessenger')) {
          this.isMobile = true
        }
        else {
          this.isMobile = false
        }
      }
      else {
        this.isMobile = false
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/new.css";
.img-box .img-user{
  position: absolute;
  left: -55%;
  width: 109%;
  margin-top: 1px;
  margin-left: 62%
}
.blue-block{
  background: #337AB7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  position: relative;
}
@media screen and (max-width: 376px) {
  .img-box .img-user {
    margin-top: 27px;
  }
}
@media screen and (max-width: 563px) and (min-width: 320px) {
  .img-box .img-user {
    margin-left: 61%;
    width: 102%;
  }
}
@media screen and (max-width: 416px) and (min-width: 377px) {
  .img-box .img-user {
    width: 110%;
  }
}
@media screen and (max-width: 605px) and (min-width: 564px) {
  .img-box .img-user{
    margin-top: 19px;
  }
}
@media screen and (max-width: 720px) and (min-width: 605px) {
  .img-box .img-user{
    margin-top: 2px;
  }
}
@media screen and (min-width: 720px) {
  .img-box .img-user{
    width: 107%;
  }
}
</style>
