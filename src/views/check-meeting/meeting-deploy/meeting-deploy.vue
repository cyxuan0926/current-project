<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-tabs
      v-model="tabs"
      type="border-card" >
      <el-tab-pane label="用户管理" name="first">
        <el-form>
        <el-form-item label="可视电话申请自动审核" class="labelTit">
          <el-switch
          v-model="autoAuthorizeMeeting"
          active-color="#13ce66">
          </el-switch>
        </el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item ></el-form-item>
          <el-form-item >
            <el-button type="primary" style="float: right; margin-right: 60px;" @click="submitTit()">提交</el-button>
          </el-form-item>
          </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px">
      <span>监狱配置已开启二级审核，当开启自动审核后，二级审核将失效，确认开启自动审核吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeDeploy()">取 消</el-button>
    <el-button type="primary" @click="submitDeploy()">确 定</el-button>
  </span>
    </el-dialog>
 </el-row>
</template>

<script>
  import http from '@/service'
  export default {
    data() {
      // 标签元素
      const tabsItems = [
        {
          label: '配置信息',
          name: 'first' }
      ]
      return {
        tabs:"first",
        dialogVisible:false,
        params:false,
        autoAuthorizeMeeting: true,
        multistageExamine:false
      }
    },
    computed: {
    },
    mounted() {
     this.getDeploy()
    },
    methods: {
      getDeploy(){
        http.getMeetDeploy().then(res => {
          this.dialogVisible = false
          this.autoAuthorizeMeeting=res.data.autoAuthorizeMeeting?true:false
          this.multistageExamine=res.data.multistageExamine?true:false
        })
      },
      submitTit(){
        //判断
        if(this.autoAuthorizeMeeting==true&&this.multistageExamine==true){
          this.dialogVisible=true
        }else{
          this.submitDeploy()
        }
      },
      closeDeploy(){
        this.dialogVisible = false
      },
      submitDeploy(){
        let params = {
          autoAuthorizeMeeting: this.autoAuthorizeMeeting?1:0,
        }
        http.getMeetDeployUpdate(params).then(res => {
          this.getDeploy()
        })
      }
    }
  }
</script>
<style scoped>
 .labelTit.el-form-item::before{
    content: '*';
    color: #F56C6C;
    float: left;
    margin-top: 10px;
    margin-right: 4px;
  }
</style>
