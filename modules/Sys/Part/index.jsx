import React, { Component } from 'react'
import intl from 'react-intl-universal'
import style from "./style.less"
import _ from 'lodash'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import StandardTable from '../../../components/Table/index';
import PageTable from '../../../components/PublicTable'
/* *********** 引入redux及redux方法 start ************* */
import { connect } from 'react-redux'
/* *********** 引入redux及redux方法 end ************* */
/* api */
import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";
import * as util from '../../../utils/util';
import axios from '../../../api/axios';
import { roleList, searchRole, roleSearchList } from '../../../api/api';

/**
 * 角色管理 模块
 *
 */
class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      selectedRowKeys: [],       //被选中的角色
      data: [],
      selectData: [],
      record: null,
      currentPage: 1,
      pageSize: 10,
      currentPageNum: '',
      total: 0,
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

  /**
   * 获取角色列表
   * @method getListData
   * @description 获取角色列表、或者根据搜索值获取角色列表
   * @param {string} currentPageNum  当前页
   * @param {string} pageSize  每页条数
   * @return {array} 返回角色列表
   */
  getDataList = (currentPageNum, pageSize, callBack) => {
    currentPageNum = currentPageNum ? currentPageNum : 1
    pageSize = pageSize ? pageSize : 20
    axios.get(roleSearchList(pageSize, currentPageNum)).then(res => {
      callBack(res.data.data)
      this.setState({
        record: null,
        selectedRowKeys: [],
        selectedRows: [],
        data: res.data.data,
        total: res.data.total,
        pageSize,
        currentPageNum
      })
    });
  };

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

  /**
   * 验证复选框是否可操作
   * @return {boolean}
   */
  checkboxStatus = (record) => {
    return false
  }
  // 搜索角色
  searchRole = (data) => {
    axios.get(`${searchRole}/${this.state.pageSize}/${this.state.currentPage}?searcher=${data}`, null, true).then(res => {
      const dataMap = util.dataMap(res.data.data);
      this.setState({
        data: res.data.data,
        dataMap,
      });
    });
  }

  /**
   * 新增角色
   * @method addSuccess
   * @description 计算总条数，直接获取最后一页数据,并且重置table的分页
   * @return {array} 返回用户列表
   */
  addSuccess = (value) => {
    const { data, total, pageSize } = this.state
    let currentPageNum = Math.ceil((total + 1) / pageSize)
    this.setState({
      currentPageNum
    }, () => {
      this.table.getAppointPageData(currentPageNum, pageSize)
    })
  };

  /**
   * 删除角色
   * @method delSuccess
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   */
  delSuccess = () => {
    const { total, selectedRows, pageSize, currentPageNum } = this.state
    let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
    let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
    this.table.getAppointPageData(PageNum, pageSize)
  };

  // 修改
  updateSuccess = (data) => {
    this.table.update(this.state.record, data)
  }


  /**
   * 获取选中集合、复选框
   * @method getListData
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
  getRowData = (record) => {
    this.setState({
      record
    })
  };

  render() {
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.role.rolename'),
        dataIndex: 'roleName',
        key: 'roleName',
        width: 300,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "角色代码",
        dataIndex: 'roleCode',
        key: 'roleCode',
        width: 300,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: intl.get('wsd.i18n.sys.role.roledesc'),
        dataIndex: 'roleDesc',
        width: 500,
        key: 'roleDesc',
        render: text => <span title={text}>{text}</span>
      },
    ];

    //分页调用
    let pagination = {
      total: this.state.total,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPage: 1
        }, () => {
          this.getList()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPage: page
        }, () => {
          this.getList()
        })
      }
    }

    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys
        })

      }
    };

    const { rightData, data, initDone, rightTags, record } = this.state;
    const { height } = this.props;
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags
            rightData={record}
            addSuccess={this.addSuccess}
            delSuccess={this.delSuccess}
            search={this.searchRole}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <PageTable onRef={this.onRef}
            pagination={true}
            getData={this.getDataList}
            columns={columns}
            rowSelection={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
            total={this.state.total}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            checkboxStatus={this.checkboxStatus}
            getRowData={this.getRowData} />
        </MainContent>
        <RightTags rightTagList={rightTags} rightData={this.state.record}
          updateSuccess={this.updateSuccess.bind(this)} menuCode={this.props.menuInfo.menuCode} />
      </ExtLayout>

    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(TableComponent);
