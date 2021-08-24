<template>
  <div class="prison-charge-config inputHeight">
      <div > 
        <div class="el-form-item__content">亲情电话参数配置</div>
        <el-table
        :data="tableData.configurationsFamilyPhoneList"
        border
        style="width: 100%">
         <el-table-column
          prop="type"
          label="管教级别"
          width="100">
           <template slot-scope="scope">
            <span v-if="scope.row.type==1">
              宽管级别
            </span>
            <span v-if="scope.row.type==2">
              普管级别
            </span>
            <span v-if="scope.row.type==3">
              考察级别
            </span>
            <span v-if="scope.row.type==4">
              严管级别
            </span>
            <span v-if="scope.row.type==5">
              其它级别
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="duration"
          label="通话时长(分钟)"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.isEditPropertyShow">
              <el-input  type="number"   onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :min="0"  @blur="changeTimes(scope.row)"  v-model="scope.row.duration" size="mini" >
               <template slot="append">/分钟</template>
              </el-input>
            </span>
            <span v-else>{{ scope.row.duration }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="通话次数(次/月)">
           <template slot-scope="scope">
            <span v-if="scope.row.isEditPropertyShow">
              <el-input  type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :min="0"  @blur="changeTimes(scope.row)" v-model="scope.row.number" size="mini">
              <template slot="append">/次</template>
                </el-input>
            </span>
            <span v-else>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEditPropertyShow" type="primary" size="mini" @click="editProperty(scope.row,scope.$index)">编辑</el-button>
                <div v-else>
                  <el-button type="primary" plain size="mini" @click="saveProperty(scope.row,scope.$index)">保存</el-button>
                  <el-button size="mini" @click="cancelProperty(scope.row,scope.$index)">取消</el-button>
                </div>
              </template>
        </el-table-column>
      </el-table>

      </div>
      <div style="margin:50px 0"> 
        <div class="el-form-item__content">亲情电话收费配置 <el-button style="margin-left:20px" v-if="show.addConfigButton==false"  type="primary"   size="mini" @click="addConfigMessage()">新增亲情电话收费配置</el-button>
         </div>
       <el-table
      :data="tableData.familyPhoneChargeTemplateList"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="destinationName"
        label="目的地"
        width="160">
      </el-table-column>
      <el-table-column
        prop="startMinutesVoice"
        label="基础通话时长(分钟)">
      </el-table-column>
      <el-table-column
        prop="startMoneyVoice"
        label="基础通话收费(元)">
      </el-table-column>
      <el-table-column
        prop="fixedMoneyVoice"
        label="基础时长后每分钟费用(元)">
      </el-table-column>
      <el-table-column
        prop="broadCostVoice"
        label="宽管级总费用(元)">
      </el-table-column>
      <el-table-column
        prop="commonCostVoice"
        label="普管级总费用(元)">
        </el-table-column>
        <el-table-column
        prop="inspectCostVoice"
        label="考察级总费用(元)">
        </el-table-column>
        <el-table-column
        prop="strictCostVoice"
        label="严管级总费用(元)">
        </el-table-column>
        <el-table-column
        prop="otherCostVoice"
        label="其它级总费用(元)">
        </el-table-column>
         <el-table-column
        prop="startDay"
        label="生效时间">
        </el-table-column>
       <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button :disabled="show.addConfigButton" type="primary" size="mini" @click="editProperty(scope.row,scope.$index,2)">编辑</el-button>
              </template>
        </el-table-column>
    </el-table>
       <el-dialog
      :visible.sync="show.addConfig"
      @close="cloneAdd()"
      title="收费配置信息"
      width="800px"
      class="authorize-dialog">
      <div  style="margin:20px 0">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                <el-form-item label="目的地" required prop="destinationCode">
                  <el-col :span="10">
                      <el-form-item   prop="startMinutesVoice">
                      <el-select v-if="!show.disabled" v-model="ruleForm.destinationCode" filterable  @change="selectaddr" placeholder="请选择地区">
                          <template v-for="code of phoneCodes">
                                                    <el-option
                                                        :key="code.english_name"
                                                        :label="code.chinese_name"
                                                        :value="code.phone_code"
                                                    />
                          </template>
                      </el-select>
                       <el-input  readonly v-if="show.disabled" v-model="ruleForm.destinationName">
                       </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2"><div>&nbsp;</div></el-col> 
                    <el-col :span="10"> 
                      <el-form-item label="生效时间" required prop="startDay" label-width="80px">
                      <el-date-picker type="date"  placeholder="选择日期" v-model="ruleForm.startDay" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                    </el-col>
                </el-form-item>
                 <el-divider></el-divider>
          
                <el-form-item label="语音电话基础费用" label-width="160px" >
                    <el-col :span="10">
                      <el-form-item   prop="startMinutesVoice">
                       <el-input  type="number"   onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" :min="0" :max="maxDuration"  @blur="changeTimes('startMinutesVoice',2)" v-model="ruleForm.startMinutesVoice">
                            <template slot="append">/分钟</template>
                       </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2"><div>&nbsp;</div></el-col>
                    <el-col :span="10">     
                          <el-form-item   prop="startMoneyVoice">
                        <el-input  type="number"  step="0.01"  placeholder="费用"  :min="0"  @blur="changeTimes('startMoneyVoice',2)"  v-model="ruleForm.startMoneyVoice">
                              <template slot="append">/元</template>
                        </el-input>
                          </el-form-item>
                    </el-col> 
                </el-form-item>
                <el-form-item  label="基础时长后每分钟费用" label-width="160px" prop="delivery2">
                  <el-col :span="10">     
                          <el-form-item   prop="fixedMoneyVoice">
                         <el-input  type="number" step="0.01" placeholder="费用" :min="0"  @blur="changeTimes('fixedMoneyVoice',2)"  v-model="ruleForm.fixedMoneyVoice">
                              <template slot="append">/元</template>
                          </el-input>
                          </el-form-item>
                    </el-col>  
                  </el-form-item>
                  <p class="fontMargin"><span>宽管级总费用{{broadCostVoice }}元</span><span>普管级总费用{{commonCostVoice }}元</span><span>考察级总费用{{inspectCostVoice }}元</span><span>严管级总费用{{strictCostVoice}}元</span><span>其它级总费用{{otherCostVoice }}元</span></p>
                <el-divider></el-divider>
                <el-form-item label="可视电话基础费用" label-width="160px" >
                    <el-col :span="10">
                      <el-form-item   prop="startMinutesVisual">
                       <el-input  type="number"   placeholder="分钟" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"  :min="0" :max="maxDuration"  @blur="changeTimes('startMinutesVisual',2)"  v-model="ruleForm.startMinutesVisual">
                            <template slot="append">/分钟</template>
                       </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2"><div>&nbsp;</div></el-col>
                      <el-col :span="10">     
                          <el-form-item   prop="startMoneyVisual">
                         <el-input  type="number"  step="0.01" placeholder="费用"  :min="0"  @blur="changeTimes('startMoneyVisual',2)"  v-model="ruleForm.startMoneyVisual">
                              <template slot="append">/元</template>
                         </el-input>
                          </el-form-item>
                      </el-col>
                </el-form-item>
                          <el-form-item label="基础时长后每分钟费用"  label-width="160px" prop="fixedMoneyVisual">
                          <el-col :span="10"> 
                           <el-input  type="number"  min="0"  @change="changeTimes('fixedMoneyVisual',2)"  v-model="ruleForm.fixedMoneyVisual">
                              <template slot="append">/元</template>
                           </el-input>
                            </el-col>
                          </el-form-item>
                  <p class="fontMargin"><span>宽管级总费用{{broadCostVisual }}元</span><span>普管级总费用{{commonCostVisual }}元</span><span>考察级总费用{{inspectCostVisual }}元</span><span>严管级总费用{{strictCostVisual }}元</span><span>其它级总费用{{otherCostVisual }}元</span></p>
              </el-form>
      </div>
     <span slot="footer" class="dialog-footer" style="padding-bottom:10px;float:right" >
      <el-button type="primary"  @click="submitForm('ruleForm')">提 交</el-button>
      <el-button @click="cloneAdd()">取 消</el-button>
    </span>
 </el-dialog>
      </div>
  </div>
</template>

<script>

import http from '@/service'
import Moment from 'moment'
import phoneCodesJson from '@/common/constants/index.json'

export default {
   data() {
     const   oneTimeDay = Moment().add(1, "day").format("YYYY-MM-DD")
     const   ruleForm = {
          destinationName: '',
          destinationCode : '',
          startDay:"",
          startMinutesVoice : 0,
          fixedMoneyVoice  : 0,
          commonCostVoice  : 0,
          broadCostVoice  : 0,
          inspectCostVoice  : 0,
          otherCostVoice  : 0,
          startMoneyVoice  : 0,
          inspectCostVoice  : 0,
          broadCostVisual  : 0,
          commonCostVisual   :0,
          fixedMoneyVisual   : 0,
          inspectCostVisual   : 0,
          otherCostVisual   : 0,
          startMinutesVisual   : 0,
          startMoneyVisual   : 0,
          strictCostVisual    : 0,
        }
      return {
        phoneCodes : phoneCodesJson,
        maxDuration:0,
        oneTimeDay,
        addrname:"",
        tableData: {
          configurationsFamilyPhoneList:[],
          familyPhoneChargeTemplateList:[]
        },
        show:{
          addConfig:false,
          addConfigButton:false,
        },
        ruleForm,
        newForm: {
          destinationName: '',
          destinationCode : '',
          startDay:oneTimeDay,
          startMinutesVoice : 0,
          fixedMoneyVoice  : 0,
          commonCostVoice  : 0,
          broadCostVoice  : 0,
          inspectCostVoice  : 0,
          otherCostVoice  : 0,
          startMoneyVoice  : 0,
          inspectCostVoice  : 0,
          broadCostVisual  : 0,
          commonCostVisual   :0,
          fixedMoneyVisual   : 0,
          inspectCostVisual   : 0,
          otherCostVisual   : 0,
          startMinutesVisual   : 0,
          startMoneyVisual   : 0,
          strictCostVisual    : 0,
        },
        oldForm:{},
        rules: {
          destinationCode: [
            { required: true, message: '请选择目的地', trigger: 'change' }
          ],
          startDay: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          startMinutesVoice: [
            { required: true, message: '请选填写分钟', trigger: 'blur' }
          ],
          startMoneyVoice: [
            { required: true, message: '请选填写金额', trigger: 'blur' }
          ],
          fixedMoneyVoice: [
            { required: true, message: '请选填写金额', trigger: 'blur' }
          ],
          fixedMoneyVisual: [
            { required: true, message: '请选填写金额', trigger: 'blur' }
          ],
          startMoneyVisual: [
            { required: true, message: '请选填写金额', trigger: 'blur' }
          ],
          startMinutesVisual: [
            { required: true, message: '请选填写分钟', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      //宽管级语音费用
      broadCostVoice (){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==1)[0]
           if(duration && duration.duration>this.ruleForm.startMinutesVoice){
             cost=parseFloat((duration.duration-this.ruleForm.startMinutesVoice)*this.ruleForm.fixedMoneyVoice+parseFloat(this.ruleForm.startMoneyVoice)).toFixed(2)
             this.ruleForm.broadCostVoice=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVoice).toFixed(2)
            this.ruleForm.broadCostVoice=cost
           }
        return cost
      },
       //普管级语音费用
      commonCostVoice(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==2)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVoice){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVoice)*this.ruleForm.fixedMoneyVoice+parseFloat(this.ruleForm.startMoneyVoice)).toFixed(2)
           this.ruleForm.commonCostVoice=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVoice).toFixed(2)
             this.ruleForm.commonCostVoice=cost
           }
        return cost
      },
       //考察级语音费用
      inspectCostVoice(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==3)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVoice){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVoice)*this.ruleForm.fixedMoneyVoice+parseFloat(this.ruleForm.startMoneyVoice)).toFixed(2)
           this.ruleForm.inspectCostVoice=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVoice).toFixed(2)
             this.ruleForm.inspectCostVoice=cost
           }
        return cost
      },
       //严管级语音费用
      strictCostVoice(){
         let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==4)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVoice){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVoice)*this.ruleForm.fixedMoneyVoice+parseFloat(this.ruleForm.startMoneyVoice)).toFixed(2)
           this.ruleForm.strictCostVoice=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVoice).toFixed(2)
             this.ruleForm.strictCostVoice=cost
           }
        return cost
      },
       //特殊级语音费用
      otherCostVoice(){
        let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==5)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVoice){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVoice)*this.ruleForm.fixedMoneyVoice+parseFloat(this.ruleForm.startMoneyVoice)).toFixed(2)
           this.ruleForm.otherCostVoice=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVoice).toFixed(2)
             this.ruleForm.otherCostVoice=cost
           }
        return cost
      },
       //宽管级可视电话费用
      broadCostVisual(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==1)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVisual){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVisual)*this.ruleForm.fixedMoneyVisual+parseFloat(this.ruleForm.startMoneyVisual)).toFixed(2)
           this.ruleForm.broadCostVisual=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVisual).toFixed(2)
              this.ruleForm.broadCostVisual=cost
           }
        return cost
      },
       //普管级可视电话费用
      commonCostVisual(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==2)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVisual){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVisual)*this.ruleForm.fixedMoneyVisual+parseFloat(this.ruleForm.startMoneyVisual)).toFixed(2)
           this.ruleForm.commonCostVisual=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVisual).toFixed(2)
              this.ruleForm.commonCostVisual=cost
           }
        return cost
      },
       //考察级可视电话费用
      inspectCostVisual(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==3)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVisual){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVisual)*this.ruleForm.fixedMoneyVisual+parseFloat(this.ruleForm.startMoneyVisual)).toFixed(2)
           this.ruleForm.inspectCostVisual=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVisual).toFixed(2)
            this.ruleForm.inspectCostVisual=cost
           }
        return cost
      },
       //严管级可视电话费用
      strictCostVisual(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==4)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVisual){
            cost=parseFloat((duration.duration-this.ruleForm.startMinutesVisual)*this.ruleForm.fixedMoneyVisual+parseFloat(this.ruleForm.startMoneyVisual)).toFixed(2)
           this.ruleForm.strictCostVisual=cost
           }else{
             cost=parseFloat(this.ruleForm.startMoneyVisual).toFixed(2)
             this.ruleForm.strictCostVisual=cost
           }
        return cost
      },
       //特殊级可视电话费用
      otherCostVisual(){
          let cost=0
           const duration=this.tableData.configurationsFamilyPhoneList.filter(item=>item.type==5)[0]
           if(duration&& duration.duration>this.ruleForm.startMinutesVisual){
            cost=parseInt((duration.duration-this.ruleForm.startMinutesVisual)*this.ruleForm.fixedMoneyVisual+parseInt(this.ruleForm.startMoneyVisual)).toFixed(2)
           this.ruleForm.otherCostVisual=cost
           }else{
             cost=parseInt(this.ruleForm.startMoneyVisual).toFixed(2)
            this.ruleForm.otherCostVisual=cost
           }
        return cost
      }
    },
    methods: {
      changeTimes(row,type){
        if(type==2){
          if(parseFloat(this.ruleForm[row])<0){
           this.$set(this.ruleForm,row,0)
          }
          if(parseFloat(this.ruleForm[row])>parseFloat(this.maxDuration)){
           this.$set(this.ruleForm,row,this.maxDuration)
           this.$message.error('填写通话时长分钟数不能大于管教级别分钟数！！');
          }
        }else{
          if(row.duration<0){
            row.duration=0
            }
        }
      },
      selectaddr(a){
        this.ruleForm.destinationName=this.phoneCodes.filter(item=>item.phone_code ==a)[0].chinese_name
        this.addrname=this.phoneCodes.filter(item=>item.phone_code ==a)[0].chinese_name
      },
      addConfigMessage(){
       this.show.addConfig=true
       this.ruleForm=  Object.assign({}, this.newForm);
      },
      cloneAdd(){
        this.resetForm("ruleForm")
        this.show.addConfig=false
        this.show.disabled=false
        this.ruleForm=Object.assign({}, this.oldForm)
      },
       submitForm(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            this.ruleForm.startDay=  Moment(this.ruleForm.startDay).format("YYYY-MM-DD")
            if(this.ruleForm.id){
              this.ruleForm.destinationName=this.addrname
              let res = await http.editTemplate({...this.ruleForm})
                if(res){
                  this.getdata()
                  }
            }else{
             let res= await http.addTemplate({...this.ruleForm,jailId: this.$route.params.id})
             if(res){
                   this.getdata()
               }
            }
            this.cloneAdd()
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 9 ||columnIndex === 10) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
       // 修改商品属性
    editProperty(row, index,type) {
      if(type==2){
         this.show.addConfig=true
         this.show.disabled=true
         this.ruleForm=Object.assign({}, row)
         this.oldForm= Object.assign({}, row)
      }else{
        this.show.addConfigButton=true
        // 我这边是表格数据都是前端处理，需要把旧值存起来，用户点击修改之后修改了原来的数据，但是又点了取消的情况，还需要获取到原来的值
        localStorage.setItem(`oldPropertValue${index}`, JSON.stringify(row))
        // isEditPropertyShow为ture展示输入框
        this.$set(this.tableData.configurationsFamilyPhoneList[index], 'isEditPropertyShow', true)
      }
    },
    // 保存修改参数配置
    async saveProperty(row, index,type) {
      if(type==2){
       return false
      }else{
        if(this.tableData.configurationsFamilyPhoneList[index].duration&&this.tableData.configurationsFamilyPhoneList[index].number){
         this.$set(this.tableData.configurationsFamilyPhoneList[index], 'isEditPropertyShow', false)
          let res=  await  http.editConfigurations({ ...this.tableData.configurationsFamilyPhoneList[index]})
           if(res){
             this.getdata()
             this.show.addConfigButton=false
           }else{
              let obj = JSON.parse( localStorage.getItem(`oldPropertValue${index}`))
              if ( obj !== 'null') {
                this.$set(this.tableData.configurationsFamilyPhoneList, index, obj)
              }
           }
        }else{
           this.$message.error('请填写通话时长与通话次数！！');
        }
      }
    },
    // 取消修改
    cancelProperty(row, index,type) {
        if(type==2){
          return false
        }else{
          this.show.addConfigButton=false
          let obj = JSON.parse( localStorage.getItem(`oldPropertValue${index}`))
          if ( obj !== 'null') {
             this.$set(this.tableData.configurationsFamilyPhoneList, index, obj)
          }
          this.$set(this.tableData.configurationsFamilyPhoneList[index], 'isEditPropertyShow', false)
        }
    },
    async getdata(){
       let res=  await  http.getConfiguractionAndtemplate({jailId: this.$route.params.id})
       this.maxDuration=Math.min.apply(Math, res.data.configurationsFamilyPhoneList.map(function(o) {return o.duration}))
       let _res = []
       res.data.familyPhoneChargeTemplateList.forEach((item,key)=>{
           let obj={}
             obj.id=item.id
             this.addrname=item.destinationName
             obj.destinationName=item.destinationName+"(可视电话)"
             item.destinationName=item.destinationName+"(语音电话)"
             obj.destinationCode=item.destinationCode
             obj.startMinutesVoice=item.startMinutesVisual
             obj.startMoneyVoice=item.startMoneyVisual
             obj.fixedMoneyVoice=item.fixedMoneyVisual
             obj.broadCostVoice=item.broadCostVisual
             obj.commonCostVoice=item.commonCostVisual
             obj.inspectCostVoice=item.inspectCostVisual
             obj.strictCostVoice =item.strictCostVisual
             obj.otherCostVoice=item.otherCostVisual
             _res.push(item)
             _res.push(obj)
            res.data.familyPhoneChargeTemplateList=_res
       })
       this.tableData=res.data
    }
},
 async mounted() {
    this.getdata()
  }
}
</script>
<style lang="stylus">
#body .el-table.border th, #body .el-table td{
 border-bottom: 1px solid #e6e6e6
}

.inputHeight .el-input--mini .el-input__inner {
    height: 28px;
    line-height: inherit;
}
</style>

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