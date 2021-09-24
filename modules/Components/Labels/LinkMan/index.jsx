import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import AddTopBtn from "../../../../components/public/TopTags/AddTopBtn"
import ModifyTopBtn from "../../../../components/public/TopTags/ModifyTopBtn"
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import LinkManAdd from './Add'
import axios from '../../../../api/axios'
import { prepaContactsList, prepaContactsDel } from '../../../../api/api'
import * as dataUtil from '../../../../utils/dataUtil'
import PubTable from '../../../../components/PublicTable'
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'

class FileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            addlinkman: false,//新增联系人
            modifylinkman: false,//
            data: [],
            record: null,
            currentPage: 1,
            pageSize: 10,
            selectedRowKeys: [],
            total: null,
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
    getDataList = (currentPage, pageSize, callBack) => {
        axios.get(prepaContactsList(this.props.bizType, this.props.data.id, pageSize, currentPage)).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                selectedRowKeys: [],
                record: null,
                data: res.data.data,
                total: res.data.total
            })
        })
    }


    //显示新增详情页面
    showAddLinkMan = () => {
        this.setState({
            addlinkman: true
        })
    }
    //关闭新增详情页面
    closeAddLinkMan = () => {
        this.setState({
            addlinkman: false
        })
    }

    //显示修改详情页面
    showModifylinkman = () => {
        if (this.state.record) {
            this.setState({
                modifylinkman: true
            })
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
        }
    }
    //关闭详情页面
    closeModifylinkman = () => {
        this.setState({
            modifylinkman: false
        })
    }

    getInfo = (record) => {
        this.setState({
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
    //新增函数
    addData = (data) => {
        this.table.getData();
    }
    //更新函数
    upData = (data) => {
        this.table.update(this.state.record, data)
    }
    //删除验证
    deleteVerifyCallBack = () => {
        const { selectedRowKeys } = this.state
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
            return false;
        } else {
            return true
        }
    }
    //删除
    showDelete = () => {
        // 选中行数据
        const { selectedRowKeys } = this.state

        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(prepaContactsDel, { "startContent": extInfo.startContent });
        // 执行删除操作
        axios.deleted(url, { data: selectedRowKeys }, true).then(res => {
            this.table.getData();
        })
    }

    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get("wsd.i18n.sys.ipt.username"),//联系人
                dataIndex: 'contactName',
                width:"20%",
                key: 'contactName',
            },
            {
                title: intl.get("wsd.i18n.plot.approval.unit"),//联系单位
                dataIndex: 'contactUnit',
                width:"20%",
                key: 'contactUnit',
            },
            {
                title: intl.get("wsd.i18n.sys.ipt.phone"),//联系电话
                dataIndex: 'contactPhone',
                width:"20%",
                key: 'contactPhone',
            },
            {
                title: intl.get("wsd.i18n.sys.ipt.remark"),//备注
                dataIndex: 'remark',
                width:"40%",
                key: 'remark',
            }
        ];

        return (

          <LabelTableLayout title = {this.props.title} menuCode = {this.props.menuCode}>
            <LabelToolbar>
              {/*新增*/}
              <PublicButton name={'新增'} title={'新增'} edit={this.props.linkManEditAuth || false} icon={'icon-add'} afterCallBack={this.showAddLinkMan.bind(this, 'AddTopBtn')} />
              {/*修改*/}
              <PublicButton name={'修改'} title={'修改'} edit={this.props.linkManEditAuth || false} icon={'icon-xiugaibianji'} afterCallBack={this.showModifylinkman.bind(this, 'ModifyTopBtn')} />
              {/*删除*/}
              <PublicButton title={"删除"} edit={this.props.linkManEditAuth || false} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.showDelete.bind(this)} icon={"icon-delete"} />
            </LabelToolbar>
            <LabelTable labelWidth = {this.props.labelWidth } contentMinWidth = {700}>
              <PubTable onRef={this.onRef}
                        pagination={true}
                        getData={this.getDataList}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        useCheckBox={true}
                        total={this.state.total}
                        scroll={{x: "100%", y: this.props.height - 100}}
                        getRowData={this.getInfo}/>
            </LabelTable>
            {this.state.addlinkman && <LinkManAdd opttype={"add"} extInfo={this.props.extInfo} addlinkman={this.state.addlinkman} handleCancel={this.closeAddLinkMan.bind(this)} addBiz={this.props.data} bizType={this.props.bizType} linkAdd={this.addData} title="新增联系人"></LinkManAdd>}
            {this.state.modifylinkman && <LinkManAdd opttype={"modify"} extInfo={this.props.extInfo} modifylinkman={this.state.modifylinkman} handleCancel={this.closeModifylinkman.bind(this)} upDataBiz={this.state.record} upData={this.upData} title="修改联系人"></LinkManAdd>}
          </LabelTableLayout>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(FileInfo)
