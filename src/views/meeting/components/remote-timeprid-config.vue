<template>
    <div>
        <div style="overflow: hidden; margin-bottom: 10px;" v-if="config.timequeue.length">
            <template v-if="!index">
                <label class="c-label">通话时长</label>
                <div
                style="float: left; width: calc(100% - 80px); overflow: hidden; margin-bottom: 10px;">
                <el-input 
                    placeholder="请输入通话时长" 
                    v-model="config.duration" 
                    style="width: 180px"
                    :disabled="durationDisabled || disabled || !!config.queue.length">
                    <template slot="append">分钟</template>
                </el-input>
                </div>
            </template>
            <label class="c-label">间隔时间</label>
            <div
                style="float: left; width: calc(100% - 80px); overflow: hidden; margin-bottom: 10px;">
                <el-input 
                placeholder="请输入间隔时间" 
                v-model="config.interval" 
                style="width: 180px"
                :disabled="disabled || !!config.queue.length">
                <template slot="append">分钟</template>
                </el-input>
            </div>
            <template v-for="(t, i) in  config.timequeue">
                <label class="c-label">时间段{{ i + 1 }}</label>
                <div
                style="float: left; width: calc(100% - 80px); overflow: hidden;">
                <m-time-range-selector
                    type="queue"
                    :val="config.timequeue[i]"
                    :disabled="!!config.queue.length"
                    :prev="config.timequeue[i - 1]"
                    :next="config.timequeue[i + 1]"
                    @handleBlur="handleTimeSelBlur($event, config)" />
                <template v-if="i == config.timequeue.length - 1 && !config.queue.length && !disabled">
                    <el-button
                    v-if="config.timequeue[config.timequeue.length - 1][1] !== '23:59'"
                    type="primary"
                    size="mini"
                    @click="handleAddTime(config)"
                    >新增时间段</el-button>
                    <el-button
                    type="primary"
                    size="mini"
                    @click="handleCreateTime(config)"
                    >生成通话时间段</el-button>
                    <el-button
                    v-if="!!i"
                    plain
                    type="danger"
                    size="mini"
                    @click="handleDelTime(config)"
                    >删除时间段</el-button>
                </template>
                </div>
            </template>
        </div>
        
        <div style="overflow: hidden; margin-bottom: 10px;" v-if="!!config.queue.length">
            <label class="c-label">时间段分配</label>
            <div
            style="float: left; width: calc(100% - 80px); overflow: hidden;">
                <m-time-range-selector
                    v-for="(d, i) in config.queue"
                    :key="i"
                    :val="d"
                    disabled
                    type="queue"/>
                <el-button
                    v-if="!disabled"
                    size="mini"
                    @click="handleResetTime(config)">重置时间段</el-button>
                <slot name="addButton"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Moment from 'moment'
    export default {
        props: {
            config: Object,
            durationDisabled: {
                type: Boolean,
                default: false
            },
            disabled: Boolean,
            index: Number
        },
        methods: {
            // 计算下一个配置时间段
            getNextRange(e, dur = 180) {
                // e：是当前日子配置时间段的最后一个时间段
                let sh = parseInt(e[0]),  // 开始时间
                    eh = parseInt(e[1]),  // 结束时间
                    sm = parseInt(e[0].split(':')[1]), // 开始的时
                    em = parseInt(e[1].split(':')[1]), // 结束的时
                    // dur = (eh - sh) * min + em - sm, // 时间间隔(秒)
                    time = Moment(new Date(2000, 0, 1, eh, em)).add(dur, 'minutes') // 下一个的时间段的结束时间
                if (time.date() !== 1) {
                    // 如果新增时间段的结束时间跨天的话 就是当天最后的时间
                    return [e[1], '23:59']
                }
                // 否则 上一个的结束时间是新的时间段的开始时间 计算后的时间就是新的时间段的结束时间
                return [e[1], time.format('HH:mm')]
            },

            // 新增时间段 (add)
            handleAddTime(current) {
                current.timequeue.push(this.getNextRange(current.timequeue[current.timequeue.length - 1]))
            },

            // 时间段修改 (add)
            handleTimeSelBlur(e, current) {
                current.timequeue[current.timequeue.length - 1] = e
            },

            // 删除时间段 (add)
            handleDelTime(current) {
                if( current.timequeue.length > 1 ) {
                    current.timequeue.pop()
                }
            },

            // 检测时间段是否大于通话时长 (add)
            checkDuring(time, during) {
                let res = false
                if( time.length ) {
                    res = time.some((t) => {
                        const st = Moment([
                            2000,
                            0,
                            1,
                            parseInt(t[0].split(':')[0]),
                            parseInt(t[0].split(':')[1])
                        ])
                        const et = Moment([
                            2000,
                            0,
                            1,
                            parseInt(t[1].split(':')[0]),
                            parseInt(t[1].split(':')[1])
                        ])
                        return et.diff(st, 'minutes') < during
                    })
                }
                return res
            },

            // 根据通话时长生成时间段 (add)
            generateDuring(current, talkT, intervalT) {
                if( current.timequeue.length ) {
                    current.timequeue.forEach((t, i) => {
                        const ct = Moment([
                            2000,
                            0,
                            1,
                            parseInt(t[0].split(':')[0]),
                            parseInt(t[0].split(':')[1])
                        ])
                        const st = Moment([
                            2000,
                            0,
                            1,
                            parseInt(t[0].split(':')[0]),
                            parseInt(t[0].split(':')[1])
                        ])
                        const et = Moment([
                            2000,
                            0,
                            1,
                            parseInt(t[1].split(':')[0]),
                            parseInt(t[1].split(':')[1])
                        ])
                        while( ct.diff(et) < 0 && ct.add(talkT, 'm').diff(et) < 0 ) {
                            current.queue.push([
                                st.format('HH:mm'),
                                st.add(talkT, 'm').format('HH:mm')
                            ])
                            st.add(intervalT, 'm')
                            ct.add(intervalT, 'm')
                        }
                    })
                }
            },

            // 生成时间段 (add)
            handleCreateTime(current) {
                if(this.checkDuring(current.timequeue, current.duration)) {
                    console.log('时间段不能小于通话时长')
                    return
                }
                this.generateDuring(current, parseInt(current.duration), parseInt(current.interval))
            },

            // 重置时间段 (add)
            handleResetTime(current) {
                current.queue = []
            }
        }
    }
</script>

<style lang="scss" scoped>
    label.c-label{
        width: 70px;
        text-align: right;
        font-weight: normal;
        float: left;
        color: #606266;
        line-height: 28px;
        margin-right: 10px;
    }
</style>