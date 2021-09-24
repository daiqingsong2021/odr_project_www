import axios from '../api/axios'
import {
  addFavorites,
  restFavorites,
  listRestFavorites,
  deleteFavorites,
  getFavoritesList,
  getDefineListByUserAuthAndProjectId,
  getLastOpenInfo
} from '../api/api'
import moment from "moment"
import MyIcon from "../components/public/TopTags/MyIcon"
import { notification } from "antd";

export function searchVerification(conditions_, dat){
  var ret = true;
  if (conditions_) {
    // 根据条件运算
    for (var i = 0, len = conditions_.length; i < len; i++) {
      let v = false;
      var item = conditions_[i];
      if (item && item['key']) {
        let keys = item['key'].split('|');
        let value = item['value'];
        if (!value) {
          v = true;
        } else {
          for (var k = 0, len_ = keys.length; k < len_; k++) {
            let d = dat[keys[k]];
            if (d && d.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {
              v = true;
              break;
            }
          }
        }
      }
      if (v == false) {
        ret = v;
        break;
      }
    };
  } else {
    ret = false;
  }
  return ret;
}

/**
 * 对数据集合进行筛选
 *
 * @param datas 数据集合
 * @param conditions 查询条件比如[{key:'code|name',value : '刘'},{key:'type',value:1}] 竖杠代表或的意思，数组里里面的元素并集关系。
 * @param children 是否包含子节点
 * @returns {*}
 */
export function search(datas, conditions, children) {

  let searchDatas = (list, parentAuth, children_) => {
    let retItems = new Array();
    if (list) {
      list.forEach((item) => {

        let auth = parentAuth;
        if (!auth || !children_) {
          auth = searchVerification(conditions, item);
        }

        let clist = searchDatas(item.children, auth, children_);
        clist = clist && clist.length > 0 ? clist : null;
        if (auth || clist) {
          var newItem = {
            ...item
          }
          newItem["children"] = clist;
          retItems.push(newItem);
        }
      });
    }
    return retItems;
  }
  if (datas) {
    return searchDatas(datas, false, children);
  }
  return datas;
};

/**
 * 根据条件查询父节点（目前主要考虑ID不是唯一而做的处理方式）
 *
 * @param datas
 * @param conditions
 * @returns {*}
 */
export function getParentByConditions(datas, conditions) {
  // 验证是否满足查询条件
  let verification = (conditions_, dat) => {
    var ret = true;
    if (conditions_) {
      // 根据条件运算
      for (var i = 0, len = conditions_.length; i < len; i++) {
        let v = false;
        let item = conditions_[i];
        if (item && item['key']) {
          let key = item['key'];
          let value = item['value'];
          if (value && dat[key] == value) {
            v = true;
          }
        }
        if (v == false) {
          ret = v;
          break;
        }
      };
    } else {
      ret = false;
    }
    return ret;
  }

  let searchDatas = (list, parent) => {
    let retParent = null;
    if (list) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        let auth = verification(conditions, item);
        if (auth) {
          retParent = parent;
          break;
        }
        retParent = searchDatas(item.children, item);
        if (retParent) {
          break;
        }
      }
    }
    return retParent;
  }
  if (datas) {
    return searchDatas(datas, null);
  }
  return null;
};

/**
 * 获取icon
 *
 * @param type
 * @param taskType
 * @returns {string}
 */
export function getIcon(type, taskType) {
  let icon = "";
  if (type == "eps") {
    icon = "icon-xiangmuqun";
  }else if(type=="folder"){
    icon = "icon-wenjianjia";
  } else if (type == "project") {
    icon = "icon-xiangmu";
  } else if (type == "define") {
    icon = "icon-jihua1";
  } else if (type == "wbs") {
    icon = "icon-WBS";
  } else if (type == "task") {
    if (taskType == 1 || taskType == 4) {
      icon = "icon-renwu1";
    } else {
      icon = "icon-lichengbei";
    }
  } else if (type == "delv") {
    icon = "icon-jiaofuwu1";
  } else if (type == "pbs") {
    icon = "icon-PBS";
  } else if (type == "equip") {
    icon = "icon-shebei";
  } else if (type == "material") {
    icon = "icon-cailiao";
  }
  else if (type == "user") {
    if (taskType == 0) {
      icon = "icon-gongsi";
    } else if (taskType == 1) {
      icon = "icon-bumen1";
    } else if (taskType == "user") {
      icon = "icon-yuangong";
    } else {
      icon = "icon-yuangong";
    }
  }else if(type == "activiti"){
    icon = "icon-wenjianjiazhankai1-copy";
  }else if(type == "group"){
    icon = "icon-fenlei";
  }
  return icon;
}
/**
 * 
 * @param {*图标类型} type 
 * @param {*类容} text 
 * @param {*图标类型判断条件2} type2 
 * @param {*图标大小} fontSize 
 * @param {*图标与内容间距} marginRight 
 * @param {*图标对其方式} marginRight 
 */
