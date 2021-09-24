import * as actionType from './action-type';

/**
 * 保存当前表格数据
 * @param {*} value 
 * @param {*} dataType 
 */
export const saveCurrentData = (data) => {
    return {
        type: actionType.SAVECURRENTDATA,
        ...data
    }
}

/**
 * 重置当前数据
 */
export const resetRightCurrentData = () => {
    return {
        type: actionType.RESETRIGHTCURRENTDATA
    }
}