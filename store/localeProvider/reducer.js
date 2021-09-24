import * as actionType from './action-type';
import intl from 'react-intl-universal'
const locales = {
  "en-US": require('../../api/language/en-US.json'),
  "zh-CN": require('../../api/language/zh-CN.json')
}
const loadLocales = (currentLocale) => {
  intl.init({
    currentLocale: currentLocale,
    locales,
  })
    .then(() => {

    });
}
loadLocales('zh-CN')
let defaultState = {
  currentLocale: 'zh-CN',
  intl
}
// 首页表单数据
export const localeProviderData = (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.LOCALEPROVIDER:
      return { ...action };
    case actionType.INITLOCALEPROVIDER:
      return { ...action };
    default:
      return state;
  }
}

