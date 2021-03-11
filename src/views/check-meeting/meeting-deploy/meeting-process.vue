<template>
    <div class="meeting-process-container">
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">家属注册认证审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus">创建新审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">家属注册认证审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus">创建新审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">家属注册认证审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus">创建新审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
        <dl class="meeting-process-item">
            <dt class="clearfix">
                <h3 class="pull-left">家属注册认证审核</h3>
                <el-button class="pull-right" type="primary" size="mini" icon="el-icon-plus">创建新审批</el-button>
            </dt>
            <dd><img src="@/assets/images/pro-test.jpg" alt=""></dd>
        </dl>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
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