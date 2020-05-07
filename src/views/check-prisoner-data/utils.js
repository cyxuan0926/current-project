import Vue from 'vue'

import store from '@/store'

import roles from '@/common/constants/roles'

const that = new Vue()

const tenantAdmin = () => store.getters.role === roles.TENANT_ADMIN

function alertParseResult(result) {
  let notify = null, message = ''
  if (notify) notify.close()
  if (result.error_total !== 0 && result.success_total === 0) {
    message = `<div style="line-height: 30px; margin-top: 10px;">
                    <i class="el-icon-success Success" style="font-size: 20px;margin-right: 10px;"></i>成功：${ result.success_total }条<br>
                    <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：${ result.error_total }条
                    <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>
                  </div>`
  }
  if (result.error_total !== 0 && result.success_total !== 0) {
    message = `<div style="line-height: 30px; margin-top: 10px;">
                    <i class="el-icon-success Success" style="font-size: 20px;margin-right: 10px;"></i>成功：${ result.success_total }条<br>
                    <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：${ result.error_total }条
                    <p style="padding-left: 30px">原因：数据内容格式有误，请检查导入失败记录，仔细对照下载的模版数据。</p>
                    <p style="padding-left: 30px" class="new-prison__areas">提示: ${ result.prisonConfigs.join('、') }为新创建的监区，请给审核人员分配该监区的相应权限！</p>
                  </div>`
  }
  if (result.error_total === 0 && result.success_total !== 0) {
    message = `<div style="line-height: 30px; margin-top: 10px;">
                <i class="el-icon-success Success" style="font-size: 20px;margin-right: 10px;"></i>成功：${ result.success_total }条<br>
                <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：${ result.error_total }条
                <p style="padding-left: 30px" class="new-prison__areas">提示: ${ result.prisonConfigs.join('、') }为新创建的监区，请给审核人员分配该监区的相应权限！</p>
              </div>`
  }
  notify = that.$notify({
    title: '导入结果提示',
    dangerouslyUseHTMLString: true,
    message: message,
    duration: 8000,
    offset: 100,
    customClass: result.prisonConfigs && result.prisonConfigs.length && tenantAdmin() ? '' : 'alert-parse-result__notify'
  })
}
function alertImportResult(result) {
  that.$notify({
    title: '导入结果提示',
    dangerouslyUseHTMLString: true,
    message: `<p>新增：${ result.insert }</p>
              <p>修改：${ result.update }</p>
              <p>失败：${ result.error }</p>
              <p>共计：${ result.total }</p>`,
    duration: 8000,
    offset: 100
  })
}
export default {
  alertParseResult, alertImportResult
}
