<template>
    <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    width="720px"
    @close="handleClose">
    <div class="prisoner-detail">
        <div class="prisoner-detail-info">
            <dl v-for="item in prisonerDetItems" :key="item.label">
                <dt>{{ item.label }}：</dt>
                <dd class="ellipsis">{{ item.value }}</dd>
            </dl>
        </div>
        <div class="prisoner-detail-face">
            <div class="el-image__error" v-if="!prisonerDetData.faceUrl">
                <p><i class="el-icon-picture-outline"></i></p>
                <p><span>暂无人脸图片</span></p>
            </div>
            <m-img-viewer
                v-else
                style="width: 100%; height: 100%;"
                :url="prisonerDetData.faceUrl"
                title="人脸图片"
                isRequired />
        </div>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span> -->
    <template #footer>
        <span class="dialog-footer">
            <slot name="dialogFooter" />
        </span>
    </template>
    </el-dialog>
</template>

<script>
    import filters from '@/filters'
    export default {
        props: {
            value: Boolean,
            input: Function,
            prisonerDetData: Object,
        },
        data() {
            return {
                dialogVisible: false,
                prisonerDetKeys: [
                    { key: 'name', label: '罪犯姓名' },
                    { key: 'prisonerNumber', label: '罪犯编号' },
                    { key: 'gender', label: '性别' },
                    { key: 'prisonArea', label: '监区' },
                    { key: 'level', label: '管教级别' },
                    { key: 'prisonerStatus', label: '服刑人员状态' }
                ],
                prisonerDetItems: []
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.dialogVisible = val
                }
            },
            prisonerDetData: {
                handler(val) {
                    this.prisonerDetItems = this.prisonerDetKeys.map(({ key, label }) => {
                        let _data = {
                            label,
                            value: ''
                        }
                        switch (key) {
                            case 'level':
                                _data.value = filters.level(val.level)
                                break;
                            case 'prisonerStatus':
                                _data.value =`${ !val.sysFlag ? `删除原因：${ val.deleteReason }` : ( val.isBlacklist ? `黑名单原因：${ val.reason }` : '' ) }`
                                break;
                            default:
                                _data.value = val[key]
                                break;
                        }
                        return _data
                    })
                }
            }
        },
        methods: {
            handleClose() {
                this.$emit('input', false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .prisoner-detail {
        display: flex;
        padding: 0 20px 16px 0;
        &-info {
            width: 60%;
            dl {
                display: flex;
                dt {
                    width: 120px;
                    text-align: right;
                }
                dd {
                    flex: 1;
                }
            }
        }
        &-face {
            flex: 1;
            .el-image__error {
                flex-direction: column;
                p {
                    margin-bottom: 10px;
                }
                i {
                    font-size: 24px;
                }
            }
        }
    }
</style>