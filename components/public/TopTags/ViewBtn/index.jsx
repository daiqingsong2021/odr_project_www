import React, { Component } from 'react'
import style from './style.less'
import { Icon, Popover, Radio,  Table, Button, Input, Modal } from 'antd'
import MyIcon from "../MyIcon"
import * as dataUtil from '../../../../utils/dataUtil'
import axios from "../../../../api/axios"
import ViewModal from "./ViewModal"


import {
  getViewList,
  getViewInfo,
  saveAsView,
  updateView
} from "../../../../api/api"
export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewModalShow : false,
            isShowView: false,
            editKey: null,//可编辑行id
            record: null,//选中行
            data: [],
            deleteVisible: false,//删除提示显藏   
            selectId: -1,
            globalId: null,
            selfId: null,
            list: [],
            expandedRowKeys: []//展开行
        }
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        this.getViewList()
    }
    getViewList = () => {
        axios.get(getViewList(this.props.bizType)).then(res => {
            if (res.data.data) {
                const data = res.data.data
                let view = data.find(item => item.defaultView == 1)
                this.setState({
                    list: res.data.data,
                    selectId: view ? view.id : -1
                },() => {
                  this.search();
                })
            }
        })
    }

    search = () => {
      this.searchByViewId(this.state.selectId);
    }

    searchByViewId = (viewId) => {
      this.getViewInfo(viewId,(info) => {
        this.setState({selectId : viewId});
        let SearchBut = this.props.getSearchBtn();
        if(SearchBut && SearchBut.setSearchData){
          SearchBut.setSearchData(info,this.state.selectId);
        }
        if(this.props.searchDatas){
          this.props.searchDatas(info);
        }
      });
    }

    /**
     * 修改名称
     *
     * @param id
     * @param newName
     */
    updateViewName = (viewId,newName) => {

        let {list} = this.state;
        if(list){
          for(let i = 0,len = list.length; i < len; i++){

            if(list[i].id === viewId){
              list[i].viewName = newName;
              break;
            }
          }
          this.setState({list});
        }
    }

    getViewInfo = (viewId,callback) => {
      axios.get(getViewInfo(viewId)).then(res => {
        const data = res.data.data;
        const info = data.viewContent ? JSON.parse(data.viewContent || "{}") : {}
        callback(info);
      })
    }

    getInfo = (record) => {
        this.setState({
            record,
            selectId : record.id
        },() => {
          this.search();
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return this.state.record && record.id === this.state.record.id ? 'tableActivty' : "";
    }

    //另存为视图
    saveAsView = (searchForm,callback) => {

      searchForm.bizType = this.props.bizType;
      axios.post(saveAsView, searchForm, true, null, true).then(res => {
        const list = this.state.list || [];
        let record = res.data.data;
        list.push(record);
        this.setState({ list, selectId : record.id, record : record});
        callback(record);
      });
    }

    //修改视图
    saveView = (searchForm,callback) => {
      searchForm.id = this.state.selectId;
      axios.put(updateView, searchForm, true, null, true).then(res => {
        callback(this.state.record);
      });
    }

    //显示视图编辑页面
    openViewModal = () => {
        this.setState({ viewModalShow: true })
    }

    deleteView =(viewId) =>{

      let {list,selectId} = this.state;
      let index = list.findIndex(item => {
        return item.id === viewId
      })
      list.splice(index,1);
      this.setState({list});

      // 如果删除默认打开的，需要将视图切换到全部视图上。
      if(viewId === selectId){
        this.searchByViewId(-1);
      }
    }

    render() {
        const columns = [
            {
                title: "视图",
                dataIndex: 'viewName',
                key: 'viewName',
                render: (text, record) => <div><Radio checked={this.state.selectId == record.id} />{text}</div>
            }
        ]
        const viewListContent = (
          <div className={style.viewListStyle}>
            <Table columns={columns}
                dataSource={this.state.list}
                pagination={false}
                size="small"
                showHeader={false}
                rowClassName={this.setClassName}
                rowKey={record => record.id}
                onRow={(record, index) => {
                        return {
                            onClick: () => {
                                this.getInfo(record, index)
                            }
                        }
                    }
                }
            />
            <p align="center" className={style.editStyle}><span onClick={this.openViewModal}>编辑视图</span></p>
          </div>
        )
        return (
            <div className={style.main}>
                <Popover placement="bottom" content={viewListContent} trigger="click">
                    <div className="topBtnActivity">
                        <MyIcon type="icon-ziyuanshituxuanze" className={style.icon} style={{ fontSize: 16, marginLeft : 3,marginRight : 3 }} />
                        视图
                        <Icon type={"caret-down"} style={{ fontSize: 14 }} />
                    </div>
                </Popover>
                {
                   this.state.viewModalShow && (
                     <ViewModal {...this.props} handleCancel = {() => {  this.setState({viewModalShow : false}); }}
                                deleteView = {this.deleteView} searchByViewId = {this.searchByViewId}
                                updateViewName = {this.updateViewName }>
                     </ViewModal>
                   )
                }

            </div>
        )
    }
}

export default Search
