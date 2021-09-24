/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-16 16:38:09
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-02-18 16:51:38
 */
import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Table, Progress, notification } from 'antd'
import style from './style.less'
import AddTopBtn from '@/components/public/TopTags/AddTopBtn' //新增按钮
import ModifyTopBtn from '@/components/public/TopTags/ModifyTopBtn' //修改按钮
import DeleteTopBtn from '@/components/public/TopTags/DeleteTopBtn' //删除按钮
import PublicdTopBtn from '@/components/public/TopTags/PublicdTopBtn' //发布按钮
import CancelPublicTopBtn from '@/components/public/TopTags/CancelPublicTopBtn' //取消发布按钮
import AddModal from "./AddModal"
import axios from "@/api/axios"
import { deletequestion, questionrelease } from "@/api/api"
import{queryQueByBizIdAndBizType,questionDelete,questionRelease,questionCancelRelease} from '@/api/suzhou-api'
import PubTable from '@/components/PublicTable'
import * as dataUtil from '@/utils/dataUtil';
import PublicButton from '@/components/public/TopTags/PublicButton';
import LabelToolbar from '@/components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '@/components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '@/components/public/Layout/Labels/Table/LabelTable'
import QuestionModal from './QuestionAdd'
export class PlanPreparedPlanAcco extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: 'PlanPreparedPlanAcco',
            addModal: false,
            data: [],
            activeIndex: null,
            rightData: null,
            selectedRowKeys: [],
            editAuth2: false,
            releaseAuth: false,
            calcReleaseAuth: false,
            creatorEdit:false,
            loginUser:'',//session中用户信息
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
 * 获取复选框 选中项、选中行数据
 * @method updateSuccess
 * @param {string} selectedRowKeys 复选框选中项
 * @param {string} selectedRows  行数据
 */
    getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRows,
            selectedRowKeys,
            isExistNotEdit: false,//是否存在不是新建中的
            isExistNotRelease: false,//是否存在不已发布的
        }, () => {
            // for (let i = 0, len = selectedRows.length; i < len; i++) {
            //     let selectRow = selectedRows[i];
            //     if (selectRow && selectRow.status.id != 'NEW') {
            //         this.setState({
            //             isExistNotEdit: true,
            //         })
            //     } 
            //     if (selectRow && selectRow.status.id != 'RELEASE') {
            //         this.setState({
            //             isExistNotRelease: true,
            //         })
            //     }
            // }
        })
    }
    componentDidMount(){
        let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
        this.setState({
            loginUser
        })
    }
    //获取项目问题
    getLists = (callBack) => {
        axios.get(queryQueByBizIdAndBizType(this.props.rightData.projectId, this.props.bizId,this.props.bizType,'task')).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data
            })
        })
    }

    closeAddModal = () => {
        this.setState({
            addModal: false
        })
    }
    addHandle = (value) => {
        this.table.add(null, value)
    }
    updatedata = (value) => {
        const { rightData } = this.state
        this.table.update(rightData, value)
    }
    getInfo = (record, index) => {
        let editAuth2 = false;
        let creatorEdit = false;
        let {loginUser} = this.state;
        if (record && record.status.id == 'NEW') {
            editAuth2 = true;
        }
        if(record.creator.id == loginUser.id){
            creatorEdit = true
        }
        this.setState({
            rightData: record,
            editAuth2,
            creatorEdit
        })
    }

    /**
     * 验证复选框是否可操作
     * @method checkboxStatus
     * @return {boolean}
     */
    checkboxStatus = (record) => {
        /*      if (record && record.status.id == 'EDIT') {
                return false
              } else {
                return true
              }*/
        return false;
    }
    //问题详情
    viewDetail = (record) =>{
        this.setState({
            isShowModal: true,
            addOrModify: 'add',
            modalTitle: '问题跟踪',
            checkRecord:record
        });
    }
    //关闭权限弹框modal
    closeDebugAdd = () => {
        this.setState({
        isShowModal: false
        });
    };
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: intl.get('wsd.i18n.plan.projectquestion.questionname'),
                dataIndex: 'title',
                key: 'title',
                width:100
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.questiontype'),
                dataIndex: 'type',
                key: 'type',
                width:100,
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.priority'),
                dataIndex: 'priority',
                key: 'priority',
                width:60,
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.iptname'),
                dataIndex: 'org',
                key: 'org',
                width:100,
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.username'),
                dataIndex: 'user',
                key: 'user',
                width:100,
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.dealtime'),
                dataIndex: 'handleTime',
                key: 'handleTime',
                width:100,
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: "问题说明",
                dataIndex: 'remark',
                key: 'remark',
                width:120,
            },
            {
                title: "处理要求",
                dataIndex: 'handle',
                key: 'handle',
                width:100,
            },

            {
                title: "提出日期",
                dataIndex: 'creatTime',
                key: 'creatTime',
                width:100,
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.status'),
                dataIndex: 'status',
                key: 'status',
                width:80,
                render: (text) => {
                    if (text) {
                        return <span>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.solvetime'),
                dataIndex: 'endTime',
                key: 'endTime',
                width:100,
                render: (text) => dataUtil.Dates().formatDateString(text)
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.creator'),
                dataIndex: 'creator',
                key: 'creator',
                render: data => data && data.name
            },
            {
                title: "问题详情",
                width:80,
                render: (text,record) => {
                    return <a onClick={this.viewDetail.bind(this, record)} style={{ cursor: 'pointer' }}>详情</a>
                }
            }
        ]
        const { selectedRowKeys } = this.state


        const showFormModal = (name, e) => {
            const { rightData, data, selectedRowKeys, selectedRows,record,loginUser} = this.state
            if (name == 'AddTopBtn') {
                this.setState({
                    addModal: true,
                    type: "add"
                })
            }
            if (name == 'ModifyTopBtn') {
                if (!rightData) {
                    notification.warning(
                        {
                            placement: 'bottomRight',
                            bottom: 50,
                            duration: 1,
                            message: '警告',
                            description: '请选择数据！'
                        }
                    )
                    return
                }
                this.setState({
                    addModal: true,
                    type: "modify"
                })
            }
            // 删除
            if (name === 'DeleteTopBtn') {
                const delArr = []
                selectedRows.map((item,i)=>{
                    if(item.creator.id == loginUser.id && item.status.id == 'NEW'){
                        delArr.push(item.id);
                    }else{
                        dataUtil.message("只能删除本用户新建的数据")
                    }
                })
                if(delArr.length > 0){
                    let { startContent } = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(questionDelete, { startContent });
                    axios.deleted(url, { data: delArr }, true, null, true).then(res => {
                        this.table.getData();
                        this.setState({
                            rightData: null,
                            selectedRowKeys: []
                        })
                    })
                }
            }
            //发布
            if (name == "PublicdTopBtn") {
                const delArr = []
                selectedRows.map((item,i)=>{
                    if(item.creator.id == loginUser.id && item.status.id == 'NEW'){
                        delArr.push(item.id);
                    }else{
                        dataUtil.message("只能发布本用户新建的数据")
                    }
                })
                if(delArr.length > 0){
                    let { startContent } = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(questionRelease, { startContent });
                    axios.put(url, delArr, true, null, true).then(res => {
                      
                        this.setState({
                            data,
                            activeIndex: null,
                            rightData: null,
                            selectedRowKeys: []
                        }, () => {
                            this.table.getData()
                        })
                    })
                }
                
            }
            //取消发布
            if (name == "CancelPublicTopBtn") {
                const delArr = []
                selectedRows.map((item,i)=>{
                    if(item.creator.id == loginUser.id && item.status.id == 'RELEASE'){
                        delArr.push(item.id);
                    }else{
                        dataUtil.message("只能取消本用户已发布的数据")
                    }
                })
                if(delArr.length > 0){
                    let { startContent } = this.props.extInfo || {};
                    let url = dataUtil.spliceUrlParams(questionCancelRelease, { startContent });
                    axios.put(url, delArr, true, null, true).then(res => {
                        this.setState({
                            data,
                            activeIndex: null,
                            rightData: null,
                            selectedRowKeys: []
                        }, () => {
                            this.table.getData()
                        })
                    })
                }
            }
        }
        let deleteVerifyCallBack = () => {
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
                return false
            }else{
                return true
            }
        }

        let releaseVerifyCallBack = () => {
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
            if (this.state.isExistNotEdit) {
                dataUtil.message("只能发布新建中的数据")
                return false
            }
            return true

        }
        let cancelVerifyCallBack = () => {
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
            if (this.state.isExistNotRelease) {
                dataUtil.message("只能取消已发布的数据！")
                return false
            }
            return true

        }
        return (

            <LabelTableLayout title={this.props.title} menuCode = {this.props.menuCode}>
                <LabelToolbar>
                    {/*新增*/}
                    <PublicButton title={"新增"} edit={this.props.editAuth}
                        afterCallBack={showFormModal.bind(this, "AddTopBtn")} icon={"icon-add"} />
                    <PublicButton title={"修改"} edit={this.state.editAuth2 && this.state.creatorEdit}
                        afterCallBack={showFormModal.bind(this, "ModifyTopBtn")} icon={"icon-xiugaibianji"} />
                    <PublicButton title={"删除"} edit={this.props.editAuth} useModel={true} verifyCallBack={deleteVerifyCallBack}
                        afterCallBack={showFormModal.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />
                    <PublicButton title={"发布"} useModel={true} verifyCallBack={deleteVerifyCallBack} edit={this.props.editAuth}
                        afterCallBack={showFormModal.bind(this, "PublicdTopBtn")} icon={"icon-fabu"} content={'你确定要发布吗？'} />
                    <PublicButton title={"取消发布"} useModel={true} edit={this.props.editAuth} verifyCallBack={deleteVerifyCallBack}
                        afterCallBack={showFormModal.bind(this, "CancelPublicTopBtn")} icon={"icon-huanyuan"} content={'你确定要取消发布吗？'} />
                </LabelToolbar>
                <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
                    <PubTable onRef={this.onRef}
                        getData={this.getLists}
                        dataSource={this.state.data}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        checkboxStatus={this.checkboxStatus}
                        useCheckBox={true}
                        scroll={{ x: 1200, y: this.props.height - 100 }}
                        getRowData={this.getInfo} />
                </LabelTable>

                {this.state.addModal && <AddModal
                    handleCancel={this.closeAddModal}
                    extInfo={this.props.extInfo}
                    type={this.state.type}
                    projectId={this.props.data.projectId}
                    taskId={this.props.data.id}
                    addHandle={this.addHandle}
                    data={this.state.rightData}
                    updatedata={this.updatedata}
                    rightData={this.props.rightData}
                    bizType = {this.props.bizType}
                    bizId = {this.props.bizId}
                    menuInfo = {this.props.menuInfo}
                />
                }
                {/* 问题跟踪 */}
                {this.state.isShowModal &&
                    <QuestionModal
                    visible={this.state.isShowModal}
                    handleCancel={this.closeDebugAdd.bind(this)}
                    title={this.state.modalTitle}
                    addOrModify={this.state.addOrModify}
                    data={this.state.checkRecord}
                    parentData={this.props.data}
                    rightData = {this.props.rightData}
                    menuCode = {this.props.menuCode}
                    updateSuccess={this.updateSuccess} addData={this.addData}
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


export default connect(mapStateToProps, null)(PlanPreparedPlanAcco);
