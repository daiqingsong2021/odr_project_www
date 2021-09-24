import * as actionType from './action-type';

/**
 * 保存流程位置
 * @param {*} value 
 * @param {*} dataType 
 */
export const saveProcessUrl = (data) => {
    return {
        type: actionType.SAVEPROCESSURL,
        data
    }
}

