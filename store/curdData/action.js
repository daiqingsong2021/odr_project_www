import * as actionType from './action-type';

/**
 * 保存当前操作的数据
 * @param {*} value 
 * @param {*} dataType 
 */
export const curdCurrentData = (data) => {
    return {
        type: actionType.CURDCURRENTDATA,
        ...data
    }
}

/**
 * 还原当前操作数据
 */
export const resetCurrentData = () => {
    return {
        type: actionType.RESETCURRENTDATA
    }
}