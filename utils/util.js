import { func } from "prop-types";
import downloads from './download';
import axios from '../api/axios'
import { notification } from 'antd';


// //初始化结构码
/**
 *
 * @param {数据} data
 * @param {*元素对应下标索引位置，例如,[0,0,1]} code
 */
export function dataMap(data, code = [], list = []) {
  if (!data || data.length == 0) {
    return []
  }
  for (var i = 0; i < data.length; i++) {
    list.push({
      id: data[i].id,
      index: [...code, i]
    })
    if (data[i].children) {
      dataMap(data[i].children, [...code, i], list)
    }
  }
  return list;
}

//解析
/**
 *
 * @param {数据} data
 * @param {查找元素下标索引数组} indexArray
 */
export function parseArray(data, indexArray) {

  let node = data[indexArray[0]]
  if (indexArray.length == 1) {
    return data[indexArray[0]]
  }
  indexArray.forEach((v, i, array) => {
    if (i > 0) {
      node = node.children[v]
    }
  });
  return node
}

//删除
/**
 *
 * @param {数据} data
 * @param {*数组元素生成的映射码} dataMap
 * @param {*选择的数据} record
 */
export function deleted(data, dataMap, record) {
  //查找映射码位置
  let i = dataMap.findIndex(item => item.id == record.id)
  //获取位置坐标
  let indexArray = dataMap[i].index
  let parentNode
  // let currentNode=parseArray(data,indexArray)
  //获取在父节点位置
  let nodeIndex = indexArray[indexArray.length - 1]
  if (indexArray.length == 1) {
    parentNode = null;
    data.splice(nodeIndex, 1)
  } else {
    indexArray.splice((indexArray.length - 1), 1)
    parentNode = parseArray(data, indexArray)
    parentNode.children.splice(nodeIndex, 1)
    if (parentNode.children.length == 0) {
      delete parentNode.children
    }

  }

  dataMap.splice(i, 1)
}

//修改节点
/**
 *
 * @param {数据} data
 * @param {*数组元素生成的映射码} dataMap
 * @param {*选择的数据} record
 * @param {*修改后的数据} newData
 */
export function modify(data, dataMap, record, newData) {
  let i = dataMap.findIndex(item => item.id == record.id)
  //获取位置坐标
  let indexArray = dataMap[i].index
  let parentNode
  let currentNode = parseArray(data, indexArray)
  //获取在父节点位置
  let nodeIndex = indexArray[indexArray.length - 1]
  //修改映射码位置
  dataMap.splice(i, 1, { id: newData.id, index: [...indexArray] })
  if (indexArray.length == 1) {
    parentNode = null;
    if (currentNode.children) {
      newData.children = currentNode.children
    }
    data.splice(nodeIndex, 1, newData)

  } else {
    //找到父节点
    indexArray.splice((indexArray.length - 1), 1)
    parentNode = parseArray(data, indexArray)
    if (currentNode.children) {
      newData.children = currentNode.children
    }
    parentNode.children.splice(nodeIndex, 1, newData)
  }
}

//新增子节点
/**
 *
 * @param {*数据} data
 * @param {*数组元素生成的映射码} dataMap
 * @param {*选择的数据} record
 * @param {*新增数据} newData
 */
export function create(data, dataMap, record, newData) {
  if (!record) {
    data.push(newData)
    //修改映射码位置
    dataMap.push({ id: newData.id, index: [data.length - 1] })
    return
  }
  let i = dataMap.findIndex(item => item.id == record.id)
  //获取位置坐标
  let indexArray = dataMap[i].index
  //找到当前节点
  let currentNode = parseArray(data, indexArray)
  if (currentNode.children) {
    //生成新位置
    let newIndex = [...indexArray, currentNode.children.length]
    //修改映射码位置
    dataMap.splice(i + currentNode.children.length + 1, 0, { id: newData.id, index: newIndex })
    currentNode.children.push(newData)
  } else {
    //生成新位置
    let newIndex = [...indexArray, 0]
    //修改映射码位置
    dataMap.splice(i + 1, 0, { id: newData.id, index: newIndex })
    currentNode.children = []
    currentNode.children.push(newData)
  }


}

//新增
export function addData(data, dataMap, newData) {
  data.push(newData)
  //修改映射码位置
  dataMap.push({ id: newData.id, index: [data.length - 1] })
}

