<template>
    <div class="meeting-process-container">
        <dl class="meeting-process-item" v-for="(pro, i) in bpmnList" :key="pro.value">
            <dt class="clearfix">
               <h3 class="pull-left">{{ pro.label }}</h3>
               <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus" @click="handleEditProcess(pro.value, bpmnXmls[i])">{{ !bpmnXmls[i] ? '创建新' : '编辑' }}审批</el-button>
            </dt>
            <dd v-if="!!bpmnXmls[i]"><div class="bpmn-viewer" :ref="pro.value"></div></dd>
            <dd v-else class="bpmn-none">还未添加审批流程</dd>
        </dl>
    </div>
</template>

<script>
   import { mapActions } from 'vuex'
   import prisons, { initBpmnData } from '@/common/constants/prisons'
   import http from '@/service'
   import BpmnViewer from 'bpmn-js/lib/Viewer'
   export default {
      data() {
         return {
            jailId: this.$route.params.jailId,
            bpmnXmls: [],
            bpmnList: prisons.bpmnList,
            bpmnModelers: []
         }
      },
      async created() {
         this.bpmnXmls = await Promise.all( this.bpmnList.map(b => http.getProcess(`${ b.value }--${ this.jailId }`)) )
      },
      methods: {
         ...mapActions(['setXmlStorage']),
         handleEditProcess(flag, xml) {
            this.setXmlStorage( xml || initBpmnData(`${ flag }--${ this.jailId }`) )
            this.$router.push({ path: `/meeting/deploy/process-edit?jailId=${ this.jailId }` })
         }
      },
      mounted() {
         try {
            this.bpmnModelers = []
            this.bpmnXmls.forEach((xml, i) => {
               if( !!xml ) {
                  let viewer = new BpmnViewer({
                     container: this.refs[ this.bpmnList[i].label ]
                  })
                  viewer.importXML(xml).then(() => {
                     viewer.get('canvas').zoom('fit-viewport')
                  })
                  this.bpmnModelers.push(viewer)
               }
            })
         } catch (error) {
            console.log(error)
         }
      },
      beforeDestroy() {
         this.bpmnModelers.forEach(m => {
            m.destroy()
         })
      }
   }
</script>

<style lang="scss" scoped>
   .meeting-process-container {
      width: 80%;
      margin: 0 auto;
      padding: 50px 0;
   }
   .meeting-process-item {
      margin: 0;

      & + & {
         margin-top: 50px;
      }

      dt {
         h3 {
               margin: 16px 0;
               font-weight: 600;
               font-size: 16px;
         }
         /deep/ .el-button {
               margin-top: 10px;
         }
         border-bottom: 1px solid #ededed;
      }
   }
   .bpmn-viewer {
      width: 100%;
      min-height: 240px;
   }
   .bpmn-none {
      width: 100%;
      min-height: 60px;
      text-align: center;
      padding-top: 60px;
      color: #999;
   }
</style>