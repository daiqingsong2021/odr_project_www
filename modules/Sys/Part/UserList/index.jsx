import React, { Component } from 'react';

import { Table, notification } from 'antd';
import { connect } from 'react-redux';
import PageTable from '../../../../components/PublicTable'
import style from './style.less';
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import SelectUser from '../../../Components/Window/SelectUser';
import axios from '../../../../api/axios';
import { getRoleUserList, deleteUserRoles, assignUserRoles } from '../../../../api/api';
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'
/**
 * 角色管理 模块 用户列表
 *
 */
class RoleUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      currentPageNum: 1,//当前页
      pageSize: 10,//每页多少条
      distributeType: false,//显示分配
      data: [],
      activeIndex: null,//选中行id
      total: 0,//总条数，
      selectedRowKeys: [],//勾选行
      h: document.documentElement.clientHeight || document.body.clientHeight - 190   //浏览器高度，用于设置组件高度
    };
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  //按钮点击事件
  onClickHandle = (name) => {
    this.state.record = this.state.record || [];
    //分配
    if (name == 'DistributionBtn') {
      this.setState({
        distributeType: true,
      });

    }
    //删除
    if (name == 'DeleteTopBtn') {
      const { selectedRowKeys, selectedRows, data, currentPageNum, total, pageSize } = this.state;
      var ids = [];
      if (selectedRows != null) {
        selectedRows.forEach(item => {
          ids.push(item.userRoleId);
        });
      }

      axios.deleted(deleteUserRoles, { data: ids }, true).then(res => {
        const { total, selectedRows, pageSize, currentPageNum } = this.state
        let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
        let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
        this.table.getAppointPageData(PageNum, pageSize)

      });
    }
  };
  //删除检验
  deleteVerifyCallBack = () => {
    const { intl } = this.props.currentLocale;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: intl.get('wsd.global.tip.title1'),
          description: intl.get('wsd.global.tip.content2'),
        },
      );
      return false;
    } else {
      return true;
    }
  };
  //分配用户角色
  handleOk = (data) => {
    let addData = [];
    for (let i = 0; i < data.length; i++) {
      let dat = data[i];
      let obj = {
        roleId: this.props.data.id,
        userId: dat.id,
        orgId: dat.parentId,
      };
      addData.push(obj);
    }
    axios.post(assignUserRoles, addData, true).then(res => {
      const { total, selectedRows, pageSize, currentPageNum } = this.state
      let totalPageNum = Math.ceil((total + addData.length) / pageSize);        //计算总页数
      this.table.getAppointPageData(totalPageNum, pageSize)
      this.closeDistribute();
    });
  };

  //获取角色人员列表
  getListData = (currentPageNum, pageSize, callBack) => {
    currentPageNum = currentPageNum ? currentPageNum : 1
    pageSize = pageSize ? pageSize : 20
    axios.get(getRoleUserList(this.props.data.id, pageSize, currentPageNum))
      .then(res => {
        callBack(res.data.data)
        this.setState({
          data: res.data.data,
          total: res.data.total,
          pageSize,
          currentPageNum
        });

      });

  };
  //关闭分配弹框
  closeDistribute = () => {
    this.setState({
      distributeType: false,
    });
  };
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

  /**
   * 验证复选框是否可操作
   * @method checkboxStatus
   * @return {boolean}
   */
  checkboxStatus = (record) => {
    return false
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
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.user.username'),
        dataIndex: 'actuName',
        key: 'actuName',
        width: '33%'
      },
      {
        title: "用户名",
        dataIndex: 'userName',
        key: 'userName',
        width: '33%'
      },
      {
        title: intl.get('wsd.i18n.sys.ipt.rolename'),
        dataIndex: 'retRole',
        key: 'retRole',
      },

    ];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
    };

    return (
      <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
        <LabelToolbar>
          {/*分配*/}
          <PublicButton name={'分配'} title={'分配'} icon={'icon-fenpeirenyuan'} afterCallBack={() => {
            this.setState({ distributeType: true });
          }} />
          {/*删除*/}
          <PublicButton title={'删除'} useModel={true} verifyCallBack={this.deleteVerifyCallBack}
            afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')} icon={'icon-delete'} />
        </LabelToolbar>
        <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
          <PageTable onRef={this.onRef}
            pagination={true}
            getData={this.getListData}
            columns={columns}
            rowSelection={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
            total={this.state.total}
            scroll={{ x: '100%', y: this.state.h - 400 }}
            checkboxStatus={this.checkboxStatus}
            getRowData={this.getRowData} />
        </LabelTable>

        {this.state.distributeType && (
          <SelectUser visible={this.state.distributeType}
            handleCancel={this.closeDistribute.bind(this)}
            handleOk={this.handleOk} />
        )}


      </LabelTableLayout>

    );
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  };
};


export default connect(mapStateToProps, null)(RoleUserList);