export function getIconCell(type, text, type2, fontSize = 18, marginRight = 8, verticalAlign = "middle") {
  const icon = getIcon(type, type2);
  return <span title={text}><MyIcon type={icon} style={{ fontSize, marginRight, verticalAlign }} /> {text}</span>
}

export const Dates = () => {
  //将时间转换成'YYYY-MM-DD HH:mm:ss'
  let formatTimeString = (date, format) => {
    if (typeof date === "string") {
      if (date && date.length <= 10) {
        date = date + " 00:00:00";
      }
      if (format) {
        date = date.substr(0, format.length);
      }
      return date;
    }
    return date ? date.format('YYYY-MM-DD HH:mm:ss') : null;
  }

  //将时间转换成'YYYY-MM-DD '
  let formatDateString = (time) => {
    if (typeof time === "string") {
      return time ? time.substr(0, 10) : null;
    } else {
      return time ? time.format('YYYY-MM-DD') : null;
    }
  }

  //将字符串时间格式转为monent对象
  let formatTimeMonent = (time) => {
    return time ? moment(time, 'YYYY-MM-DD HH:mm:ss') : null;
  }

  //将字符串时间格式转为monent对象
  let formatDateMonent = (time) => {
    return time ? moment(time, 'YYYY-MM-DD') : null;
  }

  //禁止最小时间
  let disabledMinDate = (current, max) => {
    // Can not select days before today and today
    if (current && max) {
      return current.format('YYYY-MM-DD') < max.format('YYYY-MM-DD')
    }
  }

  //禁止最大日期
  let disabledMaxDate = (current, min) => {
    // Can not select days after today and today
    if (current && min) {
      return current.format('YYYY-MM-DD') > min.format('YYYY-MM-DD')
    }
  }

  //禁止最小日期
  let disabledMinDateTime = (current, max) => {
    if (current && max) {
      if (current.format('YYYY-MM-DD') == max.format('YYYY-MM-DD')) {
        return {
          disabledHours: () => range(0, max._d.getHours()),
          disabledMinutes: () => range(0, max._d.getMinutes()),
          disabledSeconds: () => range(0, max._d.getSeconds()),
        }
      }
    }
  }

  //禁止最大时间
  let disabledMaxDateTime = (current, min) => {
    if (current && min) {
      if (current.format('YYYY-MM-DD') == min.format('YYYY-MM-DD')) {
        return {
          disabledHours: () => range(min._d.getHours() + 1, 24),
          disabledMinutes: () => range(min._d.getMinutes() + 1, 60),
          disabledSeconds: () => range(min._d.getSeconds() + 1, 60),
        }
      }
    }
  }

  //获取时间段
  let range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  // 获取天数date1开始时间，date2完成时间
  let getDiffDays = (date1, date2) => {
    if (moment(date2).isBefore(date1)) {
      return 0
    } else {
      return moment(date2).diff(moment(date1), 'day')
    }
  }

  return {
    formatTimeString,
    formatDateString,
    formatTimeMonent,
    formatDateMonent,
    disabledMinDate,
    disabledMaxDate,
    disabledMinDateTime,
    disabledMaxDateTime,
    getDiffDays,
  }
}

