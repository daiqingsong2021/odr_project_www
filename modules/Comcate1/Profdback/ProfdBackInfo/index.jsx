import React, { Component } from 'react'
import { Table, Icon, Select, Spin, Checkbox, notification } from 'antd'
import style from './style.less'
import EditModal from './EditModal'
import AddModal from './AddModal'
import UpModal from './UpModal'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import CheckModal from "./CheckModal/"

import { connect } from 'react-redux'
import { questionHandleDelete, questionHandleList } from '../../../../api/suzhou-api'
import axios from '../../../../api/axios';

import * as dataUtil from "../../../../utils/dataUtil"
const Option = Select.Option;
class ProfdBackInfoTem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleAdd: false,
            visibleModify: false,
            visibleType: false,
            visible: false,
            activeIndex: null,
            title: '',
            selectedRowKeys: [],
            isShowEditModal: false,
            isShowAddModal: false,
            submitEditAuth: false,
            //数据实例
            data: [],
            record: null,
            checkRecord: null,

        }
    }

    componentDidMount() {
        this.getQuestionHandleList()
    }

    deleteVerifyCallBack = () => {
        const { intl } = this.props.currentLocale;
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length == 0) {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.global.tip.content2')
                }
            )
            return false
        } else {
            return true
        }
    }
    onClickHandle = (name) => {
        const { intl } = this.props.currentLocale;
        if (name == "AddTopBtn") {
            this.setState({
                isShowAddModal: true,
                editModalTitle: intl.get('wsd.i18n.comcate.profdback.newmodificationrecord')
            })

        }
        if (name == "submitTopBtn") {
            this.setState({
                isShowSubmitModal: true,
                editModalTitle: intl.get('wsd.i18n.comcate.profdback.submitmodificationrecord')
            })
        }
        if (name == "ModifyTopBtn") {
            if (this.state.record) {
                this.setState({
                    isShowEditModal: true,
                    editModalTitle: intl.get('wsd.i18n.comcate.profdback.modificationrecord')
                })
            } else {
                notification.warning(
                    {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: intl.get('wsd.global.tip.title2'),
                        description: intl.get('wsd.global.tip.content1')
                    }
                )
            }

        }

        if (name == 'DeleteTopBtn') {
            //删除
            let { selectedRowKeys } = this.state;
            if (selectedRowKeys.length) {
                let { startContent } = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(questionHandleDelete, { startContent });
                axios.deleted(url, { data: selectedRowKeys }, true, null, true).then((result) => {
                    this.getQuestionHandleList()
                    this.setState({
                        selectedRowKeys: [],
                        activeIndex: null,
                        record: null
                    })
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
    }
    //关闭修改
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,

        })
    }
    //关闭新增
    closeAddModal = () => {
        this.setState({
            isShowAddModal: false,

        })
    }
    //关闭提交
    closeSubmitModal = () => {
        this.setState({
            isShowSubmitModal: false,

        })
    }
    getInfo = (record, index) => {
        let id = record.id, records = record
        if (this.state.activeIndex == id) {
            this.setState({
                activeIndex: null,
                record: null,
            })
        } else {
            this.setState({
                activeIndex: id,
                record: record,
                submitEditAuth: true
            })
        }

    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
    //显示附件
    onClickHandleCheck = (record) => {
        this.setState({
            isShowCheckModal: true,
            checkRecord: record
        })
    }
    //关闭附件
    closeCheckModal = () => {
        this.setState({
            isShowCheckModal: false
        })
    }

    // 获取处理记录
    getQuestionHandleList = () => {
        axios.get(questionHandleList(this.props.data.id)).then((res) => {
            let data = res.data.data;
            this.setState({
                data,
                latestHandleId: data[0] ? data[0].id : null
            })

        })
    }

    //新增
    addData = (newData) => {
        this.setState({
            data: [newData, ...this.state.data]
        })
    }
    //修改
    updateData = (newData) => {
        let { data } = this.state;
        let index = data.findIndex(item => item.id == newData.id);
        data.splice(index, 1, newData);
        this.setState({
            data
        })
    }



    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.comu.profdback.processingresultdescription'),//处理结果说明
                dataIndex: 'handleResult',
                key: 'handleResult',
            },
            {
                title: intl.get('wsd.i18n.comu.profdback.handlingtime'),//处理时间
                dataIndex: 'handleTime',
                key: 'handleTime',
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.comu.profdback.conductor'),//处理人
                dataIndex: 'handleUser',
                key: 'handleUser',
            },
            {
                title: '处理状态',
                dataIndex: 'handleStatus',
                key: 'handleStatus',
                render: (text) => text ? text.name : ''
            },
            {
                title: intl.get('wsd.i18n.base.docTem.enclosure'),//附件
                dataIndex: 'fileCount',
                key: 'fileCount',
                render: (text, record) => (
                    <a onClick={this.onClickHandleCheck.bind(this, record)} style={{ cursor: 'pointer' }}>{`${intl.get('wbs.il8n.process.look')}(${text})`}</a>
                )
            }, {
                title: '',
                dataIndex: 'latest',
                key: 'latest',
                render: (text, record) => (
                    text && record.handleStatus.id == 'EDIT' ?
                        <PublicButton name={'提交'} title={'提交'} icon={'icon-fabu'} edit={this.props.submitAuth} afterCallBack={this.onClickHandle.bind(this, 'submitTopBtn')} />
                        : ''
                )
            }

        ]
        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                })
            }
        }
        let submitAuth = this.props.submitAuth ? true : false
        return (
            <div className={style.main}>
                {/* 处理记录 */}
                <h3 className={style.listTitle}> {intl.get('wsd.i18n.comcate.profdback.processingrecord')} </h3>
                <div className={style.rightTopTogs}>
                    {
                        submitAuth && !this.props.isloginUserAuth && (
                            <PublicButton name={'处理'} title={'处理'} icon={'icon-fabu'} edit={this.props.submitAuth} afterCallBack={this.onClickHandle.bind(this, 'submitTopBtn')} />
                        )
                    }
                    {/*新增*/}
                    <PublicButton name={'新增'} title={'新增'} icon={'icon-add'} edit={this.props.handleEditAuth && submitAuth} afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')} />
                    {/*修改*/}
                    <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} edit={this.props.handleEditAuth && submitAuth} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
                    {/*删除*/}
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.deleteVerifyCallBack} edit={this.props.handleEditAuth && submitAuth} afterCallBack={this.onClickHandle.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                </div>
                <div className={style.mainScorll}>
                    <Table columns={columns}
                        rowKey={record => record.id}
                        size='small'
                        pagination={false}
                        dataSource={this.state.data}
                        name={this.props.name}
                        rowSelection={rowSelection}
                        rowClassName={this.setClassName}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    this.getInfo(record, index)
                                }
                            }
                        }} />
                </div>
                {this.state.isShowEditModal &&
                    <EditModal
                        data={this.props.data}
                        visible={this.state.isShowEditModal}
                        handleCancel={this.closeEditModal.bind(this)}
                        record={this.state.record}
                        updateData={this.updateData}
                        extInfo={this.props.extInfo}
                        refreshData={this.getQuestionHandleList}
                    />
                }

                {this.state.isShowAddModal &&
                    <AddModal
                        data={this.props.data}
                        visible={this.state.isShowAddModal}
                        handleCancel={this.closeAddModal.bind(this)}
                        addData={this.addData}
                        extInfo={this.props.extInfo}
                        projectId={this.props.projectId}
                        refreshData={this.getQuestionHandleList}
                    />
                }
                {this.state.isShowSubmitModal &&
                    <UpModal
                        data={this.props.data}
                        visible={this.state.isShowSubmitModal}
                        handleCancel={this.closeSubmitModal.bind(this)}
                        extInfo={this.props.extInfo}
                        projectId={this.props.projectId}
                        handleEditAuth={this.props.handleEditAuth}
                        iscreatorAuth={this.props.iscreatorAuth}
                        record={this.state.record}
                        rightData={this.props.rightData}
                        refreshData={this.getQuestionHandleList}
                        latestHandleId={this.state.latestHandleId}
                        updateData={this.props.updateData}
                        setSubmitAuth={this.props.setSubmitAuth}
                    />
                }
                {this.state.isShowCheckModal &&
                    <CheckModal
                        visible={this.state.isShowCheckModal}
                        handleCancel={this.closeCheckModal.bind(this)}
                        record={this.state.checkRecord}
                        extInfo={this.props.extInfo}
                    />}
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(ProfdBackInfoTem)


