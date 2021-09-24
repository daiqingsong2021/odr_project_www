import { func } from "prop-types";
import axios from '../../../../api/axios'
import { notification } from 'antd';
import { getBaseSelectTree } from '@/api/suzhou-api';
import {getPermission} from '../../api/suzhou-api'

//下载文件
/**
 *
 * @param {地址} fileUrl
 * @param {名称} fileName
 */

export function download(fileUrl, fileName, fileId) {
  let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm'];
  let type = fileName ? fileName.split('.')[1].toLowerCase() : '';
  let index = arr.findIndex(item => item == type);
  if (index != -1) {
    if (!fileId) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 3,
          message: "没有可下载的实体文件!",
          description: "没有可下载的实体文件!"
        }
      )
      return
    }
    axios.down("/api/doc/file/down?fileId=" + fileId, {}).then((e) => {

    });
  } else {
    window.open(fileUrl, '_self')
  }

}

/**
* 对象转url参数
* @param {Object} obj - 需要拼接在url上的{key:value}
*/
export const queryParams = obj => {
  if (typeof obj === 'object') {
    let params = [];
    for (let key in obj) {
      if (obj[key] || obj[key] === 0) {
        params.push({
          [key]: obj[key],
        });
      }
    }
    params = params.map(item => {
      let str = '';
      for (let key in item) {
        str = key + '=' + item[key];
      }
      return isChina(str);
    });
    return '?' + params.join('&');
  }
  throw Error('发生错误');
};
/**
 * 将数组转成控件需要的数据
 * @param {Array}
 */
export const getMapData = (arr, a = ['title', 'value'], b = ['name', 'id']) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i][a[0]] =arr[i][b[0]];
    arr[i][a[1]] = arr[i][b[1]];
    if (arr[i].children) {
      getMapData(arr[i].children, a, b);
    }
  }
  return arr;
};
/**
 * 将数组转成控件需要的数据  用于标段
 * @param {Array}
 */
export const getMapSectionData = (arr, a = ['title', 'value'], b = ['name', 'id','code']) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i][a[0]] =arr[i][b[2]]+'  '+arr[i][b[0]];
    arr[i][a[1]] = arr[i][b[1]];
    if (arr[i].children) {
      getMapSectionData(arr[i].children, a, b);
    }
  }
  return arr;
};
/**
 * 将数组转成控件需要的数据  指定显示某些标段
 * @param {Array}
 */
export const getMapSectionsData = (arr,sectionIds, a = ['title', 'value'], b = ['name', 'id','code']) => {
  const sectionIdsArr = sectionIds.split(',');
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    arr[i][a[0]] =arr[i][b[2]]+'  '+arr[i][b[0]];
    arr[i][a[1]] = arr[i][b[1]];
    sectionIdsArr.map((item,index)=>{
      if(item == arr[i]['id']){
        newArr.push(arr[i]);
      }
    })
    if (arr[i].children) {
      getMapSectionsData(arr[i].children,sectionIds, a, b);
    }

  }
  return newArr;
};
/**
 * 将树形数据转成列表
 * @param {Array}
 */
 //树=>列表
 export const tree2list=(array,newList)=>{
  if(array){
    array.forEach((item,index,arr)=>{
      var obj = item;
      if(item.type == 'project'){
        newList.push(item)
      }
      if(item.children){
        tree2list(item.children,newList);
      }
    })
    return newList
  }
}
// 表单布局参数
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
// 表单布局参数
export const formLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};
//
export const zipinLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
// 获取字典数据方法
export const getBaseData = (code) => {
  return new Promise(resolve => {
    axios.get(getBaseSelectTree(code)).then(response => {
      const { data } = response.data;
      resolve(data)
    });
  })
};
//判断url中是否包含中文 是的话再进行转义
export const isChina=(s)=>{                               
  if(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(s)){
      return encodeURI(s);
  }else{return s}
};
export const columnsCommon = [
  {
      title: '标段号',
      dataIndex: 'sectionCode',
      key: 'sectionCode',
      width:'8%'
  },
  {
      title: '标段名称',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width:'14%'
  },
]
export const columnsCreat = [
  {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width:'8%'
  },
  {
      title: '创建日期',
      dataIndex: 'creatTime',
      key: 'creatTime',
      width:'10%'
  }
]
export const chinaMap =[{
	name:"湖北",
	value:"0"
},{
	name:"广东",
	value:"0"
},{
	name:"河南",
	value:"0"
},{
	name:"浙江",
	value:"0"
},{
	name:"湖南",
	value:"0"
},{
	name:"安徽",
	value:"0"
},{
	name:"江西",
	value:"0"
},{
	name:"江苏",
	value:"0"
},{
	name:"重庆",
	value:"0"
},{
	name:"山东",
	value:"0"
},{
	name:"四川",
	value:"0"
},{
	name:"黑龙江",
	value:"0"
},{
	name:"北京",
	value:"0"
},{
	name:"上海",
	value:"0"
},{
	name:"福建",
	value:"0"
},{
	name:"河北",
	value:"0"
},{
	name:"陕西",
	value:"0"
},{
	name:"广西",
	value:"0"
},{
	name:"云南",
	value:"0"
},{
	name:"海南",
	value:"0"
},{
	name:"贵州",
	value:"0"
},{
	name:"山西",
	value:"0"
},{
	name:"辽宁",
	value:"0"
},{
	name:"天津",
	value:"0"
},{
	name:"甘肃",
	value:"0"
},{
	name:"吉林",
	value:"0"
},{
	name:"内蒙古",
	value:"0"
},{
	name:"新疆",
	value:"0"
},{
	name:"宁夏",
	value:"0"
},{
	name:"香港",
	value:"0"
},{
	name:"台湾",
	value:"0"
},{
	name:"青海",
	value:"0"
},{
	name:"澳门",
	value:"0"
},{
	name:"西藏",
	value:"0"
},{
	name:"南海诸岛",
	value:"0"
}]

/**
 * 获取权限
 */
export const permissionFun = (menuCode)=>{
  let params = {};
  return new Promise((resolve, reject) => {
    if(!menuCode){
      params['permission'] = [];
      resolve(params);
    }else{
      axios.get(getPermission(menuCode)).then((res)=>{
        let permission = []
        res.data.data.map((item,index)=>{
          permission.push(item.code)
        })
        params['permission'] = permission;
        resolve(params);
      })
    }
  })
}

// 页签显示
export const setRightShow = (result,msg) => {
  return new Promise(resolve => {
    resolve({rightTagShow:msg})
  })
};
