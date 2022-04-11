<template>
  <div class="container">      
    <template v-for="(configs, type) in allConfigs">
      <div
        v-if="type === 0 || (type === 1 && hasConfigAfter) || hasOriginConfigAfter"
        class="m-container"
        :key="type"
      >
        <div v-if="type === 1 && hasOriginConfigAfter" class="after-tip">{{ normalCongigs['updatedAt'] + ' 调整后的时间段配置，' + normalCongigs['enabledAt'] + ' 日生效' }}</div>
        <div>
          <el-form>
            <el-form-item label="是否分生产区和监舍区">
              <el-switch
                v-model="separateByArea[type]"
                @change="switchChange($event,type)"
                active-color="#13ce66"
                :disabled="Boolean(type === 0 && hasOriginConfigAfter) ">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="separateByArea[type]">
          <el-form >
            <el-form-item label="请选择生产区设备:" style="width:450px">
              <div class="prisonlabel">
                <el-button
                  v-for="(item,index) in terminals[type][1] "
                  :key='index' size="mini"
                  style="margin-left: 5px"
                  >{{item.selectArr}} <i
                  v-if="!(hasOriginConfigAfter && type === 0)"
                  class="el-icon-circle-close"
                  @click="open(item,type,2)"
                />
                </el-button>
              </div>
              <el-button
                v-if="!(hasOriginConfigAfter && type === 0)"
                type="primary"
                size="mini"
                style="margin-left: 10px;float: left;margin-top: 8px"
                @click="tableShow(2,type)">选择设备</el-button>
            </el-form-item>
          </el-form>

          <template v-for="(config, index) in configs">
            <div
              v-if="config.area=='2' || !config.area"
              :key="index"
              class="config-box">
              <remote-week-cy
                :separateByArea="separateByArea[type]"
                :allConfigs="allConfigs"
                :configs="configs"
                :config="config"
                :area="config.area"
                :index="index"
                :durations='durations'
                :type="type" />
            </div>
          </template>

          <el-form>
            <el-form-item label="请选择监舍区设备:" style="width:450px">
              <div class="prisonlabel">
               <el-button
                  v-for="(item,index) in terminals[type][0] "
                  :key='index'
                  size="mini"
                  style="margin-left: 5px">{{item.selectArr}} <i
                  @click="open(item,type,1)"
                  v-if="!(hasOriginConfigAfter && type === 0)"
                  class="el-icon-circle-close"
                />
                </el-button>
              </div>
              <el-button
                v-if="!(hasOriginConfigAfter && type === 0)"
                type="primary"
                size="mini"
                style="margin-left: 10px;float: left;margin-top: 8px"
                @click="tableShow(1,type)">选择设备</el-button>
            </el-form-item>
          </el-form>

          <template v-for="(config, index) in configs">
            <div
              v-if="config.area=='1'" 
              :key="index"
              class="config-box">
              <remote-week-cy
                :separateByArea="separateByArea[type]"
                :allConfigs="allConfigs"
                :configs="configs"
                :config="config"
                :area="config.area"
                :durations='durations'
                :index="index"
                :type="type" />
            </div>
          </template>
        </div>
          <!--不分舍监区-->

        <template v-for="(config, index) in configs">
          <div
            v-if="!separateByArea[type]"
            :key="index"
            class="config-box">
            <remote-week-cy
              :separateByArea="separateByArea[type]"
              :allConfigs="allConfigs"
              :configs="configs"
              :config="config"
              :durations='durations'
              :area="0"
              :index="index"
              :type="type" />
          </div>
        </template>
      </div>

    </template>
    <!-- 已经生效的日期 隐藏掉这个 -->
    <div v-if="hasOriginConfigAfter || hasConfigBeforeChange" class="effective__date">
      <label class="c-label" style="line-height: 35px">生效日期</label>

      <el-date-picker
        v-model="computedEffectiveDate"
        :picker-options="pickerOptions"
        type="date"
        :clearable="false"
        :value-format="'yyyy-MM-dd'"
        placeholder="选择日期"
      />
    </div>
    <div class="button-box">
      <el-button
        v-if="isSuperAdmin"
        size="small"
        @click="onGoBack">返回</el-button>
      <!--v-if="!updateShow && permission === 'edit'"-->
      <el-button
        size="small"
        type="primary"
        @click="onUpdate">更新</el-button>
    </div>
    <el-dialog
      class="authorize-dialog"
      :visible.sync="visible"
      width="45%"
      @close="onClose"
    >
      <span
        slot="title"
        style="display: block; text-align: center; font-weight: bold;font-size: 14px">提示</span>
      <div>修改常规配置后，如有家属已预约，将重新分配相关可视电话时间段，调整后会以短信形式通知相关家属。若预约日期无法在当日分配时间段，系统将自动取消该家属申请，并以短信形式通知相关家属！请确认是否继续操作！</div>
      <div
        slot="footer"
        class="button-box"
        style="padding-bottom: 0;">
        <el-button
          type="default"
          size="mini"
          @click="onClose">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="prisonDetil"
      class="authorize-dialog"
      @close="tableClose"
      title="请选择设备"
      width="900px">
      <div
        class="button-box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          max-height="300px"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="终端号"
            prop="terminalNumber">
          </el-table-column>
          <el-table-column
            prop="terminalName"
            label="终端别名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="prisonConfigName"
            label="监区">
          </el-table-column>
          <el-table-column
            prop="prisonChildAreaName"
            label="分监区">
          </el-table-column>
          <el-table-column
            prop="prisonBuildingName"
            label="楼栋">
          </el-table-column>
          <el-table-column
            prop="prisonFloorName"
            label="楼层">
          </el-table-column>
        </el-table>

      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="setPrimary(false,area)" :disabled="false">确 定</el-button>
          <el-button @click="prisonDetil=false">取 消</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex'

  import normalMixins from '../mixins'

  import Moment from 'moment'

  import { Message } from 'element-ui'

  import remoteWeekCy from './remote-week-cy'

  import http from '@/service'

  import { meetingChargeConfigDurations } from '@/common/constants/const'

  export default {
    components: {
      remoteWeekCy
    },
    mixins: [normalMixins],
    data() {
      const basicConfig = {
        // 工作日
        days: [],
        // 配置时间段
        config: [],
        // 时间段队列
        queue: [],
        timeperiod: [],
        timeperiodQueue: [],
        interval: 5,
        duration: 25,
        area:0,
        showError: []
      }
      return {
        // '周'的选项
        week: [
          { label: '星期一', value: 1 },
          { label: '星期二', value: 2 },
          { label: '星期三', value: 3 },
          { label: '星期四', value: 4 },
          { label: '星期五', value: 5 },
          { label: '星期六', value: 6 },
          { label: '星期日', value: 0 }
        ],
        // 默认初始的时间队列
        queue: ['09:00', '10:00'],
        flag: true,
        // 确定更新按钮加载
        separateByArea : [],
        // 确定是否分生产区跟监舍区
        prisonDetil : false,
        // 确定是否分生产区跟监舍区
        loading: false,
        permission: 'add',
        // 提示对话框显示属性
        visible: false,
        // 原始的配置信息
        orignConfigs: [],
        // 正在生效的配置
        configsBefore: [basicConfig],
        durations: [],
        // 即将生效的配置
        configsAfter: [basicConfig],
        allConfigs: [],
        basicConfig,
        effectiveDate: '',
        dateValue: '',
        updateShow: false,
        tableData: [],
        terminals:[[[],[]],[[],[]]],
        area:0,//区分选中的舍监区还是生产区
        // selectOptionProduction :[],//选中生产区设备集合
        // selectOptionDormitory :[],//选中舍监区
        multipleSelection:[],
        types:null
      }
    },

    watch: {
      allConfigs: {
        handler: function (value) {
          if (this.hasOriginConfigAfter) {
            this.updateShow = value[1].some(item => {
              return !item.queue.length
            }) || !this.hasConfigAfter
          }
          else {
            this.updateShow = value[0].some(item => {
              return !item.queue.length
            }) || !this.hasConfigBefore
          }
        },
        deep: true
      }
    },

    computed: {
      // 常规配置
      ...mapState(['normalCongigs']),
      // 是否存在正在生效的配置 现在默认情况下 是肯定有的
      hasConfigBefore() {
        return !!(this.allConfigs[0]
          && this.allConfigs[0].length
          && this.allConfigs[0][0].days.length
          && this.allConfigs[0][0].timeperiodQueue.length
          && this.allConfigs[0][0].queue.length)
      },

      // 是否存在即将生效的配置
      hasConfigAfter() {
        return !!(this.allConfigs[1]
          && this.allConfigs[1].length
          && this.allConfigs[1][0].days.length
          && this.allConfigs[1][0].timeperiodQueue.length
          && this.allConfigs[1][0].queue.length)
      },

      // 原来是否用after
      hasOriginConfigAfter() {
        return !!(this.normalCongigs['configAfter']
          && this.normalCongigs['configAfter'].length
          && this.normalCongigs['configAfter'][0].days.length
          && this.normalCongigs['configAfter'][0].timeperiodQueue.length
          && this.normalCongigs['configAfter'][0].queue.length)
      },

      // 当前仅有before config的时候 并且发生改变的时候
      hasConfigBeforeChange() {
        return !!(this.hasConfigBefore && !_.isEqual(this.allConfigs[0], this.normalCongigs['configBefore']))
      },

      // 可选日期
      // 如果没有after 取值范围就是当前日期的第二天起 默认是当前 + 15 +1
      // 如果有after 默认值是enableAt 范围是当前日期的第二天起 到 enableAt
      pickerOptions() {
        return {
          disabledDate: (time) => {
            if (!this.hasOriginConfigAfter) {
              return time.getTime() < Date.now()
            }
            else {
              const enabledAt = this.normalCongigs['enabledAt']

              return time.getTime() < Date.now() || time.getTime() > new Date(enabledAt)
            }
          }
        }
      },

     // 生效日期的默认值
    computedEffectiveDate: {
      get() {
        this.dateValue = this.dateValue  || (this.hasOriginConfigAfter ? this.effectiveDate : Moment(Date.now()).add(1, 'days').format('YYYY-MM-DD'))

        return this.dateValue
      },

      set(date) {
        this.dateValue = date
      }
    },
    // 通话时长和间隔时间
    durationIntervalItems() {
      const item = {
        formConfigs: _.cloneDeep(this.durationIntervalormConfigs),

        duration: {
          label: '通话时长',
          type: 'input',
          append: '分钟',
          rules: ['required', 'isPositiveIntegers']
        },

        interval: _.cloneDeep(this.interval)
      }

      if (!this.isSuperAdmin) this.$delete(item, 'duration')

      return this.allConfigs.map(configs => {
        return configs.map((config, index, target) => {
          const cloneItem = _.cloneDeep(item)

          if (this.isSuperAdmin) this.$set(cloneItem['duration'], 'disabled', !(!config.queue.length && target.length === 1))

          this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

          return cloneItem
        })
      })
    }
  },

  // 激活状态

    async activated() {
      // 国科服务管理员权限/信息管理人员权限
      if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
      if (this.permission === 'edit') {
        // 获取远程通话常规配置
        await this.initConfigs()
      }
    },
    methods: {
      ...mapActions([
        // 获取通话常规配置
        'getRemoteNormalConfigs',
        // 更新通话常规配置
        'updateRemoteNormalConfig'
      ]),
      switchChange($event,type){
        if($event){
          this.$set(this.allConfigs[type], 0,{ days: [],config: [],queue: [],timeperiod: [],timeperiodQueue: [],interval: 5,duration: 25,area:2,showError: [] })
          this.$set(this.allConfigs[type], 1,{ days: [],config: [],queue: [],timeperiod: [],timeperiodQueue: [],interval: 5,duration: 25,area:1,showError: [] })
        }
        else{
          this.$set(this.allConfigs, type, _.cloneDeep([this.basicConfig]))
        }
      },

      onClose() {
        this.visible = false
        //this.initConfigs()
      },

      async initConfigs() {
        await this.getRemoteNormalConfigs({ jailId: this.jailId })

        Message.closeAll()

        const { configBefore, configAfter, enabledAt, durations } = this.normalCongigs

        let beforearea1=[], beforearea2=[], afterarea1=[], afterarea2=[]

        this.separateByArea = [false, false]

        this.normalCongigs['configBefore'].forEach(item=>{
          if(item.area === 1){
            item.terminals.forEach(val=>{
              beforearea1.push(val)
            })
            this.separateByArea[0] = true
          }
          if(item.area === 2){
            item.terminals.forEach(val=>{
              beforearea2.push(val)
            })
            this.separateByArea[0] = true
          }
        })
        this.normalCongigs['configAfter'].forEach(item=>{
           if(item.area === 1){
              item.terminals.forEach(val=>{
                afterarea1.push(val)
              })
            this.separateByArea[1] = true
          }
          if(item.area === 2){
            item.terminals.forEach(val=>{
              afterarea2.push(val)
            })
            this.separateByArea[1] = true
          }
        })
        if(this.separateByArea[0]){
          beforearea1=this.arrindex(beforearea1)
          beforearea2=this.arrindex(beforearea2)
          this.setPrimary(beforearea1)
          this.setPrimary(beforearea2)
          this.terminals[0]=[beforearea1,beforearea2]
        }
        if(this.separateByArea[1]){
          afterarea1=this.arrindex(afterarea1)
          afterarea2=this.arrindex(afterarea2)
          this.setPrimary(afterarea1)
          this.setPrimary(afterarea2)
          this.terminals[1]=[afterarea1,afterarea2]
        }

        this.configsBefore = _.cloneDeep(configBefore)

        this.configsAfter = _.cloneDeep(configAfter)

        this.effectiveDate = enabledAt

        // 为了兼容后端没有返回数据的特殊处理
        let preHandleDurations = durations.length ? durations : meetingChargeConfigDurations

        this.durations = preHandleDurations.map(item => ({ label: item, value: item }))

        this.allConfigs = [this.configsBefore, this.configsAfter]
      },
      //数组去重
      arrindex(arr){
        let obj = {};
        let peon = arr.reduce((cur,next) => {
          obj[next.terminalId] ? "" : obj[next.terminalId] = true && cur.push(next);
          return cur;
        },[])
        return peon
      },
      // 能否新增工作日
      canAddDay(configs) {
        let days = []
        configs.forEach(config => {
          days = days.concat(config.days)
        })
        return days.length < 7
      },

      // 新增时间段(update)
      onNewTimePeriod(timeperiodQueue, index, type) {
        this.allConfigs[type][index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))

        this.allConfigs[type][index].showError.push(false)
      },

      // form组件数据
      onResponse(params) {
        const { index, duration, interval, type } = params

        this.$set(this.filterDuration, type, duration)

        this.$set(this.allConfigs[type][index], 'duration', duration)

        this.$set(this.allConfigs[type][index], 'interval', interval)
      },

      // 生成通话时间段
      async onFigureOut(config, index, type) {
        try {
          const isChecked = await this.$refs[`${type}form${index}`][0].onCheck()

          if (isChecked) this.getConfigsQueue(config)

          else {
            const { timeperiodQueue } = config

            timeperiodQueue.forEach((item, index) => {
              this.$set(config['showError'], index, false)
            })
          }
        } catch(err) {
          Promise.reject(err)
        }
      },

      // 参数化(update)
      filterParams(params,type) {
        let result = []
        params.forEach(config => {
          const { duration, interval, days, queue, area, timeperiodQueue } = config
          if (!config.days.length || !config.queue.length || !config.timeperiodQueue.length) return
           config.terminals=[]
           if(config.area === 1){
              let terminals=[]
              if(this.terminals[type][0]){
                  this.terminals[type][0].forEach(item=>{
                    if(item.terminalId){
                      terminals.push(item.terminalId)
                    }else{
                      terminals.push(item.id)
                    }
                   })
              }
              config.terminals=terminals
            }
          if(config.area === 2){
            let terminals=[]
            if(this.terminals[type][1]){
              this.terminals[type][1].forEach(item=>{
                 if(item.terminalId){
                      terminals.push(item.terminalId)
                    }else{
                      terminals.push(item.id)
                    }
              })
              config.terminals=terminals
          }
          }
          let c = []

          let period = []

          queue.forEach(q => c.push(q.join('-')))

          timeperiodQueue.forEach(t => period.push(t.join('-')))

          result.push({ days, config: c, terminals:config.terminals, area,duration, interval, timeperiod: period })
        })

        return result
      },

      // 更新按钮的方法
      // 只有before
      onUpdate() {
        const [before, after] = this.allConfigs
        let isUpdate=false,isTerminals=false,separateByArea
        //先判断生产区和建设区同时修改配置更新
            if (this.hasOriginConfigAfter) {
              if(this.separateByArea[1]){
                isTerminals=this.terminals[1].every(item=> {
                return item.length>0
                })
                isUpdate = this.isByArea(after)
                separateByArea=this.separateByArea[1]
              }
            } else {
              if(this.separateByArea[0]){
               isTerminals=this.terminals[0].every(item=> {
                return item.length>0
                })
              isUpdate = this.isByArea(before)
              separateByArea=this.separateByArea[0]
              }
            }
         if(!isTerminals && separateByArea){
           this.$message({
            showClose: true,
            message: '更新需要选择设备号',
            duration: 3000,
            type: 'error'
          })
          return false
        }
        if(isUpdate && separateByArea){
           this.$message({
            showClose: true,
            message: '生产区和监舍区需同时配置后才可更新',
            duration: 3000,
            type: 'error'
          })
          return false
        }

        let hasNoChanged

        const { configBefore, configAfter, enabledAt } = this.normalCongigs

        if (!this.hasOriginConfigAfter) hasNoChanged = _.isEqual(this.filterParams(before,0), this.filterParams(configBefore,0)) && (!enabledAt || enabledAt === this.computedEffectiveDate)

        else hasNoChanged = _.isEqual(this.filterParams(after,1), this.filterParams(configAfter,1)) && enabledAt === this.computedEffectiveDate

        if (hasNoChanged) {
          // this.$message({
          //   showClose: true,
          //   message: '配置没有变化，无需编辑！',
          //   duration: 3000,
          //   type: 'error'
          // })
          this.visible = true
        }
        // 展示提示对话框
        else this.visible = true
      },

      // 更新常规配置
      onSubmit() {
        let params
        const [before, after] = this.allConfigs

        if (this.hasOriginConfigAfter) {
          params = this.filterParams(after,1)
        } else {
          params = this.filterParams(before,0)
        }
        const { id, jailId } = this.normalCongigs

        this.loading = true

        this.updateRemoteNormalConfig({
          enabledAt: this.computedEffectiveDate,
          id,
          jailId,
          configAfter: params
        }).then(res => {
          this.loading = false
          if (!res) return
          this.visible = false
        })
      },
      //判断是否监舍区与生产区一起配置
      isByArea(arr){
        let n=0,m=0
        arr.forEach(item=>{
          if(item.area === 1 && item.queue.length > 0) n=1
          if(item.area === 2 && item.queue.length > 0) m=1
        })
         return n+m<2?true:false
      },
      // 新增一个时间段 配置默认的会见时间段(update)
      handleConfig(index, type, configs) {
        const duration = this.filterDuration[type]

        const timeperiodQueue = [this.queue]

        const interval = 5

        const showError = [false]

        const values = {
          duration,
          timeperiodQueue,
          interval,
          showError
        }

        const keys = ['duration', 'timeperiodQueue', 'interval', 'showError']

        keys.forEach(key => {
          this.$nextTick(function() {
            this.$set(this.allConfigs[type][index], key, values[key])
          })
        })
      },

      // 删除当前常规配置(update)
      handleDeleteConfig(params) {
        let { configs, index, type } = params

        const { configBefore } = this.normalCongigs

        const beforDuration = _.cloneDeep(configBefore)[0].duration

        const initDuration = beforDuration

        this.$nextTick(function() {
          if (configs.length > 1) this.allConfigs[type].splice(index, 1)

          else {
            this.$set(this.allConfigs, type, _.cloneDeep([this.basicConfig]))

            this.$set(this.filterDuration, type, initDuration)
          }
        })
      },

      // 新增工作日
      onAddDay(type) {
        // 在常规配置里面新增一个初始化的配置
        this.allConfigs[type].push({ days: [], interval: 5, duration: this.filterDuration[type], timeperiod: [], config: [], queue: [], timeperiodQueue: [], showError: [] })
      },

      // 显示的日 w: 日子对象 config：当前配置信息 index： 当前索引
      showWeek(w, config, index, configs) {
        // 配置信息的时间段队列存在的话
        if (config.timeperiodQueue.length) {
          // 存在就显示
          return config.days.some(v => v === w.value)
        }
        // 没有配置时间(新增工作日)
        else {
          let days = []
          // 新增后的常规配置信息:key
          configs.forEach((config, i) => {
            // 已经配置了的日期
            if (i !== index) days = days.concat(config.days)
          })
          // 过滤已经配置了的日子
          return !days.some(v => v === w.value)
        }
      },
      //全选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //选择设备显示表
      tableShow(area,type){
        this.prisonDetil=true
        let params={jailId:this.jailId,area:area}
        http.getTerminal(params).then( res=>{
          this.tableData=res
          this.area=area
          this.types=type
          if(area==2){
             if(this.terminals[type][0]){
            this.tableData=this.tableData.filter(item=>{
              return !this.terminals[type][0].find((val)=>{
                 return item.id == val.terminalId ||item.id == val.id
              })
            })
             }
          }
          if(area==1){
            if(this.terminals[type][1]){
               this.tableData=this.tableData.filter(item=>{
              return !this.terminals[type][1].find((val)=>{
                return item.id == val.terminalId ||item.id == val.id
              })
            })
            }
          }
           this.$nextTick(() => {
            this.tableData.forEach(outerItem => {
              if(area==2){
            if(this.terminals[type][1]){
                this.terminals[type][1].forEach((item) => {
                  if (outerItem.id == item.terminalId ||outerItem.id == item.id ){
                    this.$refs.multipleTable.toggleRowSelection(outerItem, true)
                  }
                })
            }
              }else{
                 if(this.terminals[type][0]){
                this.terminals[type][0].forEach((item) => {
                  if (outerItem.id == item.terminalId ||outerItem.id == item.id ){
                    this.$refs.multipleTable.toggleRowSelection(outerItem, true);
                  }
                })
              }
              }
            })
          })
        })
      },
      //关闭设备显示表
      tableClose(){
        this.prisonDetil=false
      },
      //删除按扭
      open(item,type,area) {
        const confirmText = ['是否将'+item.selectArr+'"设备，从选中的设备项中移出？',  '注意：删除终端后，将重新分配通话时间段，如预约日期无法分配时间段，系统将自动取消通话申请，调整后会以短信的形式通知相关家属 ，请确认是否继续操作？']
        const newDatas = []
        const h = this.$createElement
        for (const i in confirmText) {
          newDatas.push(h('p', null, confirmText[i]))
        }
        this.$confirm( '提示', {
          title: '提示',
          message: h('div', null, newDatas),
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(area==2){
            //this.$set( this.terminals[type],1, this.terminals[type][1].filter(val=> val!=item))
            this.terminals[type][1]= this.terminals[type][1].filter(val=> val!=item)
          }
          if(area==1) {
             this.terminals[type][0]=this.terminals[type][0].filter(val=> val!=item)
          }
           this.$forceUpdate();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //修改按钮对应值
      setPrimary(obj,area){
        let multipleSelection=obj ? obj: this.multipleSelection
        multipleSelection.forEach((item,key)=>{
          this.$set(item, 'selectArr', `${item.terminalNumber}${item.terminalName ? '-' + item.terminalName : ""}`)
        })
        if(area === 1){
          this.terminals[this.types][0] = multipleSelection
        }
        if(area === 2){
          this.terminals[this.types][1] = multipleSelection
        }
        this.prisonDetil = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .container {
    .m-container + .m-container {
      border-top: 1px solid #dcdfe6;
      padding-top: 10px;
    }
    .config-box{
      overflow: hidden;
      padding-top: 3px;
    }

    label.c-label{
      width: 70px;
      text-align: right;
      font-weight: normal;
      float: left;
      color: #606266;
      line-height: 28px;
      margin-right: 10px;
    }
    .button-float{
      float: left;
      margin-bottom: 10px;
      // margin-left: 0;
    }
    .button-box{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      clear: both;
    }
    .authorize-dialog {
      /deep/ .button-box {
        button {
          width: 14% !important;
        }
      }
    }

    .duration-interval-form {
      padding-top: 5px;
      /deep/ .el-form-item {
        margin-bottom: 13px;

        .el-form-item__content {
          width: 30%;
        }

        label {
          line-height: 36px;
        }

        .el-form-item__error {
          padding-top: 0px;
          top: 95%
        }
      }
    }

    .timeperiod {
      display: flex;

      /deep/ label {
        line-height: 36px;
      }

      /deep/ .range-selecor__container {
        display: flex;
        flex-direction: column;
        width: 30%;
        margin-right: 10px;

        .m-range-selector {
          float: none;
          width: $absolutely-measure;
          height: 36px;
          margin-bottom: 13px;
        }
      }

      button {
        margin-bottom: 13px;
      }

      /deep/ .error-status {
        .m-range-selector {
          border-color: $red;
          margin-bottom: 4px;
        }
        & ~ button {
          margin-bottom: 15px;
        }
      }

    }
    .prisonlabel{
      width: 240px;
      min-height:34px ;
      margin-top: 4px;
      border: 1px solid #dcdfe6 ;
      border-radius: 5px;
      float: left;
    }
  }

  .after-tip {
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 10px;
  }

  .error__tip {
    color: $red;
    font-size: 12px;
    line-height: 1;
  }

  .effective__date {
    padding-top: 10px;

    .el-date-editor {
      width: 30%;
    }
  }

  .none_superAdmin {
    line-height: 36px;
    label, span {
      display: inline-block;
    }
    label {
      width: 70px;
      text-align: right;
      margin-right: 10px;
      font-weight: normal;
      color: #606266;
    }
  }
</style>