export const WorkTimes = () => {
  /**
   * 代单位的工期转小时
   * @param value 值
   * @param unit 单位 h=小时，d=天，w=周，m=月，y=年
   * @param calendar 日历
   * @returns {*}
   */
  let toHour = (value, unit, calendar) => {
    if (!isNaN(value) && unit && calendar) {
      if (unit == "h") {
        return value;
      } else if (unit == "d" && calendar.dayHrCnt) {
        return value * calendar.dayHrCnt;
      } else if (unit == "w" && calendar.weekHrCnt) {
        return value * calendar.weekHrCnt;
      } else if (unit == "m" && calendar.monthHrCnt) {
        return value * calendar.monthHrCnt;
      } else if (unit == "y" && calendar.yearHrCnt) {
        return value * calendar.yearHrCnt;
      } else if (unit == '%') {
        return value;
      }
    }
    return 0;
  }

  /**
   * 小时转成对应单位的数字
   * @param value 值
   * @param unit 单位 h=小时，d=天，w=周，m=月，y=年
   * @param calendar 日历
   * @returns {*}
   */
  let hourTo = (value, unit, calendar) => {
    if (!isNaN(value) && unit && calendar) {
      if (unit == "h") {
        return value;
      } else if (unit == "d" && calendar.dayHrCnt) {
        return value / calendar.dayHrCnt;
      } else if (unit == "w" && calendar.weekHrCnt) {
        return value / calendar.weekHrCnt;
      } else if (unit == "m" && calendar.monthHrCnt) {
        return value / calendar.monthHrCnt;
      } else if (unit == "y" && calendar.yearHrCnt) {
        return value / calendar.yearHrCnt;
      } else if (unit == '%') {
        return value;
      }
    }
    return 0;
  }
  return {
    toHour,
    hourTo,
  }
}

export const Numbers = () => {
  /**
   * 格式化小数
   * @param value 值
   * @param precision 小数位数
   * @param thousandsSeparator 是否千分位分隔
   * @returns {*}
   */
  let valueFomat = (value, precision, thousandsSeparator) => {
    if (!isNaN(value)) {
      precision = precision || 0
      let data = parseFloat(value);
      data = Math.round(data * 100) / 100;
      let s = data.toString();
      let rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + precision) {
        s += '0';
      }
      if (thousandsSeparator) {
        s = s.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      }
      return s;
    }
    return value;
  }

  /**
   * 模式格式化
   * @param value 值
   * @param pattern 格式化模型 ###,###.00
   * @returns {*}
   */
  let pattern = (value, pattern) => {
    if (!isNaN(value) && pattern) {
      let data = parseFloat(value);
      let strarr = data ? data.toString().split('.') : ['0'];
      let fmtarr = pattern ? pattern.split('.') : [''];
      let retstr = '';
      // 整数部分
      let str = strarr[0];
      let fmt = fmtarr[0];
      let i = str.length - 1;
      let comma = false;
      for (let f = fmt.length - 1; f >= 0; f--) {
        switch (fmt.substr(f, 1)) {
          case '#':
            if (i >= 0) retstr = str.substr(i--, 1) + retstr;
            break;
          case '0':
            if (i >= 0) retstr = str.substr(i--, 1) + retstr;
            else retstr = '0' + retstr;
            break;
          case ',':
            comma = true;
            retstr = ',' + retstr;
            break;
        }
      }
      if (i >= 0) {
        if (comma) {
          let l = str.length;
          for (; i >= 0; i--) {
            retstr = str.substr(i, 1) + retstr;
            if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
          }
        }
        else retstr = str.substr(0, i + 1) + retstr;
      }
      retstr = retstr + '.';
      // 处理小数部分
      str = strarr.length > 1 ? strarr[1] : '';
      fmt = fmtarr.length > 1 ? fmtarr[1] : '';
      i = 0;
      for (let f = 0; f < fmt.length; f++) {
        switch (fmt.substr(f, 1)) {
          case '#':
            if (i < str.length) retstr += str.substr(i++, 1);
            break;
          case '0':
            if (i < str.length) retstr += str.substr(i++, 1);
            else retstr += '0';
            break;
        }
      }
      return retstr.replace(/^,+/, '').replace(/\.$/, '');
    }
    return value;
  }

  /**
   * 格式化小数
   * @param value 值
   * @param fomat 格式化参数对象
   * @returns {*}
   */
  let fomat = (value, fomat) => {
    if (!isNaN(value) && fomat) {
      if (fomat.pattern) {
        return pattern(value, fomat.pattern)
      } else {
        return valueFomat(value, fomat.precision, fomat.thousandsSeparator)
      }
    }
    return value;
  }

  return {
    fomat,
  }
}

