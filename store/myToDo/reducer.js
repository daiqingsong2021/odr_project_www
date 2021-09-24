import * as types from './action-type'


/**
 * 系统管理--菜单管理
 * @param {*} state 
 * @param {*} action 
 */
export default function (state = {num:0,list:[]}, action) {
    switch (action.type) {
        
        case types.SET_MYTODOLIST:   //设置 我的代办
            return {...action.data} ;
        default:
            return state;
    }
}