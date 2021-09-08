<template>
  <div class="prison-charge-config inputHeight">
      <div >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                 <el-row>
                  <el-col :span="15">
                 <el-form-item label="收费方式">
                    <el-radio-group :disabled="show.editDisabled" v-model="ruleForm.type">
                      <el-radio :label="1">按条收费</el-radio>
                      <el-radio :label="2">包月</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item v-if="ruleForm.type ==2"  label="短信每月收费"  prop="startMinutesVisual">
                       <el-input   :disabled="show.editDisabled" type="number"  step="0.01"  placeholder="元/条"  :min="0" @change="changeTimes('charge')"  v-model="ruleForm.charge">
                            <template slot="append">元/月</template>
                       </el-input>
                  </el-form-item>
                  <el-form-item  v-if="ruleForm.type ==1"  label="短信每条收费"  prop="startMinutesVisual">
                       <el-input  type="number"  step="0.01"  :disabled="show.editDisabled"  placeholder="元/条"  :min="0" @change="changeTimes('charge')"  v-model="ruleForm.charge">
                            <template slot="append">元/条</template>
                       </el-input>
                  </el-form-item>
                  
                <el-form-item  label="每月发短信上限条数"  prop="limitNum">
                       <el-input  type="number" :disabled="show.editDisabled"  placeholder="条" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"  :min="0"   @blur="changeTimes('limitNum')"  v-model="ruleForm.limitNum">
                            <template slot="append">/条</template>
                       </el-input>
                </el-form-item>
                 
                <el-form-item  label="国科短信服务条款"  prop="termsService">
                       <el-input  type="url" placeholder="分钟"  :disabled="show.editDisabled" v-model="ruleForm.termsService">
                       </el-input>
              </el-form-item>
                <el-form-item  label="生效日期"  required prop="effectTime">
                      <el-date-picker type="date" :disabled="show.editDisabled" :clearable="false" :picker-options="pickerOptions"  placeholder="选择日期" v-model="ruleForm.effectTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                 </el-col>
                 </el-row>
            </el-form>
      <div style="text-align: center;margin-bottom:10px">
        <el-button type="primary" v-if="show.editDisabled==true"  @click="show.editDisabled=false">编 辑</el-button>
        <el-button type="primary" v-if="show.editDisabled==false" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button v-if="show.editDisabled==false" @click="cloneAdd()">取 消</el-button>
      </div>
      </div>
        <el-divider  v-if="show.editData"></el-divider>
      <div v-if="show.editData" style="margin:50px 0">
        <p>生效日期~{{newForm.effectTime}}</p>
            <el-form :model="newForm"   label-width="160px" class="demo-ruleForm">
                 <el-row>
                  <el-col :span="15">
                    <el-form-item label="收费方式">
                    <el-radio-group disabled v-model="newForm.type">
                      <el-radio :label="1">按条收费</el-radio>
                      <el-radio :label="2">包月</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item  v-if="newForm.type ==2"   label="短信每月收费" >
                       <el-input  type="number" disabled  v-model="newForm.charge">
                            <template slot="append">元/月</template>
                       </el-input>
                  </el-form-item>
                  <el-form-item  v-if="newForm.type ==1"  label="短信每条收费"  >
                       <el-input  type="number"  disabled  :min="0"  v-model="newForm.charge">
                            <template slot="append">元/条</template>
                       </el-input>
                  </el-form-item>
                <el-form-item  label="每月发短信上限条数"  >
                       <el-input  type="number" disabled   v-model="newForm.limitNum">
                            <template slot="append">/条</template>
                       </el-input>
                </el-form-item>
                <el-form-item  label="国科短信服务条款" >
                       <el-input   placeholder="分钟" disabled  v-model="newForm.termsService">
                       </el-input>
                </el-form-item>
                 </el-col>
                 </el-row>
            </el-form>
      </div>  
  </div>
</template>

<script>

import http from '@/service'
import Moment from 'moment'

export default {
   data() {
      return {
        show:{
          editDisabled:true,
          editData:false
        },
        ruleForm: {},
        newForm:{},
        rules: {
          effectTime: [
              { required: true, message: '请选生效日期', trigger: 'blur' },
            { validator:(rule, value, callback) => {
                if(Moment(value).isBefore(new Date())){
                   callback(new Error('生效日期不得小于明天'));
                }else{
                   callback();
                }
              },
              trigger: 'blur'
            }
          ],
          termsService: [
            { required: true, type: 'url', message: `请输入正确的url`, trigger: 'blur' }
          ],
          startMoneyVoice: [
            { required: true, message: '请选填写金额', trigger: 'blur' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        }
      };
    },
    methods: {
      changeTimes(row){
           if(parseFloat(this.ruleForm[row])<0){
            this.$set(this.ruleForm,row,0)
          }
      },
      cloneAdd(){
           this.show.editDisabled=true
           this.getdata()
           this.$refs['ruleForm'].resetFields();
      },
       submitForm(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            this.ruleForm.effectTime=  Moment(this.ruleForm.effectTime).format("YYYY-MM-DD HH:mm:ss")
             console.log(this.ruleForm.effectTime)
            this.ruleForm.id = this.newForm.id?this.newForm.id:this.ruleForm.id
            let res= await http.editMessageList({...this.ruleForm})
             if(res){
                   this.show.editDisabled=true
                   this.getdata()
               }
          } else {
            return false;
          }
        });
      },
    async getdata(){
       let res=  await  http.getConfigMessageList({jailId: this.$route.params.id})
       if(res.length==2){
          this.ruleForm=res[1]
          this.newForm=res[0]
          this.show.editData=true
       }else{
         this.ruleForm=res[0]
         this.show.editData=false
       }
      this.newForm.effectTime=Moment(res[0].effectTime).format("YYYY-MM-DD")
    }
},
 async mounted() {
    this.getdata()
  }
}
</script>

<style lang="scss" scoped>

.fontMargin{
  font-size: 12px;
  margin-left: 50px;
  span{
    margin-left: 20px;
  }
}

.prison-charge-config {
  &-button_box {
    text-align: right;

    padding-bottom: 10px;
    /deep/ .el-button {
      padding: 8px 24px !important;
    }
  }

  &_basic-form {
    /deep/ .el-form-item {
      &.el-form-item_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }

      &.el-form-item_charge-type {
        label {
          width: auto !important;
        }

        .el-form-item__content {
          margin-left: 0px !important;
        }
      }
    }

    /deep/ .el-table {
      margin-bottom: 22px !important;
    }
  }

  &_diplomaticConsulOfficial-form {
    /deep/ .el-form-item {
      &__message-set {
        .el-form-item__content {
          width: 36.5%;
        }
      }

      &_once-monney {
        .el-input {
          width: 45.83333%;
        }
      }
    }
  }
}
</style>
