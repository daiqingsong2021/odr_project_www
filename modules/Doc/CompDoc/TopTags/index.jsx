import Approval from '../Workflow/Approval'
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { Modal, message, Divider, Icon, Popover, Table, Button, notification } from 'antd';
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from '../../../../components/public/TopTags/PublicButton'
import PublicMenuButton from '../../../../components/public/TopTags/PublicMenuButton'
import UploadDoc from '../Upload/index'
import Publicd from '../Publicd/index'
import Upgrade from '../Upgrade/index'
import axios from '../../../../api/axios';
import { docFileInfo } from '../../../../api/api'
import Distribute from '../../SzxmProDoc/Distribute';
import Mail from '../../SzxmProDoc/Mail';

const confirm = Modal.confirm

export class CompDocTop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            UploadVisible: false,
            PublicdVisible: false,
            UpgradeVisible: false,
            DistributeVisible: false,
            showApprovalVisible: false,
            MailVisible: false,
            visible: false,
            roleBtnData: [
                {
                    id: 1,
                    name: 'UploadTopBtn',
                    aliasName: '上传'
                },
                {
                    id: 2,
                    name: 'PublicdTopBtn',
                    aliasName: '发布'
                },
                {
                    id: 3,
                    name: 'Upgrade',
                    aliasName: '升版'
                },
                {
                    id: 4,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                },
                {
                    id: 5,
                    name: 'DownloadTopBtn',
                    aliasName: '下载'
                },
                {
                  id: 6,
                  name: 'Mail',
                  aliasName: '邮件'
                },
                {
                  id: 7,
                  name: 'Distribute',
                  aliasName: '分发'
                }
            ],
        }
    }

  showFormModal = (name) => {
    let {selectProjectName} = this.props;
    if (name == "Distribute") {
      this.setState({ showApprovalVisible: true,projectName: "["+selectProjectName+"]" });
    }
    if (name == "approveDistribute") {
      this.setState({ PublicdVisible: true,projectName: "["+selectProjectName+"]" });
    }
  }

    showReleaseModal = (name) => {

        if (name == "approve") {
            this.setState({ showApprovalVisible: true });
        }
        if (name == "direct") {
            this.setState({ PublicdVisible: true });
        }
    }
    // modal取消
    handleCancel = (v) => {
        if (v == 'UploadVisible') {
            this.setState({ UploadVisible: false })
        } else if (v == 'PublicdVisible') {
            this.setState({ PublicdVisible: false })
        } else if (v == 'UpgradeVisible') {
            this.setState({ UpgradeVisible: false })
        }
    }


    render() {


        // 显示表单弹窗
        let showFormModal = (name) => {
            let that = this
            // 新增
            if (name === 'AddTopBtn') {
                this.setState({
                    modalVisible: true
                })
            }

            // 删除
            if (name === 'DeleteTopBtn') {
                this.props.delete();
            }
            //上传
            if (name === 'UploadTopBtn') {
                if (this.props.leftRecord) {
                    this.setState({ UploadVisible: true })
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

            } else if (name === 'PublicdTopBtn') {
                this.setState({ PublicdVisible: true })

            } else if (name === 'Upgrade') {    //升版
                if (this.props.rightData) {
                    
                    if(this.props.rightData.status && this.props.rightData.status.id=="RELEASE"){
                        this.setState({ UpgradeVisible: true })
                    }else{
                        notification.warning(
                            {
                                placement: 'bottomRight',
                                bottom: 50,
                                duration: 2,
                                message: '提示',
                                description: '该文档未发布，请选择已发布的文档'
                            }
                        )
                        return
                    }
                   
                } else if (name === 'Distribute') { //分发
                  if (this.props.selectedRows.length) {
                    this.setState({ DistributeVisible: true })
                  } else {
                    notification.warning(
                      {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择勾选文档进行操作'
                      }
                    )
                  }

                }else if (name === 'Mail') {

                  if (this.props.selectedRows.length) {
                    this.setState({ MailVisible: true })
                  } else {
                    notification.warning(
                      {
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 2,
                        message: '未选中数据',
                        description: '请选择勾选文档进行操作'
                      }
                    )
                  }
                }else {
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

            } else if (name === 'DownloadTopBtn') { //下载
                this.props.download();
            }
        }



        const {permission,editPermission, sendPermission, updatePermission}=this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文档标题/文档编号"/>
                </div>
                <div className={style.tabMenu}>
                    {/*上传*/}
                    {permission.indexOf(editPermission)!==-1 && (
                    <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={showFormModal.bind(this, 'UploadTopBtn')} />)}
                    {/*发布*/}
                    {permission.indexOf(sendPermission)!==-1 && (
                    <PublicMenuButton title={"发布"} afterCallBack={this.showReleaseModal} icon={"icon-fabu"}
                        menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: true },
                        { key: "approve", label: "发布审批", icon: "icon-shenpi1", edit: true }]} />)}
                    {/*分发*/}
                    {/*<PublicButton name={'分发'} title={'分发'} icon={'icon-fenfa'} afterCallBack={showFormModal.bind(this, 'Distribute')} />*/}
{/*                    <PublicMenuButton title={"分发"} afterCallBack={this.showFormModal} icon={"icon-fenfa"}
                                      menus={[{ key: "Distribute", label: "按组分发", icon: "icon-fenfa", edit: true },
                                        { key: "approveDistribute", label: "按人分发", icon: "icon-fenfa", edit: true }]} />*/}
                    {/*升版*/}
                    {permission.indexOf(updatePermission)!==-1 && (
                    <PublicButton name={'升版'} title={'升版'} icon={'icon-shengjibanben'} edit={this.props.editAuth} afterCallBack={showFormModal.bind(this, 'Upgrade')} />)}
                    <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={showFormModal.bind(this, 'DownloadTopBtn')} />
                    {/*删除*/}
                    {permission.indexOf(editPermission)!==-1 && (
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={showFormModal.bind(this, "DeleteTopBtn")} icon={"icon-delete"} />)}

                    {/*邮件*/}
                    {/*<PublicButton name={'邮件'} title={'邮件'} icon={'icon-message'} afterCallBack={showFormModal.bind(this, 'Mail')} />*/}
                </div>


                {/* 上传文档 */}
                {this.state.UploadVisible && <UploadDoc  handleCancel={this.handleCancel} data={this.props.leftRecord} addList={this.props.addList} />}
                {/* 发布 */}
                {this.state.PublicdVisible && <Publicd folderId={this.props.folderId} modalVisible={this.state.PublicdVisible} handleCancel={this.handleCancel} update={this.props.update} />}
                {/* 升版 */}
                {this.state.UpgradeVisible && <Upgrade modalVisible={this.state.UpgradeVisible} handleCancel={this.handleCancel} rightData={this.props.rightData} update={this.props.update} />}
                {/* 分发 */}
                {/*{this.state.DistributeVisible && <Distribute modalVisible={this.state.DistributeVisible} handleOk={this.handleOk}
                   handleCancel={this.handleCancel} selectedRows={this.props.selectedRows}
                   updateSelectedRows={this.props.updateSelectedRows} startContent={this.props.startContent} />}*/}
                {/* 邮件 */}
                {this.state.MailVisible && <Mail modalVisible={this.state.MailVisible} handleOk={this.handleOk} handleCancel={this.handleCancel}
                   selectedRows={this.props.selectedRows} updateSelectedRows={this.props.updateSelectedRows} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        folderId={this.props.folderId}
                        visible={true}
                        width={"1200px"}
                        proc={{ "procDefKey": "model_20190513_2687523", "bizTypeCode": "plan_compdoc_approve", "title": "企业文档发布审批" }}
                        projectId={this.props.selectProjectId}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.refreshData}
                    />}

            </div>

        )
    }
}

export default CompDocTop
