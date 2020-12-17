<template>
        <div class='scoped' style="display:flex;justify-content: center;">
            <el-form :inline="true" label-width="120px" label-position="right"  :model="formDate" class="demo-form-inline">
                 <div>
                        <el-form-item   style="width:380px" label="广告所属地区">
                        <el-select v-model="formDate.provincesId" @change='getjailTypes()' placeholder="广告所属地区">
                        <el-option v-for="(item,index) in provinceslist" :key='index' :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                         <el-form-item   style="width:380px" label="广告所属监狱">
                        <el-select v-model="formDate.jailId"  placeholder="广告所属监狱">
                        <el-option v-for="(item,index) in jailIdlist" :key='index' :label="item.title" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                </div>
                <div>
                        <el-form-item   style="width:380px" label="广告所属服务">
                        <el-select v-model="formDate.adservicesId" @change='getadservicesTypes()' placeholder="广告所属服务">
                        <el-option v-for="(item,index) in adservicesIdlist" :key='index' :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                         <el-form-item   style="width:380px" label="广告位置">
                        <el-select v-model="formDate.typeId"  @change='getusedSortTypes()' placeholder="广告位置">
                        <el-option v-for="(item,index) in adservicesTypes" :key='index' :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                </div>
                <div>
                    <el-form-item style="width:380px" label="广告序号">
                          <el-select v-model="formDate.sort" placeholder="广告序号">
                            <el-option v-for="(item,index) in adservicesSortTypes" :key='index' :label="item.toString()" :value="item"></el-option>
                          </el-select>
                     </el-form-item>
                         <el-form-item   style="width:500px" label="广告有效期">
                          <el-date-picker
                           style="width:380px"
                            v-model="timedate"
                            type="datetimerange"
                            clearable
                            :editable="false"
                            @change="getChangeDate"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          />
                        </el-form-item>
                </div>
                    <div>
                        <el-form-item   style="width:380px" label="广告封面形式">
                            <el-select v-model="formDate.adForm" @change="clearPicSize" placeholder="广告封面形式">
                            <el-option label="图片" :value="1" ></el-option>
                            <!-- <el-option label="视频" value="2"></el-option> -->
                            <el-option label="文件" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="width:380px" label="广告播放时长">
                            <el-select v-model="formDate.duration" :disabled ="formDate.adForm!=1" placeholder="广告播放时长">
                            <el-option label="3秒" :value="3"></el-option>
                            <el-option label="4秒" :value="4"></el-option>
                            <el-option label="5秒" :value="5"></el-option>
                            <el-option label="6秒" :value="6"></el-option>
                            <el-option label="7秒" :value="7"></el-option>
                            <el-option label="8秒" :value="8"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div>
                         <el-form-item   style="width:380px" label="广告尺寸">
                        <el-select v-model="formDate.picSize" :disabled="formDate.adForm!=1" placeholder="广告尺寸">
                        <el-option label="720*1440" :value="`720*1440`"></el-option>
                        <el-option label="720*86" :value="`720*86`"></el-option>
                        <el-option label="660*214" :value="`660*214`"></el-option>
                        </el-select>
                        </el-form-item>
                         <el-form-item   style="width:380px" label="广告内容形式">
                                <el-select v-model="formDate.adContentForm"  :disabled="!formDate.adForm" @change="showTab()" placeholder="广告内容形式">
                                <el-option label="图片" :value="1" :disabled="formDate.adForm==3"></el-option>
                                <el-option label="视频" :value="2" :disabled="formDate.adForm==3"></el-option>
                                <el-option label="H5地址链接" :value="3"></el-option>
                                </el-select>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item   style="width:380px" label="广告封面">                             
                            <div v-if="formDate.adForm==1">
                                 <div  v-if="!formDate.title">
                                 <el-upload
                                    action="#"
                                    list-type="picture-card"
                                    v-bind="defaultUploadAttrs"
                                    :before-upload="beforUpload"
                                    :on-remove="handleRemove"
                                    :on-preview="handlePictureView"
                                    :http-request="handleFileUpload">
                                    <i class="el-icon-plus"></i>
                                     <p style="color:#000000;line-height: 20px;">广告支持jpeg, jpg, gif,png格式的图片，且不超过2M</p>                                  
                                </el-upload>
                                 </div>
                                <ul v-if="formDate.title" class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0"  class="el-upload-list__item is-success">
                                            <img :src="formDate.title"  class="el-upload-list__item-thumbnail">
                                            <span class="el-upload-list__item-actions">
                                                <span class="el-upload-list__item-preview">
                                                <i class="el-icon-zoom-in" @click="handlePictureView"></i>
                                                </span>
                                                <span class="el-upload-list__item-delete">
                                                <i class="el-icon-delete" @click="handleRemove"></i>
                                                </span>
                                            </span>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="formDate.adForm==2">
                               视频
                            </div>
                            <div v-if="formDate.adForm==3">
                                <el-input type='text' style="width:224px" v-model="formDate.title" placeholder="文件名称"></el-input>
                            </div>

                        
                        </el-form-item>

                         <el-form-item   style="width:380px" label="广告内容">
                            <div v-if="formDate.adContentForm==1">
                                <el-input  style="width:224px" :readonly='true' v-model="formDate.content" placeholder="广告内容"></el-input> 
                            </div>
                            <div v-if="formDate.adContentForm==2">
                                  <el-upload
                                    v-if="!formDate.content"
                                    list-type="picture-card"
                                    action="#"
                                    :show-file-list="false"
                                    :http-request="handleFileUpload"
                                    :before-upload="beforeUploadVideo"
                                    :on-preview="handlePictureView"
                                    >                                   
                                    <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <video v-if="formDate.content" :src="formDate.content"
                                    style="width:155px"
                                    controls="controls" class="avatar"></video>
                                    <p  v-if="formDate.content">
                                        <el-button type="danger" @click="deleteVideo()">删除视频</el-button>
                                    </p>
                                    <p v-if='load'> 上传中</p>
                                    <p style="color:#000000;width:120px;text-align: center;line-height: 20px;">广告支持视频格式'mp4','webm','avi','rmvb',且不超过10M</p>              
                            </div>
                            <div v-if="formDate.adContentForm==3">
                                <el-input  style="width:224px"  v-model="formDate.content" placeholder="广告内容"></el-input> 
                            </div>
                        </el-form-item>
                    </div>
                        

            <div>
            <el-form-item style='float:right'>
                <div >
                    <el-button  @click="goback()">返回</el-button>
                    <el-button  type="primary" v-if="status==`add`||status==`edit` " @click="onSubmit">提交</el-button>
                </div>
            </el-form-item>

            </div>
         
            </el-form>
            <el-dialog :visible.sync='dialogVisible'>
                <img width="100%" :src="formDate.title">
            </el-dialog>

        </div>
        
