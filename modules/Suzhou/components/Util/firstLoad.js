import * as dataUtil from '@/utils/dataUtil';
import notificationFun from '@/utils/notificationTip';
import {getTokenKey,planProAuthTree} from '../../api/suzhou-api';
import axios from '@/api/axios';
import {tree2list} from "@/modules/Suzhou/components/Util/util.js";
// 获取项目id 和 标段IDs
export const firstLoad = () => {
    let params = {};
    //获取菜单列表
    const lastOpenProjectByTask = JSON.parse(sessionStorage.getItem('lastOpenProjectByTask') || '{}');
    const lastOpenSection = JSON.parse(sessionStorage.getItem('lastOpenSection') || '{}');
    let openedProject = sessionStorage.getItem('openedProject');
    return new Promise((resolve, reject) => {
        //本地缓存   项目为空
        if (!lastOpenProjectByTask.projectId){
            dataUtil.Favorites().list('lastOpenProjectByTask', res => {
                if (!res.data.data) {
                    //收藏  无项目
                    axios.get(planProAuthTree).then(res=>{
                        if(res.data.data.length > 0){
                            const proList = tree2list(res.data.data,[]);
                            if(proList.length > 0){
                                params['projectId'] =proList[0].id;
                                params['projectName'] =proList[0].name;
                                resolve(params);
                            }
                        }else{
                            notificationFun('警告','请选择项目和标段');
                            return reject('');
                        }
                    })
                } else {
                    params['projectId'] = res.data.data[0];
                    dataUtil.Favorites().list('lastOpenProjectName',projectName=>{
                        if(!projectName.data.data){
                        }else{
                            params['projectName'] = projectName.data.data[0];
                            sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId:res.data.data[0],projectName:projectName.data.data[0]}));
                            sessionStorage.setItem('openedProject', "true");
                        }
                        dataUtil.Favorites().list('lastOpenSection', res => {
                            if (!res.data.data) {
                                //收藏  无标段
                                params['sectionId'] = '';
                            } else {
                                //收藏  有标段
                                params['sectionId'] = Array.isArray(res.data.data) ? res.data.data.join(','): '';
                                dataUtil.Favorites().list('lastOpenSectionCode',sectionCode=>{
                                    if(!sectionCode.data.data){

                                    }else{
                                        params['sectionCode'] = Array.isArray(sectionCode.data.data) ? sectionCode.data.data.join(','): '';
                                        sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data,sectionCode:sectionCode.data.data}));

                                    }
                                })
                                // sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data }));
                            }
                            resolve(params);
                        })
                    })
                }
            });
        }else{
            //本地有项目
            sessionStorage.setItem('openedProject', "true");
            params['projectId'] = lastOpenProjectByTask.projectId;
            params['projectName'] = lastOpenProjectByTask.projectName;
            if((!lastOpenSection.sectionId)){
                dataUtil.Favorites().list('lastOpenSection', res => {
                    if (!res.data.data) {
                        //收藏  无标段
                        params['sectionId'] = '';
                    } else {
                        //收藏  有标段
                        params['sectionId'] = Array.isArray(res.data.data) ? res.data.data.join(',') : '';
                        dataUtil.Favorites().list('lastOpenSectionCode',sectionCode=>{
                            if(!sectionCode.data.data){

                            }else{
                                params['sectionCode'] = Array.isArray(sectionCode.data.data) ? sectionCode.data.data.join('/'): '';
                                sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data,sectionCode:sectionCode.data.data}));

                            }
                        })
                        // sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data }));
                    }
                    resolve(params);
                });
            }else{
                params['sectionId'] = Array.isArray(lastOpenSection.sectionId)
                    ? lastOpenSection.sectionId.join(',')
                    : '';
                    params['sectionCode'] = Array.isArray(lastOpenSection.sectionCode)
                    ? lastOpenSection.sectionCode.join('/')
                    : '';
                resolve(params);
            }
        }
    });
};

//选择标段
/**
 *
 * @param {源数据} array
 * @param {修改key值} keyMap {"id":"value","name":"title"}
 */
export function getSelectTreeArr(array,keyMap){
    if(array){
        array.forEach((item,index,arr)=>{
          var obj = item;
          for(var key in obj){
            var newKey = keyMap[key];
            if(newKey){
                obj[newKey] = obj[key];
            }
          }
          getSelectTreeArr(item.children,keyMap);
        })
      }
}


