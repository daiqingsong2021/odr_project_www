import React, { Component } from 'react'
import { Table, Icon, Select, notification, Checkbox } from 'antd'
import style from './style.less'
import PublicButton from "../../../../../components/public/TopTags/PublicButton"
import DistributionModal from "./DistributeModal"
import { connect } from 'react-redux'
import axios from '../../../../../api/axios';
import { getTmpltaskDelvlist, deleteTmpltaskDelv } from "../../../../../api/api"
import * as dataUtil from '../../../../../utils/dataUtil'
import LabelToolbar from '../../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../../components/public/Layout/Labels/Table/LabelTable'
import LabelTableItem from '../../../../../components/public/Layout/Labels/Table/LabelTableItem'
import PageTable from "../../../../../components/PublicTable"
const Option = Select.Option;
class PlanTemPer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: null,
            rightData: null,
            distributeType: false,
            data: [],
            selectedRowKeys: []
        }
    }

    getData = (callBack) => {
        axios.get(getTmpltaskDelvlist(this.props.data.id)).then(res => {
            if (res.data.data) {
                callBack(res.data.data)
            } else {
                callBack([])
            }
        })
    }
    //删除前校验
    deleteVerifyCallBack = () => {

        const { selectedRowKeys } = this.state
        if (selectedRowKeys.length == 0) {
            dataUtil.message("请勾选数据进行操作")
            return false
        } else {
            return true
        }
    }
    //删除
    onClickHandleDelete = () => {

        const { intl } = this.props.currentLocale
        const { data, activeIndex, selectedRowKeys } = this.state
        if (selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 1,
                    message: intl.get("wsd.global.tip.title2"),
                    description: intl.get("wsd.global.tip.title1"),
                }
            )
            return
        }
        axios.deleted(deleteTmpltaskDelv, { data: selectedRowKeys }, true, "删除交付清单成功").then(res => {
            this.setState({
                rightData: null,
                selectedRowKeys: []
            })
        })

    }
    onClickHandleDistribute = () => {

        this.setState({
            distributeType: true
        })

    }
    closeDistribute = () => {
        this.setState({
            distributeType: false
        })
    }
    getInfo = (record, ) => {
        this.setState({
            rightData: record,
        })
    }

    distributeSucess = (value) => {
        this.table.getData()
    }
    /**
  * 父组件即可调用子组件方法
  */
    onRef = (ref) => {
        this.table = ref
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
        const columns = [
            {
                title: intl.get("wsd.i18n.plan.delvList.delvname"),
                dataIndex: 'delvName',
                key: 'delvName',
            },
            {
                title: intl.get('wsd.i18n.base.docTem.docnum'),
                dataIndex: 'delvCode',
                key: 'delvCode',
            },
            {
                title: intl.get('wsd.i18n.base.tmpldelv1.delvtype'),
                dataIndex: 'delvType',
                key: 'delvType',
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
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return ""
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.sys.menu.creattime'),
                dataIndex: 'creatTime',
                key: 'creatTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
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

        return (
            <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
                <LabelToolbar>
                    {/*分配*/}
                    <PublicButton name={'分配'} title={'分配'} icon={'icon-fenpei'} afterCallBack={this.onClickHandleDistribute} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} afterCallBack={this.onClickHandleDelete} icon={"icon-delete"} />

                </LabelToolbar>
                <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
                  
                    <PageTable onRef={this.onRef}
                        pagination={false}
                        getData={this.getData}
                        columns={columns}
                        closeContentMenu={true}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        useCheckBox={true}
                        getRowData={this.getInfo} />
                </LabelTable>

                {this.state.distributeType &&
                    <DistributionModal
                        handleCancel={this.closeDistribute}
                        taskId={this.props.data.id}
                        distributeSucess={this.distributeSucess}
                    />}

            </LabelTableLayout>

        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(PlanTemPer);