export const Arr = () => {

  let toString = (arr = [], mark = ",") => {
    let str = "";
    if (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        str += str ? mark + arr[i] : arr[i];
      }
    }
    return str;
  }

  let toStringByObjectArr = (arr = [], field = "id", mark = ",") => {
    let l = new Array();
    if (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        l.push(arr[i][field]);
      }
    }
    return toString(l, mark);
  }


  return {
    toString,
    toStringByObjectArr
  }
}

export const Favorites = () => {

  const add = async (bizType, bizs, callback) => {
    axios.post(addFavorites, { bizType: bizType, bizs: bizs }).then((result) => {
      callback && callback(result);
    })
  }

  const rest = async (bizType, bizs, callback) => {
    axios.post(restFavorites, { bizType: bizType, bizs: bizs }).then((result) => {
      callback && callback(result);
    })
  }

  const listRest = async (rests, callback) => {

    axios.post(listRestFavorites, rests).then((result) => {
      callback && callback(result);
    })
  }


  const del = (bizType, bizs, callback) => {
    bizs = Arr().toString(bizz);
    axios.deleted(deleteFavorites(bizType, bizs), {}, true).then(result => {
      callback && callback(result);
    })
  }

  const list = async (bizType,callback) => {
    let data = await axios.get(getFavoritesList(bizType));
    callback(data);
    return data.data || [];
  }

  return {
    add,
    del,
    list,
    rest,
    listRest
  }
}

export var CacheOpenProject = function () {

  let initDatas = async (callback) => {
    // 是否第一次加载
    let openedProject = sessionStorage.getItem('openedProject');
    if (!openedProject) {
      // 读取用户上传加载的数据
      let result = await axios.get(getLastOpenInfo) || { data: {} };
      const { lastOpenProject, lastOpenProjectByTask, lastOpenPlans, lastOpenPlanProject } = result.data.data || {};

      if (lastOpenProject) {
        sessionStorage.setItem('lastOpenProject', JSON.stringify({ projectId: lastOpenProject.id, projectName: lastOpenProject.name }));
      } else {
        sessionStorage.setItem('lastOpenProject', "{}");
      }

      if (lastOpenProjectByTask) {
        sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId: lastOpenProjectByTask.id, projectName: lastOpenProjectByTask.name }));
      } else {
        sessionStorage.setItem('lastOpenProjectByTask', "{}");
      }
      if (lastOpenPlans) {
        let { id, name } = lastOpenPlanProject || {};
        sessionStorage.setItem('lastOpenPlan', JSON.stringify({ planId: lastOpenPlans, projectId: id, projectName: name }));
      } else {
        sessionStorage.setItem('lastOpenPlan', "{}");
      }
      sessionStorage.setItem('openedProject', "true");
    }
    callback();
  }

  let getLastOpenProject = (callback) => {
    initDatas(() => {
      let dat = JSON.parse(sessionStorage.getItem('lastOpenProject') || "{}");
      callback(dat);
    });
  }

  let getLastOpenProjectByTask = (callback) => {
    initDatas(() => {
      let dat = JSON.parse(sessionStorage.getItem('lastOpenProjectByTask') || "{}");
      callback(dat);
    });
  }

  let getLastOpenPlan = (callback) => {
    initDatas(() => {
      let dat = JSON.parse(sessionStorage.getItem('lastOpenPlan') || "{}");
      callback(dat);
    });
  }

  let setLastOpen = (projectId, defines) => {
    let addArr = [{ bizType: "last-open-project-task", bizs: [projectId] }, { bizType: "last-open-project", bizs: [projectId] }, { bizType: "last-open-plan", bizs: defines }];
    Favorites().listRest(addArr);
  }

  let addLastOpenPlan = (defineIds, projectId, projectName, callback) => {
    sessionStorage.setItem('openedProject', "true");
    sessionStorage.setItem('lastOpenPlan', JSON.stringify({ "planId": defineIds, "projectId": projectId, projectName: projectName }));
    sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId: projectId, projectName: projectName }));
    sessionStorage.setItem('lastOpenProject', JSON.stringify({ projectId: projectId, projectName: projectName }));

    callback && callback();
    setLastOpen(projectId, defineIds);
  }

  /**
   * 默认打开有权限的计划
   *
   * @param projectId
   */
  let cachePlanByProject = (project, callback) => {
    let { projectId, projectName } = project;
    axios.get(getDefineListByUserAuthAndProjectId(projectId)).then(res => {
      let data = res.data.data || [];
      let defineIds = new Array();
      if (data) {
        data.forEach(item => {
          defineIds.push(item.id);
        })
      }
      sessionStorage.setItem('lastOpenPlan', JSON.stringify({ planId: defineIds, projectId: projectId, projectName }));
      callback && callback();
      setLastOpen(projectId, defineIds);
    });
  };

  let addLastOpenProject = (projectId, projectName, callback) => {
    sessionStorage.setItem('openedProject', "true");
    sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId: projectId, projectName: projectName }));
    sessionStorage.setItem('lastOpenProject', JSON.stringify({ projectId: projectId, projectName: projectName }));
    cachePlanByProject({ projectId, projectName }, callback);
  }
  let addLastOpenProjectByTask = (projectId, projectName, callback) => {
    sessionStorage.setItem('openedProject', "true");
    sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId: projectId, projectName: projectName }));
    sessionStorage.setItem('lastOpenProject', JSON.stringify({ projectId: projectId, projectName: projectName }));
    cachePlanByProject({ projectId, projectName }, callback);
  }
  return {
    getLastOpenProject,
    getLastOpenProjectByTask,
    getLastOpenPlan,
    addLastOpenPlan,
    addLastOpenProject,
    addLastOpenProjectByTask,
    cachePlanByProject
  }
}

