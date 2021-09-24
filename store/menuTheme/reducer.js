import * as actionType from './action-type';
let defaultState={
  menuType:'rowTheme-vertical'
}
// 首页表单数据
export const menuTypeData = (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.rowThemeVertical:
      return {...action} ;
    case actionType.rowThemeInline:
      return {...action};
    case actionType.colTheme:
      return {...action};
    default:
      return state;
  }
}

