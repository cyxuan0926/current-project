<template>
    <div class="guide-detail">
        <div class="guide-detail-title">更新内容介绍</div>
        <p class="guide-detail-date">{{guideData.updatedTime}}</p>
        <div class="guide-detail-context" v-html="guideData.preContent"></div>
        <div class="guide-detail-context" v-html="guideData.guide"></div>
        <div class="guide-detail-back">
            <el-button @click="handleBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters(['guideData'])
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
            margin: 0 20%;
        }
        &-date {
            font-size: 14px;
            color: #999;
            margin-top: 8px;
            margin-left: 20%;
        }
        &-context {
            padding: 16px 0;
            margin: 0 20%;
            color: #666;
            font-size: 14px;
            line-height: 22px;
        }
        &-back {
            margin: 30px 20% 0;
            text-align: right;
        }
    }
</style>