/**
 * 警告提醒
 *
 * @param content
 * @param type
 */
export function message(content, type) {
  notification.warning({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    type : "warning",
    message: type || '警告',
    description: content
  });
}


/**
 * 警告提醒
 *
 * @param content
 * @param type
 */
export function warning(content, type) {
  message(content,type);
}


/**
 * 成功提醒
 *
 * @param content
 * @param type
 */
export function success(content, type) {
  notification.success({
    placement: 'bottomRight',
    bottom: 50,
    duration: 1,
    type : "success",
    message: type || '成功',
    description: content
  });
}

/**
 * 消息提醒
 *
 * @param content
 * @param type
 */
export function error(content, type) {
  notification.error({
    placement: 'bottomRight',
    bottom: 50,
    duration: 1,
    type : "error",
    message: type || '失败',
    description: content
  });
}

/**
 * 消息提醒
 *
 * @param content
 * @param type
 */
export function info(content, type) {
  notification.info({
    placement: 'bottomRight',
    bottom: 50,
    duration: 1,
    type : "error",
    message: type || '信息',
    description: content
  });
}



/**
 * @author
 * 如果想将日期字符串格式化,需先将其转换为日期类型Date
 * 以下是提供几种常用的
 *
 * var da = new Date().format('yyyy-MM-dd hh:mm:ss'); //将日期格式串,转换成先要的格式
 * alert("格式化日期类型 \n" + new Date() + "\n 为字符串：" + da);
 *
 * var str = "2014/01/01 01:01:01" // yyyy/mm/dd这种格式转化成日期对像可以用new Date(str);在转换成指定格式
 * alert("格式化字符串\n" + str + " 为日期格式 \n" + new Date(str).format('yyyy-MM-dd hh:mm:ss'))
 *
 *
 * var str1 = "2014-12-31 00:55:55" // yyyy-mm-dd这种格式的字符串转化成日期对象可以用new Date(Date.parse(str.replace(/-/g,"/")));
 * alert("格式化字符串\n" + str1 + " 为日期格式 \n" + new Date(Date.parse(str1.replace(/-/g, "/"))).format('yyyy-MM-dd hh:mm:ss'))
 *
 *
 * 日期加月
 * 先将字符转换成Date类型才可以使用
 * var str1 = "2014-12-31 00:55:55" // yyyy-mm-dd这种格式的字符串转化成日期对象可以用new Date(Date.parse(str.replace(/-/g,"/")));
 * 例如 var saveDate = new Date(Date.parse(str1.replace(/-/g, "/"))).addMonth(5)
 * addMonth(月数) 必须为整数
 */
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

