<template>
  <div class="m-footer">
    <div class="hidden-xs-only">
      <b>版本</b> 1.0.0
    </div>
    <b>Copyright © 2014-2018 <a href="http://www.sinog2c.com">国科政信科技(北京)股份有限公司</a></b> 版权所有.
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.m-footer {
  height: 100%;
  font-size: 13px;
  font-weight: bold;
  background: #fff;
  color: #444;
  border-top: 1px solid #d2d6de;
  line-height: 40px;
  padding: 0 15px;
  overflow: hidden;
  .hidden-xs-only{
    float: right;
  }
  a{
    color: #3c8dbc;
  }
  b{
    font-weight: 700;
  }
}
</style>
