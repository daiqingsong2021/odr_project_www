import React, { Component } from 'react'
import { Table, Icon, Select, notification } from 'antd'
import { connect } from 'react-redux'
import style from './style.less'
import Distribute from "../../../Components/Window/SelectUserRole"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PageTable from '../../../../components/PublicTable'
// 接口引入
import axios from '../../../../api/axios';
import { iptgetUser, deleteIptUser, userAdd, userAddRoles } from '../../../../api/api';
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'

const Option = Select.Option;

//IPT全局树-右侧页签 -用户列表
class StaffInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPageNum: 1,              //当前页
      pageSize: 20,                    //每页条数
      distributeType: false,          //显示分配
      data: [],
      total: 0,                       //总条数，
      selectedRowKeys: [],            //勾选行
      rolelist: null,                  //角色数据
      h: document.documentElement.clientHeight || document.body.clientHeight - 190   //浏览器高度，用于设置组件高度

    }
  }

  componentDidMount() {
    //获取用户角色
    axios.get("api/sys/role/list").then(res => {
      this.setState({
        rolelist: res.data.data
      })
    })
  }

  /**
   * 获取ipt人员列表
   * @method getListData
   * @description 获取用户列表
   * @param {string} currentPageNum  当前页
   * @param {string} pageSize  每页条数
   * @param {fun} callBack  回调数据
   * @return {array} 返回用户列表
   */
  getListData = (currentPageNum, pageSize, callBack) => {
    currentPageNum = currentPageNum ? currentPageNum : 1
    pageSize = pageSize ? pageSize : 20
    this.setState({
      loading: true
    })
    axios.get(iptgetUser(this.props.data.id, pageSize, currentPageNum))
      .then(res => {
        const { data, total } = res.data
        if (data) {
          data.forEach(item => {
            if (item.role) {
              let roleIds = []
              item.role.forEach(value => {
                roleIds.push(value.id)
              })
              item.role = roleIds
            }
          })
          callBack(data)
          this.setState({
            data: data,
            total: total,
            loading: false,
            selectedRowKeys: [],
            rightData: null,
            currentPageNum: currentPageNum
          });
        }
      })
  }

  /**
   @method 父组件即可调用子组件方法
   @description 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.child = ref
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

  /**
   * 顶部按钮事件
   * @method updateSuccess
   * @param {string} name name等于 DistributionBtn 分配功能，name等于 DeleteTopBtn 删除用户
   * @param {string} selectedRows  行数据
   */
  onClickHandle = (name) => {
    this.state.rightData = this.state.rightData || [];
    if (name == "DistributionBtn") {
      this.setState({
        distributeType: true
      })
    }
    if (name == "DeleteTopBtn") {
      const { selectedRowKeys, data, currentPageNum, total, pageSize, selectedRows } = this.state
      axios.deleted(deleteIptUser(this.props.data.id), { data: selectedRowKeys }, true).then(res => {
        let totalPageNum = Math.ceil((total - selectedRows.length) / pageSize);        //计算总页数
        let PageNum = totalPageNum >= currentPageNum ? currentPageNum : totalPageNum   //总页数大于等于 当前页面，当前页数不变 否则 为1
        this.child.getAppointPageData(PageNum, pageSize)
      })
    }
  }
  //删除检验
  deleteVerifyCallBack = () => {
    const { intl } = this.props.currentLocale
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 1,
          message: intl.get("wsd.global.tip.title1"),
          description: intl.get("wsd.global.tip.content2")
        }
      )
      return false
    } else {
      return true
    }
  }

  /**
   * @method 分配提交
   * @description 给部门分配用户的提交
   * @param {array} data 用户集合
   */
  handleDistribute = (data) => [
    axios.post(userAdd(this.props.data.id), data).then(res => {
      //成功刷新
      this.child.getData()
    })
  ]
  //关闭分配弹框
  closeDistribute = () => {
    this.setState({
      distributeType: false
    })
  }
  //点击行事件
  getRowData = (record, index) => {
    let id = record.id, records = record
    this.setState({
      rightData: record
    })
  }

  handleSelectdata = (record, index, val) => {
    if (val && val.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '提示',
          description: '角色不能为空'
        }
      )
      return false;
    }
    let obj = {
      userId: record.id,
      roleIds: val
    }
    axios.put(userAddRoles(this.props.data.id), obj).then(res => {
      const { data } = this.state
      data[index].role = val
      this.setState({
        data
      })
    })
  }

  render() {
    const { intl } = this.props.currentLocale
    const columns = [
      {
        title: intl.get("wsd.i18n.sys.user.username"),
        dataIndex: 'actuName',
        key: 'actuName',
        width: 150
      },
      {
        title: "用户名",
        dataIndex: 'userName',
        key: 'userName',
        width: 150
      },
      {
        title: intl.get("wsd.i18n.sys.ipt.rolename"),
        dataIndex: 'role',
        key: 'role',
        render: (text, record, index) => {

          return <Select style={{ width: "100%" }} value={text} onChange={this.handleSelectdata.bind(this, record, index)}
            mode="multiple"
          >
            {this.state.rolelist && this.state.rolelist.map(item => {
              return <Option value={item.id} key={item.id}>{item.roleName}</Option>
            })}
          </Select>
        }

      }

    ];
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys
        })
      }
    };
    //分页配置
    let pagination = {
      total: this.state.total,
      // hideOnSinglePage: true,
      current: this.state.currentPageNum,
      pageSize: this.state.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      size: "small",
      showTotal: total => `总共${this.state.total}条`,
      onShowSizeChange: (current, size) => {
        this.setState({
          pageSize: size,
          currentPageNum: 1
        }, () => {
          this.getListData()
        })
      },
      onChange: (page, pageSize) => {
        this.setState({
          currentPageNum: page
        }, () => {
          this.getListData()
        })
      }
    }
    return (
      <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
        <LabelToolbar>
          {/*分配*/}
          <PublicButton name={'分配'} title={'分配'} icon={'icon-fenpeirenyuan'}
            afterCallBack={this.onClickHandle.bind(this, 'DistributionBtn')} />
          {/*删除*/}
          <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack}
            afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
        </LabelToolbar>
        <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
          <PageTable onRef={this.onRef}
            pagination={true}
            getData={this.getListData}
            dataSource={this.state.data}
            columns={columns}
            rowSelection={true}
            onChangePage={this.getListData}
            loading={this.state.loading}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
            total={this.state.total}
            scroll={{ x: '100%', y: this.state.h - 400 }}
            getRowData={this.getRowData} />
        </LabelTable>
        {this.state.distributeType && (
          <Distribute handleCancel={this.closeDistribute.bind(this)} handleOk={this.handleDistribute} />
        )}
      </LabelTableLayout>

    )
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(StaffInfo);
