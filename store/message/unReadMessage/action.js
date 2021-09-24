import * as types from './action-type'
import axios from '../../../api/axios'
import { getLastMessageList } from "../../../api/api";


// 获取我的代办
export function getMyUnReadMessage() {
    return function (dispatch, getState) {
        return axios.post(getLastMessageList).then(res => {
            if (res.data.data) {
                const obj = { num: res.data.data.size, list: res.data.data.detailVos }
                dispatch(setMyUnReadMessage(obj));
                return obj
            }
        })
    }
}
 

// 设置我的代办
export function setMyUnReadMessage(data) {
    return {
        type: types.SET_MYUNREADMESSAGE,
        data
    };
}
