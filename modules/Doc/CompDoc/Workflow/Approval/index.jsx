import React, { Component } from 'react'
import style from './style.less'
import { Table, Form } from 'antd';
import Search from '../../../../../components/public/Search'

import { connect } from 'react-redux'
import '../../../../../asserts/antd-custom.less'
import axios from "../../../../../api/axios"
import * as WorkFolw from '../../../../Components/Workflow/Start';
import * as dataUtil from "../../../../../utils/dataUtil";
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import {docReleaseListByFolderId } from "../../../../../api/api";
import PageTable from '../../../../../components/PublicTable';

class PlanPreparedRelease extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initDone: false,
            step: 1,
            columns: [],
            data: [],
            info: {},
            selectedRowKeys: [],
            currentData: [],
            activeIndex: []
        }
    }

    /**
     @method 父组件即可调用子组件方法
     @description 父组件即可调用子组件方法
     */
    onRef = (ref) => {
        this.table = ref
    }

    initDatas =(callBack)=>{
      if(this.state.newData){
          callBack(this.state.newData)
          this.setState({newData:null})
          return
      }
      axios.get(docReleaseListByFolderId(this.props.folderId ?this.props.folderId : 0)).then(res=>{
        if(res.data.data){
          callBack(res.data.data)
          this.setState({
            data:res.data.data,
            initData:res.data.data
          })
        }else{
          callBack([])
        }
      })
    }

    getInfo = (record) => {
        this.setState({
            record
        })
    }


    componentDidMount() {
       // 初始化数据
    }
    // 查询
    search = (text) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"docTitle|docNum","value":text}],true);
        this.setState({
          data: newData
        },()=>{
          this.table.getData()
        });
    }

    getSubmitData = () => {

    }

    /**
     * 获取复选框 选中项、选中行数据
     * @method updateSuccess
     * @param {string} selectedRowKeys 复选框选中项
     * @param {string} selectedRows  行数据
     */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        },()=>{
          let selectedItems = new Array();
          if(selectedRows){
            for(let i = 0, len = selectedRows.length; i < len; i++){
              let item =   selectedRows[i];
              selectedItems.push({"bizId" : item.id, "bizType": "compdoc"});
            }
          }
          this.props.getSubmitData(selectedItems);
        })
    }


  render() {
        const { intl } = this.props.currentLocale;
        const columns = [
          {
            title: "文档标题",
            dataIndex: 'docTitle',
            key: 'docTitle',
            width:"20%",
          },
          {
            title: "文档编号",
            dataIndex: 'docNum',
            key: 'docNum',
            width:"20%",
          },
          // {
          //   title: "文档密级",
          //   dataIndex: 'secutyLevel',
          //   key: 'secutyLevel',
          //   render: data => data ? data.name : '',
          //   width:200,
          // },
          {
            title: "版本",
            dataIndex: 'version',
            key: 'version',
            width:"10%",
          },
          {
            title: "创建时间",
            dataIndex: 'creatTime',
            key: 'creatTime',
            width:"25%",
            render: (text) =>  dataUtil.Dates().formatDateString(text)
          },
          {
            title: "更新时间",
            dataIndex: 'updateTime',
            key: 'updateTime',
            width:"25%",

            render: (text) =>  dataUtil.Dates().formatDateString(text)
          }
        ];

        let display = this.props.visible ? "" : "none";
        return (
            <div style = {{display:display}} className={style.main}>
              <div className={style.tableMain}>
                <div className={style.search}>
                  <Search search = {this.search } placeholder="文档标题/文档编号"/>
                </div>

              <PageTable onRef={this.onRef}
                     rowSelection={true}
                     pagination={false}
                     useCheckBox={true}
                     onChangeCheckBox={this.getSelectedRowKeys}
                     getData={this.initDatas}
                     scroll={{x:"100%",y:350}}
                     closeContentMenu={true}
                     columns={columns}
                     getRowData={this.getInfo}
              />
              </div>
            </div>
        )
    }
}

const PlanPreparedReleases = Form.create()(PlanPreparedRelease)

const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};

const  DelvApporal = connect(mapStateToProps, null)(PlanPreparedReleases);
export default WorkFolw.StartWorkFlow(DelvApporal);
