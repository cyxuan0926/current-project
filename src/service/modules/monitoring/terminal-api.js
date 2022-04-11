import * as service from '@/service/config/service'
export default {
    // 终端升级详情表
    getTerminalDetlist: params => service.get(service.getTerminalUrl('/terminal/version/UpdateDetailPage'), params),

    // 终端升级详情导出
    exportTerminalUpgradeDetail: data => service.
        postObj(service.getTerminalUrl('/terminal/version/exportUpdateDetail'), data, { responseType: 'blob' }).
        then(res => res && res.data),

    // 终端升级统计表
    getTerminalStatistics: params => service.get(service.getTerminalUrl('/terminal/version/terminalUpgradeStatistics'), params),

    // 终端升级统计导出
    exportTerminalUpgradeStatic: params => service.
        get(service.getTerminalUrl('/terminal/version/exportUpgradeStatistics'), params, { responseType: 'blob' }).
        then(res => res && res.data)
}
