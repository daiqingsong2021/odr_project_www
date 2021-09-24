import * as actionType from './action-type';

/**
 * 保存编码规则选择的业务对象
 * @param {*} value 
 * @param {*} dataType 
 */
export const saveCodeRuleBo = (data) => {
    
    return {
        type: actionType.SAVECODERULEBO,
        data
    }
}

