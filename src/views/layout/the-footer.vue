<template>
  <div class="m-footer">
    <div class="hidden-xs-only">
      <b>版本</b> 2.0.0
    </div>
    {{ 'Copyright © 2006-' + year }}
    <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a>
    <a href="http://www.beian.miit.gov.cn">湘ICP备18008171号-2</a>
  </div>
</template>

<script>
import { _thisYear } from '@/common/constants/const'

export default {
  data() {
    return {
      year: _thisYear
    }
  }
}
</script>

<style lang="scss" scoped>
.m-footer {
  height: $absolutely-measure;
  // font-size: 13px;
  // font-weight: bold;
  background: $white;
  // color: #444;
  border-top: 1px solid #d2d6de;
  line-height: 36px;
  padding: 0 15px;
  overflow: hidden;
  .hidden-xs-only{
    float: right;
  }
  // a{
  //   color: #444;
  //   // color: #3c8dbc;
  // }
  b{
    font-weight: normal;
    // font-weight: 700;
  }
}
</style>
