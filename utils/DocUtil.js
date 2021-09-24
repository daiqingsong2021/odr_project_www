import axios from '../api/axios'
import {
  docFileInfo
} from '../api/api'
import * as dataUtil from "./dataUtil";
import {docFileEdit} from '../api/api';
import {baseURL} from '../api/config';


/**
 * 表格数据操作
 *
 * @param datas
 * @returns {{newItem: newItem}}
 * @constructor
 */
export const File = function (fileId) {
 
  let onlineView = () => {
    let newwindow
    let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
    if (fileId) {
      let url = dataUtil.spliceUrlParams(docFileInfo(fileId), {});
      axios.get(url).then(res => {
        if (res.data.data && res.data.data.fileUrl) {
          // let type = res.data.data.fileName ? res.data.data.fileName.split('.')[1] : '';
          let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
          if(type){
            type = type.toLowerCase();
          }
          let index = arr.findIndex(item => item == type);
          if (index != -1) {
            if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
              newwindow = window.open(res.data.data.fileViewUrl)
              // newwindow.document.charset="UTF-8";
            } else{
              newwindow = window.open(res.data.data.fileUrl)
              // newwindow.document.charset="UTF-8";
            }
          } else {
            // dataUtil.message(intl.get('wsd.global.hint.docwarning'));
          }
        }
      })
    } else {
      // dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
    }
  }

  let onlineEdit = () =>{
    let newwindow
    if (fileId) {
      let url = dataUtil.spliceUrlParams(docFileInfo(fileId), {});
      axios.get(url).then(res => {
        if (res.data.data && res.data.data.fileUrl) {
          let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
          if(type){
            type = type.toLowerCase();
          }
          if(type == 'doc' ||  type == 'docx' ||  type == 'xls' ||  type == 'xlsx'){
            newwindow = window.open(baseURL.replace("8765","8778")+docFileEdit(fileId))
          }else{
            alert("该文档格式暂不支持在线编辑")
            return false
          }
        }
      })
    } else {
      // dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
    }
  }

  return {
    onlineView,
    onlineEdit
  }

}
