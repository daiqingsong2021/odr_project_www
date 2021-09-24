import React, { Component } from 'react'
import { Table, Radio, notification } from 'antd'
import style from './style.less'
import _ from 'lodash'
import TopTags from './TopTags/index'
import RightTags from '../../../../components/public/RightTags/index'
import PageTable from '../../../../components/PublicTable'
import { connect } from 'react-redux'
import { tmpdocListSearch, tmpdocList, tmpdocDel } from "../../../../api/api";
import axios from '../../../../api/axios'
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import MainContent from "../../../../components/public/Layout/MainContent";
import Toolbar from "../../../../components/public/Layout/Toolbar";
export class BasicTemplatedDoc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      rightData: null,
      rightTags: [
        { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Basicd/Templated/Doc/DocInfo' }
      ],
      selectedRowKeys: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchValue: null
    }


  }


  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  getData  = (currentPage, pageSize,callBack) => {
    let val = this.state.searchValue;
    currentPage = currentPage ? currentPage :1
    pageSize = pageSize ? pageSize :20
    if (val) {
      axios.get(tmpdocListSearch(currentPage,pageSize, val)).then(res => {
        callBack(res.data.data)
        this.setState({
          data: res.data.data,
          total: res.data.total,
          currentPage,
          pageSize,
          selectedRowKeys:[],
          rightData:null
        })
      })
    } else {
      axios.get(tmpdocList(currentPage,pageSize)).then(res => {
        callBack(res.data.data)
        this.setState({
          data: res.data.data,
          total: res.data.total,
          currentPage,
          pageSize,
          selectedRowKeys:[],
          rightData:null
        })
      })
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


  // 当表格数据选中时执行
  getRowData = (record, ) => {
    this.setState({
      rightData: record,
    })



  }
  //搜索
  search = (val) => {
    this.setState({
      searchValue: val
    }, () => {
      this.table.getData();
    })

  }

  //新增
  addData = (newData) => {
    const {total,pageSize} = this.state
    let totalPageNum = Math.ceil((total + 1) / pageSize);        //计算总页数
    this.table.getAppointPageData(totalPageNum,pageSize)
  }
  //修改
  updateData = (newData) => {
    this.table.update(this.state.rightData,newData)
  }
  //删除
  deleteData = () => {
    const { intl } = this.props.currentLocale
    let { selectedRowKeys,total,pageSize,currentPage } = this.state;
    if (selectedRowKeys.length) {
      axios.deleted(tmpdocDel, { data: selectedRowKeys }, true, intl.get('wsd.i18n.comcate.profdback.successfullydelete')).then(res => {
        let totalPageNum = Math.ceil((total - selectedRowKeys.length) / pageSize);        //计算总页数
        let PageNum = totalPageNum >= currentPage ? currentPage : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
        this.table.getAppointPageData(PageNum,pageSize)
      })
    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: intl.get('wsd.global.tip.title2'),
          description: intl.get('wsd.global.tip.content2')
        }
      )
    }
  }

  render() {

    const { intl } = this.props.currentLocale

    const columns = [
      {
        title: "文档标题",
        dataIndex: 'docTitle',
        key: 'docTitle',
        width:'20%',
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "文档编号",
        dataIndex: 'docNum',
        key: 'docNum',
        width:'20%',
        render: text => <span title={text}>{text}</span>
      },
      {
        title: intl.get('wsd.i18n.base.docTem.docversion'),
        dataIndex: 'docVersion',
        key: 'docVersion',
        width:'20%',
        render: text => <span title={text}>{text}</span>
      },
      {
        title: intl.get('wsd.i18n.doc.compdoc.docclassify'),
        dataIndex: 'docClassify',
        key: 'docClassify',
        width:'20%',
        render: text => text ? text.name : ''
      },
      {
        title: intl.get('wsd.i18n.base.docTem.docobject'),
        dataIndex: 'docObject',
        key: 'docObject',
        render: text => text ? text.name : ''
      }
    ];

    
    return (
<ExtLayout renderWidth = {({contentWidth}) => { this.setState({contentWidth}) }}>
              <Toolbar>
              <TopTags search={this.search} 
              addData={this.addData} 
              deleteData={this.deleteData}
               selectedRowKeys={this.state.selectedRowKeys}
                />
              </Toolbar>
              <MainContent contentWidth = {this.state.contentWidth} contentMinWidth = {1500}>
              <PageTable onRef={this.onRef}
                         pagination={true}
                         getData={this.getData}
                         columns={columns}
                         rowSelection={true}
                         onChangeCheckBox={this.getSelectedRowKeys}
                         useCheckBox={true}
                         total={this.state.total}
                         scroll={{x:'100%',y:this.props.height-100}}
                         getRowData={this.getRowData}/>
              </MainContent>
              <RightTags 
              rightTagList={this.state.rightTags} 
              rightData={this.state.rightData} 
              updateData={this.updateData} 
              menuCode={this.props.menuInfo.menuCode}
               />

            </ExtLayout>
     
    )
  }

}


export default connect(state => ({
  currentLocale: state.localeProviderData
}))(BasicTemplatedDoc);
