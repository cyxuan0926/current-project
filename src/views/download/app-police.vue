<template>
  <main>
    <section class="blue-block">
      <div class="blue-container">
        <div class="img-box">
          <img
            class="img-user"
            src="../../assets/images/yujingban_show.png"
            alt="">
        </div>
        <div class="download-box">
          <h3>狱警版</h3>
          <div class="download android">
            <!--这个地址是预定的 还不能下 到时候要修改 生产：https://www.yuwugongkai.com/app/yuwutong_j.apk-->
            <a href="https://www.yuwugongkai.com/app/yuwutong_j.apk">
              <el-button><i class="iconfont icon-android" />Android下载</el-button>
            </a>
            <img
              src="../../assets/images/yujing_code.png"
              alt="">
          </div>
          <!-- <div class="download ios">
            <a href="https://itunes.apple.com/cn/app/%E7%8B%B1%E5%8A%A1%E9%80%9A/id1102307635?mt=8">
              <el-button><i class="iconfont icon-ios" />iPhone下载</el-button>
            </a>
            <img
              src="../../assets/images/yuwutong-ios.png"
              alt="">
          </div> -->
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
.blue-block{
  background: #337AB7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  position: relative;
  overflow-x: hidden !important;
}
.img-box{
  width: 25%;
  float: left;
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
}
// 没有ios的情况
.img-box .img-user {
  position: absolute;
  left: 30% !important;
  top: 16px !important;
  width: 161% !important;
  margin-top: -15px;
  margin-left: -26%;
}
.download-box {
  // width: 75%;
  left: 22%;
}
// .img-box .img-user {
//   position: absolute;
//   left: -14% !important;
//   top: 40px !important;
//   width: 102% !important;
//   margin-top: -15px;
//   margin-left: -26%;
// }
// 没有ios展示的情况下 width: 186 left:162
// .download.prison .android{
//   width: 90%;
//   margin: 0 auto;
//   padding-right: 15px;
//   padding-left: 0;
//   position: relative;
//   min-height: 1px;
// }
</style>
