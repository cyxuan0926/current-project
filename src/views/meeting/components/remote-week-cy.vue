<template>
  <label>
    <div
      class="config-box">
      <div class="day-box">
      <label class="c-label">选择工作日</label>
          <!-- 当前工作日有配置时间段或者不是国科服务管理员的时候disabled状态 -->
          <el-checkbox-group
            v-model="config.days"
            :disabled="!!config.timeperiodQueue.length || (!config.timeperiodQueue.length && !!config.queue.length)">
            <template v-for="(w, i) in week">
              <el-checkbox
                v-if="showWeek(w, config, index, configs)"
                :key="i"
                :label="w.value"
              >{{ w.label }}</el-checkbox>
            </template>
          </el-checkbox-group>
          <el-button
            type="primary"
            size="mini"
            v-if="!config.timeperiodQueue.length && config.days.length && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
            @click="handleConfig(index, type, configs)">配置时间段参数</el-button>
          <el-button
            plain
            type="danger"
            size="mini"
            v-if="config.timeperiodQueue.length && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
            @click="handleDeleteConfig({ configs, index, type })">删除当前配置</el-button>
        </div>
        <template v-if="config.timeperiodQueue.length">
          <!-- 通话时长/时间间隔 -->

          <!-- <div v-if="!isSuperAdmin" class="none_superAdmin">
            <label >通话时长</label>
            <span>{{ config.duration }} 分钟</span>
          </div> -->

          <m-form
            class="duration-interval-form"
            :items="durationIntervalItems[type][index]"
            :values="{ index: index, duration: config.duration, interval: config.interval, type: type }"
            @response="onResponse"
            :ref="`${type}form${index}`"
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

            <template v-if="o === config.timeperiodQueue.length -1 && !config.queue.length  && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))">
              <el-button
                v-if="config.timeperiodQueue[config.timeperiodQueue.length - 1][1] !== '23:59'"
                type="primary"
                size="mini"
                style="margin-right: 10px;"
                @click="onNewTimePeriod(config.timeperiodQueue[config.timeperiodQueue.length - 1], index, type)">新增时间段</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="onFigureOut(config, index, type)">生成通话时间段</el-button>
              <el-button
                v-if="config.timeperiodQueue.length > 1"
                size="mini"
                type="danger"
                @click="onDelTimePriod(config)">删除时间段</el-button>
            </template>
          </div>

          <!-- 当有配置时间队列并且flag -->
          <div
            v-if="config.queue.length && flag"
            style="overflow: hidden; margin-bottom: 10px;"
          >
            <label class="c-label">时间段分配</label>
            <div
              style="float: left; width: calc(100% - 80px); overflow: hidden;">
              <!-- 时间范围选择器 -->
              <m-time-range-selector
                v-for="(queue, o) in config.queue"
                :key="o"
                :val="queue"
                :disabled="true"
                :prev="config.queue[o - 1]"
                :next="config.queue[o + 1]"
                type="queue"
              />
              <!--配置的时间段的最后一个时间段的结束时间是不是23:59并且是国科服务管理员角色-->
               <!--<el-button-->
                      <!--v-if="config.queue[config.queue.length - 1][1] !== '23:59' && !disabled"-->
                      <!--type="primary"-->
                      <!--size="mini"-->
                      <!--class="button-float"-->
                      <!--style="margin-right: 10px;"-->
                      <!--@click="onAddRange(config.queue)">新增会见时间段</el-button>-->
              <!-- 国科服务管理员角色 -->
              <el-button
                v-if="!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0)"
                size="mini"
                class="button-float"
                :style="index === configs.length - 1 ? 'margin-right: 10px;' : ''"
                @click="onRestQueue(config)">重置时间段</el-button>
              <!-- 国科服务管理角色并且有新增的日子选项并且常规配置的长度和当前的索引一致 -->

<!--index === configs.length - 1 && canAddDay(configs,index) && (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))-->
              <el-button
                v-if="config.area==1&&canAddDay(configs,1)&&hasConfigLeng(index)&&  (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
                size="mini"
                type="success"
                class="button-float"
                @click="onAddDay(type,configs)">新增工作日</el-button>
                <el-button
                v-if="config.area==2&&canAddDay(configs,2)&&hasConfigLeng(index)&&  (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
                size="mini"
                type="success"
                class="button-float"
                @click="onAddDay(type,configs)">新增工作日</el-button>
                <el-button
                v-if="!config.area&&canAddDay(configs)&&hasConfigLeng(index)&&  (!hasOriginConfigAfter || !(hasOriginConfigAfter && type === 0))"
                size="mini"
                type="success"
                class="button-float"
                @click="onAddDay(type,configs)">新增工作日</el-button>
            </div>
          </div>
        </template>
      </div>
  </label>
