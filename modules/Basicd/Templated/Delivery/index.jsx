import React, { Component } from 'react'
import style from './style.less'


import { Table, notification } from 'antd'
import TopTags from './TopTags/index'
import RightTags from '../../../../components/public/RightTags/index'

import { connect } from 'react-redux'
import axios from "../../../../api/axios"
import { getTmpldelvList, deleteTmpldelv } from "../../../../api/api"
import * as dataUtil from '../../../../utils/dataUtil'
import PageTable from '../../../../components/PublicTable'
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import MainContent from "../../../../components/public/Layout/MainContent";
import Toolbar from "../../../../components/public/Layout/Toolbar";

export class BasicTemplatedDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      currentPageNum: 1,
      pageSize: 10,
      total: 0,
      searcher: "",
      data: [],
      /* *********** 初始化rightTag ************* */
      rightData: null,
      rightTags: [
        { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Basicd/Templated/Delivery/DeliveryInfo' },
        { icon: 'iconjiaofuwushezhi1', title: '交付设置', fielUrl: 'Basicd/Templated/Delivery/DevSet' }
      ],
    }


  }


  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  //搜索
  search = (value) => {
    if (value != null || value.trim() != "") {
      this.setState({
        searcher: value,
        currentPageNum: 1,
      }, () => {
        this.table.getAppointPageData(1)
      })

    } else {
      this.setState({
        searcher: null,
        currentPageNum: 1,
      }, () => {
        this.table.getData()
      })
    }
  }
  getList = (currentPageNum, pageSize, callBack) => {
    currentPageNum = currentPageNum ? currentPageNum : 1
    pageSize = pageSize ? pageSize : 20
    axios.get(getTmpldelvList(currentPageNum, pageSize) + "?searcher=" + this.state.searcher || null).then(res => {
      callBack(res.data.data)
      this.setState({
        rightData: null,
        data: res.data.data,
        total: res.data.total,
        currentPageNum,
        pageSize,
        selectedRowKeys: []
      })
    })
  }

  // 当表格数据选中时执行
  getRowData = (record) => {
    this.setState((preState, props) => ({
      rightData: record,
    }))

  };

  //新增
  addData = (value) => {
    const { total, pageSize, currentPageNum } = this.state
    let totalPageNum = Math.ceil((total + 1) / pageSize);        //计算总页数
    this.table.getAppointPageData(totalPageNum, pageSize)
  }
  //删除
  deleteData = () => {

    const { data, total, currentPageNum, pageSize, selectedRowKeys } = this.state
    if (selectedRowKeys.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: '警告',
          description: '请勾选数据！'
        }
      )
      return
    }
    axios.deleted(deleteTmpldelv, { data: selectedRowKeys }, true).then(res => {
      const { total, selectedRowKeys, pageSize, currentPageNum } = this.state
      let totalPageNum = Math.ceil((total - selectedRowKeys.length) / pageSize);        //计算总页数
      let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
      this.table.getAppointPageData(PageNum, pageSize)
    })
  }
  //修改
  updateSuccess = (value) => {
    const { data } = this.state
    this.table.update(this.state.rightData, value)
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
  render() {
    const { intl } = this.props.currentLocale
    const { selectedRowKeys, activeIndex } = this.state


    const columns = [
      {
        title: intl.get('wsd.i18n.base.docTem.doctitle'),
        dataIndex: 'typeTitle',
        key: 'typeTitle',
        width: '20%'
      },
      {
        title: intl.get('wsd.i18n.base.docTem.docnum'),
        dataIndex: 'typeNum',
        key: 'typeNum',
        width: '10%'
      },
      {
        title: intl.get('wsd.i18n.base.docTem.docversion'),
        dataIndex: 'typeVersion',
        key: 'typeVersion',
        width: '10%'
      },
      {
        title: intl.get('wsd.i18n.base.tmpldelv1.delvtype'),
        dataIndex: 'typeType',
        key: 'typeType',
        width: '20%',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return ""
          }
        }
      },
      {
        title: intl.get('wsd.i18n.plan.plandefine.creator'),
        dataIndex: 'creator',
        key: 'creator',
        width: '10%',
        render: (text) => {
          if (text) {
            return <span>{text.name}</span>
          } else {
            return "--"
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.menu.creattime'),
        dataIndex: 'creatTime',
        key: 'creatTime',
        width: '10%',
        render: (text) => dataUtil.Dates().formatDateString(text)
      },
      {
        title: intl.get('wsd.i18n.sys.ipt.remark'),
        dataIndex: 'typeDesc',
        key: 'typeDesc',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {

        this.setState({

          selectedRowKeys
        })
      }

    };
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      size: "small",
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getList()
        })
      }
    }
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags
            addData={this.addData}
            deleteData={this.deleteData}
            search={this.search}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <PageTable onRef={this.onRef}
            pagination={true}
            getData={this.getList}
            columns={columns}
            rowSelection={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
            total={this.state.total}

            getRowData={this.getRowData} />
        </MainContent>
       
        <RightTags
          rightTagList={this.state.rightTags}
          rightData={this.state.rightData}
          updateSuccess={this.updateSuccess}
          menuCode={this.props.menuInfo.menuCode}
        />
      </ExtLayout>

    )
  }

}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(BasicTemplatedDelivery);