Date.daysInMonth = function (year, month) {
  if (month == 1) {
    if (year % 4 == 0 && year % 100 != 0)
      return 29;
    else
      return 28;
  } else if ((month <= 6 && month % 2 == 0) || (month = 6 && month % 2 == 1))
    return 31;
  else
    return 30;
};
Date.prototype.addMonth = function (addMonth) {
  var y = this.getFullYear();
  var m = this.getMonth();
  var nextY = y;
  var nextM = m;
  //如果当前月+要加上的月>11 这里之所以用11是因为 js的月份从0开始
  if (m > 11) {
    nextY = y + 1;
    nextM = parseInt(m + addMonth) - 11;
  } else {
    nextM = this.getMonth() + addMonth
  }
  var daysInNextMonth = Date.daysInMonth(nextY, nextM);
  var day = this.getDate();
  if (day > daysInNextMonth) {
    day = daysInNextMonth;
  }
  return new Date(nextY, nextM, day);
};

export const getUrlParams = (info) => {
  let str = ""
  for (let key in info) {
    let v = info[key] == null || info[key] == undefined ? "" : info[key];
    if(str!=""){
      str += `&${key}=${v}`
    }else{
      str += `${key}=${v}`
    }
  }
  return str
}

export const spliceUrlParams = (url,info) => {
  let paramstr = getUrlParams(info);
  return url + "?"+ paramstr;
}



//展开行
 //初始化展开所有行
 /**
  * 返回展开行数组
  * @param {*源数据} data 
  * @param {*层数} level 
  * @param {*待定} idarr 
  */
 export const getExpandKeys=(data,level = 1000,idarr)=>{
  let array=[]
  let loop=(data,level_)=>{
      if(level_ && level_ > 0 || level_ =="ALL"){
        data.forEach(item=>{
          if(item.children){
            array.push(item.id)
            loop(item.children, (!level_ || level_ =="ALL" ) ? level_ : level_ - 1)
          }
        })
      }
  }
  loop(data,level)
  return array
}
//定位展开
 //初始化展开指定位置
 /**
  * 返回展开行数组
  * @param {*源数据} data 
  * @param {*定位展开行id} id 
  */
 export const getLocateExpandKeys =(data,id)=>{
  let array=[];
  let loop=(data,id)=>{
    let ret = false;
    if(data){
      for(let i = 0, len = data.length; i < len; i++) {
        if(data[i].id === id){
          ret = true;
          break;
        }
        if(data[i].children){
          ret = loop(data[i].children,id);
          if(ret){
            array.push(data[i].id);
            break;
          }
        }
      }
    }
    return ret;
  }
  loop(data,id);
  return array;
}

/**
 * 获取节点
 *
 * @param list
 * @param func
 */
export const getItemByTree = (list,func) => {
  function getItemByTree_(l,f){
    let retItem = null;
    if(l){
      for(let i = 0, len = l.length; i < len; i++){
        if(f(l[i])){
          retItem = l[i];
          break;
        }else{
          let ritem = getItemByTree_(l[i].children, f);
          if(ritem){
            retItem = ritem;
            break;
          }
        }
      }
    }
    return retItem;
  }
  return getItemByTree_(list,func);
}

/**
 * 遍历树形集合/集合
 *
 * @param l
 * @param f
 * @returns {*}
 */
export const forEachTreeItem = (l,f,parentItem = null) =>{
  if(l){
    for(let i = 0, len = l.length; i < len; i++){
      let b = f(l[i],l,i,parentItem);
      if(b === "break"){
        return b;
      }
      let c = forEachTreeItem(l[i].children, f, l[i]);
      if(c === "break")
      {
        return c;
      }
    }
  }
}

/**
 * 倒序遍历
 *
 * @param l
 * @param f
 * @param parentItem
 */
function forEachTreeItemLast(l,f,parentItem = null){
  if(l){
    for(let i = l.length -1, len = 0; i >= len; i-- ){
      forEachTreeItemLast(l[i].children, f, l[i]);
      f(l[i],l,i,parentItem);
    }
  }
}




/**
 * 克隆
 *
 * @param data
 * @returns {any}
 */
export const clone = (data) => {
  return JSON.parse( JSON.stringify(data))
}

/**
 * 表格数据操作
 *
 * @param datas
 * @returns {{newItem: newItem}}
 * @constructor
 */
