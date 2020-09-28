<template>
  <div
    v-if="show"
    class="m-container">
    <div
      v-for="(config, index) in configs"
      :key="index"
      class="config-box">
      <div class="day-box">
        <label class="c-label">选择日期</label>
        <el-tooltip
          v-if="showTooltip[index]"
          effect="light"
          popper-class="color-transprant__tooltip"
          :content="config.day.join(',')"
          placement="top-start"
        >
          <el-date-picker
            v-model="config.day"
            size="mini"
            type="dates"
            :disabled="!!config.id"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="onSureDates($event, config, index)"
          />
        </el-tooltip>
        <el-date-picker
          v-else
          class="none-2"
          v-model="config.day"
          size="mini"
          type="dates"
          :disabled="!!config.id"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="onSureDates($event, config, index)"
        />
        <el-radio-group
          v-model="config.enabledMeeting"
          @change="handleDate(config, currentDuration)">
          <el-radio :label="1">支持预约申请</el-radio>
          <el-radio :label="0">不支持预约申请</el-radio>
        </el-radio-group>
        <!--（不支持通话申请或者支持通话申请并且通话时间段已经初始化）并且是国科服务管理员-->
        <el-button
          plain
          type="danger"
          size="mini"
          v-if="(config.enabledMeeting === 0 || config.queue.length)"
          @click="handleDeleteConfig(config, index)">删除当前日期配置</el-button>
           <el-button
          v-if="!config.show &&(canSave(config) && permission === 'edit')"
          type="primary"
          size="mini"
          @click="onSubmit(config, index)">保存</el-button>       
        <!--编辑状态并且不支持通话并且选择了日期并且国科服务管理员角色并且是最新一个配置的-->
        <el-button
          v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.enabledMeeting === 0 && config.day)"
          size="mini"
          type="success"
          class="button-float"
          @click="onAddDay">新增特殊日期</el-button>
      </div>

        <div>
          <el-form>
            <el-form-item label="是否分生产区和监舍区">
              <el-switch
                v-model="config.show"
                :disabled="true"
                active-color="#13ce66">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div  v-if="config.show">
          <el-form >
            <el-form-item label="生产区设备:" style="width:450px">
              <div class="prisonlabel">
                <el-button  v-for="(item,index) in terminals[0] "
                           :key='index' size="mini"
                           style="margin-left: 5px"
                           >{{item.selectArr}} 
                </el-button>
              </div>
              <el-button  v-if="config.area=='1'|| config.type || !(config.enabledMeeting && flag) "  type="primary" size="mini" style="margin-left: 10px;float: left;margin-top: 8px" @click="onSureDates(false, config, index,2)">配置时间段</el-button>
               <!--可保存状态并且是国科服务管理员并且是编辑状态-->
            <el-button
              v-if="config.area=='2'&&canSave(config) && permission === 'edit'"
              type="primary"
              size="mini"
              style="margin-top:8px;margin-left:15px"
              @click="onSubmit(config, index)">保存</el-button>
                  </el-form-item>
          </el-form>
              <div v-if="config.area=='2'">
                <template v-if="config.timeperiodQueue.length && config.enabledMeeting">
                  <div class="none_superAdmin">
                    <label >通话时长</label>
                    <span>{{ config.duration }} 分钟</span>
                  </div>

                  <m-form
                    class="duration-interval-form"
                    :items="durationIntervalItems[index]"
                    :values="{ index: index, interval: config.interval }"
                    @response="onResponse"
                    :ref="`form${index}`"
                  />

                  <div
                    class="timeperiod"
                    v-for="(queue, o) in config.timeperiodQueue"
                    :key="o"
                  >
                    <label class="c-label">{{ '时间段' + convertToChinaNum(o + 1) }}</label>

                    <div :class="['range-selecor__container', { 'error-status': config['showError'][o] } ]">
                      <m-time-range-selector
                        :val="queue"
                        :configs="{
                          prev: {
                            attrs: {
                              prefixIcon: 'ower-cssName'
                            } 
                          }
                        }"
                        :disabled="!!config.queue.length"
                        :prev="config.timeperiodQueue[o - 1]"
                        :next="config.timeperiodQueue[o + 1]"
                        type="queue"
                        @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
                      />
                      <div
                        v-if="config['showError'][o]"
                        class="error__tip">时间段区间小于通话时长</div>
                      </div>
                    
                      <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length ">
                        <el-button
                          v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                          type="primary"
                          size="mini"
                          style="margin-right: 10px;"
                          @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index)">新增时间段</el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="onFigureOut(config, index)">生成通话时间段</el-button>
                        <el-button
                          v-if="config.timeperiodQueue.length > 1"
                          size="mini"
                          type="danger"
                          @click="onDelTimePriod(config)">删除时间段</el-button>
                      </template>
                     </div>

          <!-- 可配置/时间段存在 -->
        <div
          v-if="config.enabledMeeting && config.queue.length && flag"
          style="overflow: hidden; margin-bottom: 10px;">
          <label class="c-label">时间段分配</label>
          <div
            style="float: left; width: calc(100% - 80px); overflow: hidden;">
            <m-time-range-selector
              v-for="(queue, o) in config.queue"
              :key="o"
              :val="queue"
              :disabled="true"
              :prev="config.queue[o - 1]"
              :next="config.queue[o + 1]"
              type="queue"
            />
            <!-- 通常规时间配置 -->
            <el-button
              size="mini"
              class="button-float"
              :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
              @click="onRestQueue(config)">重置会见时间段</el-button>
            <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
            <el-button
              v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.queue.length > 0)"
              size="mini"
              type="success"
              class="button-float"
              @click="onAddDay">新增特殊日期</el-button>
          </div>
        </div>
                 </template>
              </div>
            <el-form>
            <el-form-item label="监舍区设备:" style="width:450px">
              <div class="prisonlabel">
               <el-button  v-for="(item,index) in terminals[1] "
                           :key='index' size="mini"
                           style="margin-left: 5px">{{item.selectArr}} 
                </el-button>
              </div>
             <el-button  v-if="config.area=='2'||!(config.enabledMeeting && flag) || config.type"  type="primary" size="mini" style="margin-left: 10px;float: left;margin-top: 8px" @click="onSureDates(false, config, index,1)">配置时间段</el-button>
              <el-button
              v-if="config.area=='1'&&canSave(config) && permission === 'edit'"
              type="primary"
              size="mini"
              style="margin-top:8px;margin-left:15px"
              @click="onSubmit(config, index)">保存</el-button>
            </el-form-item>
            
          </el-form>
          <div v-if="config.area=='1'">
                <template v-if="config.timeperiodQueue.length && config.enabledMeeting">
        <div class="none_superAdmin">
          <label >通话时长</label>
          <span>{{ config.duration }} 分钟</span>
        </div>

        <m-form
          class="duration-interval-form"
          :items="durationIntervalItems[index]"
          :values="{ index: index, interval: config.interval }"
          @response="onResponse"
          :ref="`form${index}`"
        />

        <div
          class="timeperiod"
          v-for="(queue, o) in config.timeperiodQueue"
          :key="o"
        >
          <label class="c-label">{{ '时间段' + convertToChinaNum(o + 1) }}</label>

          <div :class="['range-selecor__container', { 'error-status': config['showError'][o] } ]">
            <m-time-range-selector
              :val="queue"
              :configs="{
                prev: {
                  attrs: {
                    prefixIcon: 'ower-cssName'
                  } 
                }
              }"
              :disabled="!!config.queue.length"
              :prev="config.timeperiodQueue[o - 1]"
              :next="config.timeperiodQueue[o + 1]"
              type="queue"
              @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
            />
            <div
              v-if="config['showError'][o]"
              class="error__tip">时间段区间小于通话时长</div>
            </div>
          
            <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length ">
              <el-button
                v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                type="primary"
                size="mini"
                style="margin-right: 10px;"
                @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index)">新增时间段</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="onFigureOut(config, index)">生成通话时间段</el-button>
              <el-button
                v-if="config.timeperiodQueue.length > 1"
                size="mini"
                type="danger"
                @click="onDelTimePriod(config)">删除时间段</el-button>
            </template>
          </div>

          <!-- 可配置/时间段存在 -->
        <div
          v-if="config.enabledMeeting && config.queue.length && flag"
          style="overflow: hidden; margin-bottom: 10px;">
          <label class="c-label">时间段分配</label>
          <div
            style="float: left; width: calc(100% - 80px); overflow: hidden;">
            <m-time-range-selector
              v-for="(queue, o) in config.queue"
              :key="o"
              :val="queue"
              :disabled="true"
              :prev="config.queue[o - 1]"
              :next="config.queue[o + 1]"
              type="queue"
            />
            <!-- 通常规时间配置 -->
            <el-button
              size="mini"
              class="button-float"
              :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
              @click="onRestQueue(config)">重置会见时间段</el-button>
            <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
            <el-button
              v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.queue.length > 0)"
              size="mini"
              type="success"
              class="button-float"
              @click="onAddDay">新增特殊日期</el-button>
          </div>
        </div>
  </template>
          </div>
        </div>
        <div v-if="!config.show">
          <template v-if="config.timeperiodQueue.length && config.enabledMeeting">
                <div class="none_superAdmin">
                  <label >通话时长</label>
                  <span>{{ config.duration }} 分钟</span>
                </div>
                <m-form
                  class="duration-interval-form"
                  :items="durationIntervalItems[index]"
                  :values="{ index: index, interval: config.interval }"
                  @response="onResponse"
                  :ref="`form${index}`"
                />
                <div
                  class="timeperiod"
                  v-for="(queue, o) in config.timeperiodQueue"
                  :key="o"
                >
                  <label class="c-label">{{ '时间段' + convertToChinaNum(o + 1) }}</label>

                  <div :class="['range-selecor__container', { 'error-status': config['showError'][o] } ]">
                    <m-time-range-selector
                      :val="queue"
                      :configs="{
                        prev: {
                          attrs: {
                            prefixIcon: 'ower-cssName'
                          } 
                        }
                      }"
                      :disabled="!!config.queue.length"
                      :prev="config.timeperiodQueue[o - 1]"
                      :next="config.timeperiodQueue[o + 1]"
                      type="queue"
                      @handleBlur="handleBlur($event, config.timeperiodQueue, index)"
                    />
                    <div
                      v-if="config['showError'][o]"
                      class="error__tip">时间段区间小于通话时长</div>
                    </div>
                  
                    <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length ">
                      <el-button
                        v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                        type="primary"
                        size="mini"
                        style="margin-right: 10px;"
                        @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index)">新增时间段</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="onFigureOut(config, index)">生成通话时间段</el-button>
                      <el-button
                        v-if="config.timeperiodQueue.length > 1"
                        size="mini"
                        type="danger"
                        @click="onDelTimePriod(config)">删除时间段</el-button>
                    </template>
                  </div>

                  <!-- 可配置/时间段存在 -->
                <div
                  v-if="config.enabledMeeting && config.queue.length && flag"
                  style="overflow: hidden; margin-bottom: 10px;">
                  <label class="c-label">时间段分配</label>
                  <div
                    style="float: left; width: calc(100% - 80px); overflow: hidden;">
                    <m-time-range-selector
                      v-for="(queue, o) in config.queue"
                      :key="o"
                      :val="queue"
                      :disabled="true"
                      :prev="config.queue[o - 1]"
                      :next="config.queue[o + 1]"
                      type="queue"
                    />
                    <!-- 通常规时间配置 -->
                    <el-button
                      size="mini"
                      class="button-float"
                      :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                      @click="onRestQueue(config)">重置会见时间段</el-button>
                    <!--编辑状态并且支持通话并且选择了日期并且国科服务管理员角色并且是最新配置并且初始化了通话时间段-->
                    <el-button
                      v-if="(permission === 'edit' || (permission === 'add' && configs.length < 10)) && (index === configs.length - 1 && config.queue.length > 0)"
                      size="mini"
                      type="success"
                      class="button-float"
                      @click="onAddDay">新增特殊日期</el-button>
                  </div>
                </div>
          </template>

        </div>
      <!-- 选择的日期 -->
      <!-- <div class="config-days__selected">
        <label >配置日期</label>
        <el-select
          ref="test"
          v-model="a"
          multiple
          placeholder="配置日期">
          <el-option
            v-for="item in array"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </div> -->
     
    </div>
    <div
      class="button-box"
      v-if="superAdmin" >
      <el-button
        size="small"
        @click="onGoBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

