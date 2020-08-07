<template>
    <section class="day-box-wrapper">
        <div
            v-for="(config, index) in configs"
            :key="index"
            class="config-box">
            <div class="day-box">
                <label class="c-label">选择工作日</label>
                <el-checkbox-group
                v-model="config.days"
                :disabled="disabled || !!config.timequeue.length">
                <template v-for="(w, i) in week">
                    <el-checkbox
                    :key="i"
                    v-if="showWeek(w, config, index)"
                    :label="w.value">{{ w.label }}</el-checkbox>
                    </template>
                </el-checkbox-group>
                <el-button
                type="primary"
                size="mini"
                v-if="!disabled && !config.timequeue.length && config.days.length"
                @click="handleConfig(config, index)">配置时间段参数</el-button>
                <el-button
                plain
                type="danger"
                size="mini"
                v-if="!disabled && !!config.timequeue.length"
                @click="handleDeleteConfig(index)">删除当前日期配置</el-button>
            </div>
            <remote-timeprid-config :index="index" :disabled="disabled" :config="config">
                <template v-slot:addButton>
                    <el-button
                        v-if="index === configs.length - 1 && canAddDay && !disabled"
                        size="mini"
                        type="success"
                        @click="onAddDay">新增工作日</el-button>
                </template>
            </remote-timeprid-config>
        </div>
    </section>
</template>

<script>
    import remoteTimepridConfig from './remote-timeprid-config'
    export default {
        components: {
            remoteTimepridConfig
        },

        props: {
            disabled: Boolean,
            configs: Array
        },

        data() {
            return {
                timequeue: ['09:00','12:00'],
                week: [
                    { label: '星期一', value: 1 },
                    { label: '星期二', value: 2 },
                    { label: '星期三', value: 3 },
                    { label: '星期四', value: 4 },
                    { label: '星期五', value: 5 },
                    { label: '星期六', value: 6 },
                    { label: '星期日', value: 0 }
                ],
            }
        },

        computed: {
            // 能否新增工作日
            canAddDay() {
                let days = []
                this.configs.forEach(config => {
                    days = days.concat(config.days)
                })
                return days.length < 7
            },
        },

        methods: {

            // 显示工作日
            showWeek(w, config, index) {
                // 配置信息的时间段队列存在的话
                if (config.queue.length) {
                    // 存在就显示
                    return config.days.some(v => v === w.value)
                }
                // 没有配置时间(新增工作日)
                else {
                    let days = []
                    // 新增后的常规配置信息
                    this.configs.forEach((config, i) => {
                        // 已经配置了的日期
                        if (i !== index) days = days.concat(config.days)
                    })
                    // 过滤已经配置了的日子
                    return !days.some(v => v === w.value)
                }
            },

            // 初始化时间段配置参数 (add)
            getInitParmas() {
                return {
                    days: [], interval: '5', duration: '25', timeperiod: [], config: [], queue: [], timequeue: []
                }
            },

            // 选择的工作日后 新增配置时间段参数 (update)
            handleConfig(current, i) {
                current.timequeue = [this.timequeue]
                if ( !!i ) {
                    current.interval = this.configs[0].interval
                    current.duration = this.configs[0].duration
                }
            },

            // 删除当前常规配置 (update)
            handleDeleteConfig(i) {
                this.configs.splice(i, 1)
                if( !this.configs.length ) {
                    this.configs.push(this.getInitParmas())
                }
            },

            // 新增工作日 (update)
            onAddDay() {
                this.configs.push( this.getInitParmas() )
            }
        }
    }
</script>

<style lang="scss" scoped>
    .day-box-wrapper + .day-box-wrapper {
        margin-top: 20px;
    }
    .config-box{
        overflow: hidden;
    }
    .config-box+.config-box{
        // border-top: 1px solid #dcdfe6;
        padding-top: 10px;
        margin-top: 20px;
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
    .day-box {
        margin-bottom: 10px;
    }
    .button-float{
        float: left;
        margin-bottom: 10px;
        margin-left: 0;
    }
</style>