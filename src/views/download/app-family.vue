<template>
  <main class="app-download">
    <section class="app-download-wrap">
      <section class="app-download-container">
        <section class="app-download-content">
          <dl class="app-download-block">
            <dt class="app-download-block-hd">
              <h3>构建G2C商业生态新世界</h3>
            </dt>
            <dd class="app-download-block-bd">
              <div class="app-download-btns">
                <a href="https://itunes.apple.com/cn/app/%E7%8B%B1%E5%8A%A1%E9%80%9A/id1102307635?mt=8"><el-button class="btn-ios"><i class="iconfont icon-ios" />App Store 下载</el-button></a>
                <a href="https://www.yuwugongkai.com/app/yuwutong_f.apk?from=wechat"><el-button class="btn-and"><i class="iconfont icon-android" />Android 下载</el-button></a>
              </div>
              <div class="app-download-qrcode">
                <img src="../../assets/images/yuwutong_pro_download.png" alt="国科服务app下载">
                <div class="app-download-qrcode-text">扫码下载国科服务App</div>
              </div>
            </dd>
          </dl>
        </section>
        <section class="app-download-mobile">
          <img src="../../assets/images/app-family-mobile-bg.png" alt="国科服务app">
        </section>
      </section>
    </section>
    
    
    <!-- <footer class="main-footer">
      <p><strong>Copyright © 2014-2018 <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a></strong> 版权所有.</p>
      <div>
        <b>版本</b> 1.0.0
      </div>
    </footer> -->

    <!-- <div
        class="tips"
        v-if="isMobile">
        <p>请点击右上角选择“浏览器中打开”</p>
        <i class="iconfont icon-aaa" />
      </div> -->
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
  .app-download {
    background-image: url('../../assets/images/app-family-download-bg.png');
    background-position: center center;
    background-repeat:  no-repeat;
    background-size: auto $absolutely-measure;
    background-color: #2B6CFF;
    width: $absolutely-measure;
    height: $absolutely-measure;
    position: relative;

    &-wrap {
      position: absolute;
      top: 0;
      left: 50%;
      bottom: 0;
      margin-left: -422px;
      width: 844px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &-container {
      display: flex;
      justify-content: center;
      overflow: hidden;
    }

    &-mobile {
      width: 246px;
      img {
        display: block;
        width: $absolutely-measure;
        height: auto;
      }
    }

    &-content {
      width: 530px;
      margin-right: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &-block {
      width: $absolutely-measure;
      display: flex;
      flex-direction: column;
      // &-hd img {
      //   display: block;
      //   width: $absolutely-measure;
      //   height: auto;
      //   margin-bottom: 76px;
      // }
      &-hd h3 {
        display: block;
        width: $absolutely-measure;
        font-size: 44px;
        margin-top: 0;
        margin-bottom: 70px;
        color: $white;
        font-weight: 400;
        text-align: center;
      }
      &-bd {
        margin: 0;
        display: flex;
        justify-content: center;
      }
    }

    &-btns {
      padding-top: 20px;
      a {
        display: block;
        & + a {
          margin-top: 20px;
        }
      }
      /deep/ .el-button {
        width: 217px;
        height: 56px;
        font-size: 16px;
        display: block;
        margin: 0;
        padding: 0;
        line-height: 56px;
        border: none;
        box-shadow: 6px 6px 15px #2c6bff;
      }

      .btn-ios {
        background: #333;
        color: $white;
      }

      .btn-and {
        background: #A5C846;
        color: $white;
      }

      /deep/ .iconfont {
        font-size: 22px;
        margin-right: 10px;
      }
    }

    &-qrcode {
      width: 174px;
      color: $white;
      margin-left: 44px;
      img {
        display: block;
        width: $absolutely-measure;
        height: auto;
        box-shadow: 6px 6px 15px #2c6bff;
      }
      &-text {
        font-size: 16px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
</style>
