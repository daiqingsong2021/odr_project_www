import * as actionType from './action-type';

// 首页表单数据
export const windowSizeData = (state = null, action = {}) => {
  switch (action.type) {
    case actionType.SETSIZE:
      return { ...action };
    case actionType.GETSIZE:
      return { ...action };
    default:
      return state;
  }
}

