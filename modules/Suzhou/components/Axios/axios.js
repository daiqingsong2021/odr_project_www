import axios from "axios";
import qs from "qs";
import emitter from '@/api/ev'
// import {getToken} from './auth.js'
import router from 'next/router'
// react 中使用antd  此处自定义
import {message, notification} from "antd";
import {baseURL} from "@/api/config";
// 创建axios默认请求
axios.defaults.baseURL = baseURL;
// 配置超时时间
axios.defaults.timeout = 100000;
// 配置请求拦截
axios.interceptors.request.use(config => {
  // config.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT,DELETE'
  if (sessionStorage.getItem('token')) {
    config.headers['Authorization'] = sessionStorage.getItem('token');
    config.headers['Content-Type'] = 'application/json';
    //config.headers['visitor'] = 'szc'
  }
  return config;
});
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // 对响应错误 统一格式提示
    notification.error(
      {
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '出错了',
        description: '抱歉，网络开小差了，请稍后重试'
      }
    )
    return Promise.reject(error);
  }
);
/**
 *GET请求 封装
 * @method GET
 * @param {string} url 接口地址
 * @param {json} params 提交数据
 * @param {Boolean} isSuccess  是否显示提示文字 默认false
 * @param {string} description 提示框提示文字   默认 "操作成功！"
 * @param {Boolean} isLoading 是否显示loading动画 默认 true
 * @return {json} 数据
 */
var get = function (url, params, isSuccess = false, description, isLoading = false) {
  isLoading ? emitter.emit('loading', true) : ''
  return new Promise((resolve, reject) => {

    axios.get(url, params).then(res => {
      isLoading ? emitter.emit('loading', false) : ''
      if (res.data.status == 200) {
        if (isSuccess) {
          notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '操作提醒',
              description: description ? description : '操作成功！'
            }
          )
        }
        resolve(res);
      } else if (res.data.status == 40301) {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '登陆过期',
            description: '登陆失效，请重新登陆！'
          }
        )
        router.push('/login')
        // window.location.href = baseURL + "/api/szxm/sologin";
      }else if(res.data.status==1088){
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: res.data.message
          }
        )
      } else {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '出错了',
            description: res.data.message
          }
        )
      }
    })
      .catch(err => {
        isLoading ? emitter.emit('loading', false) : ''
        reject(err);
      });
  });
};
/**
 *POST请求 封装
 * @method POST
 * @param {string} url 接口地址
 * @param {json} params 提交数据
 * @param {Boolean} isSuccess  是否显示提示文字 默认false
 * @param {string} description 提示框提示文字   默认 "操作成功！"
 * @param {Boolean} isLoading 是否显示loading动画 默认 true
 * @return {json} 数据
 */

var post = function (url, params, isSuccess = false, description, isLoading = false) {
  isLoading ? emitter.emit('loading', true) : ''
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {

      isLoading ? emitter.emit('loading', false) : ''
      if (res.data.status == 200) {
        resolve(res);
      } else if (res.data.status == 40301) {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '出错了',
            description: '登陆失效，请重新登陆！'
          }
        )
        router.push('/login')
        // window.location.href = baseURL + "/api/szxm/sologin";
      }else if(res.data.status==1088){
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: res.data.message
          }
        )
      } else {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '出错了',
            description: res.data.message
          }
        )
      }
    })
      .catch(err => {
        isLoading ? emitter.emit('loading', false) : ''
        reject(err);
      });
  });
};

/**
 *DELETE请求 封装
 * @method DELETE
 * @param {string} url 接口地址
 * @param {json} params 提交数据
 * @param {Boolean} isSuccess  是否显示提示文字 默认false
 * @param {string} description 提示框提示文字   默认 "操作成功！"
 * @param {Boolean} isLoading 是否显示loading动画 默认 true
 * @return {json} 数据
 */
var deleted = function (url, params, isSuccess = false, description, isLoading = false) {
  isLoading ? emitter.emit('loading', true) : ''
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then(res => {
      isLoading ? emitter.emit('loading', false) : ''
      if (res.data.status == 200) {
        if (isSuccess) {
          notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '操作提醒',
              description: description ? description : '操作成功！'
            }
          )
        }
        resolve(res);
      } else if (res.data.status == 40301) {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '出错了',
            description: '登陆失效，请重新登陆！'
          }
        )
        router.push('/login')
        // window.location.href = baseURL + "/api/szxm/sologin";
      }else if(res.data.status==1088){
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: res.data.message
          }
        )
      } else {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '出错了',
            description: res.data.message
          }
        )
      }
    })
      .catch(err => {
        isLoading ? emitter.emit('loading', false) : ''
        reject(err);
      });
  });
};

/**
 *PUT请求 封装
 * @method PUT
 * @param {string} url 接口地址
 * @param {json} params 提交数据
 * @param {Boolean} isSuccess  是否显示提示文字 默认false
 * @param {string} description 提示框提示文字   默认 "操作成功！"
 * @param {Boolean} isLoading 是否显示loading动画 默认 true
 * @return {json} 数据
 */
var put = function (url, params, isSuccess = false, description, isLoading = false) {
  isLoading ? emitter.emit('loading', true) : ''
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(res => {
      isLoading ? emitter.emit('loading', false) : ''
      if (res.data.status == 200) {
        if (isSuccess) {
          notification.success(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '操作提醒',
              description: description ? description : '操作成功！'
            }
          )
        }
        resolve(res);
      } else if (res.data.status == 40301) {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 1,
            message: '出错了',
            description: '登陆失效，请重新登陆！'
          }
        )
        router.push('/login')
        // window.location.href = baseURL + "/api/szxm/sologin";
      } else if(res.data.status==1088){
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '警告',
            description: res.data.message
          }
        )
      }else {
        notification.error(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '出错了',
            description: res.data.message
          }
        )
      }
    })
      .catch(err => {
        isLoading ? emitter.emit('loading', false) : ''
        reject(err);
      });
  });
};

/**
 *POST请求 封装
 * @method POST
 * @param {string} url 接口地址
 * @param {json} params 提交数据
 * @param {Boolean} isSuccess  是否显示提示文字 默认false
 * @param {string} description 提示框提示文字   默认 "操作成功！"
 * @param {Boolean} isLoading 是否显示loading动画 默认 true
 * @return {json} 数据
 */

var down = function (url, params, isSuccess = false, description, isLoading = false) {

  return new Promise((resolve, reject) => {

    axios.post(url, params,{responseType: 'blob'}).then(resp => {

      isLoading ? emitter.emit('loading', false) : ''

      let headers = resp.headers;
      let contentType = headers['content-type'];

      if (!resp.data) {
        return false;
      } else {

        const blob = new Blob([resp.data], {type: contentType});

        const contentDisposition = resp.headers['content-disposition'];
        let fileName = 'unknown';
        if (contentDisposition) {
          fileName = window.decodeURI(resp.headers['content-disposition'].split('=')[1]);
        }
        downFile(blob, fileName);
      }
    })
    .catch(err => {
    });
  });
};

 /* 下载方法 */
 var downFile = function(blob, fileName) {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); // 创建下载的链接
    link.download = fileName; // 下载后文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click(); // 点击下载
    window.URL.revokeObjectURL(link.href); // 释放掉blob对象
    document.body.removeChild(link); // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName);
  }
 }



export default {get, post, deleted, put, down};
