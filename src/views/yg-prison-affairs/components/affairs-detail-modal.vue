<template>
    <el-dialog :visible.sync="affairsVisible" class="phone-dialog" width="300px" @close="handleClose">
        <div class="phone-dialog-wrapper">
            <div class="phone-dialog-iframe">
                <section class="affairs-detail">
                    <div class="affairs-detail-title" v-if="affairsStorage.headline">
                        <h3>{{affairsStorage.headline}}</h3>
                    </div>
                    <div class="affairs-detail-subhead" v-if="affairsStorage.subhead">
                        <h4>{{affairsStorage.subhead}}</h4>
                    </div>
                    <div class="affairs-detail-createtime">发布于 {{ affairsStorage.createTime }}</div>
                    <div class="affairs-detail-content" v-if="affairsStorage.videoUrl">
                        <video :src="affairsStorage.videoUrl" poster="http://qa-ywgk.yuwugongkai.com/static/images/video-cover.png" controls="controls" width="100%"></video>
                    </div>
                    <div class="affairs-detail-content" v-html="affairsStorage.content"></div>
                </section>
            </div>
            <el-button type="text" class="phone-dialog-close-btn" icon="el-icon-close" @click="handleClose"></el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: {
            value: Boolean,
            input: Function
        },
        data() {
            return {
                affairsVisible: false
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.affairsVisible = val
                },
                immediate: true
            }
        },
        computed: {
            ...mapState({
                affairsStorage: state => state.global.affairsStorage
            })
        },
        methods: {
            handleClose() {
                this.$emit('input', false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .phone-dialog {
        /deep/ .el-dialog {
            background: none;
            box-shadow: none;
            overflow: visible;
        }
        /deep/ .el-dialog__body {
            padding: 0;
        }
        /deep/ .el-dialog__header {
            display: none;
        }
    }
    .phone-dialog-wrapper {
        width: 300px;
        height: 598px;
        position: relative;
        background-image: url('../../../assets/images/phone-bg.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% auto;
    }
    .phone-dialog-iframe {
        background-color: #fff;
        position: absolute;
        top: 34px;
        bottom: 48px;
        left: 24px;
        right: 24px;
        overflow: auto;
    }
    .phone-dialog-close-btn {
        position: absolute;
        right: 0;
        top: -26px;
        padding: 5px 10px;
        z-index: 5;
        /deep/ .el-icon-close {
            color: #333;
            font-size: 20px;
        }
    }
    .affairs-detail {
        padding: 1rem;
        &-title {
            h3 {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
                color: #333;
            }
        }
        &-subhead {
            h4 {
                font-size: 14px;
                font-weight: 400;
                margin: 5px 0 0;
                color: #555;
            }
        }
        &-createtime {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
        }
        &-content {
            font-size: 14px;
            padding: 1rem 0;
            color: #777;

            /deep/ img,
            /deep/ video {
                display: block;
                width: 100%;
                height: auto;
            }
        }
    }
</style>