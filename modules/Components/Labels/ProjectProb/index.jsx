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
import AddTopBtn from '../../../../components/public/TopTags/AddTopBtn' //新增按钮
import ModifyTopBtn from '../../../../components/public/TopTags/ModifyTopBtn' //修改按钮
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn' //删除按钮
import PublicdTopBtn from '../../../../components/public/TopTags/PublicdTopBtn' //发布按钮
// import CancelPublicTopBtn from '../../../../components/public/TopTags/CancelPublicTopBtn' //取消发布按钮
import AddModal from "./AddModal"
import axios from "../../../../api/axios"
import { queryQueByBizIdAndBizType, questionDelete, questionRelease, 
    questionCancelRelease ,queryQuestionList,deleteQuestion,publishQuestion} from '../../../../api/suzhou-api'
import {queryYqQuestionList} from '@/modules/Suzhou/api/suzhou-api'
import PubTable from '../../../../components/PublicTable'
import * as dataUtil from '../../../../utils/dataUtil';
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import LabelToolbar from '../../../../components/public/Layout/Labels/Table/LabelToolbar'
import LabelTableLayout from '../../../../components/public/Layout/Labels/Table/LabelTableLayout'
import LabelTable from '../../../../components/public/Layout/Labels/Table/LabelTable'
import QuestionModal from './QuestionAdd'
import ReleaseModal from './ReleaseModal'
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
            loginUser:'',//session中用户信息
            creatorEdit:false, //
            pageSize:10,
            currentPage:1,
            total: 0,
            releaseModal:false,//发布
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
    // getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    //     debugger
    //     this.setState({
    //         selectedRows,
    //         selectedRowKeys,
    //         isExistNotEdit: false,//是否存在不是编辑中的
    //         isExistNotRelease: false,//是否存在不已发布的
    //     }, () => {
    //         for (let i = 0, len = selectedRows.length; i < len; i++) {
    //             let selectRow = selectedRows[i];
    //             if (selectRow && selectRow.statusVo.code != 0) {
    //                 this.setState({
    //                     isExistNotEdit: true,
    //                 })
    //             } else if (selectRow && selectRow.statusVo.code != 3) {
    //                 this.setState({
    //                     isExistNotRelease: true,
    //                 })
    //             }
    //         }
    //     })
    // }
    componentDidMount(){
        let loginUser = JSON.parse(sessionStorage.getItem('userInfo'));
        this.setState({loginUser});
    }
    //获取项目问题
    getLists = (size, page,callBack) => {
        const {projectId, bizId, bizType}= this.props
        const params = {projectId, bizId, bizType}
        axios.get(queryYqQuestionList(page,size, ),{params}).then(res => {
            callBack(res.data.data ? res.data.data : [])
            this.setState({
                data: res.data.data,
                total:res.data.total
            })
        })
    }

    closeAddModal = () => {
        this.setState({
            addModal: false
        })
    }
    addHandle = (value) => {
        //this.table.add(null, value)
        this.table.getData();
        this.getInfo();
    }
    updatedata = (value) => {
        const { rightData } = this.state
        //this.table.update(rightData, value)
        this.table.getData();
        this.getInfo();
    }
    getInfo = (record, index) => {
        let editAuth2 = false;
        let editAuth3 = false;
        let editAuth4 = false;
        let creatorEdit = false;
        let {loginUser} = this.state;
        if (record && record.statusVo.code == 0) { //新建
            editAuth2 = true;
        }
        if (record && record.statusVo.code == 3) {
            editAuth3 = true;
        }
        if (record && record.statusVo.code == 1) {
            editAuth4 = true;
        }
        if(record && record.createrVo.id == loginUser.id){//登录人是创建人
            creatorEdit = true  
        }
        this.setState({
            rightData: record,
            editAuth2,
            editAuth3,
            editAuth4,
            creatorEdit
        })
    }

    /**
     * 验证复选框是否可操作
     * @method checkboxStatus
     * @return {boolean}
     */
    checkboxStatus = (record) => {
        /*      if (record && record.statusVo.code == 'EDIT') {
                return false
              } else {
                return true
              }*/
        return false;
    }
    //问题详情
    viewDetail = (record) => {
        this.setState({
            isShowModal: true,
            addOrModify: 'add',
            modalTitle: '问题跟踪',
            checkRecord: record
        });
    }
    //关闭权限弹框modal
    closeDebugAdd = () => {
        this.setState({
            isShowModal: false
        });
    };
    //关闭审批
    shenpiModalCancel = ()=>{
        this.setState({
            releaseModal: false
        })
    }
    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title: '问题标题',
                dataIndex: 'title',
                key: 'title',
                width: 100,
                render(text, record) {
                    return <span title={text}>{text}</span>
                    }
            },
            {
                title: '问题类型',
                dataIndex: 'typeVo',
                key: 'typeVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.iptname'),
                dataIndex: 'orgVo',
                key: 'orgVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: intl.get('wsd.i18n.plan.projectquestion.username'),
                dataIndex: 'userVo',
                key: 'userVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: '当前处理人',
                dataIndex: 'currentUserVo',
                key: 'currentUserVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: "所属组织",
                dataIndex: 'currentUserOrgVo',
                key: 'currentUserOrgVo',
                width: 160,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: "提出人",
                dataIndex: 'createrVo',
                key: 'createrVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: "提出日期",
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={dataUtil.Dates().formatDateString(text)}>{dataUtil.Dates().formatDateString(text)}</span>
                    } else {
                        return null
                    }
                }                              
            },
            {
                title: '要求处理日期',
                dataIndex: 'handleTime',
                key: 'handleTime',
                width: 120,
                render: (text) => {
                    if (text) {
                        return <span title={dataUtil.Dates().formatDateString(text)}>{dataUtil.Dates().formatDateString(text)}</span>
                    } else {
                        return null
                    }
                } 
            },
            {
                title: '状态',
                dataIndex: 'statusVo',
                key: 'statusVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        return <span title={text.name}>{text.name}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: "站点/区间",
                dataIndex: 'stationVo',
                key: 'stationVo',
                width: 100,
                render: (text) => {
                    if (text) {
                        let station = ''
                        let station1 = []
                            text.map((item,index)=>{
                                station1.push(item.name)                              
                            })
                            station = station1.join(',')
                        return <span title={station}>{station}</span>
                    } else {
                        return null
                    }
                }
            },
            {
                title: "查看详情",
                width: 80,
                render: (text, record) => {
                    return <a onClick={this.viewDetail.bind(this, record)} style={{ cursor: 'pointer' }}>查看</a>
                }
            }
        ]
        const { selectedRowKeys } = this.state


        const showFormModal = (name, e) => {
            const { rightData, data, selectedRowKeys, } = this.state
            if (name == 'AddTopBtn') {
                this.setState({
                    addModal: true,
                    type: "add",
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
                let { startContent } = this.props.extInfo || {};
                let url = dataUtil.spliceUrlParams(deleteQuestion, { startContent });
                axios.deleted(url, { data: [rightData.id] }, true, null, true).then(res => {
                    this.table.getData();
                    this.setState({
                        rightData: null,
                    },()=>{
                        this.getInfo();
                    })
                })
            }
            //发布
            if (name == "PublicdTopBtn") {
                // let { startContent } = this.props.extInfo || {};
                //let url = dataUtil.spliceUrlParams(publishQuestion(selectedRowKeys), { startContent });
                // axios.post(publishQuestion(selectedRowKeys)).then(res => {
                //     this.setState({
                //         data,
                //         activeIndex: null,
                //         rightData: null,
                //         selectedRowKeys: []
                //     }, () => {
                //         this.table.getData()
                //     })
                // })
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
                }else if (rightData.statusVo.code != '0') {
                    dataUtil.message("只能发布新建中的数据")
                    return false
                }
                this.setState({
                    releaseModal: true,
                    modelTitle:'发布审批'
                })
            }
            //取消发布
            // if (name == "CancelPublicTopBtn") {
            //     let { startContent } = this.props.extInfo || {};

            //     let url = dataUtil.spliceUrlParams(questionCancelRelease, { startContent });
            //     axios.put(url, selectedRowKeys, true, null, true).then(res => {
            //         this.setState({
            //             data,
            //             activeIndex: null,
            //             rightData: null,
            //             selectedRowKeys: []
            //         }, () => {
            //             this.table.getData()
            //         })
            //     })
            // }
        }
        let deleteVerifyCallBack = () => {
            const {rightData} = this.state;
            if (!rightData) {
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
            } else if (rightData.statusVo.code != '0') {
                dataUtil.message("只能删除新建中的数据")
                return false
            }
            else {
                return true
            }
        }

        // let releaseVerifyCallBack = () => {
        //     const {rightData} = this.state;
        //     if (!rightData) {
        //         notification.warning(
        //             {
        //                 placement: 'bottomRight',
        //                 bottom: 50,
        //                 duration: 1,
        //                 message: '警告',
        //                 description: '请选择数据！'
        //             }
        //         )
        //         return false
        //     }else if (rightData.statusVo.code != '0') {
        //         dataUtil.message("只能发布新建中的数据")
        //         return false
        //     }
        //     else {
        //         return true
        //     }

        // }
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

            <LabelTableLayout title={this.props.title} menuCode={this.props.menuCode}>
                {this.props.isEdit && (<LabelToolbar>
                    {/*新增*/}
                    {this.props.problemShow&& 
                    (<PublicButton title={"新增"} edit={this.props.editAuth}
                        afterCallBack={showFormModal.bind(this, "AddTopBtn")} icon={"icon-add"} />)}
                    {this.props.problemShow&& 
                    (<PublicButton title={"修改"} edit={this.state.editAuth2 && this.state.creatorEdit}
                        afterCallBack={showFormModal.bind(this, "ModifyTopBtn")} icon={"icon-xiugaibianji"} />)}
                    {this.props.problemShow&& 
                    (<PublicButton title={"删除"} edit={(this.state.editAuth2) && this.state.creatorEdit} useModel={true} verifyCallBack={deleteVerifyCallBack}
                        afterCallBack={showFormModal.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />)}
                    {this.props.problemSendShow&& 
                    (<PublicButton title={"发布"}  edit={this.state.editAuth2 && this.state.creatorEdit}
                        afterCallBack={showFormModal.bind(this, "PublicdTopBtn")} icon={"icon-fabu"} />)}
                    {/* {this.props.problemSendShow&& 
                    (<PublicButton title={"取消发布"} useModel={true} edit={this.state.editAuth3 && this.state.creatorEdit} verifyCallBack={cancelVerifyCallBack}
                        afterCallBack={showFormModal.bind(this, "CancelPublicTopBtn")} icon={"icon-huanyuan"} content={'你确定要取消发布吗？'} />)} */}
                </LabelToolbar>)}
                <LabelTable labelWidth={this.props.labelWidth} contentMinWidth={1000}>
                    <PubTable onRef={this.onRef}
                        pagination={true}
                        pageSize={10}
                        total={this.state.total}
                        getData={this.getLists}
                        dataSource={this.state.data}
                        columns={columns}
                        rowSelection={true}
                        onChangeCheckBox={this.getSelectedRowKeys}
                        // checkboxStatus={this.checkboxStatus}
                        // useCheckBox={true}
                        scroll={{ x: 1200, y: this.props.height - 100 }}
                        getRowData={this.getInfo} />
                </LabelTable>

                {this.state.addModal && <AddModal
                    handleCancel={this.closeAddModal}
                    extInfo={this.props.extInfo}
                    type={this.state.type}
                    projectId={this.props.data.projectId}
                    taskId={this.props.data.id}
                    bizId = {this.props.data.id}
                    bizType={this.props.bizType}
                    addHandle={this.addHandle}
                    data={this.state.rightData}
                    updatedata={this.updatedata}
                    rightData={this.props.rightData}
                    loginUserId={this.props.loginUserId}
                    loginUser  = {this.state.loginUser}
                    projectName={this.props.projectName}
                    menuInfo={this.props.menuInfo}
                    sectionType = {this.props.sectionType}

                    // addData={this.updatedata}
                    // modalVisible={this.state.addModal}
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
                {/* 审批*/}
                {this.state.releaseModal && <ReleaseModal
                    modalVisible={this.state.releaseModal}
                    handleCancel={this.shenpiModalCancel}
                    modelTitle={this.state.modelTitle}
                    parentData = {this.state.rightData}
                    addData={this.updatedata}
                    // loginUserId = {this.props.loginUserId}
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
