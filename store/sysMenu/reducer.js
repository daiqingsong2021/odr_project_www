import * as types from './action-type'
import initialState from './initialState';


/**
 * 系统管理--菜单管理
 * @param {*} state 
 * @param {*} action 
 */
export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_SYSMENU_RECORD:   //设置 record
            return Object.assign({}, state, {
                record: action.data
            });
        case types.SET_SYSMENU:   //设置 menu
            return Object.assign({}, state, {
                menuData: [...action.data]
            });
        default:
            return state;
    }
}