</template>

<script>
    import  { getadserviceslist , getjailIdlist,getadservicesTypes,getprovinceslist, addInside,uploadadservices ,updateInside,getusedSort} from '@/service-public/api/inside';
    import Moment from 'moment'
    export default {
       data() {
        return {
           defaultUploadAttrs:{
            multiple: false,
            accept: 'image/jpeg,image/jpg,image/gif,image/png',
            limit: 1,
            name: 'file'
            },
        formDate: {},
        timedate:[],
        createdDate:[],
        adservicesIdlist:[], //广告服务集合
        adservicesTypes:[], //广告位置集合
        adservicesSortTypes:[], //序号集合
        provinceslist:[],//地区
        jailIdlist:[],//监狱集合
        status:'add',
        value:'',
        accept:'image/jpeg,image/jpg,image/gif,image/png',
        load:false,
        dialogVisible:false,
        filter:{},
        loading:false,
        searching: false,
        exporting:false,
        jailIsVisible: true,
        pagedMessageConsumptions:{}
        }
       },
         methods: {
        //图片上传
        async handleFileUpload(data) {
           let res = await uploadadservices({
                type: 'PUBLIC',
                file: data.file
            })
              console.log(res)
              if(res.mime=='image/jpeg'|| res.mime=='image/jpg'||res.mime=='image/gif'||res.mime=='image/png'){
                this.$set(this.formDate,"title",res.url)
                console.log(this.formDate)
              }else{
                  this.$set(this.formDate,"content",res.url)
                  this.load = false;
              }
        },
        //清空图片尺寸
        clearPicSize(){
                this.$set(this.formDate,"picSize",'')
                this.$set(this.formDate,"title",'')
                this.$set(this.formDate,"adContentForm",'')
                this.$set(this.formDate,"content",'')
                this.$set(this.formDate,"duration",'')
        },
        //返回列表
        goback(){
            this.$router.back(-1)
        },
        //移除图片
        handleRemove(){
            this.formDate.title=''
            this.formDate.adContentForm=''
        },
        //移除视频
        deleteVideo(){
            this.formDate.content=''
        },
        //图片放大
        handlePictureView(){
         this.dialogVisible=true
        },
        //上传前判断
        beforUpload(file) {
        const fileType = this.defaultUploadAttrs.accept.split(',')
        const isAccept = fileType.indexOf(file.type) > -1
        const isSize = file.size / 1024 / 1024 < 2
        if (!isAccept) {
            let accept = []
            fileType.forEach(type => { accept.push(type.substr(type.lastIndexOf('/') + 1)) })
            this.$message.error(`请上传正确图片格式'image/jpeg,image/jpg,image/gif,image/png'`)
            return false
        }
        if (!isSize) {
            this.$message.error('文件大小不能超过2MB!')
            return false
        }
        if(!this.formDate.picSize){
            this.$message.error('请先选择图片尺寸')
             return false
        }
      const ratio = this.formDate.picSize.split('*')
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = (e) => {
          let data = e.target.result, image = new Image()
          image.onload = () => {
            if (image.width / image.height !== ratio[0] / ratio[1]) {
              this.$message.error(`请上传宽高比为${ this.formDate.picSize }的图片`)
              reject(false)
            }
            else resolve(true)
          }
          image.src = data
        }
        reader.readAsDataURL(file)
      })
    },
        //获取时间
        getChangeDate(){
            if(this.timedate.length){
                if(Moment(this.timedate[1]).isBefore(Moment().format())){
                    this.timedate=[]
                    this.$message.error(`结束时间需要大于当前时间`)
                }else{
                    this.formDate.startDate=Moment(this.timedate[0]).format('YYYY-MM-DD HH:mm:ss')
                    this.formDate.endDate=Moment(this.timedate[1]).format('YYYY-MM-DD HH:mm:ss')
                }
            }
        },
        //提交数据
        async onSubmit() {
            let parmas=this.formDate
             if(!parmas.adservicesId){
                    this.$message.error(`请先选择广告所属服务`)
                     return false
                }
                 if(!parmas.typeId){
                    this.$message.error(`请先选择广告位置`)
                     return false
                }
                 if(!parmas.sort){
                    this.$message.error(`请先选择广告序号`)
                     return false
                }
                 if(!parmas.startDate){
                    this.$message.error(`请先选择有效日期`)
                    return false
                }
                if(!parmas.adForm){
                    this.$message.error(`请先选择广告封面形式`)
                     return false
                }
                 if(!parmas.title){
                    this.$message.error(`请先选择广告封面`)
                     return false
                }
                if(!parmas.adContentForm){
                    this.$message.error(`请先选择广告内容形式`)
                     return false
                }
                if(!parmas.content){
                    this.$message.error(`请先选择广告内容`)
                    return false
                }
            if(parmas.id){
                 await updateInside(parmas).then(res=>{
                   if(res.code==200) {
                    this.$message.success(res.msg)
                    this.$router.back(-1)
                    }else{
                        this.$message.error(res.msg)
                    }
                 })
            }else{
              await addInside(parmas).then(res=>{
                 if(res.code==200) {
                    this.$message.success(res.msg)
                    this.$router.back(-1)
                }else{
                    this.$message.error(res.msg)
                }
              })
            }
         },
          showTab(){
             if(this.formDate.adContentForm==1){
                 if(!this.formDate.title){
                      this.$message.error(`请先上传封面图片`)
                      this.$set(this.formDate,"adContentForm" ,"")
                      return false
                 }else{
                    this.$set(this.formDate,"content" ,this.formDate.title)
                 }
             }
             if(this.formDate.adContentForm==2){
                this.$set(this.formDate,"content" ,'')
             }
             if(this.formDate.adContentForm==3){
                this.$set(this.formDate,"content" ,'')
             }
          },
          //上传前限制大小
            beforeUploadVideo (file) {
            const isLt20M = file.size / 1024 / 1024 < 10;
            if (['video/mp4','video/webm','video/avi','video/rmvb'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv',  'video/wmv', 'video/rmvb'
                this.$message.error(`请上传正确的视频格式'video/mp4','video/webm','video/avi','video/rmvb'`);
                return false;
            }
            if (!isLt20M) {
                this.$message.error('上传视频大小不能超过10MB哦!');
                return false;
            }
            this.load=true;
        },
       async  getusedSortTypes(type){
            let parmas={typeId:this.formDate.typeId}
            await getusedSort(parmas).then(res=>{
              this.adservicesSortTypes=res
            })
            if(type){
                return false
            }else{
                this.$set(this.formDate,"sort" ,"")

            }
       },
         //获取广告位置集合
       async getadservicesTypes(type){
            let parmas=this.formDate.adservicesId
            await getadservicesTypes(parmas).then(res=>{
                this.adservicesTypes=res
            })
            if(type){
                return false
            }else{
                this.$set(this.formDate,"typeId" ,"")

            }
       },
         //获取广告服务集合
        async getadservices(){
            await getadserviceslist().then(res=>{
              this.adservicesIdlist=res
            })
        },
         //获取广告地区集合
       getadprovinces(){
           getprovinceslist().then(res=>{
              this.provinceslist=res
           })
        },
        //根据地区id获取监狱
        async  getjailTypes(type){
             let parmas={provinces:this.formDate.provincesId}
             await getjailIdlist(parmas).then(res=>{
                this.jailIdlist=res
              })
            if(type){
                return false
            }else{
                this.$set(this.formDate,"jailId" ,"")
            }
        }
         },
    mounted() {
        this.formDate=this.$route.query.formDate?this.$route.query.formDate:{}
        if(this.$route.query.formDate){
            this.timedate=[this.$route.query.formDate.startDate,this.$route.query.formDate.endDate]
            this.status=this.$route.query.status
            this.getadservices()
            this.getadservicesTypes(true)
            this.getjailTypes(true)
            this.getusedSortTypes(true)
            this.getChangeDate()
        }else{
            this.getadprovinces()
            this.getadservices()
            this.timedate=[ Moment().format('YYYY-MM-DD HH:mm:ss'),Moment().add(1, "years").format("YYYY-MM-DD HH:mm:ss")]
             this.getChangeDate()
       }
    }
    
    }
</script>

<style scoped>
.scoped{
    padding: 50px 24px 0;
    background-color: #fff;
}
.scoped .el-form-item {
    margin-bottom: 75px;
}
</style>