// 获取项目id 和 标段IDs
export const firstLoadCache = () => {
    let params = {};
    //获取菜单列表
    const lastOpenProjectByTask = JSON.parse(sessionStorage.getItem('lastOpenProjectByTask') || '{}');
    const lastOpenSection = JSON.parse(sessionStorage.getItem('lastOpenSection') || '{}');
    let openedProject = sessionStorage.getItem('openedProject');
    return new Promise((resolve, reject) => {
        //本地缓存   项目为空
        if (!lastOpenProjectByTask.projectId){
            dataUtil.Favorites().list('lastOpenProjectByTask', res => {
                if (!res.data.data) {
                    //收藏  无项目
                    axios.get(planProAuthTree).then(res=>{
                        if(res.data.data.length > 0){
                            const proList = tree2list(res.data.data,[]);
                            if(proList.length > 0){
                                params['projectName'] =proList[0].name;
                                resolve(params);
                            }
                        }else{
                            return reject('');
                        }
                    })
                } else {
                    params['projectId'] = res.data.data[0];
                    dataUtil.Favorites().list('lastOpenProjectName',projectName=>{
                        if(!projectName.data.data){
                        }else{
                            params['projectName'] = projectName.data.data[0];
                            sessionStorage.setItem('lastOpenProjectByTask', JSON.stringify({ projectId:res.data.data[0],projectName:projectName.data.data[0]}));
                            sessionStorage.setItem('openedProject', "true");
                        }
                        dataUtil.Favorites().list('lastOpenSection', res => {
                            if (!res.data.data) {
                                //收藏  无标段
                                params['sectionId'] = '';
                                params['sectionCode'] = '';
                            } else {
                                //收藏  有标段
                                params['sectionId'] = Array.isArray(res.data.data) ? res.data.data.join(','): '';
                                // sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data }));
                                
                            }
                            dataUtil.Favorites().list('lastOpenSectionCode',sectionCode=>{
                                if(!sectionCode.data.data){

                                }else{
                                    params['sectionCode'] = Array.isArray(sectionCode.data.data) ? sectionCode.data.data.join('/'): '';
                                    sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data,sectionCode:sectionCode.data.data}));
                                }
                                resolve(params);
                            })
                        })
                    })
                }
            });
        }else{
            //本地有项目
            sessionStorage.setItem('openedProject', "true");
            params['projectId'] = lastOpenProjectByTask.projectId;
            params['projectName'] = lastOpenProjectByTask.projectName;
            if((!lastOpenSection.sectionId)){
                dataUtil.Favorites().list('lastOpenSection', res => {
                    if (!res.data.data) {
                        //收藏  无标段
                        params['sectionId'] = '';
                        params['sectionCode'] = '';
                    } else {
                        //收藏  有标段
                        params['sectionId'] = Array.isArray(res.data.data) ? res.data.data.join(',') : '';
                        // sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data }));
                        
                    }
                    dataUtil.Favorites().list('lastOpenSectionCode',sectionCode=>{
                        if(!sectionCode.data.data){

                        }else{
                            params['sectionCode'] = Array.isArray(sectionCode.data.data) ? sectionCode.data.data.join('/'): '';
                            sessionStorage.setItem('lastOpenSection', JSON.stringify({ sectionId: res.data.data,sectionCode:sectionCode.data.data}));
                        }
                        resolve(params);
                    })
                });
            }else{
                params['sectionId'] = Array.isArray(lastOpenSection.sectionId)
                    ? lastOpenSection.sectionId.join(',')
                    : '';
                    params['sectionCode'] = Array.isArray(lastOpenSection.sectionCode)
                    ? lastOpenSection.sectionCode.join('/')
                    : '';
                    // params['selectedRowSections'] = Array.isArray(lastOpenSection.selectedRowSections)
                    // ? lastOpenSection.selectedRowSections
                    // : '';
                resolve(params);
            }
        }
    });
};

export const TokenKey = () => {
    let params = {};
    return new Promise((resolve, reject) => {
        axios.get(getTokenKey).then(res=>{
            if(res.data.data){
                params['tokenkey'] = res.data.data;
            }
            resolve(params);
        })
    })
}