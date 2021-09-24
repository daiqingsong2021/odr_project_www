import * as types from './action-type'
import initialState from './initialState';

/**
 * state更新
 * @param {*} state 
 * @param {*} action 
 */
//编码规则左侧选择的业务对象行数据，用于规则类型获取列表数据
export default function (state = initialState, action) {
    switch (action.type) {
        case types.SAVECODERULEBO:   //设置 record
            return Object.assign({}, state, {
                data: action.data
            });
        default:
            return state;
    }
}