//新增同级
/**
 *
 * @param {数据} data
 * @param {*数组元素生成的映射码} dataMap
 * @param {*选择的数据} record
 * @param {*新增数据} newData
 */
export function newBrother(data, dataMap, record, newData) {
  if (!record) {
    data.push(newData)
    //修改映射码位置
    dataMap.push({ id: newData.id, index: [data.length - 1] })
    return
  }
  let i = dataMap.findIndex(item => item.id == record.id)
  //获取位置坐标
  let indexArray = dataMap[i].index
  let parentNode
  if (indexArray.length == 1) {
    parentNode = null;

    data.push(newData)
    //修改映射码位置
    dataMap.push({ id: newData.id, index: [data.length - 1] })
  } else {

    //找到父节点
    indexArray.splice((indexArray.length - 1), 1)
    parentNode = parseArray(data, indexArray)
    parentNode.children.push(newData)
    //修改映射码位置
    dataMap.splice(i + parentNode.children.length - 1, 0, {
      id: newData.id,
      index: [...indexArray, parentNode.children.length - 1]
    })
  }
}

// 移动操作
/**
 *
 * @param {数据} data
 * @param {需要移动数据} record
 * @param {需要移动到的位置的ID} tableKey
 * @param {落点下标} hoverIndex
 */

export function move(datas, record, tableKey, hoverIndex) {
  //用于标记是否移动成功，不成功继续执行移动事件，默认不成功
  let moveStatus = false
  //先删除被移动数据
  let loop = (data)=>{
    data.forEach((item,key)=>{
      if (item.id == record.id && !moveStatus) {
        data.splice(key, 1)
      loop2(datas)
      }else {
        if(item.children){
          loop(item.children)
        }
      }
    })
  }
  let loop2 = (data)=>{
    data.forEach(item2=>{
      if (item2.id == tableKey && !moveStatus) {
        moveStatus = true
        data.splice(hoverIndex, 0, record)
      }else {
        if(item2.children){
          loop2(item2.children)
        }
      }
    })
  }
  loop(datas)
}


//下载文件
/**
 *
 * @param {地址} fileUrl
 * @param {名称} fileName
 */

