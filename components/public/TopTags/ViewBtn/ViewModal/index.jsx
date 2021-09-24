import React, { Component } from 'react'
import style from './style.less'
import {  Radio, Table, Button, Input,Modal } from 'antd'
import MyIcon from "../../MyIcon"
import * as dataUtil from '../../../../../utils/dataUtil'
import axios from "../../../../../api/axios"

import {
  setDefaultView,
  getViewTree,
  updateViewName,
  viewIdGlobal,
  deleteView,
  getViewInfo
} from "../../../../../api/api"
import * as util from "../../../../../utils/util";

export class ViewModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            globalDisabled : true,
            deleteDisabled : true,
            isShowView: false,
            editKey: null,//可编辑行id
            record: null,//选中行
            data: [],
            deleteVisible: false,//删除提示显藏   
            selectId: -1,
            defaultId : -1,
            list: [],
            expandedRowKeys: []//展开行
        }
    }
    componentDidMount() {
        this.initDatas()
    }

    initDatas = () => {
        axios.get(getViewTree(this.props.bizType)).then(res => {
            const data = res.data.data;
            if (data) {
                let global = dataUtil.getItemByTree(data,(item)=>{
                  return item.defaultView == 1
                }) || {};

                let array = dataUtil.getExpandKeys(data);
                const dataMap = util.dataMap(data);
                this.setState({
                    defaultId : global.id || -1,
                    data: res.data.data,
                    expandedRowKeys: array,
                    dataMap
                })
            }
        });
    }

    //展开行事件
    handleOnExpand = (expanded, record) => {
        const { expandedRowKeys } = this.state
        if (expanded) {
            expandedRowKeys.push(record.id)
        } else {
            let i = expandedRowKeys.findIndex(item => item == record.id)
            expandedRowKeys.splice(i, 1)
        }
        this.setState({
            expandedRowKeys
        })
    }

    //失去焦点保存
    changeTitle = (record, e) => {

        const value = e.currentTarget.value;

        if (record.viewName == value) {
            this.setState({
                editKey: null
            });
            return
        }
        axios.put(updateViewName(record.id, value)).then(res => {
            const { data, dataMap } = this.state;
            let newRecord = {...record,viewName : value};
            util.modify(data, dataMap, record,newRecord);
            this.setState({
                data,
                dataMap,
                editKey: null
            },() => {
                this.props.updateViewName(record.id,value);
            });
        })
    }

    //删除视图
    deleteRecord = () => {
        let { record } = this.state
        if (!record) {
            dataUtil.message("请选择数据进行操作")
            return
        }
        let viewId = record.id;
        axios.deleted(deleteView, { data: [viewId] }).then(res => {
            const { data, dataMap } = this.state;
            util.deleted(data, dataMap, record);
            let dataMap1 = util.dataMap(data);
            this.setState({
              data,
              dataMap: dataMap1,
              record : null,
              deleteDisabled : false,
              selectId : null
            });
            this.props.deleteView(viewId);
        })
    }
    /**
     * 设置默认视图
     * @param record
     * @param e
     */
      setDefaultView = (record, e) => {
          e.stopPropagation();
          if(record.id != this.state.defaultId ){
            axios.put(setDefaultView(record.id, this.props.bizType)).then(res => {
              this.setState({ defaultId: record.id },() => {
                dataUtil.success("设置【"+record.viewName+"】为个人默认视图成功!");
              });
            })
          }
      }

    getInfo = (record) => {

        let deleteDisabled = true;
        if(record.userId){
          deleteDisabled = false;
        }
        this.setState({
            record,
            selectId : record.id,
            deleteDisabled
        })
    }

    setClassName = (record) => {
        //判断索引相等时添加行的高亮样式
        return this.state.record && record.id === this.state.record.id ? 'tableActivty' : "";
    }

    openView = () => {
        let {record} = this.state;

        if(!record){
          dataUtil.message("请选择数据后操作");
          return ;
        }
        this.props.searchByViewId(record.id);
        this.props.handleCancel();
    }
    /**
    saveGlobal = () => {
        let { record } = this.state
        if (!record) {
            dataUtil.message("请选择数据进行操作")
            return
        }
        const { data } = this.state
        const globalList = data[0].children || [];
        const personalList = data[1].children || [];

        if (record.viewType == "global") {
            dataUtil.message("请选择个人视图进行操作")
            return
        } else {
            axios.put(viewIdGlobal(record.id)).then(res => {

            })
            let i = personalList.findIndex(item => item.id == record.id)
            personalList.splice(i, 1)
            if (personalList.length == 0) {
                delete data[1].children
            }
            globalList.push(record)
            this.setState({
                data,
                record: null
            })
        }
    }
    **/
    render() {
        const columns = [
            {
                title: "视图名称",
                dataIndex: 'viewName',
                key: 'viewName',
                width: 300,
                render: (text, record) => {

                    text = record.classifyName == "self" ? "个人视图" : record.classifyName == "global" ?  "全局视图" : text;
                    if (record.id == this.state.editKey) {
                        return <span><Input size="small" defaultValue={text} onBlur={this.changeTitle.bind(this, record)} autoFocus='autofocus' style={{ width: 239 }} /></span>
                    } else {
                        if (record.classifyName && record.classifyName == "global") {
                            return <span><MyIcon type="icon-zujian" style={{ verticalAlign: "middle", fontSize: 18, marginRight: 5 }} />{text}</span>
                        } else if (record.classifyName && record.classifyName == "self") {
                            return <span><MyIcon type="icon-yuangong" style={{ verticalAlign: "middle", fontSize: 18, marginRight: 5 }} />{text}</span>
                        } else {
                            return <span>{text}</span>
                        }
                    }
                },
                onCell: record => {
                    return {
                        onDoubleClick: () => {
                            if (!record.userId) {
                                return;
                            }
                            this.setState({ editKey: record.id })
                        }
                    }
                }
            },
            {
                title: "默认",
                dataIndex: 'defaultView',
                align: "center",
                key: 'defaultView',
                render: (text, record) => {
                    if (record.classifyName && record.classifyName == "global" || record.classifyName && record.classifyName == "self") {
                        return ""
                    } else {
                        return (
                          <div><Radio checked={ this.state.defaultId == record.id} onClick={this.setDefaultView.bind(this, record)} /></div>
                        )
                    }
                }
            }
        ]
        return (
            <div className={style.main}>
                <Modal width={500} title={"视图"} mask={false}
                    maskClosable={false} visible={true}
                    onCancel={this.props.handleCancel}
                    footer={<div className="modalbtn">
                        {/* 全局 */}
                        {/*<Button key="1" disabled = {this.state.globalDisabled} onClick={this.saveGlobal}>全局</Button>*/}
                        {/* 删除 */}
                        <Button key="2" disabled = {this.state.deleteDisabled} onClick={this.deleteRecord}>删除</Button>
                        {/* 打开 */}
                        <Button key="1" type="primary" onClick={this.openView}>打开</Button>
                    </div>}>

                    <div className={style.mytable}>
                        <Table columns={columns}
                            expandedRowKeys={this.state.expandedRowKeys}
                            onExpand={this.handleOnExpand.bind(this)}		//添加 默认点击 + 图标方法
                            dataSource={this.state.data}
                            pagination={false}
                            size="small"
                            bordered
                            rowClassName={this.setClassName}
                            rowKey={record => record.id}
                            onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            if (record.classifyName && record.classifyName == "global" || record.classifyName && record.classifyName == "self") {
                                                return
                                            }
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                            } />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default ViewModal
