import Approval from '../Workflow/Approval'
import React, { Component } from 'react'
import { Divider, notification } from 'antd';
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import PublicMenuButton from "../../../../components/public/TopTags/PublicMenuButton"
import UploadDoc from '../Upload/index'
import Publicd from '../Publicd/index'
import Upgrade from '../Upgrade/index'
import Distribute from '../Distribute/index'
import DistributeByGroup from '../DistributeByGroup/index'
import Mail from '../Mail/index'
import * as dataUtil from "../../../../utils/dataUtil";

export class DocTempDoc extends Component {
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
                    name: 'AllDocuments',
                    aliasName: '全部文档'
                },
                {
                    id: 2,
                    name: 'UploadTopBtn',
                    aliasName: '上传'
                },
                {
                    id: 3,
                    name: 'PublicdTopBtn',
                    aliasName: '发布'
                },
                {
                    id: 4,
                    name: 'Distribute',
                    aliasName: '分发'
                },
                {
                    id: 5,
                    name: 'Upgrade',
                    aliasName: '升版'
                },
                {
                    id: 6,
                    name: 'Mail',
                    aliasName: '邮件'
                },
                {
                    id: 7,
                    name: 'DownloadTopBtn',
                    aliasName: '下载'
                },
                {
                    id: 8,
                    name: 'DeleteTopBtn',
                    aliasName: '删除'
                }
            ],
        }
    }


    showReleaseModal = (name) => {
        let {selectProjectName} = this.props;
        if (name == "approve") {
            this.setState({ showApprovalVisible: true,projectName: "["+selectProjectName+"]" });
        }
        if (name == "direct") {
            this.setState({ PublicdVisible: true,projectName: "["+selectProjectName+"]" });
        }
    }
 /**
     *  打开上传文件窗口
     *
     **/
    showUpLoadModal = () => {
        if (!this.props.leftData) {
            dataUtil.message('请选择文件夹进行操作');
            return;
        }
        this.setState({ UploadVisible: true })
    }
     /**
     * 打开分发窗口
     *
     **/
    showOutgivingModal = (name) => {
      if (!this.props.leftData) {
          dataUtil.message('请选择文件夹进行操作');
          return;
      }
/*      if (this.props.rightData && this.props.rightData.status.id == 'EDIT'){
          dataUtil.message('文档未发布，无法进行分发');
          return;
      }*/
      if (name == "approveDistribute") {
          this.setState({ approveDistributeVisible: true })
      }
      if (name == "Distribute") {
          this.setState({ DistributeVisible: true })
      }
    }
    /**
     * 升版功能
     **/
    upgrade = () => {
        if (!this.props.rightData) {
            dataUtil.message('请选择文档进行操作');
            return;
        }
        if (this.props.rightData.status.id != "RELEASE") {
            dataUtil.message("请选择已发布的文档进行升版!");
            return;
        }
        this.setState({ UpgradeVisible: true });
    }
    /**
     * 打开发送邮件功能
     **/
    showMailModal = () => {
        this.setState({ MailVisible: true })
    }
    render() {
        const {permission,editPermission, sendPermission, updatePermission,dispensePermission}=this.props
        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="文档标题/文档编号" />
                </div>
                <div className={style.tabMenu}>
                    {/*上传*/}
                    {permission.indexOf(editPermission)!==-1 && (
                    <PublicButton name={'上传'} title={'上传'} icon={'icon-shangchuanwenjian'} afterCallBack={this.showUpLoadModal} />)}
                    {/*发布*/}
                    {permission.indexOf(sendPermission)!==-1 && 
                    // (<PublicButton title={"发布审批"} afterCallBack={this.showReleaseModal} icon={"icon-shenpi1"} edit={true} />)
                        (<PublicMenuButton title={"发布"} afterCallBack={this.showReleaseModal} icon={"icon-fabu"}
                        menus={[{ key: "direct", label: "直接发布", icon: "icon-fabu", edit: true },
                        { key: "approve", label: "发布审批", icon: "icon-shenpi1", edit: true }]} />)
                    }
                    {/*分发*/}
                    {permission.indexOf(dispensePermission)!==-1 && (
                    <PublicMenuButton title={"分发"} afterCallBack={this.showOutgivingModal} icon={"icon-fenfa"}
                                    menus={[{ key: "Distribute", label: "按组分发", icon: "icon-fenfa", edit: true },
                                      { key: "approveDistribute", label: "按人分发", icon: "icon-fenfa", edit: true }]} />)}
                    {/*升级*/}
                    {permission.indexOf(updatePermission)!==-1 && (
                    <PublicButton name={'升版'} title={'升版'} icon={'icon-shengjibanben'} afterCallBack={this.upgrade} />)}
                    {/*邮件*/}
                    {/* <PublicButton name={'邮件'} title={'邮件'} icon={'icon-message'} afterCallBack={this.showMailModal} /> */}
                    {/*下载*/}
                    <PublicButton name={'下载'} title={'下载'} icon={'icon-xiazaiwenjian'} afterCallBack={this.props.download} />
                    {/*删除*/}
                    {permission.indexOf(editPermission)!==-1 && (
                    <PublicButton title={"删除"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={this.props.deleteData} icon={"icon-delete"} />)}
                </div>

                {/* 上传文档 */}
                {this.state.UploadVisible && <UploadDoc handleCancel={() => { this.setState({ UploadVisible: false }) }}
                    projectId={this.props.projectId} data={this.props.leftData} addData={this.props.rightAddData} folderUpdate={this.props.folderUpdate}
                    bizType={this.props.bizType} startContent={this.props.startContent}
                />}
                {/* 发布 */}
                {this.state.PublicdVisible && <Publicd modalVisible={this.state.PublicdVisible} handleOk={this.handleOk} projectId={this.props.projectId}
                                               folderId={this.props.folderId} sectionIds={this.props.sectionIds} handleCancel={() => { this.setState({ PublicdVisible: false }) }} refreshRight={this.props.refreshRight} startContent={this.props.startContent} />}
                {/* 按人分发 */}
                {this.state.approveDistributeVisible && <Distribute modalVisible={this.state.approveDistributeVisible} handleOk={this.handleOk}
                    handleCancel={() => { this.setState({ approveDistributeVisible: false }) }} getDocGivingList={this.props.getDocGivingList}
                    startContent={this.props.startContent} rightData={this.props.rightData} />}
                {/* 按组分发 */}
                {this.state.DistributeVisible && <DistributeByGroup modalVisible={this.state.DistributeVisible} handleOk={this.handleOk}
                      handleCancel={() => { this.setState({ DistributeVisible: false }) }} getDocGivingList={this.props.getDocGivingList}
                      startContent={this.props.startContent} rightData={this.props.rightData} />}
                {/* 升版 */}
                {this.state.UpgradeVisible && <Upgrade modalVisible={this.state.UpgradeVisible} handleOk={this.handleOk} handleCancel={() => { this.setState({ UpgradeVisible: false }) }}
                    rightData={this.props.rightData} rightUpdateData={this.props.rightUpdateData} startContent={this.props.startContent} />}
                {/* 邮件 */}
                {this.state.MailVisible && <Mail modalVisible={this.state.MailVisible} handleOk={this.handleOk} handleCancel={() => { this.setState({ MailVisible: false }) }}
                    selectedRows={this.props.selectedRows} updateSelectedRows={this.props.updateSelectedRows} />}
                {this.state.showApprovalVisible &&
                    <Approval
                        visible={true}
                        width={"1200px"}
                        proc={{ "vars": {}, "procDefKey": "", "bizTypeCode": "plan_prodoc-approve", "title": this.state.projectName + "项目文档发布审批" }}
                        projectId={this.props.projectId}
                        folderId={this.props.folderId}
                        sectionIds={this.props.sectionIds}
                        handleCancel={() => { this.setState({ showApprovalVisible: false }) }}
                        refreshData={this.props.refreshRight}
                    />}
            </div>

        )
    }
}

export default DocTempDoc
