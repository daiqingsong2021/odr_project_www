import * as actionType from './action-type';
import intl from 'react-intl-universal'
const locales = {
    "en-US": require('../../api/language/en-US.json'),
    "zh-CN": require('../../api/language/zh-CN.json')
  }
const loadLocales=(currentLocale)=>{
    intl.init({
      currentLocale:currentLocale,
      locales,
    })
     
  }
// 保存表单数据
export const initLocaleProvider = (currentLocale) => {
    loadLocales(currentLocale)
    return {
        type: actionType.INITLOCALEPROVIDER,
        currentLocale,
        intl
    }
}
// 保存表单数据
export const changeLocaleProvider = (currentLocale) => {
    
    this.callback()
    return {
        type: actionType.LOCALEPROVIDER,
        currentLocale
    }
}