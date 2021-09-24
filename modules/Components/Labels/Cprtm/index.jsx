import React, { Component } from 'react'
import { notification } from 'antd'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import { cprtmList, cprtmDel, cprtmAdd } from '../../../../api/api'
import MyIcon from "../../../../components/public/TopTags/MyIcon";
import SelectOrgUser from "../../Window/SelectOrgUser";
import * as dataUtil from "../../../../utils/dataUtil"
import PublicTable from '../../../../components/PublicTable'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'


class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
        }
    }

    //注册 父组件即可调用子组件方法
    onRef = (ref) => {
        this.table = ref
    }
    //删除验证
    deleteVerifyCallBack = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择勾选数据进行操作'
                }
            )
            return false
        } else {
            return true
        }
    }
    delete = () => {
        let { selectedRowKeys } = this.state;

        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(cprtmDel, { "startContent": extInfo.startContent });
        axios.deleted(url, { data: selectedRowKeys }, true).then(res => {
          this.table.getData();
          this.setState({
            selectedRowKeys:[],
            
          })
        });
    }
    //控制分配弹窗开关
    closeDistributeModal = () => {
        this.setState({
            distributeType: false
        })
    }


    //获取协作团队数据
    getDataList = (callBack) => {

        let { bizId, bizType } = this.props
        axios.get(cprtmList(bizId, bizType)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data
            })
        })
    }

    //表格 点击行事件
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id,
            record
        })
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

    handleOk = (data) => {
        let addData = [];
        for (let i = 0; i < data.length; i++) {
            let dat = data[i];
            let obj = {
                bizId: this.props.bizId,
                bizType: this.props.bizType,
                cprtmId: dat.id,
                cprtmType: dat.type
            }
            addData.push(obj)
        }

        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(cprtmAdd, { "startContent": extInfo.startContent });

        axios.post(url, addData, true).then(res => {
            this.table.getData();
            this.closeDistributeModal();
        })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get("wsd.i18n.operate.prepared.name"),//名称
                dataIndex: 'name',
                key: 'name',
                width:"60%",
                render: (text, record) => {
                    if (record.type == "org") {
                        return <span><MyIcon type="icon-gongsi" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    } else if (record.type == "user") {
                        return <span><MyIcon type="icon-yuangong" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    } else {
                        return <span><MyIcon type="icon-bumen1" style={{ fontSize: 18, vectorEffect: "middle" }} />{text}</span>
                    }
                }
            },
            {
                title: intl.get("wsd.i18n.sys.menu.menucode"),//代码
                dataIndex: 'code',
                key: 'code',
                width: "40%"
            }
        ];
        const {rangePermission,permission,menuCode} = this.props
        return (

          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*分配*/}
              {menuCode == 'DM-CORP'? (permission.indexOf(rangePermission)!==-1 && (
              <PublicButton name={'分配'} edit={this.props.cprtmEditAuth} title={'分配'} icon={'icon-fenpei'} afterCallBack={() => { this.setState({ distributeType: true }) }} />)):
              <PublicButton name={'分配'} edit={this.props.cprtmEditAuth} title={'分配'} icon={'icon-fenpei'} afterCallBack={() => { this.setState({ distributeType: true }) }} />}
              {/*删除*/}
              {menuCode == 'DM-CORP'? (permission.indexOf(rangePermission)!==-1 && (
              <PublicButton title={"删除"} edit={this.props.cprtmEditAuth} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.delete} icon={"icon-delete"} />)):
              <PublicButton title={"删除"} edit={this.props.cprtmEditAuth} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.delete} icon={"icon-delete"} />}
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {400}>
              <PublicTable istile={true} onRef={this.onRef} getData={this.getDataList}
                           pagination={false} columns={columns}
                           getRowData={this.getInfo}
                           useCheckBox={true}
                           rowSelection={true}
                           onChangeCheckBox={this.getSelectedRowKeys}

              />
            </LabelTable>
            {this.state.distributeType && (
              <SelectOrgUser visible={this.state.distributeType} handleOk={this.handleOk} handleCancel={this.closeDistributeModal.bind(this)}
                             bizType={this.props.bizType} bizId={this.props.bizId} getDataList={this.getDataList} />
            )}
          </LabelTableLayout>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TeamInfo)
