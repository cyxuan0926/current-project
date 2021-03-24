<template>
    <div class="meeting-process-container">
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">亲情电话家属管理审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus" @click="handleEditProcess('phonefamily')">{{ !phonefamilyData ? '创建新' : '编辑' }}审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">亲情电话次数修改审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus" @click="handleEditProcess('phonenumber')">{{ !phonenumber ? '创建新' : '编辑' }}审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                phonefamily: null,
                phonenumber: null
            }
        },
        methods: {
            handleEditProcess(flag) {
                this.$router.push({ path: '/meeting/deploy/process-edit' })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .meeting-process-container {
        width: 80%;
        margin: 0 auto;
        padding: 50px 0;
    }
    .meeting-process-item {
        margin: 0;

        & + & {
            margin-top: 50px;
        }

        dt {
            h3 {
                margin: 16px 0;
                font-weight: 600;
                font-size: 16px;
            }
            /deep/ .el-button {
                margin-top: 10px;
            }
            border-bottom: 1px solid #ededed;
        }
    }
</style>