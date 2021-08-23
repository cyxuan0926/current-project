<template>
    <el-dialog
        title="家属信息"
        class="family-dialog"
        :visible.sync="visible"
        @close="handleClose">
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col>
                <label>姓名：</label>
                <span>{{ familyDetData.familyName }}</span>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col>
                <label>关系：</label>
                <span>{{ familyDetData.relationship }}</span>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col class="img-box">
                <label>家属信息：</label>
                <div class="img-items">
                    <m-img-viewer
                        :url="familyDetData.familyIdCardFront"
                        title="身份证正面"
                        isRequired />
                    <m-img-viewer
                        :url="familyDetData.familyIdCardBack"
                        title="身份证背面"
                        isRequired />
                    <m-img-viewer
                        :url="familyDetData.familyAvatarUrl"
                        title="头像"
                        isRequired />
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px" v-if="familyDetData.relationalProofUrls && familyDetData.relationalProofUrls.length">
            <el-col class="img-box">
                <label>关系证明：</label>
                <div class="img-items">
                    <m-img-viewer v-for="(u, i) of familyDetData.relationalProofUrls"
                        :key="i"
                        title="关系证明图"
                        :class="{ 'relation_img': familyDetData.relationalProofUrls.length !== 1 }"
                        :url="u"
                        :isLazy="false"
                    />
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px" v-if="familyDetData.meetNoticeUrl">
            <el-col class="img-box">
                <label>可视电话通知单：</label>
                <div class="img-items">
                    <m-img-viewer
                        :url="familyDetData.meetNoticeUrl"
                        title="可视电话通知单"
                        :isLazy="false"
                    />
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            value: Boolean,
            input: Function,
            familyData: Object
        },
        data() {
            return {
                visible: false,
                familyDetData: {}
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.visible = val
                    val && this.setRelationalProofUrls()
                }
            }
        },
        methods: {
            setRelationalProofUrls() {
                let _data = Object.assign({}, this.familyData)
                _data.relationalProofUrls = []
                let _keys = [ 'familyRelationalProofUrl', 'familyRelationalProofUrl2', 'familyRelationalProofUrl3', 'familyRelationalProofUrl4' ]
                Object.keys(_data).forEach(key => {
                    if( _keys.includes(key) && _data[key] ) {
                        _data.relationalProofUrls.push( _data[key] )
                    }
                })
                this.familyDetData = _data
            },
            handleClose() {
                this.$emit('input', false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .family-dialog {
        .img-box {
            display: flex;
            flex-direction: column;
            .img-items {
                padding-top: 10px;
                /deep/ .el-image {
                    width: 32%;
                    height: 110px;
                    margin-bottom: 5px;
                    img {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                }

                /deep/ .el-image.relation_img {
                    width: 24% !important;
                }
            }
        }
        /deep/ .el-dialog__body {
            padding: 10px 20px;
        }
        /deep/ .el-dialog__header {
            border-bottom: 1px solid #f4f4f4;
        }
    }
</style>