export function download(fileUrl, fileName,fileId) {
  let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm'];
  let type = fileName ? fileName.split('.')[1].toLowerCase() : '';
      let index = arr.findIndex(item => item == type);
      // if (index != -1) {
        if(!fileId){
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
        axios.down("/api/doc/file/down?fileId="+fileId, {}).then((e) => {
          
        });
      // } else {
      //   window.open(fileUrl,'_self')
      // }

}


// ============================================================================================================================
// /**
//  *
//  * @param data 元数据 required
//  * @returns {Array} 返回映射表,所有方法都需要
//  */
// export const dataMap = (data) => {
//   const arr = [];
//   if (data.length) {
//     data.map(item => {
//       const parentKey = item.id; // 最外层ID
//       arr.push({ parentKey, id: parentKey }); // 自己
//       const loop = v => {
//         v.map(j => {
//           arr.push({ parentKey, id: j.id });
//           if (j.children) {
//             loop(j.children);
//           }
//         });
//       };
//       if (item.children) {
//         loop(item.children);
//       }
//     });
//   }
//   return arr;
// };

// /**
//  * 删除方式为引用删除
//  * @param data 元数据 required
//  * @param map 映射表 required
//  * @param record 选中行 required
//  * @returns null 无返回,以删除元数据引用,操作成功后,data保存,record选中行数据清除
//  */
// export const deleted = (data, map, record) => {
//   let _key;
//   let _id;
//   for (let i = 0; i < map.length; i++) {
//     if (map[i].id === record.id) {
//       _key = map[i].parentKey;
//       _id = map[i].id;
//       if (_key === _id) { // 删除最外层
//         const _delIndex = data.findIndex((value) => {
//           return value.id === _key;
//         });
//         if (_delIndex >= 0) {
//           data.splice(_delIndex, 1);
//           break;
//         }

//       } else {
//         for (let j = 0; j < data.length; j++) {
//           if (data[j].id === _key) {
//             const jChildren = data[j].children;
//             const loop = value => {
//               for (let k = 0; k < value.length; k++) {
//                 if (value[k].id === _id) {
//                   value.splice(k, 1);
//                   break;
//                 }

//                 if (value[k].children) {
//                   loop(value[k].children);
//                 }
//               }
//             };

//             jChildren && loop(jChildren);
//           }
//         }
//       }
//       break;
//     }
//   }
// };

// /**
//  * 删除方式为引用删除(批量删除) 待完善
//  * @param data 元数据 required
//  * @param map 映射表 required
//  * @param record 选中行 required
//  * @returns tOrf 是否为批量删除
//  */
// // export const deletedBatch = (data, map, record) => {
// //   let _key;
// //   let _id;
// //   for (let a = 0; a < record.length; a++) {
// //     for (let i = 0; i < map.length; i++) {
// //       if (map[i].id === record[a].id) {
// //         _key = map[i].parentKey;
// //         _id = map[i].id;
// //         if (_key === _id) { // 删除最外层
// //           const _delIndex = data.findIndex((value) => {
// //             return value.id === _key;
// //           });
// //           if (_delIndex >= 0) {
// //             data = data.splice(_delIndex, 1);
// //             break;
// //           }

// //         } else {
// //           for (let j = 0; j < data.length; j++) {
// //             if (data[j].id === _key) {
// //               const jChildren = data[j].children;
// //               const loop = value => {
// //                 for (let k = 0; k < value.length; k++) {
// //                   if (value[k].id === _id) {
// //                     value.splice(k, 1);
// //                     break;
// //                   }

// //                   if (value[k].children) {
// //                     loop(value[k].children);
// //                   }
// //                 }
// //               };

// //               jChildren && loop(jChildren);
// //             }
// //           }
// //           data = data
// //         }
// //         break;
// //       }
// //     }
// //   }

// // };

// /**
//  *
//  * @param data 元数据 required
//  * @param map 映射表 required
//  * @param record 选中行 required
//  * @param newData 修改成功后的返回数据 required
//  * @returns null 无返回,修改引用,操作成功后,选中行数据更改
//  */
// export function modify(data, map, record, newData) {
//   delete newData.children;
//   if (!record) {
//     throw ('请选中需要修改的数据');
//   }

//   if (record.parentId === 0) {
//     const _id = record.id;
//     for (let i = 0; i < map.length; i++) {
//       if (map[i].id === _id) {
//         const key = map[i].parentKey;
//         for (let j = 0; j < data.length; j++) {
//           if (data[j].id === key) {
//             Object.assign(data[j], newData);
//           }
//         }
//       }
//     }
//   } else {
//     let _key;
//     let _id;
//     for (let i = 0; i < map.length; i++) {
//       if (map[i].id === record.id) {
//         _key = map[i].parentKey;
//         _id = map[i].id;
//         for (let j = 0; j < data.length; j++) {
//           if (data[j].id === _key) {
//             const jChildren = data[j].children;
//             const loop = value => {
//               for (let k = 0; k < value.length; k++) {
//                 if (value[k].id === _id) {
//                   Object.assign(value[k], newData);
//                   break;
//                 }

//                 if (value[k].children) {
//                   loop(value[k].children);
//                 }
//               }
//             };

//             jChildren && loop(jChildren);
//           }
//         }
//         break;
//       }
//     }
//   }

// }

// /**
//  * 新增
//  * @param data 元数据 required
//  * @param map 映射表 required
//  * @param record 选中的行
//  * @param newData 新增成功返回的数据 required
//  * @returns null 无返回,引用修改
//  */
// export const create = (data, map, record, newData) => {
//   if (!record) {
//     data.push(newData);
//     map.push({ parentKey: newData.id, id: newData.id });
//   } else {

//     const _id = record.id;
//     const _key = newData.parentId;

//     for (let i = 0; i < data.length; i++) {
//       if (data[i].id === _key) {
//         if (!data[i].children) {
//           data[i].children = [newData];
//         } else {
//           data[i].children.push(newData);
//         }
//         map.push({ id: _id, parentKey: _key });
//         break;
//       }
//       const Children = data[i].children;
//       const loop = (value = []) => {
//         for (let j = 0; j < value.length; j++) {
//           if (value[j].id === _key) {
//             if (!value[j].children) {
//               value[j].children = [newData];
//             } else {
//               value[j].children.push(newData);
//             }
//             map.push({ id: _id, parentKey: data[i].id });
//             break;
//           }

//           if (value[j].children) {
//             loop(value[j].children);
//           }
//         }
//       };

//       loop(Children);
//     }
//   }
// };






