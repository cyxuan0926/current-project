<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" >
        <template slot="append">
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>
       </template>
    </m-search>
    <el-col :span="24" class="flex"  style="border:1px solid #e6e6e6;overflow:auto">
      <template v-if="!noData">
      <div style="min-width:160px">
          <p style="height:60px">时间</p>
              <p class="borderTop" v-for="(val,i) in tabledata['合计']" :key="i">
                        {{val.month}}
              </p>
      </div>
      <div style="min-width:160px;border-left:1px solid #e6e6e6">
          <p style="height:60px">省份</p>
              <p class="borderTop" v-for="(val,i) in tabledata['合计']" :key="i">
                        {{val.provinceName}}
              </p>
      </div>
      <div style="min-width:160px;border-left:1px solid #e6e6e6">
          <p style="height:60px">监狱</p>
              <p class="borderTop" v-for="(val,i) in tabledata['合计']" :key="i">
                        {{val.jailName}}
              </p>
      </div>
        <div v-for="(item,index) in tabledata" :key="index" style="display:flex;flex-direction:column;min-width:160px; border-left:1px solid #e6e6e6">
                   <div >{{index}}</div>
                <div  class="flex borderTop">
                  <div >
                    <p >会见量</p>
                    <p class="borderTop" v-for="(val,i) in item" :key="i">
                        {{val.meetingNum}}
                    </p>
                  </div>
                  <div  style="border-left:1px solid #e6e6e6">
                     <p>参会人数</p>
                    <p class="borderTop" v-for="(val,i) in item" :key="i">
                        {{val.num}}
                    </p>
                  </div>
                </div>
             <!-- <p v-for="(item,index) in tabledata[index]">{{item.month}}</p> -->
        </div>
      </template>
       <template v-if="noData">
      <div style="min-width:160px">
          <p style="height:60px">暂无数据</p>
      </div>
      </template>
    </el-col>
  </el-row>
</template>

<script>
import http from '@/service'
 import { mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import Moment from 'moment'
import { DateFormat } from '@/utils/helper'
import { saveAs } from 'file-saver'

export default {
  mixins: [prisonFilterCreator],
  data() {
     const year = Moment().format('YYYY')
      const options = [
      {
        label: '年度统计',
        value: 0
      },
      {
        label: '月度统计',
        value: 1
      }
    ]
    return {
      downloading:false,
      searchItems: {
       year:{
          type: 'year',
          label: '时间',
          canNotClear:true,
          value: year
        },
         timeType: {
            type: 'select',
            label: '统计维度',
            options,
            canNotClear:true,
            value: 1
        },
        dataType: {
            type: 'select',
            label: '数据类型',
            options:[{label: '全量数据',value: 1},{label: '去重数据', value: 2}],
            canNotClear:true,
            value: 1
        },

      },
      noData:false,
      tabledata:{}
    }
  },

  computed: {
      ...mapState({
        jailIdAll: state => state.prisonAll
      })
    },
   watch: {
    jailIdAll(val) {
      if( val && val.length ) {
       this.$set(this.searchItems['jailId'], 'value',val[0].id)
      }

    }
  },
  methods: {
     // 导出excel
    async onDownloadExcel() {
         if (this.downloading) {
                    return
         }
         this.downloading = true
         let params = { ...this.filter, jailId: this.searchItems.jailId.value, type: this.filter.dataType  }
         try {
             let data = await http.exportMeetingStatis(params)
             saveAs(data, `会见量和参会人数统计报表-${this.filter.dataType==1?'全量':'去重'}-${ DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)
                     this.downloading = false
             } catch (error) {
              this.downloading = false
            }
    },
     async getDatas() {
       let endobj=null
       let params = { ...this.filter, jailId: this.searchItems.jailId.value, type: this.filter.dataType  }
       let res = await http.getMettinMemberStatis(params)
        if (!res) return this.noData=true
          Object.values(res).forEach(val=>{
               val.forEach(item=>{
               if(params.dataType==1){
              item.num=item.membersNum
             }else{
                item.num=item.familyCount
             }
            })
          })
          endobj= res["合计"]
          this.$delete(res, "合计")
          res["合计"]=endobj
          this.tabledata=res
    },
    onSearch() {
      if(this.filter.jailId){
          this.getDatas()
      }else{
         this.$message({
            message: '选择的监狱不能为空',
            type: 'error'
          });
         return false
      }
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.flex{
  display:flex;
  font-size:12px;
  line-height:30px;
  color: #606266
}
.flex div{
  flex:1;
  text-align:center
}
.borderTop{
  border-top:1px solid #e6e6e6
}
</style>
