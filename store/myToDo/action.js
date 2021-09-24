import * as types from './action-type'
import axios from '../../api/axios'
import {getMyUnfinishTaskList} from "../../api/api";


// 获取我的代办
export function getMytodoList() {
    return function (dispatch, getState) {
    return axios.post(getMyUnfinishTaskList(7, 1), {}).then(res => {
        if (res.data.data) {
            const obj={num:res.data.total,list:res.data.data}
            dispatch(setMytodoList(obj));
            return obj
        } 
      })
    }
}

// 设置我的代办
export function setMytodoList(data){
    return {
        type: types.SET_MYTODOLIST,
        data
    };
}
