<template>
    <div class="guide-detail">
        <div class="guide-detail-title">{{guideData.content}}</div>
        <div class="guide-detail-date">更新时间：{{guideData.updatedTime}}</div>
        <div class="guide-detail-context" v-html="guideData.guide"></div>
        <div class="guide-detail-back">
            <el-button @click="handleBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                guideData: {}
            }
        },
        created() {
            if(!this.isAdd && window.sessionStorage) {
                let guideData = window.sessionStorage.getItem('APP_GUIDE_DATA')
                if(guideData) {
                    this.guideData = JSON.parse(guideData)
                }
            }
        },
        methods: {
            handleBack() {
                this.$router.back()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .guide-detail {
        padding: 50px 30px;
        &-title {
            font-size: 20px;
            font-weight: 400;
            color: #333;
            text-align: center;
            width: 70%;
            margin: 0 auto;
        }
        &-date {
            font-size: 12px;
            color: #999;
            text-align: center;
            padding: 30px 0;
        }
        &-context {
            padding: 16px 50px;
            color: #666;
            font-size: 14px;
            line-height: 22px;
        }
        &-back {
            margin-top: 30px;
            text-align: right;
        }
    }
</style>
