
/**
 * 获取页签会话缓存
 *
 * @returns {string | {}}
 */
export const getLabelInfo = (menuCode) =>{
  let key = menuCode+"-LabelInfo";
  let ret = JSON.parse(sessionStorage.getItem(key) || "{}");
  return ret;
}

/**
 * 设置页签会话缓存
 * @param data
 */
export const setLabelInfo =(menuCode,data)=>{
  let key = menuCode+"-LabelInfo";
  let labelInfo = JSON.parse(sessionStorage.getItem(key) || "{}");
  let newInfo = {...labelInfo,...data};
  sessionStorage.setItem(key,JSON.stringify(newInfo));
}

/**
 * 测试
 *
 * @param menuCode
 * @returns {number}
 */
export const getLabelsWidthByMenuCode = (menuCode) =>{
  let $ = document.getElementById(menuCode+"-LabelsGroup");
  let a = $.getAttribute("data-contentwidth");
  return Number(a);  //宽度
}

export const getNumber = (numstr,max) =>{
  let ret = 0;
  if(typeof numstr === "number"){
    ret = numstr;
  }else if(typeof numstr === "string"){
    if(numstr.indexOf("%")>-1){
      ret =(Number(numstr.replace("%","").trim())*max)/100;
    }else if(numstr.indexOf("px") > -1){
      ret = Number(numstr.replace("px","").trim());
    }
  }
  return ret;
}
