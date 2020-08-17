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
            <div style="margin-bottom: 10px;">亲情电话通知单:</div>
            <div class="img-box">
            <m-img-viewer
                :class="[{'el-image__no-box_shadow': !toAuthorize.meetNoticeUrl}]"
                :url="toAuthorize.meetNoticeUrl"
                title="亲情电话通知单"
            />
            </div>
        </template>
        <div style="margin-bottom: 10px;">{{ toAuthorize.status === '' }}审核未通过原因：</div>
        <div class="img-box"></div>
        <div style="margin-bottom: 10px;">审核时间：</div>
    </div>
</template>

<script>
    export default {
        props: {
            toAuthorize: Object
        },
        created() {
            let _relationalProofUrls = []
            for (let index = 0; index < 4; index++) {
                if (index === 0 && this.toAuthorize.relationalProofUrl) _relationalProofUrls.push({ url: this.toAuthorize.relationalProofUrl })
                else {
                const num = `relationalProofUrl${ index + 1 }`
                this.toAuthorize[num] && _relationalProofUrls.push({ url: this.toAuthorize[num] })
                }
            }
            this.toAuthorize.relationalProofUrls = _relationalProofUrls
        }
    }
</script>

<style lang="scss" scoped>

</style>