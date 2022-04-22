import { initStore } from '@/common/constants/prisons'
// const _local = window.localStorage
const _session = window.sessionStorage
const _local = window.localStorage
const getItem = (store, key, isParse) => {
    if (store) {
        let _data = store.getItem(key)
        if (_data) {
            return isParse ? JSON.parse(_data) : _data
        }
    }
    return initStore[key] && initStore[key]()
}
const setItem = (store, key, value) => {
    if (store) {
        store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    }
}

// 阳光监狱-狱务公开的详情数据
export const getAffairsStorage = () => getItem(_session, 'APP_AFFAIRS_DATA', true)
export const setAffairsStorage = val => setItem(_session, 'APP_AFFAIRS_DATA', val)

// 阳光监狱-狱务公开的业务模块
export const getAffairsModule = () => getItem(_session, 'APP_AFFAIRS_MODULE_DATA', true)
export const setAffairsModule = val => setItem(_session, 'APP_AFFAIRS_MODULE_DATA', val)

// 操作指引的详情数据
export const getGuideStorage = () => getItem(_session, 'APP_GUIDE_DATA', true)
export const setGuideStorage = val => setItem(_session, 'APP_GUIDE_DATA', val)

// 流程设计xml
export const getXmlStorage = () => getItem(_session, 'APP_BPMN_DATA')
export const setXmlStorage = val => setItem(_session, 'APP_BPMN_DATA', val)

// 获取user
export const getUserStorage = () => getItem(_local, 'user', true)
