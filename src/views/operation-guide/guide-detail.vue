<template>
    <div class="guide-detail">
        <div class="guide-detail-title">{{guideData.content}}</div>
        <div class="guide-detail-date">更新时间：{{guideData.updatedTime}}</div>
        <div class="guide-detail-context" v-html="guideData.guide"></div>
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
                this.$router.push({ path: '/operation-guide/list' })
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
