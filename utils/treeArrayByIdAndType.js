

// //初始化结构码
/**
 *
 * @param {数据} data
 * @param {*元素对应下标索引位置，例如,[0,0,1]} code
 */
export function dataMap(data, code = [], list = []) {
  if(data.length){
    for (var i = 0; i < data.length; i++) {
      list.push({
        id: data[i].id,
        type: data[i].type,
        index: [...code, i]
      })
      if (data[i].children) {
        dataMap(data[i].children, [...code, i],list)
      }
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
  let i = dataMap.findIndex(item => item.id == record.id && record.type==item.type)
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

  let i = dataMap.findIndex(item => item.id == record.id && record.type==item.type)
  //获取位置坐标
  let indexArray = dataMap[i].index
  let parentNode
  let currentNode = parseArray(data, indexArray)
  //获取在父节点位置
  let nodeIndex = indexArray[indexArray.length - 1]
  //修改映射码位置
  dataMap.splice(i, 1, {id: newData.id,type:newData.type, index: [...indexArray]})
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
    dataMap.push({id: newData.id,type:newData.type, index: [data.length - 1]})
    return
  }
  let i = dataMap.findIndex(item => item.id == record.id && record.type==item.type)
  //获取位置坐标
  let indexArray = dataMap[i].index
  //找到当前节点
  let currentNode = parseArray(data, indexArray)
  if (currentNode.children) {
    //生成新位置
    let newIndex = [...indexArray, currentNode.children.length]
    //修改映射码位置
    dataMap.splice(i + currentNode.children.length + 1, 0, {id: newData.id,type:newData.type, index: newIndex})
    currentNode.children.push(newData)
  } else {
    //生成新位置
    let newIndex = [...indexArray, 0]
    //修改映射码位置
    dataMap.splice(i + 1, 0, {id: newData.id,type:newData.type, index: newIndex})
    currentNode.children = []
    currentNode.children.push(newData)
  }


}

//新增
export function addData(data, dataMap, newData) {
    data.push(newData)
    //修改映射码位置
    dataMap.push({id: newData.id,type:newData.type, index: [data.length - 1]})
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
    dataMap.push({id: newData.id,type:newData.type, index: [data.length - 1]})
    return
  }
  let i = dataMap.findIndex(item => item.id == record.id && record.type==item.type)
  //获取位置坐标
  let indexArray = dataMap[i].index
  let parentNode
  if (indexArray.length == 1) {
    parentNode = null;

    data.push(newData)
    //修改映射码位置
    dataMap.push({id: newData.id, type:newData.type,index: [data.length - 1]})
  } else {

    //找到父节点
    indexArray.splice((indexArray.length - 1), 1)
    parentNode = parseArray(data, indexArray)
    parentNode.children.push(newData)
    //修改映射码位置
    dataMap.splice(i + parentNode.children.length - 1, 0, {
      id: newData.id,type:newData.type,
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

export function move(data, record, tableKey, hoverIndex) {
  //用于标记是否移动成功，不成功继续执行移动事件，默认不成功
  let moveStatus = false
  //先删除被移动数据
  data.map((list, key) => {
    if (list.id == record.id ) {
      data.splice(key, 1)
    }
    const loop = v => {
      v.map((item2, key2) => {
        if (item2.id == record.id) {
          v.splice(key2, 1)
        }
      })
    }
    if (list.children) {
      loop(list.children)
    }
  })

  //添加被移动的数据到新位置，成功时 step 为真
  data.map((item, key) => {
    if (item.id == tableKey && !moveStatus) {
      moveStatus = true
      data.splice(hoverIndex, 0, record)
    }
    const getOverRecord = v => {
      v.map((item2, key2) => {
        if (item2.id == tableKey && !moveStatus) {
          moveStatus = true
          v.splice(hoverIndex, 0, record)
        }
      })
    }
    if (item.children && !moveStatus) {
      getOverRecord(item.children)
    }
  });

}