export const Table = function (datas) {
  /**
   * 增加
   *
   * @param newItem
   * @param parentItem
   * @param type
   */
  let newItem = (newItem,parentItem,type = "last") => {
    let list = datas;
    // 存在父节点，增加子节点
    if(parentItem){
      let parentId = 0;
      if( typeof parentItem === "number"){
        parentId = parentItem;
      }else{
        parentId = parentItem.id;
      }
      // 获取父节点对象
      let parent = getItemByTree(datas,(item) => {
        return item.id == parentId;
      })
      if(parent){
        if(parent.children){
          list = parent.children;
        }else{
          list = [];
          parent.children = list;
        }
      }
    }
    if(type == "first"){
      list.unshift(newItem);
    }else if(type == "last"){
      list.push(newItem);
    }
  };

  /**
   * 修改数据
   *
   * @param newItem
   */
  let updateItem = (newItem) => {

    let {id} = newItem;
    // 获取父节点对象
    forEach((item,list,index) => {
      if(item.id == id){
        if (item.children) {
          newItem.children = item.children;
        }
        list.splice(index, 1, newItem)
        return "break";
      }
    });
  };

  /**
   * 获取父节点
   *
   * @param item
   * @returns {*}
   */
  let getParentItem = (item) =>{
    let {id} = item || {};
    let retItem = null;
    forEach((item,list,index,parentItem) => {
      if(item.id == id){
        retItem = parentItem;
        return "break";
      }
    })
    return retItem;
  }
  /**
   * 遍历
   *
   * @param callback
   */
  let forEach = (callback) =>{
    forEachTreeItem(datas,callback);
  }
  /**
   * 倒叙遍历
   *
   * @param callback
   */
  let forEachLast = (callback) =>{
    forEachTreeItemLast(datas,callback);
  }
  /**
   * 根据ID集合删除对象
   *
   * @param idArr
   */
  let deleteItemByIds = (idArr) => {
    forEachLast((item,list,index) => {
      if(idArr.indexOf(item.id) > -1){
        list.splice(index,1);
      }
    })
  }
  /**
   * 根据ID获取对象
   *
   * @param id
   */
  let getItemById = (id) =>{
    return getItemByTree(datas,(item) => {
      return item.id == id;
    })
  }

  let getDataMaps = () =>{
    let dataMaps = new Object();
    if(datas){
      datas.forEach((item,index)=>{
        dataMaps[item.id] = item;
      });
    }
    return dataMaps;
  }

  /**
   * 倒序遍历
   *
   * @param l
   * @param f
   * @param parentItem
   */
  function forEachParentItem(l,id,f,parentItem = null){
    if(l){
      for(let i = l.length -1, len = 0; i >= len; i-- ){
        forEachTreeItemLast(l[i].children, f, l[i]);
        f(l[i],l,i,parentItem);
      }
    }
  }

  /**
   * 内部方法，遍历父节点
   *
   * @param list
   * @param id
   * @param parentItem
   * @param callback
   * @returns {*}
   * @private
   */
  let forEachParentById___ = (list,id,parentItem,callback) =>{
    if(list){
      for(let i = 0, len = list.length; i < len; i ++ ){
        let item = list[i];
        if(item.id == id){
          return true;
        }
        let isParent = forEachParentById___(item.children,id,item,callback);
        if(isParent){
          callback(item,i,parentItem);
          return isParent;
        }
      }
    }
    return false;
  }
  /**
   * 遍历父节点，爷爷节点，爷爷的父亲，爷爷的父亲的父亲，爷爷的父亲的父亲的父亲，爷爷的父亲的父亲的父亲的父亲...
   * @param id
   * @param callback
   */
  let forEachParentById = (id,callback) =>{
    forEachParentById___(datas,id,null,callback);
  }
  /**
   * 获取父节点，爷爷节点，爷爷的父亲，爷爷的父亲的父亲，爷爷的父亲的父亲的父亲，爷爷的父亲的父亲的父亲的父亲...的集合【从最大辈分到最小辈分排序】。
   * @param id
   * @returns {any[]}
   */
  let getParentsById = (id) => {
    let parents = new Array();
    forEachParentById(id,(item,index,parentItem)=>{
      parents.unshift(item);
    })
    return parents;
  }

  /**
   * 获取根目录
   *
   * @param id
   */
  let getRootItemById = (id) =>{
    let rootItem = null;
    forEachParentById(id,(item,index,parentItem)=>{
      if(parentItem == null){
        rootItem = item;
      }
    })
    return rootItem;
  }

  return {
    newItem,
    updateItem,
    deleteItemByIds,
    getParentItem,
    getItemById,
    forEach,
    forEachLast,
    forEachParentById,
    getRootItemById,
    getParentsById
  }
}
