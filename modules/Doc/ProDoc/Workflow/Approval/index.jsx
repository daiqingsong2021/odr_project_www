import React, { Component } from 'react'
import style from './style.less'
import { Table, Form } from 'antd';
import Search from '../../../../../components/public/Search'
import { connect } from 'react-redux'
import '../../../../../asserts/antd-custom.less'
import axios from "../../../../../api/axios"
import * as WorkFolw from '../../../../../modules/Components/Workflow/Start';
import * as dataUtil from "../../../../../utils/dataUtil";
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import {docProjectReleaseList } from "../../../../../api/api";
import PageTable from '../../../../../components/PublicTable'
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

    initDatas =(callBack)=>{
      if(this.state.newData){
        callBack(this.state.newData)
        this.setState({newData:null})
        return
      }
      axios.get(docProjectReleaseList(this.props.projectId)).then(res=>{
        if(res.data.data){
          callBack(res.data.data)
          this.setState({
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

  
    /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }
    // 查询
    search = (text) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"docTitle|docNum","value":text}],true);
        this.setState({
          newData
        },()=>{
          this.table.getData()
        });
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
            if(this.state.selectedRows){
              for(let i = 0, len = this.state.selectedRows.length; i < len; i++){
                let item =   this.state.selectedRows[i];
                selectedItems.push({"bizId" : item.id, "bizType": "projectdoc"});
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
            width:"15%",
          },
          {
            title: "文档类别",
            dataIndex: 'docClassify',
            key: 'docClassify',
            render: data => data ? data.name : '',
            width:"10%",
          },
          {
            title: "作者",
            dataIndex: 'author',
            key: 'author',
            width:"10%",
          },
          {
            title: "版本",
            dataIndex: 'version',
            key: 'version',
            width:"10%",
          },
          {
            title: "创建人",
            dataIndex: 'creator',
            key: 'creator',
            render: data => data ? data.name : '',
            width:"10%",
          },
          {
            title: "创建时间",
            dataIndex: 'creatTime',
            key: 'creatTime',
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