import Moment from 'moment'

import normalMixins from '../mixins'

import cloneDeep from 'lodash/cloneDeep'

export default {
  mixins: [normalMixins],

  data() {
    const basicConfig = {
      enabledMeeting: 1,
      day: '',
      config: [],
      queue: [],
      duration: 25,
      interval: 5,
      timeperiod: [],
      timeperiodQueue: [],
      showError: []
    }
    return {
      // data里面的特殊日期配置
      configs: [
        // { day: '', config: [], queue: [], enabledMeeting: 1 }
      ],
      queue: ['09:00', '12:00'],
      show: true,
      flag: true,
      loading: false,
      // 选择日期的选择选项配置
      terminals:[[],[]],
      pickerOptions: {
        // 不可选的时间: 今天之前的 或者是已经选择了的日期
        disabledDate: (time) => {
          const { unMeetingDays } = this.specialConfigs
          let t = Moment(new Date(time)).format('YYYY-MM-DD')
          return ( time.getTime() < Date.now()) || (this.configs.find(item => item.day === t) || unMeetingDays.find(day => day.applicationDate === t ))
        }
      },
      // 页面权限
      permission: 'add',
      basicConfig,
      separateByArea:false,
      currentDuration: 25,
      showTooltip: []
    }
  },

  computed: {
    // vuex里面的特殊日期配置
    ...mapState(['specialConfig', 'specialConfigs']),

    durationIntervalItems() {
      const item = {
        formConfigs: {
          labelWidth: '81px',
          hideRequiredAsterisk: true,
        },
        interval: {
          label: '间隔时间',
          type: 'input',
          append: '分钟',
          rules: ['required', 'isNumber']
        }
      }

      return this.configs.map((config, index, target) => {
        const cloneItem = cloneDeep(item)

        this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)

        return cloneItem
      })
    },

    hasConfigsAfter() {
      const { configAfter } = this.specialConfigs

      return !!(configAfter && configAfter.length && configAfter[0].days  && configAfter[0].days.length && configAfter[0].timeperiod  && configAfter[0].timeperiod.length && configAfter[0].config && configAfter[0].config.length)
    }
  },
  async activated() {
    // 国科服务管理员权限/信息管理人员权限
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') this.permission = 'edit'
    if (this.permission === 'edit') {
      // 获取特殊日期配置
      await this.initData()
    }
  },
  methods: {
    ...mapActions([
      // 新增特殊日期配置(保存操作)
      'addSpecialConfig',
      // 更新特殊日期配置
      'updateSpecialConfig',
      // 删除特殊日期配置
      'deleteSpecialConfig',
      // 获取特殊日期配置
      'getRemoteSpecialConfigs'
    ]),

    async initData() {
      await this.getRemoteSpecialConfigs({ jailId: this.jailId })
   const { complexSpecialConfigs , separateByArea } = this.specialConfigs
     this.separateByArea=separateByArea?true:false
     this.configs = cloneDeep(complexSpecialConfigs)
     console.log(this.configs)
      let beforearea1=[],beforearea2=[]
      this.configs.forEach(item=>{
        if(item.area){
          item.show=true
          if( item.area==1){
            console.log(item.terminals)
            item.terminals.forEach(val=>{
                beforearea1.push(val)
            })
          }
          if( item.area==2){
             item.terminals.forEach(val=>{
                beforearea2.push(val)
            })
          }
        }else{
           item.show=false
        }
      })
      if(beforearea1.length>0||beforearea2.length>0){
         beforearea1=this.arrindex(beforearea1)
         beforearea2=this.arrindex(beforearea2)
          this.setPrimary(beforearea1)
           this.setPrimary(beforearea2)
          this.terminals[0]=beforearea1
          this.terminals[1]=beforearea2
      }
      this.showTooltip = new Array(this.configs.length).fill(false)
    },//修改按钮对应值
      setPrimary( obj){
        let multipleSelection=obj
        multipleSelection.forEach((item,key)=>{
          this.$set(item, 'selectArr', `${item.terminalNumber}${item.terminalName?'-'+item.terminalName:""}`)
        })
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
    // 选择日期确定后
    // 先要判断是否选择得日期 有交叉得部分
    onSureDates(e, configs, index,area) {
      const {
        beforeDuration,
        afterDuration,
        enabledAt
      } = this.specialConfigs
      if(this.separateByArea){
        this.$set(configs, 'type', !configs.type)
        this.$set(configs, 'show', true)
        if(area==configs.area){
          this.$set(configs, 'updates',false )
        }else{
           this.$set(configs, 'updates',true )
        }
        this.$set(configs, 'area',area )
      }
      if (this.hasConfigsAfter && e) {
        // Moment实例化后的数组
        const rangeDates = this.momentInputs(e)

        // 最大的日期
        const maxDate = Moment.max(rangeDates)

        // 最小的日期
        const minDate = Moment.min(rangeDates)

        // 是否在中间
        const isBetween = Moment(enabledAt).isBetween(minDate, maxDate)

        // 选择的日期都在生效日期之前
        const isBefore = Moment(maxDate).isBefore(enabledAt)

        // 选择的日期都在生效日期之后
        const isAfter = Moment(minDate).isAfter(enabledAt)

        if (isBetween) {
          this.$set(configs, 'timeperiodQueue', [])

          this.$message.error('所选日期常规配置中的通话时长不同，请分开配置！')

          return
        }

        else if (isBefore) {
          this.currentDuration = beforeDuration
        }

        else if (isAfter) {
          this.currentDuration = afterDuration
        }
      }
      else {
        this.currentDuration = beforeDuration || configs.duration
      }

      if (e && Array.isArray(e) && e.length > 1) this.showTooltip[index] = true

      else this.showTooltip[index] = false
      this.$set(configs, 'queue', [])

      this.handleDate(configs, this.currentDuration)
    },

    // 把输入的日期格式初始化
    momentInputs(inputs = [], formatString = 'YYYY-MM-DD') {
      return inputs.map(input => {
        return Moment(input, formatString)
      })
    },

    // 很单一的判断是否含有某个值(别删除)
    // 如果是before的话 那么就要小于生效日期
    // 如果是after的话 那么就要大于生效日期
    isIncludeInput(targetArray, input, type = 'before') {
      return targetArray.some(item => {
        if (type === 'before') return Moment(item).diff(Moment(input)) < 0
        if (type === 'after') return Moment(item).diff(Moment(input)) > 0
      })
    },

    // 选择日期后 初始化时间段
    handleDate(config, currentDuration) {
      // 选择了日子 并且 是支持通话申请 并且 没有通话配置通话时间段的
      this.$set(config, 'duration', currentDuration)
      if (config.day && config.enabledMeeting && config.queue.length < 1) {
        this.$set(config, 'timeperiodQueue', [this.queue])
      }
    },

    onNewTimePeriod(timeperiodQueue, index) {
      this.configs[index].timeperiodQueue.push(this.getNextRange(timeperiodQueue, 180))

      this.configs[index].showError.push(false)
    },

    // 生成通话时间段
    async onFigureOut(config, index) {
      try {
        const isChecked = await this.$refs[`form${index}`][0].onCheck()

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

    // form组件数据
    onResponse(params) {
      const { index, interval } = params

      this.$set(this.configs[index], 'interval', interval)
    },

    // 单独保存某一个特殊日期配置
    onSubmit(config, index, e) {
      const {
        day,
        duration,
        interval,
        area,
        enabledMeeting,
        id,
        queue,
        updates,
        timeperiodQueue
      } = config
console.log(config)
      let terminals=[]
      if(area==1){
        this.terminals[1].forEach(item=>{
            terminals.push(item.terminalId)
        })
      }
      if(area==2){
         this.terminals[0].forEach(item=>{
            terminals.push(item.terminalId)
        })
      }
      console.log(terminals)
      let params = {
        day,
        duration,
        interval,
        area,
        terminals,
        enabledMeeting,
        jailId: Number(this.jailId),
        config: [],
        timeperiod: []
      }

      if (enabledMeeting) {
        params.config = []
        queue.forEach(q => params.config.push(q.join('-')))
        timeperiodQueue.forEach(q => params.timeperiod.push(q.join('-')))
      }

      if (e) return params
      // 更新配置
      if (id) {
        params.id = id
        if(updates){
          params.id =null
          if(!Array.isArray(params.day)){
            console.log(params.day)
            params.day=[params.day]
            console.log(params.day)
          }
          this.addSpecialConfig(params).then(async res => {
          if (!res) return
          await this.initData()
          this.show = false
          this.show = true
        })
        }else{
          this.updateSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
          config.config = params.config || []
          config.timeperiod = params.timeperiod || []
       })
        }
        this.updateSpecialConfig(params).then(res => {
          if (!res) return
          config.oldDay = params.day
          // config.config = params.config
          config.config = params.config || []
          config.timeperiod = params.timeperiod || []
        })
      }
      // 新增配置
      else {
        this.addSpecialConfig(params).then(async res => {
          if (!res) return

          await this.initData()
          // config.oldDay = params.day
          // config.jailId = params.jailId
          // config.config = params.config || []
          // config.timeperiod = params.timeperiod || []
          // config.id = res.id
          // this.$forceUpdate()
          this.show = false
          this.show = true
        })
      }
    },

    handleEmit() {
      let params = []
      this.configs.forEach((config, index) => {
        if (this.canSave(config)) params.push(this.onSubmit(config, index, true))
      })
      this.$emit('submit', params)
    },

    // 删除特殊日期配置
    handleDeleteConfig(config, index) {
      if (config.id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSpecialConfig({ jailId: config.jailId, day: config.oldDay }).then(res => {
            if (!res) return
            this.splice(index)
          })
        }).catch(() => {})
      }
      else {
        this.splice(index)
      }
    },

    // 删除配置
    splice(index) {
      if (this.configs.length > 1) {
        this.configs.splice(index, 1)
      }
      else {
        this.configs = cloneDeep([this.basicConfig])
      }
    },

    // 可保存状态 本质是一个特殊日期的实际变化
    // 如果是支持通话的 那么queue 肯定要存在
    canSave(config) {
      // config：当前特殊配置信息
      if (!config.day) {
        // 未选择配置日期
        return false
      }
      // 不支持通话申请
      else if (config.enabledMeeting === 0) {
        // 这个日期是初始化时候不支持通话的并且本质上没有改变其状态 则是不可保存的
        if (config.oldEnabled === 0 && config.day === config.oldDay) return false
        return true
      }
      else if (config.queue.length === 0) {
        // 没有配置通话时间段
        return false
      }
      // 新增的特殊日期配置 或者 是新增了通话时间段 或者是更换了新的配置日期
      else if (!config.id || config.config.length !== config.queue.length || config.day !== config.oldDay) {
        return true
      }
      // 修改了某个通话时间段
      else {
        for (let i = 0; i < config.queue.length; i++) {
          if (config.queue[i].join('-') !== config.config[i]) return true
        }
      }
    },

    onAddDay() {
        if(this.separateByArea){


          // this.basicConfig.area=1
          // this.basicConfig.show=true
          // console.log(this.basicConfig)
          // this.configs.push(cloneDeep(this.basicConfig))
          //  this.basicConfig.area=2
          // this.basicConfig.show=true
          // console.log(this.basicConfig)
          this.configs.push(cloneDeep(this.basicConfig))


        }else{
          this.configs.push(cloneDeep(this.basicConfig))
        }

    }
  }
}
</script>
<style lang="scss" scoped>
.m-container {
  .config-box {
    overflow: hidden;
  }
  .config-box+.config-box {
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }
  label.c-label {
    width: 70px;
    text-align: right;
    font-weight: normal;
    float: left;
    color: #606266;
    line-height: 28px;
    margin-right: 10px;
  }
  .button-float {
    float: left;
    margin-bottom: 10px;
    margin-left: 0;
  }
  .button-box {
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
    .prisonlabel{
      width: 240px;
      display: inline-block;
      min-height:34px ;
      margin-top: 4px;
      border: 1px solid #dcdfe6 ;
      border-radius: 5px;
      float: left;
    }
}
.config-days__selected {
  label {
    display: inline-block;
    width: 70px;
    text-align: right;
    margin-right: 10px;
    font-weight: normal;
    color: #606266;
  }
  /deep/ .el-select {
    width: 40%;
  }
}

.none_superAdmin {
  line-height: 36px;
  margin-bottom: 8px;
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
      line-height: 36px !important;
    }

    /deep/ .range-selecor__container {
      display: flex;
      flex-direction: column;
      width: 30%;
      margin-right: 10px;

      .m-range-selector {
        float: none;
        width: 100%;
        height: 36px;
        margin-bottom: 13px;
      }
    }

    button {
        margin-bottom: 13px;
    }

    /deep/ .error-status {
      .m-range-selector {
        border-color: #F56C6C;
        margin-bottom: 4px;
      }
      & ~ button {
        margin-bottom: 15px;
      }
    }
    
  }
</style>
