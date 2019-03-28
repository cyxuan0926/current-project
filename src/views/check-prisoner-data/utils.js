import Vue from 'vue'
let that = new Vue()
function alertParseResult(result) {
  that.$notify({
    title: '解析结果提示',
    dangerouslyUseHTMLString: true,
    message: `<p>成功：${ result.success_total }</p>
              <p>失败：${ result.error_total }</p>`,
    duration: 8000,
    offset: 100
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
