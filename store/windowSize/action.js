import * as actionType from "./action-type";

let windowSizeValue = null;
/**
 * 获取浏览器尺寸
 *
 * @param currentLocale
 * @returns {{type: string, currentLocale: *, intl}}
 */
export const getSize = () => {
    return windowSizeValue || {}
}

/**
 * 设置浏览器尺寸
 *
 * @param currentLocale
 * @returns {{type: object, size: *}}
 */
export const setSize = (size) =>{
    windowSizeValue = size;
    return {
      type: actionType.SETSIZE,
      size
    }
}
