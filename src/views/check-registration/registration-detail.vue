<template>
    <div>
        <div style="margin-bottom: 10px;">请核对申请人信息:</div>
        <div class="img-box" :style="{'margin-bottom': toAuthorize.relationalProofUrls && toAuthorize.relationalProofUrls.length || toAuthorize.meetNoticeUrl ? '10px' : '40px'}">
            <m-img-viewer
            isRequired
            :class="[{'el-image__no-box_shadow': !toAuthorize.idCardFront}]"
            :url="toAuthorize.idCardFront"
            :toolbar="{ prev: 1, next: 1 }"
            title="身份证正面照"
            />
            <m-img-viewer
            isRequired
            :class="[{'el-image__no-box_shadow': !toAuthorize.idCardBack}]"
            :url="toAuthorize.idCardBack"
            :toolbar="{ prev: 1, next: 1 }"
            title="身份证背面照"
            />
            <m-img-viewer
            isRequired
            :class="[{'el-image__no-box_shadow': !toAuthorize.avatarUrl}]"
            :url="toAuthorize.avatarUrl"
            :toolbar="{ prev: 1, next: 1 }"
            title="头像"
            />
        </div>
        <template v-if="toAuthorize.relationalProofUrls && toAuthorize.relationalProofUrls.length" >
            <div style="margin-bottom: 10px;">请核对关系证明:</div>
            <div class="img-box">
            <template v-for="relationalProofUrl in toAuthorize.relationalProofUrls" >
                <m-img-viewer
                :style="{ width: relationalWidth }"
                :class="relationalProofUrl.className"
                :key="relationalProofUrl.url"
                :url="relationalProofUrl.url"
                :toolbar="toAuthorize.relationalProofUrls.length === 1 ? {} : { prev: 1, next: 1 }"
                title="关系证明图"
                />
            </template>
            </div>
        </template>
        <template v-if="!!toAuthorize.meetNoticeUrl">
            <div style="margin-bottom: 10px;">可视电话通知单:</div>
            <div class="img-box">
            <m-img-viewer
                :class="[{'el-image__no-box_shadow': !toAuthorize.meetNoticeUrl}]"
                :url="toAuthorize.meetNoticeUrl"
                title="可视电话通知单"
            />
            </div>
        </template>
        <div style="margin-bottom: 10px;" v-if="toAuthorize.remarks">{{ toAuthorize.status === 'WITHDRAW' ? '撤回原因：' : '审核未通过原因：' }}</div>
        <div class="img-box">{{ toAuthorize.remarks }}</div>
        <div style="margin-bottom: 10px;" v-if="toAuthorize.status === 'WITHDRAW' || toAuthorize.status === 'DENIED'">{{ toAuthorize.status === 'WITHDRAW' ? '撤回' : '审核' }}时间：{{ toAuthorize.auditAt }}</div>
    </div>
</template>

<script>
    export default {
        props: {
            toAuthorize: {
                type: Object,
                default: {}
            }
        },
        computed: {
            relationalWidth() {
                const widthConstent = {
                    0: '0%',
                    1: '32%',
                    2: '48%',
                    3: '32%',
                    4: '24%'
                }
                return widthConstent[this.toAuthorize.relationalProofUrls && this.toAuthorize.relationalProofUrls.length || 0]
            }
        }
    }
</script>

<style type="text/stylus" lang="stylus" scoped>
.authorize-dialog
  .img-box
    .el-image
      width: 32%;
      height: 110px;
      margin-bottom: 5px;
      >>> img
           width: 100%;
           height: 100%;
           cursor: pointer;
.button-box 
  .el-button
    &:first-of-type
      margin-left: 0px !important;
.view-box
  display: flex;
  flex-direction: row-reverse;
</style>