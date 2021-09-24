import _ from 'lodash'

//维护数据、     //type 新增、修改、删除 allData 全部数据（列表数据，结构码），currentId 当前操作ID，data新数据
//本方法主要处理复杂数据，增删改查 通过传入的操作类型去处理业务数据，同时更新结构码，返回 allData
export function maintainData(type, allData, currentId, data) {

    var index = ''
    if (currentId) { //有挂载点
        var key = _.findIndex(allData.structure, function (o) { //提取当前操作ID的结构码
            return o.id == currentId
        })
        if (key != -1) {
            var go = allData.structure[key].go;

            if (type == 'add') { //新增
                var list = _.get(allData.list, allData.structure[key].go);
                _.updateWith(allData.list, go, _.constant(data), Object);
                var num = 0;
                if (list.children) {
                    num = list.children.length
                }
                allData.structure.push({
                    id: data.id,
                    go: allData.structure[key].go + '.children[' + num + ']'
                })
            } else if (type == 'update') {
                _.update(allData.list, go, function (n) {
                    return data;
                });
            } else if (type == 'delete') {
                let goPrefix = go.substr(0, go.length - 2);

                let goIndex = go.substr(go.length - 2, 1);

                let resultList = allData.list
                let newdata = resultList;
                const result = _.filter(allData.structure, function (o) {
                    if (_.startsWith(o.go, goPrefix)) {
                        // 节点删除
                        let deleteIndex = goPrefix + goIndex;
                        if (_.startsWith(o.go, deleteIndex)) {
                            //  resultList =_.filter(allData.list, function (a) {
                            //      alert(a.id)
                            //     if(_.startsWith(a.id,o.id)){
                            //         return false;
                            //     }else{
                            //         return true
                            //     }
                            // })
                            _.unset(resultList, o.go);
                            newdata = _.filter(resultList, function (x) {
                                if (x) {
                                    return true
                                }

                            })

                            return false
                        }
                        // 索引+1
                        let indexChar = o.go.charAt(deleteIndex.length - 1)
                        if (indexChar > goIndex) {
                            o.go = _.replace(o.go, goPrefix + indexChar, goPrefix + (indexChar - 1))
                            return true
                        }
                    }
                    return true
                })
                allData.structure = result
                allData.list = newdata
                return allData
            }
        } else {
            alert('操作数据不存在')
        }
    } else { //无挂载点直接追加到数据中，并更新结构码
        if (type == 'add') { //新增
            index = allData.list.length;
            allData.list.push(data)
            allData.structure.push({
                id: data.id,
                go: "data[" + index + "]"
            })
        }
    }
}


const list = []
// //初始化结构码
export function initStructureCode(data, code) {
    for (var i = 0; i < data.length; i++) {
        list.push({
            id: data[i].id,
            go: code + '[' + i + ']'
        })
        if (data[i].children) {
            var code2 = code + '[' + i + '].children';
            initStructureCode(data[i].children, code2)
        }
    }
    return list;
}

export function findItemIndex(data, id) {
    let parentNode = null;
    let currentNode;
    let index;
    let flag = true;
    function treeiterator(data, id) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == id) {
               
                flag = false
                currentNode = data[i]
                index = i
               break
            }
            if (data[i].children) {
               
                treeiterator(data[i].children, id)
                if (!flag) {
                    if(!parentNode){
                        parentNode = data[i]
                    }
                    return { parentNode, currentNode, index }
                }
            }

           

        }
        return { parentNode, currentNode, index }
    }
    return treeiterator(data, id)
}
export function deleteData(data,record){
    const {parentNode, currentNode, index }=findItemIndex(data,record.id)
    if(parentNode){
        parentNode.children.splice(index,1)
        if(parentNode.children.length==0){
            delete parentNode.children
        }
    }else{
        data.splice(index,splice)
    }
}