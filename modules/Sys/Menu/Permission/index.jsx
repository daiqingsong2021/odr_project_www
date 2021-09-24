import React, { Component } from 'react';
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../components/public/Layout/Labels/Table/LabelTableItem'
import { Table, notification, Modal } from 'antd';
import style from './style.less';
import PageTable from "../../../../components/PublicTable"
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import PermissionModal from '../PermissionModal';
import axios from '../../../../api/axios'
import { funcFuncs, funcDel } from '../../../../api/api'
import { connect } from 'react-redux';
const confirm = Modal.confirm;

//菜单管理-权限配置
class Permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      isShowModal: false,
      activeIndex: '',
      record: null,
      selectData: null,
      addOrModify: 'add',//新增或修改
      modalTitle: null,
      data: [],
      selectedRowKeys: [],
    };
  }
  //请求接口函数
  reqFun = (callBack) => {
    axios.get(funcFuncs(this.props.data.id)).then(res => {
      if (res.data.data) {
        callBack(res.data.data)
      }
    })
    callBack([])
  }




  //删除验证
  deleteVerifyCallBack = () => {
    let { selectedRowKeys, data } = this.state;
    if (selectedRowKeys.length == 0) {
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
    } else {
      return true
    }
  }
  onClickHandle = (name) => {
    if (name == 'AddTopBtn') {
      this.setState({
        isShowModal: true,
        addOrModify: 'add',
        modalTitle: '新增权限配置',
      });
    }
    if (name == 'ModifyTopBtn') {
      if (!this.state.record) {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作'
          }
        )
      } else {
        this.setState({
          isShowModal: true,
          addOrModify: 'modify',
          modalTitle: '修改权限配置',
        });
      }
    }
    if (name == 'DeleteTopBtn') {
      let { selectedRowKeys, data } = this.state;
      axios.deleted(funcDel, { data: selectedRowKeys }, true).then(res => {
        this.setState({
          record: null,
          selectedRowKeys: []
        }, () => {
          this.table.getData()
        })

      })

    }
  };
  //更新
  updateSuccess = (data) => {
    const { record } = this.state
    this.table.update(record, data)
  }

  //新增
  addData = (data) => {
    this.table.add(null, data)
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
  //关闭权限弹框modal
  closePermissionModal = () => {
    this.setState({
      isShowModal: false
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
  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.menu.menuname'),
        dataIndex: 'funcName',
        key: 'funcName',
        width: "25%"
      },
      {
        title: intl.get('wsd.i18n.sys.menu.menucode'),
        dataIndex: 'funcCode',
        key: 'funcCode',
        width: "25%"
      },
      {
        title: intl.get('wsd.i18n.sys.menu.shortcode'),
        dataIndex: 'shortCode',
        key: 'shortCode',
        width: "25%"
      },
      {
        title: intl.get('wsd.i18n.sys.menu.active'),
        dataIndex: 'del',
        key: 'del',
        width: "10%",
        render: (text) => text ? <span>{text.id == 0 ? '未激活' : '激活'}</span> : ''
      }

    ];
    return (
      <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
        <LabelToolbar>
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />
          {/*修改*/}
          <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
          {/*删除*/}
          <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"}
            content="你确定要删除吗？" />
        </LabelToolbar>
        <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
          <PageTable onRef={ref => this.table = ref}
            pagination={false}
            getData={this.reqFun}
            columns={columns}
            bordered={false}
            dataSource={this.state.data}
            loading={this.state.loading1}
            scroll={{ x: '100%', y: this.props.height - 100 }}
            getRowData={this.getRowData}
            rowSelection={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
          />
        </LabelTable>

        {this.state.isShowModal &&
          <PermissionModal
            visible={this.state.isShowModal}
            handleCancel={this.closePermissionModal.bind(this)}
            title={this.state.modalTitle}
            addOrModify={this.state.addOrModify}
            data={this.state.addOrModify == 'add' ? this.props.data : this.state.record}
            parentData={this.props.data}
            updateSuccess={this.updateSuccess} addData={this.addData}
          />}

      </LabelTableLayout>

    );
  }
}



const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,

  }
};

export default connect(mapStateToProps, null)(Permission);