<template>
  <el-container class="gd-home">
    <el-header class="gd-home-title">广东监狱管理首页</el-header>
    <el-container>
      <section class="gd-home__left">
        <section class="gd-home-map" id="gd-home-map">
          
        </section>
        <section class="gd-home-statistics">
          
        </section>  
      </section>
      <section class="gd-home__right">
        
      </section>
    </el-container>
  </el-container>
</template>
<script>
  import echarts from 'echarts'
  import AmapUtil from '@/utils/amapUtil'
  export default {
    data() {
      return {
        instance: null
      }
    },
    methods: {
      async initMap() {
        const utilIns = this.instance = AmapUtil.getMapInstance()
        await utilIns.loadMap()
        await utilIns.loadPlugin('DistrictLayer')

        var SOC = 'CHN'
        var colors = {};
        var GDPSpeed = {
          '520000':10,//贵州
          '540000':10,//西藏
          '530000':8.5,//云南
          '500000':8.5,//重庆
          '360000':8.5,//江西
          '340000':8.0,//安徽
          '510000':7.5,//四川
          '350000':8.5,//福建
          '430000':8.0,//湖南
          '420000':7.5, //湖北
          '410000':7.5,//河南
          '330000':7.0,//浙江
          '640000':7.5,//宁夏
          '650000':7.0,//新疆
          '440000':7.0,//广东
          '370000':7.0,//山东
          '450000':7.3,//广西
          '630000':7.0,//青海
          '320000':7.0,//江苏
          '140000':6.5,//山西
          '460000':7,// 海南
          '310000':6.5,//上海
          '110000':6.5, // 北京
          '130000':6.5, // 河北
          '230000':6, // 黑龙江
          '220000':6,// 吉林
          '210000':6.5, //辽宁
          '150000':6.5,//内蒙古
          '120000':5,// 天津
          '620000':6,// 甘肃
          '610000':8.5,// 甘肃
          '710000':2.64, //台湾
          '810000':3.0, //香港
          '820000':4.7 //澳门
        }
        var getColorByDGP = function(adcode){
          if(!colors[adcode]){
              var gdp = GDPSpeed[adcode];
              if(!gdp){
                  colors[adcode] = 'rgb(227,227,227)'
              }else{
                  var r = 3;
                  var g = 140;
                  var b = 230;
                  var a = gdp/10;
                  colors[adcode] = 'rgba('+ r +','+ g +','+b+','+a+')';
              }
          }
          return colors[adcode]
        }
        var disCountry = new utilIns.plugins.DistrictLayer.Country({
          zIndex:10,
          SOC:'CHN',
          depth:1,
          styles:{
              'nation-stroke':'#ff6600',
              'coastline-stroke':'ff8800',
              'province-stroke':'white',
              'fill':function(props){
                return getColorByDGP(props.adcode_pro)
              }
          }
        })
        utilIns.map = new utilIns.AmapConstructor.Map('gd-home-map', {
          layers:[
            disCountry
          ],
          viewMode:'2D',
        })
      }
    },
    mounted() {
      this.initMap()
    }
  }
</script>
<style lang="scss" scoped>
  .gd-home {
    height: 100%;

    &-title {
      height: 44px;
      background: gray;
    }

    &__left, &__right {
      padding: 16px 30px;
    }

    &__left {
      width: 50%;
      display: flex;
      flex-direction: column;
      background: pink;

      .gd-home-map {
        flex: 3;
        position: relative;
      }

      .gd-home-statistics {
        flex: 2;
        background: red;
      }

    }

    &__right {
      width: 50%;
      margin-left: -30px;
    }
  }
</style>
