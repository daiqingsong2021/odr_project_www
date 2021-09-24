import * as home from './action-type';

let defaultState = {
  orderSum: '1', //金额
  name: '2', //姓名
  phoneNo: '3', //手机号
  imgpath: '4', //图片地址
  rightTag:[],
  title:''
}
// 首页表单数据
export const formData = (state = defaultState , action = {}) => {
  switch(action.type){
    case home.SAVEFORMDATA:
      return {...state, ...{[action.datatype]: action.value}};
    case home.SAVEIMG:
      return {...state, ...{imgpath: action.path}};
    case home.CLEARDATA:
      return {...state, ...defaultState};
    default:
      return state;
  }
}