</template>
<script>
  import { mapActions, mapState } from 'vuex'
  import normalMixins from '../mixins'
  import { Message } from 'element-ui'
  export default {
    props: {
      allConfigs: {
        type: Array,
        default:()=> []
      },
      configs: {
        type: Array,
        default:()=> []
      },
      durations: {
        type: Array,
        default:()=> []
      },config:{
        type: Object,
        default:()=> {}
      },
      separateByArea:{
        type:Boolean,
        default:false
      },
      area:[String,Number],
      index:[String,Number],
      type:[String,Number]
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
        loading: false,
        permission: 'add',
        // 提示对话框显示属性
        visible: false,
        // 确定是否分生产区跟监舍区
        prisonDetil : false,
        // 原始的配置信息
        orignConfigs: [],
        // 正在生效的配置
        configsBefore: [basicConfig],

        // 即将生效的配置
        configsAfter: [basicConfig],
        basicConfig,
        effectiveDate: '',
        dateValue: '',
        tableData: [],
        selectOption:[],
        multipleSelection:[],
        canAddLastIndex: []
      }
    },
    computed: {
      // 常规配置
      ...mapState(['normalCongigs']),

      filterDuration() {
        const duration = (this.durations[0] && this.durations[0].value) || 25

        return [duration, duration]
      },

      // 是否存在正在生效的配置 现在默认情况下 是肯定有的
      hasConfigBefore() {
        return this.allConfigs[0] && this.allConfigs[0].length && this.allConfigs[0][0].days.length && this.allConfigs[0][0].timeperiodQueue.length && this.allConfigs[0][0].queue.length
      },

      // 是否存在即将生效的配置
      hasConfigAfter() {
        return this.allConfigs[1] && this.allConfigs[1].length && this.allConfigs[1][0].days.length && this.allConfigs[1][0].timeperiodQueue.length && this.allConfigs[1][0].queue.length
      },

      // 原来是否用after
      hasOriginConfigAfter() {
       return this.normalCongigs['configAfter'] && this.normalCongigs['configAfter'].length && this.normalCongigs['configAfter'][0].days.length && this.normalCongigs['configAfter'][0].timeperiodQueue.length && this.normalCongigs['configAfter'][0].queue.length
      },

      // 当前仅有before config的时候 并且发生改变的时候
      hasConfigBeforeChange() {
        this.normalCongigs.configBefore.forEach(item=>{
          if(item.area){
            item.isarea=true
          }else{
            item.isarea=false
          }
        })
        return this.hasConfigBefore && !isEqual(this.allConfigs[0], this.normalCongigs['configBefore'])
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
          const limitDays = this.normalCongigs['dayInLimit']

          this.dateValue = this.dateValue  || (this.hasOriginConfigAfter ? this.effectiveDate : Moment(Date.now()).add(limitDays, 'days').format('YYYY-MM-DD'))

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
            type: 'select',
            append: '分钟',
            rules: ['required', 'isPositiveIntegers'],
            props:{label:'label',value:'value'},
            options:this.durations,
            value: (this.durations.length && this.durations[0].value) || 25
          },

          interval: _.cloneDeep(this.interval)
        }
        // if (!this.isSuperAdmin) this.$delete(item, 'duration')
        return this.allConfigs.map(configs => {
          return configs.map((config, index, target) => {
            const cloneItem = _.cloneDeep(item)
            // if (this.isSuperAdmin ) {
            //   this.$set(cloneItem['duration'], 'disabled', !index ? !!config.queue.length : true)
            // }
            this.$set(cloneItem['duration'], 'disabled', !index ? !!config.queue.length : true)
            this.$set(config, 'duration', configs.length && configs[0].duration)
            this.$set(cloneItem['interval'], 'disabled', !!config.queue.length)
            return cloneItem
          })
        })
      }
    },
    watch: {
      configs: {
         immediate: true,
        handler: function (value) {
          let productIndex = 0
          let dormitoryIndex = 0
          value.forEach((config,i) => {
              if(this.separateByArea){
                if(config.area==2){
                  productIndex = i
                }
                if(config.area==1){
                  dormitoryIndex = i
                }
              }
          })
          this.canAddLastIndex = [value.length - 1]
          if (this.separateByArea) {
            this.canAddLastIndex.push(Math.min(productIndex, dormitoryIndex))
          }
        }
      }
    },
    methods: {
      // 是否存在正在生效的配置 现在默认情况下 是肯定有的
      hasConfigLeng(index) {
        if(this.canAddLastIndex.length==0){
          return  true
        }else{
          return this.canAddLastIndex.includes(index)
        }
      },
      // 能否新增工作日
      canAddDay(configs,area) {
        let days = [],productiondays=[],dormitorydays=[],isCanAddDay= false
        configs.forEach((config) => {
        if(this.separateByArea){
          if(config.area==1){
            productiondays = productiondays.concat( config.days )
          }
          if(config.area==2){
            dormitorydays = dormitorydays.concat( config.days )
          }
          isCanAddDay = (area == '1' ?  productiondays : dormitorydays).length < 7
         } else {
            days = days.concat(config.days)
            isCanAddDay = days.length < 7
         }
        })
        return isCanAddDay
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
          const isChecked = await this.$refs[`${type}form${index}`].onCheck()
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
      filterParams(params) {
        let result = []

        params.forEach(config => {
          const { duration, interval, days, queue, timeperiodQueue } = config

          if (!config.days.length || !config.queue.length || !config.timeperiodQueue.length) return

          let c = []

          let period = []

          queue.forEach(q => c.push(q.join('-')))

          timeperiodQueue.forEach(t => period.push(t.join('-')))

          result.push({ days, config: c, duration, interval, timeperiod: period })
        })

        return result
      },

      // 更新按钮的方法
      // 只有before
      onUpdate() {
        let hasNoChanged

        const [before, after] = this.allConfigs

        const { configBefore, configAfter, enabledAt } = this.normalCongigs

        if (!this.hasOriginConfigAfter) hasNoChanged = isEqual(this.filterParams(before), this.filterParams(configBefore)) && (!enabledAt || enabledAt === this.computedEffectiveDate)

        else hasNoChanged = isEqual(this.filterParams(after), this.filterParams(configAfter)) && enabledAt === this.computedEffectiveDate

        if (hasNoChanged) {
          this.$message({
            showClose: true,
            message: '配置没有变化，无需编辑！',
            duration: 3000,
            type: 'error'
          })
        }
        // 展示提示对话框
        else this.visible = true
      },
      // 更新常规配置
      onSubmit() {
        let params
        const [before, after] = this.allConfigs
        if (this.hasOriginConfigAfter) {
          params = this.filterParams(after)
        } else {
          params = this.filterParams(before)
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
          if (this.separateByArea) {
            let configs1=[],configs2=[]
            configs.forEach((item,ind)=>{
              if(item.area === 1){
                configs1.push(item)
              }
              if( item.area === 2){
                configs2.push(item)
              }
            })
            configs.forEach((item,ind) => {
              if (ind === index) {
                if (item.area === 1) {
                  if (configs1.length > 1) {
                    this.allConfigs[type].splice(index, 1)
                  } else {
                    this.$set(this.allConfigs[type], index, {days: [],config: [],queue: [],timeperiod: [],timeperiodQueue: [],interval: 5,duration: 25,area:1,showError: [] })
                  }
                }
                if (item.area === 2) {
                  if (configs2.length > 1){
                    this.allConfigs[type].splice(index, 1)
                  } else {
                    this.$set(this.allConfigs[type], index, { days: [],config: [],queue: [],timeperiod: [],timeperiodQueue: [],interval: 5,duration: 25,area:2,showError: [] })
                  }
                }
                if (!item.area) {
                  this.$set(this.allConfigs[type], 0,{ days: [],config: [],queue: [],timeperiod: [],timeperiodQueue: [],interval: 5,duration: 25,area:1,showError: [] })
                  this.$set(this.allConfigs[type], 1, { days: [],config: [], queue: [],timeperiod: [],timeperiodQueue: [], interval: 5, duration: 25,area:2,showError: [] })
                }
              }
            })
          } else {
            if (configs.length > 1) {
              this.allConfigs[type].splice(index, 1)
            } else {
              this.$set(this.allConfigs, type, _.cloneDeep([this.basicConfig]))

              this.$set(this.filterDuration, type, initDuration)
            }
          }
        })
      },
      // 新增工作日
      onAddDay(type,configs) {
        // 在常规配置里面新增一个初始化的配置
        //区分是否分生产区跟舍监区
        if(this.separateByArea){
          let _config = configs.find(c => c.area === this.area)
          configs.push({ days: [], area:this.area, interval: 5, duration: !_config ? this.filterDuration[type] : _config.duration , timeperiod: [], config: [], queue: [], timeperiodQueue: [], showError: [] })
        }else{
          this.allConfigs[type].push({ days: [], interval: 5, duration: this.filterDuration[type], timeperiod: [], config: [], queue: [], timeperiodQueue: [], showError: [] })
        }
      },

      // 显示的日 w: 日子对象 config：当前配置信息 index： 当前索引
      showWeek(w, config, index, configs) {
        // 配置信息的时间段队列存在的话
        if (config.timeperiodQueue.length) {
          // 存在就显示
         return config.days.some(v => v === w.value)
        }
        // 没有配置时间(新增工作日)s
        else {
          let days = [], productiondays=[], dormitorydays=[]
          // 新增后的常规配置信息:key
          configs.forEach((config, i) => {
            // 已经配置了的日期
            if(i !== index) {
              if(this.separateByArea) {
                if(config.area === 2)  {
                  productiondays = productiondays.concat( config.days )
                }
                if(config.area === 1){
                  dormitorydays = dormitorydays.concat( config.days )
                }
              } else {
                days = days.concat(config.days)
              }
            }
          })

          if(this.separateByArea) {
            if(config.area === 2) {
              return !productiondays.some(v => v === w.value)
            }
            if(config.area === 1){
              return !dormitorydays.some(v => v === w.value)
            }
          } else  {
            return !days.some(v => v === w.value)
          }
        }
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
      margin-left: 0;
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

  .after-tip {
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 10px;
  }

  .error__tip {
    color: #F56C6C;
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
