import * as types from './action-type'
import axios from '../../api/axios'
import {getUserInfo} from "../../api/api";
// 设置 系统管理-菜单管理  record
export function setSysMenuRecord(data) {
    return {
        type: types.SET_SYSMENU_RECORD,
        data
    };
}

// 获取系统菜单
export function getSysMenu() {
    return function (dispatch, getState) {
        return axios.get(getUserInfo).then((res)=>{
            dispatch(setSysMenu(res.data.data.loginMenu.left));
            return res.data.data;
        });
    };
}

// 设置系统菜单
export function setSysMenu(data){
    return {
        type: types.SET_SYSMENU,
        data
    };
}
