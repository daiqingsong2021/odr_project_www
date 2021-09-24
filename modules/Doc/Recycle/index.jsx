import React, { Component } from 'react'

import { Table, notification } from 'antd'
import style from './style.less'
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";

import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import * as dataUtil from "../../../utils/dataUtil"
import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { docRecyclebinList, docRecyclebinRestore, docRecyclebinDel } from '../../../api/api'
import PublicTable from '../../../components/PublicTable'

class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      activeIndex: "",
      rightData: null,
      rightTags: [
        { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Doc/Recycle/BasicInfo' },
      ],
      data: [],
      selectedRowKeys: [],
      selectedRows: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,


    }
  }


  /**
   * 父组件即可调用子组件方法
   * @method
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
  onRef = (ref) => {
    this.table = ref
  }

  //获取回收站数据
  getData = (currentPageNum, pageSize,callBack)=>{
    axios.get(docRecyclebinList(pageSize, currentPageNum) + `?name=${this.state.keyWords ? this.state.keyWords : ''}`).then(res => {
      callBack(res.data.data)
      this.setState({
        data: res.data.data,
        total: res.data.total,
        selectedRowKeys:[],
        rightData:null,
        keyWords:null
      })
    })
  }


  //table 点击行
  getInfo = (record) => {
    this.setState({
      rightData: record
    })
  }

  //还原
  back = () => {
    let { selectedRows } = this.state;
    if (selectedRows.length) {

      let data = [];
      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].type == "file") {
          let obj = {
            id: selectedRows[i].fileId,
            type: selectedRows[i].type,
          }
          data.push(obj);
        } else {
          let obj2 = {
            id: selectedRows[i].id,
            type: selectedRows[i].type,
          }
          data.push(obj2);
        }


      }

      axios.post(docRecyclebinRestore, data, true, null,true).then(res => {
        this.setState({
          selectedRows:[],
          selectedRowKeys:[]
        })
        this.table.getData();
      })
    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
    }
  }
  //还原前验证
  recyleVerifyCallBack=()=>{
    let { selectedRows } = this.state;
    if(selectedRows.length==0){
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
      return false
    }else{
      return true
    }
  }
  //删除前验证
  deleteVerifyCallBack=()=>{
    let { selectedRows } = this.state;
    if(selectedRows.length==0){
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
      return false
    }else{
      return true
    }
  }
  delete = () => {
    let { selectedRows } = this.state;
    if (selectedRows.length) {
      let data = [];
      for (let i = 0; i < selectedRows.length; i++) {
        let obj = {
          id: selectedRows[i].id,
          type: selectedRows[i].type,
        }
        data.push(obj);
      }

      axios.deleted(docRecyclebinDel, { data }, true, '删除成功').then(res => {
        this.setState({
          selectedRows:[],
          selectedRowKeys:[]
        })
        this.table.getData();
      })
    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
        }
      )
    }
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
    })
  }

  search = (val) => {
    this.setState({
      keyWords:val
    },()=>{
      this.table.getData()
    })
  }


  render() {

    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.doc.temp.title'),//文档标题
        dataIndex: 'docTitle',
        key: 'docTitle',
        width:'200px'
      },
      {
        title: intl.get('wsd.i18n.doc.compdoc.docserial'),//文档编号
        dataIndex: 'docNum',
        key: 'docNum',
        width:'200px'
      },
      {
        title: intl.get('wsd.i18n.comu.meeting.projectname'),//所属项目
        dataIndex: 'projectName',
        key: 'projectName',
        width:'200px'
      },
      {
        title: intl.get('wsd.i18n.doc.recycle.sourcefolder'),//原文件夹
        dataIndex: 'folderName',
        key: 'folderName',
        width:'200px'
      },
      {
        title: intl.get('wsd.i18n.doc.compdoc.babelte'),//上传人
        dataIndex: 'creator',
        key: 'creator',
        width:'200px',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.creattime'),//创建日期
        dataIndex: 'creatTime',
        key: 'creatTime',
        render: (text) =>  dataUtil.Dates().formatDateString(text)
      },

    ];

    return (
      	
		  <ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
      <Toolbar>
      <TopTags back={this.back} delete={this.delete} search={this.search}
       deleteVerifyCallBack={this.deleteVerifyCallBack}
        recyleVerifyCallBack={this.recyleVerifyCallBack}
        />
      </Toolbar>
      <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
      <PublicTable onRef={this.onRef}
                         rowSelection={true}
                         pagination={true}
                         useCheckBox={true}
                         onChangeCheckBox={this.getSelectedRowKeys}
                         getData={this.getData}
                         columns={columns}
                         scroll={{x: '1200px', y: this.props.height - 100}}
                         getRowData={this.getInfo}
                         total={this.state.total}
              />
      </MainContent>
      <RightTags rightTagList={this.state.rightTags} 
      rightData={this.state.rightData} 
      menuCode = {this.props.menuInfo.menuCode}
       />

    </ExtLayout>
      
    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(TableComponent);

